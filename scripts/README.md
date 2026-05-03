# scripts/ — Automação 100% CLI

Pipeline completo para preparar assets, gerar mockups via ComfyUI, otimizar imagens e auditar performance. Tudo encapsulado em scripts node/PowerShell — zero passo manual.

## Pré-requisitos (rodar uma vez)

```powershell
pwsh ./scripts/bootstrap.ps1
```

Instala:
- `realesrgan-ncnn-vulkan` (upscale)
- `playwright` chromium (smoke test)
- `lighthouse` CLI
- `sharp` (otimização)

## Fluxo recomendado

```powershell
# 1. Baixar HDRIs e PBR textures (Poly Haven CC0)
npm run assets:hdri
npm run assets:pbr

# 2. Gerar 9 mockups SD (ComfyUI deve estar em :8188)
npm run assets:mockups

# 3. Otimizar tudo para WebP/AVIF
npm run assets:optimize

# 4. Audit + smoke
npm run audit
npm run smoke
```

Ou tudo em um só:

```powershell
npm run assets:all
```

## Scripts individuais

| Script | Faz | Saída |
|---|---|---|
| `bootstrap.ps1` | instala ferramentas externas | sistema preparado |
| `fetch-hdri.mjs` | Poly Haven API → HDRIs `.hdr` 2K | `public/hdri/` |
| `fetch-pbr.mjs` | Poly Haven API → mapas PBR 2K WebP | `public/textures/` |
| `comfy-generate.mjs` | ComfyUI batch (9 workflows) | `public/images/cases/` |
| `comfy-workflows/*.json` | Workflows ComfyUI por mockup | (input) |
| `optimize-images.mjs` | sharp → WebP + AVIF + resize | sobrescreve `public/images/` |
| `audit-lighthouse.mjs` | Lighthouse JSON + Markdown | `audit/lighthouse-{ts}.{json,md}` |
| `smoke-playwright.mjs` | mount canvas + screenshot | `audit/smoke-{ts}.png` |

## Variáveis de ambiente

- `COMFY_URL` — URL ComfyUI (default `http://127.0.0.1:8188`)
- `COMFY_TIMEOUT` — segundos (default 600)
- `SITE_URL` — URL alvo audit (default `http://localhost:3003`)

## Negative prompts (já embutidos nos workflows)

Ver [`../.planning/IMMERSIVE_V4_PLAN.md` § 6](../.planning/IMMERSIVE_V4_PLAN.md).
