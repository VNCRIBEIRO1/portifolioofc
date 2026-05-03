#!/usr/bin/env node
/**
 * fetch-pbr.mjs — baixa texturas PBR CC0 da Poly Haven (diffuse/normal/roughness/ao)
 *
 * Saida: public/textures/{slug}/{slug}_{map}_2k.{jpg|png}
 */
import { writeFile, mkdir, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const outRoot = join(repoRoot, "public", "textures");

// Texturas escolhidas para o look Liquid Mercury
const TEXTURES = [
  { slug: "frosted_glass_01", maps: ["diff", "rough", "nor_gl"] },
  { slug: "metal_brushed_01", maps: ["diff", "rough", "nor_gl", "metal"] },
  { slug: "marble_01",         maps: ["diff", "rough", "nor_gl"] },
];

async function exists(p) { try { await access(p); return true; } catch { return false; } }

async function fetchTex(slug, mapName) {
  const dir = join(outRoot, slug);
  await mkdir(dir, { recursive: true });
  const filesRes = await fetch(`https://api.polyhaven.com/files/${slug}`);
  if (!filesRes.ok) throw new Error(`API files ${slug}: ${filesRes.status}`);
  const files = await filesRes.json();
  // Estrutura: files[mapName]["2k"]["jpg"|"png"].url
  const node = files?.[mapName]?.["2k"];
  if (!node) { console.log(`  [miss] ${slug}/${mapName}`); return; }
  const fmt = node.jpg ? "jpg" : node.png ? "png" : null;
  if (!fmt) { console.log(`  [miss] ${slug}/${mapName} (sem fmt)`); return; }
  const out = join(dir, `${slug}_${mapName}_2k.${fmt}`);
  if (await exists(out)) { console.log(`  [skip] ${slug}/${mapName}`); return; }
  const url = node[fmt].url;
  const dl = await fetch(url);
  if (!dl.ok) throw new Error(`download ${slug}/${mapName}: ${dl.status}`);
  await writeFile(out, Buffer.from(await dl.arrayBuffer()));
  console.log(`  [get ] ${slug}/${mapName}`);
}

async function main() {
  console.log(`==> Fetching PBR textures from Poly Haven`);
  for (const t of TEXTURES) {
    for (const m of t.maps) {
      try { await fetchTex(t.slug, m); }
      catch (e) { console.error(`  [FAIL] ${t.slug}/${m}: ${e.message}`); }
    }
  }
  console.log("==> Done");
}

main().catch((e) => { console.error(e); process.exit(1); });
