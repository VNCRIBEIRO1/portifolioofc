#!/usr/bin/env node
/**
 * generate-crystal-refs.mjs — Gera 11 imagens de cristais/meteoritos
 * inspirados no portfólio Bryce-tier (img de referência) para alimentar
 * Hunyuan3D-2 manualmente (HuggingFace) e gerar os GLBs.
 *
 * Estilo-alvo:
 *   - Objeto único centralizado (cristal cru / meteorito / mineral abstrato)
 *   - Fundo cinza neutro liso (gradiente sutil) — ideal para image-to-3D
 *   - Iluminação difusa de estúdio, leves reflexos especulares iridescentes
 *   - Aberração cromática sutil nas bordas (RGB split) — efeito digital
 *   - Forma orgânica e facetada, NÃO geometricamente perfeita
 *   - Nenhum texto/UI (limpo para 3D reconstruction)
 *
 * Output: public/images/crystal-refs/<slug>.png  (1024x1024)
 */
import { writeFile, mkdir, access, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { argv, env, exit } from "node:process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const outDir = join(repoRoot, "public", "images", "crystal-refs");
const wfDir = join(__dirname, "comfy-workflows");

const COMFY_URL = env.COMFY_URL || "http://127.0.0.1:8188";
const TIMEOUT_S = Number(env.COMFY_TIMEOUT || 900);
const MODEL = "DreamShaper_8_pruned.safetensors";

// Negative prompt forte para garantir objeto LIMPO, sem texto, sem UI, sem fundo poluído
const NEG = [
  "text, letters, words, typography, watermark, signature, logo, label, ui, interface",
  "multiple objects, scattered pieces, floating shards, debris, particles around",
  "background scenery, landscape, sky, sun, moon, planet, stars, galaxy",
  "ground, floor, table, surface, shadow on ground, pedestal, base",
  "people, hands, fingers, faces, body parts",
  "cartoon, anime, illustration, painterly, hand drawn, sketch, drawing",
  "low quality, blurry, out of focus, pixelated, jpeg artifacts, noise",
  "deformed, distorted, asymmetric extreme, broken geometry",
  "rainbow neon, oversaturated, vibrant colors, neon glow",
  "duplicate, twins, two of, pair of, collection",
  "photoshop frame, border, vignette dark heavy",
].join(", ");

// Base style aplicado a todos para coesão visual com a referência
const STYLE = "studio product photography, single isolated object centered in frame, " +
              "soft neutral gray gradient background (#a8a8ab to #c4c4c8), " +
              "subtle iridescent specular highlights, soft top-lighting, " +
              "diffuse rim light, photorealistic, ultra detailed, hyperreal, " +
              "subtle chromatic aberration on edges, micro fractures and surface detail, " +
              "shallow depth of field, 8k product render, NO text, NO ui";

const CRYSTALS = [
  {
    slug: "cerbelera",
    prompt: "rough volcanic obsidian meteorite crystal, jagged sharp facets, " +
            "deep black core with molten gold veins glowing from within, " +
            "wet glossy surface, fragments of dark glass, single floating object",
  },
  {
    slug: "andresa",
    prompt: "raw rose quartz crystal cluster, soft pink translucent, " +
            "rounded organic facets with tiny micro-fractures, milky inclusions, " +
            "delicate glow from inside, single floating gemstone object",
  },
  {
    slug: "apex",
    prompt: "raw aquamarine sapphire crystal, hexagonal prism with broken tip, " +
            "electric blue glass-like core, sharp crystalline facets, " +
            "icy translucent edges, floating mineral specimen",
  },
  {
    slug: "lumen",
    prompt: "natural emerald crystal column with gold streaks, " +
            "deep green translucent core, bipyramidal hexagonal shape, " +
            "broken jagged tips revealing inner glow, floating gemstone",
  },
  {
    slug: "onda",
    prompt: "raw aquamarine ice crystal cluster, frozen translucent blue, " +
            "rounded melted facets like ocean glass, soft cyan inner glow, " +
            "subtle white frost on surface, single floating object",
  },
  {
    slug: "pulse",
    prompt: "raw ruby crystal meteorite, deep blood red core, " +
            "molten orange-red veins, sharp angular fractures, " +
            "wet glossy obsidian-like surface, floating gemstone",
  },
  {
    slug: "atelier",
    prompt: "raw amethyst geode crystal, deep violet purple, " +
            "hexagonal druzy facets clustered, lavender inner glow, " +
            "rounded organic shape with sharp crystal tips, floating mineral",
  },
  {
    slug: "forge",
    prompt: "raw citrine quartz crystal, golden honey amber color, " +
            "sharp hexagonal prism shape, copper inclusions, " +
            "warm inner glow like molten gold, floating gemstone specimen",
  },
  {
    slug: "northwind",
    prompt: "raw deep blue sapphire boulder, royal navy core, " +
            "rough natural facets with broken edges, ice-blue highlights, " +
            "polished wet surface revealing depth, floating mineral",
  },
  {
    slug: "kira",
    prompt: "raw opal mineral with iridescent rainbow play-of-color, " +
            "milky white base with shifting pink, cyan, green flashes, " +
            "rounded organic shape, soft pearl-like surface, floating gemstone",
  },
  {
    slug: "scholae",
    prompt: "raw fluorite crystal with cubic facets, " +
            "translucent teal-green to deep blue gradient, " +
            "geometric stepped formations, soft emerald inner light, " +
            "single floating mineral specimen",
  },
];

async function exists(p) { try { await access(p); return true; } catch { return false; } }
async function loadTemplate() { return JSON.parse(await readFile(join(wfDir, "_template.json"), "utf8")); }

async function patchWorkflow(template, c) {
  const wf = JSON.parse(JSON.stringify(template));
  for (const key of Object.keys(wf)) {
    if (key.startsWith("_") || !wf[key]?.class_type) delete wf[key];
  }
  if (wf["4"]?.inputs) wf["4"].inputs.ckpt_name = MODEL;
  if (wf["5"]?.inputs) { wf["5"].inputs.width = 1024; wf["5"].inputs.height = 1024; }
  if (wf["6"]?.inputs) wf["6"].inputs.text = `${c.prompt}, ${STYLE}`;
  if (wf["7"]?.inputs) wf["7"].inputs.text = NEG;
  if (wf["3"]?.inputs) {
    wf["3"].inputs.steps = 36;
    wf["3"].inputs.cfg = 7.5;
    wf["3"].inputs.sampler_name = "dpmpp_2m";
    wf["3"].inputs.scheduler = "karras";
    // Seed deterministica por slug para reproducibilidade
    let h = 5381;
    for (let i = 0; i < c.slug.length; i++) h = ((h << 5) + h) ^ c.slug.charCodeAt(i);
    wf["3"].inputs.seed = Math.abs(h) >>> 0;
  }
  return wf;
}

async function comfyHealth() {
  try { const r = await fetch(`${COMFY_URL}/system_stats`); return r.ok; }
  catch { return false; }
}
async function submit(wf) {
  const r = await fetch(`${COMFY_URL}/prompt`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: wf }),
  });
  if (!r.ok) throw new Error(`submit ${r.status}: ${await r.text()}`);
  return (await r.json()).prompt_id;
}
async function pollHistory(promptId) {
  const start = Date.now();
  while ((Date.now() - start) / 1000 < TIMEOUT_S) {
    const r = await fetch(`${COMFY_URL}/history/${promptId}`);
    if (r.ok) {
      const j = await r.json(); const e = j[promptId];
      if (e?.outputs) return e;
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error(`timeout ${promptId}`);
}
function findFirstImage(entry) {
  for (const nodeId of Object.keys(entry.outputs)) {
    const imgs = entry.outputs[nodeId]?.images;
    if (imgs?.length) return imgs[0];
  }
  return null;
}
async function downloadImage(meta) {
  const url = `${COMFY_URL}/view?filename=${encodeURIComponent(meta.filename)}&subfolder=${encodeURIComponent(meta.subfolder || "")}&type=${meta.type || "output"}`;
  const r = await fetch(url); if (!r.ok) throw new Error(`view ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

async function generateOne(c, template, force) {
  const out = join(outDir, `${c.slug}.png`);
  if (!force && await exists(out)) { console.log(`  [skip] ${c.slug}`); return; }
  console.log(`  [gen ] ${c.slug}  1024x1024  steps=36  dpmpp_2m/karras`);
  const wf = await patchWorkflow(template, c);
  const pid = await submit(wf);
  const e = await pollHistory(pid);
  const m = findFirstImage(e); if (!m) throw new Error("sem imagem");
  const buf = await downloadImage(m);
  await writeFile(out, buf);
  console.log(`         ok ${(buf.length/1024).toFixed(0)}KB`);
}

async function main() {
  const force = argv.includes("--force");
  const only = argv.find(a => a.startsWith("--slug="))?.split("=")[1];
  if (!await comfyHealth()) {
    console.error(`ComfyUI nao acessivel em ${COMFY_URL}. Inicie:`);
    console.error(`  D:\\desktop1\\forge\\venv\\Scripts\\python.exe D:\\desktop1\\ComfyUI\\main.py --port 8188 --lowvram`);
    exit(1);
  }
  await mkdir(outDir, { recursive: true });
  const template = await loadTemplate();
  const list = only ? CRYSTALS.filter(c => c.slug === only) : CRYSTALS;
  console.log(`==> Gerando ${list.length} cristal(is) de referencia para Hunyuan3D-2`);
  console.log(`    Output: ${outDir}\n`);
  for (const c of list) {
    try { await generateOne(c, template, force); }
    catch (e) { console.error(`  [FAIL] ${c.slug}: ${e.message}`); }
  }
  console.log("\n==> Done. Suba cada PNG no Hunyuan3D-2 e baixe como GLB.");
  console.log("    Coloque os .glb gerados em: public/models/crystals-real/<slug>.glb");
}

main().catch(e => { console.error(e); exit(1); });
