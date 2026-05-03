#!/usr/bin/env node
/**
 * seed-cases.mjs — cria stubs em public/images/cases/{slug}.png copiando mockups reais.
 *
 * Roda automaticamente no `npm run dev` (via predev) para garantir que os caminhos existam
 * mesmo antes de comfy-generate.mjs gerar os mockups SD definitivos.
 *
 * Idempotente: nunca sobrescreve um arquivo existente.
 */
import { copyFile, mkdir, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const projDir = join(repoRoot, "public", "images", "projects");
const casesDir = join(repoRoot, "public", "images", "cases");

// Mapeamento slug → arquivo "real" usado como stub
const SEEDS = {
  apex: "luciana-desktop.png",
  lumen: "bozo-desktop.png",
  onda: "andresa-mobile.png",
  pulse: "luciana-mobile.png",
  atelier: "luciana-desktop.png",
  forge: "bozo-desktop.png",
  northwind: "cerbelera-desktop.png",
  kira: "luciana-desktop.png",
  scholae: "bozo-desktop.png",
};

async function exists(p) { try { await access(p); return true; } catch { return false; } }

async function main() {
  await mkdir(casesDir, { recursive: true });
  let created = 0;
  for (const [slug, src] of Object.entries(SEEDS)) {
    const dst = join(casesDir, `${slug}.png`);
    if (await exists(dst)) continue;
    const from = join(projDir, src);
    if (!(await exists(from))) { console.warn(`  [warn] fonte nao existe: ${from}`); continue; }
    await copyFile(from, dst);
    created++;
  }
  if (created > 0) console.log(`==> seed-cases: ${created} stub(s) criados em public/images/cases/`);
}

main().catch((e) => { console.error(e); process.exit(1); });
