#!/usr/bin/env node
/**
 * fetch-hdri.mjs — baixa HDRIs CC0 da Poly Haven via API pública
 *
 * Saida: public/hdri/{slug}_2k.hdr
 *
 * Sem autenticacao necessaria. API: https://api.polyhaven.com/
 *
 * Idempotente: pula arquivos ja existentes.
 */
import { writeFile, mkdir, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const outDir = join(repoRoot, "public", "hdri");

const HDRIS = [
  { slug: "studio_small_08", res: "2k" }, // estudio frio para superficie
  { slug: "dikhololo_night", res: "2k" }, // noite escura para abismo
];

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function fetchHdri(slug, res) {
  const out = join(outDir, `${slug}_${res}.hdr`);
  if (await exists(out)) {
    console.log(`  [skip] ${slug}_${res}.hdr (ja existe)`);
    return;
  }
  console.log(`  [get ] ${slug}_${res}.hdr`);
  // API files endpoint: https://api.polyhaven.com/files/{slug}
  const filesRes = await fetch(`https://api.polyhaven.com/files/${slug}`);
  if (!filesRes.ok) throw new Error(`API files ${slug}: ${filesRes.status}`);
  const files = await filesRes.json();
  const hdriUrl = files?.hdri?.[res]?.hdr?.url;
  if (!hdriUrl) throw new Error(`HDRI ${slug} ${res} nao disponivel na Poly Haven`);
  const dl = await fetch(hdriUrl);
  if (!dl.ok) throw new Error(`Download ${slug}: ${dl.status}`);
  const buf = Buffer.from(await dl.arrayBuffer());
  await writeFile(out, buf);
  console.log(`         ${(buf.length / 1024 / 1024).toFixed(2)}MB`);
}

async function main() {
  await mkdir(outDir, { recursive: true });
  console.log(`==> Fetching ${HDRIS.length} HDRIs from Poly Haven`);
  for (const h of HDRIS) {
    try { await fetchHdri(h.slug, h.res); }
    catch (e) { console.error(`  [FAIL] ${h.slug}: ${e.message}`); }
  }
  console.log("==> Done");
}

main().catch((e) => { console.error(e); process.exit(1); });
