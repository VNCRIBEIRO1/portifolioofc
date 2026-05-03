#!/usr/bin/env node
/**
 * optimize-images.mjs — converte PNG/JPG em public/images/ para WebP + AVIF mantendo o original.
 *
 * Requer: sharp instalado localmente (`npm i -D sharp`)
 *
 * Idempotente: pula arquivos com .webp/.avif ja existentes mais novos que o original.
 */
import { readdir, stat, mkdir } from "node:fs/promises";
import { join, extname, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const targets = [
  join(repoRoot, "public", "images", "projects"),
  join(repoRoot, "public", "images", "cases"),
];

let sharp;
try { sharp = (await import("sharp")).default; }
catch {
  console.error("sharp nao instalado. Rode: npm i -D sharp");
  process.exit(1);
}

async function* walk(dir) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); }
  catch { return; }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

async function shouldConvert(src, dst) {
  try {
    const [s, d] = await Promise.all([stat(src), stat(dst)]);
    return s.mtimeMs > d.mtimeMs;
  } catch { return true; }
}

async function convertOne(file) {
  const ext = extname(file).toLowerCase();
  if (![".png", ".jpg", ".jpeg"].includes(ext)) return;
  const base = file.slice(0, -ext.length);
  const webp = `${base}.webp`;
  const avif = `${base}.avif`;

  const tasks = [];
  if (await shouldConvert(file, webp)) {
    tasks.push(sharp(file).webp({ quality: 86, effort: 5 }).toFile(webp).then(() => console.log(`  [webp] ${basename(webp)}`)));
  }
  if (await shouldConvert(file, avif)) {
    tasks.push(sharp(file).avif({ quality: 60, effort: 6 }).toFile(avif).then(() => console.log(`  [avif] ${basename(avif)}`)));
  }
  await Promise.all(tasks);
}

async function main() {
  for (const dir of targets) {
    await mkdir(dir, { recursive: true });
    console.log(`==> ${dir}`);
    for await (const f of walk(dir)) {
      try { await convertOne(f); }
      catch (e) { console.error(`  [FAIL] ${f}: ${e.message}`); }
    }
  }
  console.log("==> Done");
}

main().catch((e) => { console.error(e); process.exit(1); });
