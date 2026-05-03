#!/usr/bin/env node
/**
 * comfy-generate.mjs — gera mockups via ComfyUI API
 *
 * Uso:
 *   node scripts/comfy-generate.mjs --batch=all
 *   node scripts/comfy-generate.mjs --case=apex
 *
 * Estrategia:
 *   1. Cada case tem um descriptor (modelo, resolucao, prompt, neg prompt)
 *   2. Carrega o template de workflow (`comfy-workflows/_template.json`)
 *   3. Substitui os campos dinamicos
 *   4. Submete em POST /prompt; faz polling em /history/{id}
 *   5. Baixa imagens de /view e salva em public/images/cases/{slug}.png
 *
 * Idempotente: pula slugs cujo arquivo final ja existe.
 */
import { writeFile, mkdir, access, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { argv, env, exit } from "node:process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const outDir = join(repoRoot, "public", "images", "cases");
const wfDir = join(__dirname, "comfy-workflows");

const COMFY_URL = env.COMFY_URL || "http://127.0.0.1:8188";
const TIMEOUT_S = Number(env.COMFY_TIMEOUT || 600);

// Negative prompt comum para mockups UI
const NEG_UI = [
  "lorem ipsum, placeholder text, gibberish text, garbled letters",
  "deformed UI, broken alignment, asymmetric buttons, misaligned grid",
  "cartoon, anime, illustration, painterly, hand drawn",
  "watermark, signature, artist name, logo overlay",
  "blurry, out of focus, low resolution, pixelated, aliasing",
  "ugly fonts, papyrus, comic sans, distorted typography",
  "rainbow colors, neon overload, gradient abuse",
  "fake metrics impossibly large, unrealistic numbers",
  "hands, fingers, faces",
].join(", ");

// Único modelo disponível no sistema — DreamShaper 8
const MODEL = "DreamShaper_8_pruned.safetensors";

const CASES = {
  apex: {
    width: 1280, height: 800, steps: 32, cfg: 7.0,
    prompt: "ultra realistic screenshot of a premium SaaS analytics landing page, dark theme, glassmorphism panels, sharp typography Inter font, minimal grid layout, animated chart preview, deep navy background with subtle teal accents, Linear/Vercel inspired UI, 4k UI mockup, photorealistic browser chrome, no people",
  },
  lumen: {
    width: 1280, height: 800, steps: 32, cfg: 7.5,
    prompt: "premium CRM dashboard UI screenshot, dark theme, kanban + table + chart layout, sidebar navigation with icons, sharp Inter font, subtle violet accents, ultra detailed, 4k, photorealistic UI mockup, browser chrome",
  },
  onda: {
    width: 390, height: 844, steps: 32, cfg: 7.0,
    prompt: "iOS banking app screen mockup, premium fintech, dark theme with gradient accents, large balance hero, transactions list, bottom tab bar, San Francisco font, ultra realistic iPhone frame screenshot, 4k mobile UI",
  },
  pulse: {
    width: 412, height: 915, steps: 32, cfg: 7.0,
    prompt: "Android fitness app screen, Material You design, vibrant gradient ring chart for daily activity, bottom navigation, large hero metric, modern Roboto font, 4k mobile UI mockup, photorealistic Pixel phone frame",
  },
  atelier: {
    width: 1440, height: 900, steps: 32, cfg: 7.5,
    prompt: "luxury fashion e-commerce homepage, editorial photography hero, large product grid, refined typography Didone serif headlines, generous whitespace, neutral palette beige and black, ultra premium minimalism, 4k UI mockup browser screenshot",
  },
  forge: {
    width: 1440, height: 900, steps: 32, cfg: 7.5,
    prompt: "enterprise ERP admin dashboard, dense data tables, multi-level filters, status pills, modern dark UI with cyan accents, sharp Inter font, sidebar tree navigation, ultra realistic 4k UI mockup",
  },
  northwind: {
    width: 1440, height: 900, steps: 32, cfg: 7.0,
    prompt: "premium institutional website hero for a capital management firm, refined typography serif headline plus mono subhead, dark navy background with subtle gold accents, executive photography hero blurred, ultra elegant minimalism, 4k browser screenshot",
  },
  kira: {
    width: 1440, height: 900, steps: 32, cfg: 7.0,
    prompt: "editorial portfolio website for a Japanese photographer, asymmetric grid, large image plates, ultra refined typography, monochrome palette with one red accent, generous whitespace, awwwards-tier design, 4k browser mockup",
  },
  scholae: {
    width: 1280, height: 800, steps: 32, cfg: 7.5,
    prompt: "modern educational platform UI, course cards grid, progress rings, light theme with academic blue accents, sidebar with course list, sharp typography, ultra clean 4k browser screenshot",
  },
};

async function exists(p) { try { await access(p); return true; } catch { return false; } }

async function loadTemplate() {
  const tpl = JSON.parse(await readFile(join(wfDir, "_template.json"), "utf8"));
  return tpl;
}

async function patchWorkflow(template, c) {
  // Template clone + substituicoes
  const wf = JSON.parse(JSON.stringify(template));
  // Remove quaisquer chaves de comentario que o ComfyUI nao aceita
  for (const key of Object.keys(wf)) {
    if (key.startsWith("_") || !wf[key]?.class_type) delete wf[key];
  }
  // Pontos de injecao (nodes nomeados)
  if (wf["4"]?.inputs) wf["4"].inputs.ckpt_name = MODEL;
  if (wf["5"]?.inputs) { wf["5"].inputs.width = c.width; wf["5"].inputs.height = c.height; }
  if (wf["6"]?.inputs) wf["6"].inputs.text = c.prompt;
  if (wf["7"]?.inputs) wf["7"].inputs.text = NEG_UI;
  if (wf["3"]?.inputs) {
    wf["3"].inputs.steps = c.steps;
    wf["3"].inputs.cfg = c.cfg;
    wf["3"].inputs.seed = Math.floor(Math.random() * 1e15);
  }
  return wf;
}

async function comfyHealth() {
  try {
    const r = await fetch(`${COMFY_URL}/system_stats`);
    if (!r.ok) throw new Error(`status ${r.status}`);
    return true;
  } catch (e) {
    console.error(`ComfyUI nao acessivel em ${COMFY_URL}: ${e.message}`);
    return false;
  }
}

async function submit(workflow) {
  const r = await fetch(`${COMFY_URL}/prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: workflow }),
  });
  if (!r.ok) throw new Error(`submit ${r.status}: ${await r.text()}`);
  const j = await r.json();
  return j.prompt_id;
}

async function pollHistory(promptId) {
  const start = Date.now();
  while ((Date.now() - start) / 1000 < TIMEOUT_S) {
    const r = await fetch(`${COMFY_URL}/history/${promptId}`);
    if (r.ok) {
      const j = await r.json();
      const entry = j[promptId];
      if (entry?.outputs) return entry;
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  throw new Error(`timeout aguardando ${promptId}`);
}

function findFirstImage(entry) {
  for (const nodeId of Object.keys(entry.outputs)) {
    const imgs = entry.outputs[nodeId]?.images;
    if (imgs?.length) return imgs[0]; // {filename, subfolder, type}
  }
  return null;
}

async function downloadImage(meta) {
  const url = `${COMFY_URL}/view?filename=${encodeURIComponent(meta.filename)}&subfolder=${encodeURIComponent(meta.subfolder || "")}&type=${meta.type || "output"}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`view ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

async function generateOne(slug, c, template) {
  const out = join(outDir, `${slug}.png`);
  if (await exists(out)) { console.log(`  [skip] ${slug}`); return; }
  console.log(`  [gen ] ${slug} (${c.width}x${c.height} ${MODEL.split('.')[0]})`);
  const wf = await patchWorkflow(template, c);
  const pid = await submit(wf);
  const entry = await pollHistory(pid);
  const meta = findFirstImage(entry);
  if (!meta) throw new Error("nenhuma imagem retornada");
  const buf = await downloadImage(meta);
  await writeFile(out, buf);
  console.log(`         ok (${(buf.length / 1024).toFixed(0)}KB)`);
}

function parseArgs() {
  const args = { batch: null, only: null };
  for (const a of argv.slice(2)) {
    if (a.startsWith("--batch=")) args.batch = a.split("=")[1];
    if (a.startsWith("--case=")) args.only = a.split("=")[1];
  }
  return args;
}

async function main() {
  const args = parseArgs();
  if (!args.batch && !args.only) {
    console.error("Uso: node scripts/comfy-generate.mjs --batch=all | --case=<slug>");
    exit(2);
  }
  if (!(await comfyHealth())) {
    console.error("Inicie ComfyUI em :8188 (ou export COMFY_URL).");
    exit(1);
  }
  await mkdir(outDir, { recursive: true });
  const template = await loadTemplate();
  const slugs = args.only ? [args.only] : Object.keys(CASES);
  console.log(`==> Gerando ${slugs.length} mockup(s) via ComfyUI`);
  for (const slug of slugs) {
    const c = CASES[slug];
    if (!c) { console.warn(`  [warn] case "${slug}" nao definido`); continue; }
    try { await generateOne(slug, c, template); }
    catch (e) { console.error(`  [FAIL] ${slug}: ${e.message}`); }
  }
  console.log("==> Done");
}

main().catch((e) => { console.error(e); exit(1); });
