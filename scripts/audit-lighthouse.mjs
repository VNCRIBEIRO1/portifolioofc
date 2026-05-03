#!/usr/bin/env node
/**
 * audit-lighthouse.mjs — roda Lighthouse em SITE_URL (default http://localhost:3003)
 * Saida: audit/lighthouse-{ts}.{json,md}
 *
 * Requer lighthouse global: npm i -g lighthouse
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const auditDir = join(repoRoot, "audit");
const SITE = process.env.SITE_URL || "http://localhost:3003";

function ts() {
  return new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
}

async function runLighthouse() {
  await mkdir(auditDir, { recursive: true });
  const stamp = ts();
  const jsonPath = join(auditDir, `lighthouse-${stamp}.json`);
  const args = [
    SITE,
    "--output=json",
    `--output-path=${jsonPath}`,
    "--quiet",
    "--chrome-flags=--headless=new --no-sandbox",
    "--preset=desktop",
  ];
  console.log(`==> Lighthouse ${SITE}`);
  await new Promise((resolve, reject) => {
    const ps = spawn("lighthouse", args, { stdio: "inherit", shell: true });
    ps.on("exit", (c) => (c === 0 ? resolve() : reject(new Error(`lighthouse exit ${c}`))));
  });
  const r = JSON.parse(await (await import("node:fs/promises")).readFile(jsonPath, "utf8"));
  const cat = r.categories;
  const perf = (cat.performance.score * 100).toFixed(0);
  const a11y = (cat.accessibility.score * 100).toFixed(0);
  const bp = (cat["best-practices"].score * 100).toFixed(0);
  const seo = (cat.seo.score * 100).toFixed(0);
  const md = `# Lighthouse — ${stamp}\n\nURL: ${SITE}\n\n| Categoria | Score |\n|---|---|\n| Performance | ${perf} |\n| A11y | ${a11y} |\n| Best Practices | ${bp} |\n| SEO | ${seo} |\n`;
  await writeFile(join(auditDir, `lighthouse-${stamp}.md`), md);
  console.log(md);
}

runLighthouse().catch((e) => { console.error(e); process.exit(1); });
