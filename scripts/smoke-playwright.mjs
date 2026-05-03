#!/usr/bin/env node
/**
 * smoke-playwright.mjs — abre SITE_URL, espera <canvas> WebGL aparecer,
 * scrolla 100% e tira screenshots em 3 pontos do mergulho.
 *
 * Requer: playwright instalado (`npm i -g playwright` + `npx playwright install chromium`)
 */
import { mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const outDir = join(repoRoot, "audit");
const SITE = process.env.SITE_URL || "http://localhost:3003";

let chromium;
try { ({ chromium } = await import("playwright")); }
catch {
  console.error("playwright nao encontrado. Rode: npm i -g playwright && npx playwright install chromium");
  process.exit(1);
}

function ts() { return new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14); }

async function main() {
  await mkdir(outDir, { recursive: true });
  const stamp = ts();
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  console.log(`==> Smoke ${SITE}`);
  await page.goto(SITE, { waitUntil: "networkidle", timeout: 30000 });
  // Aguarda canvas aparecer
  await page.waitForSelector("canvas", { timeout: 15000 }).catch(() => console.warn("  [warn] canvas nao encontrado"));
  await page.waitForTimeout(2000);

  // 3 pontos de scroll
  const points = [0, 0.4, 0.85];
  for (const p of points) {
    await page.evaluate((pp) => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: max * pp, behavior: "instant" });
    }, p);
    await page.waitForTimeout(1500);
    const f = join(outDir, `smoke-${stamp}-p${(p * 100).toFixed(0)}.png`);
    await page.screenshot({ path: f, fullPage: false });
    console.log(`  [shot] ${f}`);
  }

  await browser.close();
  console.log("==> Done");
}

main().catch((e) => { console.error(e); process.exit(1); });
