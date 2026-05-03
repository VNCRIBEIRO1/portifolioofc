# Plano de Transformação — PixelCode Studio Immersive **V3 (Igloo-tier 3D)**

> Documento mestre canônico. Substitui `IMMERSIVE_V2_PLAN.md` (mantido como histórico).
> Data: 03/05/2026 · Branch: `main` · Commit base: `4ffb4dff`
> Pasta oficial: `D:\desktop1\portfolio_pixel\portifolioofc`

---

## 0. TL;DR

Transformar `pixelcodestudio.com.br` em uma experiência **3D imersiva navegável por scroll bidirecional**, inspirada no **Igloo Inc**. Câmera mergulha em um oceano de mercúrio líquido; conforme desce, conteúdo (manifesto, serviços, cases, contato) emerge da cena. Subir o scroll faz a timeline rebobinar (replay reverso natural). Tudo executado **autonomamente via CLI**, sem passos manuais.

---

## 1. Decisões consolidadas (V3)

| # | Item | Escolha |
|---|------|---------|
| 1 | Pasta oficial | `D:\desktop1\portfolio_pixel\portifolioofc` ✅ |
| 2 | **Stack 3D** | **Three.js + React Three Fiber + drei + postprocessing** (substitui OGL) |
| 3 | Roteiro | 5 atos com mergulho 3D contínuo |
| 4 | Loading screen | REMOVER (hero HTML estática carrega antes do canvas) |
| 5 | Mockups | gerados via SD local + 2 cases reais |
| 6 | Paleta | **A — Liquid Mercury** |
| 7 | Branch | `main` direto |
| 8 | Showcase navigation | **B+A híbrido** (carrossel horizontal pin com botão "Explorar" abrindo overlay leve) |
| 9 | Som ambiente | **NÃO** (visual carrega sozinho) |
| 10 | Animação personalizada de cada plate | **SIM** — cada case tem entrada/saída próprias |
| 11 | Nível de fidelidade | **Igloo-tier completo** (volumetric fog custom, LUT, DOF, ACES) |
| 12 | Execução | **100% via CLI / API**, sem passos manuais |

---

## 2. Paleta — Liquid Mercury

| Token | Valor | Uso |
|-------|-------|-----|
| `--bg` | `#03030c` | Fundo base (quase preto azulado) |
| `--ink` | `#e8e8f0` | Texto principal (off-white frio) |
| `--dim` | `#6b6b80` | Texto secundário, captions |
| `--accent` | `#9ba3c4` | Linhas, bordas, acentos sutis |
| `--glow` | `#c5cde8` | Highlights metálicos no shader |
| `--ripple` | `#4a5375` | Cor base das ondas (mid-tone) |
| `--abyss` | `#01010a` | Cor do abismo final |

Tipografia:
- **Display:** Inter Variable
- **Mono:** JetBrains Mono Variable (scramble + captions técnicos)
- **3D Text:** Inter convertido para MSDF via `msdf-bmfont-xml` (CLI)

---

## 3. Stack & dependências

```json
{
  "manter": {
    "next": "14.2.15",
    "react": "^18.3.1",
    "framer-motion": "^11.11.0",
    "lucide-react": "^1.11.0",
    "tailwindcss": "^3.4.13"
  },
  "novas_runtime": {
    "three": "^0.170.x",
    "@react-three/fiber": "^8.17.x",
    "@react-three/drei": "^9.114.x",
    "@react-three/postprocessing": "^2.16.x",
    "postprocessing": "^6.36.x",
    "gsap": "^3.12.x",
    "lenis": "^1.3.x",
    "zustand": "^5.x",
    "splitting": "^1.0.6",
    "troika-three-text": "^0.52.x"
  },
  "novas_dev": {
    "@types/three": "^0.170.x",
    "leva": "^0.10.x",
    "r3f-perf": "^7.2.x"
  }
}
```

**Bundle delta:** ~140KB gzip. Aceitável para portfolio premium (Lusion ~300KB+).

---

## 4. Roteiro — Mergulho em 5 atos

| Ato | Scroll % | Camera Y | Cena | Conteúdo |
|---|---|---|---|---|
| **1. Superfície** | 0–15% | y=0 | Vista de cima do oceano de mercúrio. Ondas Gerstner com fresnel. HDRI estúdio frio. | Logo `PIXELCODE STUDIO` + scramble: "experiências digitais sob medida" |
| **2. Atravessando** | 15–30% | y=0→−5 | Tensão superficial (vertex push + ripple radial), câmera atravessa a água. HDRI crossfade para escuro. | Manifesto em Text MSDF flutuando: "Não fazemos sites." / "Construímos experiências." / "Que convertem." |
| **3. Mid-water (Voronoi)** | 30–50% | y=−5→−15 | Volume líquido com partículas subindo. 4 cristais Icosahedron com material refrativo emergem. | 4 serviços: Sites · Sistemas · Apps · Imersivo |
| **4. Vale dos cases** | 50–85% | y=−15→−40 | Câmera segue path entre 6 plates flutuantes (cada uma é um case). Cada plate tem animação de entrada própria (rotação, deformação, pulse). | 6 cases (1 por categoria) — fluxo carrossel-3D |
| **5. Abismo** | 85–100% | y=−40→−50 | Tudo escurece. God rays do centro, único ponto de luz. Câmera para. | Scramble "Vamos conversar?" + WhatsApp magnético |

**Replay reverso:** scroll ↑ rebobina toda a timeline (todos efeitos amarrados a `scrub: true` GSAP).

---

## 5. Hierarquia 4 / 6 / 12

| Camada | Quantidade | Onde aparece |
|---|---|---|
| **Serviços** (oferta) | **4** | Ato 3 — cristais Voronoi |
| **Showcase visível** | **6** (1 por serviço/nicho) | Ato 4 — carrossel horizontal pin |
| **Mockups produzidos** | **12** | Acervo total (galerias internas dos cards do showcase) |

### Cases reais (mantidos)
1. Cerbelera & Oliveira Advogados — `/images/projects/cerbelera-*.png`
2. Dra. Andresa Martin — `/images/projects/andresa-*.png`

### Cases gerados via SD (10)
| # | Tipo | Nicho | Modelo SD | Resolução |
|---|------|-------|-----------|-----------|
| 3 | Landing SaaS B2B | Apex Analytics | `protogenX34Photorealism` | 1280×800 |
| 4 | CRM Dashboard | Lumen CRM | `dreamshaper_8` | 1280×800 |
| 5 | App iOS | Onda banking | `realisticVisionV60B1` | 390×844 |
| 6 | App Android | Pulse Fit | `realisticVisionV60B1` | 412×915 |
| 7 | E-commerce | Atelier (moda) | `dreamshaper_8` | 1440×900 |
| 8 | ERP/Admin | Forge | `dreamshaper_8` | 1440×900 |
| 9 | Institucional Premium | Northwind Capital | `protogenX34Photorealism` | 1440×900 |
| 10 | Portfolio Editorial | Kira Tanaka | `realisticVisionV60B1` | 1440×900 |
| 11 | Educacional | Scholae | `dreamshaper_8` | 1280×800 |
| 12 | Imersivo 3D | Atlas Studio | `deliberate_v6` | 1440×900 |

### Agrupamento final no showcase
- **Jurídico** → Cerbelera (real)
- **Saúde** → Dra. Andresa (real)
- **Landing/SaaS** → Apex Analytics (#3)
- **CRM/ERP** → Lumen (#4) primário, Forge (#8) galeria
- **Mobile** → Onda (#5) + Pulse Fit (#6) galeria
- **Imersivo/Editorial** → Atlas (#12) primário, Kira (#10) + Northwind (#9) galeria

> Atelier (#7) e Scholae (#11) ficam como bônus rotativos.

---

## 6. Showcase — Navegação confirmada (B+A híbrido)

**Carrossel 3D pin scrub** com drill-down opcional:

- Seção pinada por ~600vh
- Câmera viaja horizontalmente entre as 6 plates flutuantes 3D
- Scroll vertical = movimento horizontal (mapping clássico Lusion)
- Botão "Explorar →" em cada plate abre **overlay leve** (clip-path radial expansão a partir do clique) com galeria detalhada
- Continuar scroll com overlay aberto fecha overlay primeiro
- Mobile: swipe vertical (avança/rebobina) + tap em plate abre overlay
- Atalhos: setas ↑/↓ navegam, Esc fecha overlay, números 1-6 saltam para case específico

**Animação personalizada por plate:**

| Case | Entrada | Idle | Hover | Saída |
|---|---|---|---|---|
| Cerbelera (jurídico) | sobe do fundo, gira em Y | leve oscilação Y | tilt em mouse, glow accent | desce e gira contrário |
| Andresa (saúde) | aparece com fade vertical, partículas saindo | respiração X (escala 1.0↔1.02) | tilt + brilho clearcoat | partículas reabsorvendo |
| Apex (SaaS) | construção em camadas (4 layers stagger) | parado | tilt forte 3D | colapso por camada |
| Lumen (CRM) | rotação 90° desde lateral | dados scroll na textura | textura "preview" anima | rotação 90° saída |
| Onda+Pulse (mobile) | dois plates entram em paralelo, 1 atrás do outro | parallax sutil entre os 2 | um foca na frente | retornam à pilha |
| Atlas (imersivo) | partículas se condensam → forma plate | iridescência animada na superfície | distorção wave | partículas explodem |

Implementação: cada plate é um componente R3F com hook `usePlateAnimation(scrollProgress, hoverState)` que retorna uniforms + transform. Timeline GSAP individual sincroniza com timeline mestre.

---

## 7. Aquisição automatizada de assets

### A. HDRIs (Poly Haven CC0)
Baixar via API CLI (script `scripts/fetch-hdri.mjs`):
- `studio_small_08` — superfície (estúdio frio)
- `dikhololo_night` — abismo (noite escura)
- Formato: `.hdr` 2K
- Destino: `public/hdri/`

### B. PBR Textures (Poly Haven CC0)
Via API:
- `frosted_glass_01` (vidro fosco)
- `metal_brushed_01` (metal escovado para bordas)
- `marble_01` (acentos opcionais)
- Maps: diffuse + normal + roughness + AO
- Formato: WebP 2K (convertido após download)
- Destino: `public/textures/`

### C. Caustics
Geradas **proceduralmente em shader GLSL** (zero asset). Função baseada em Voronoi noise dual-layer com offset temporal.

### D. LUTs filmicas
- `Teal-Orange-Cinematic.cube` de luts.iwltbap.com (CC)
- `Cold-Mercury-Custom.cube` (gerar via script Python com colour-science)
- Destino: `public/luts/`

### E. Fonts MSDF
Converter Inter Variable e JetBrains Mono via `msdf-bmfont-xml`:
```bash
npx msdf-bmfont -f json -o public/fonts/inter-msdf Inter-Variable.ttf
```

### F. Mockups SD (10) + variações
Via ComfyUI API local em `http://127.0.0.1:8188`. Workflows JSON em `scripts/comfy-workflows/`.

### G. Texturas decorativas SD
- Iridescência metálica seamless (256×256)
- Mercúrio macro seamless (512×512)
- Geradas com flag `tileable` no ComfyUI

### H. Sequência de bolhas (sprite sheet)
Gerada com AnimateDiff (ComfyUI), 16 frames @ 256×256, exportada como sprite sheet.

---

## 8. Pipeline de pós-processamento (camada Igloo-tier)

```ts
<EffectComposer multisampling={4}>
  <Bloom intensity={0.6} luminanceThreshold={0.85} />
  <DepthOfField focusDistance={0.01} focalLength={0.05} bokehScale={3} />
  <ChromaticAberration offset={[0.0008, 0.0008]} />
  <Noise opacity={0.025} />
  <Vignette offset={0.2} darkness={0.6} />
  <LUT lut={loadedLUT} />
  <ToneMapping mode={ACES_FILMIC} />
</EffectComposer>
```

**Volumetric fog custom**: shader raymarching em `<VolumetricFog>` componente, ~150 linhas GLSL. Densidade animada por scroll (mais denso no abismo).

---

## 9. Skill `mockup-prompt-architect`

Criada em `c:\Users\Administrador\.agents\skills\mockup-prompt-architect\`. Detalhes na estrutura própria. Resumo do escopo:

- Análise estética baseada em ícones renomados da web (Linear, Vercel, Stripe, Apple, Notion, Figma, Cartier, Bruno Simon, Lusion, Active Theory, Igloo Inc)
- Output: prompt SD positivo + negativo + parâmetros sampling otimizados RTX 2060 6GB
- Suporte a Motion LoRAs (AnimateDiff)
- Templates por tipo: SaaS, CRM/ERP, mobile iOS, mobile Android, e-commerce, editorial, institucional, educacional, imersivo, jurídico/médico (PT-BR)
- Cases prontos para os 12 mockups deste projeto

---

## 10. Negative prompts — biblioteca consolidada

```yaml
liquid_metal_3d:
  - cartoon water, anime water, stylized waves, low poly water
  - flat shading, no specular, matte plastic look, no fresnel
  - obvious tiling, repeating pattern, seam visible
  - banding, posterization, color quantization

mockups_sd_ui:
  - lorem ipsum, placeholder text, gibberish text, garbled letters
  - deformed UI, broken alignment, asymmetric buttons, misaligned grid
  - cartoon, anime, illustration, painterly, hand drawn
  - watermark, signature, artist name, logo overlay
  - low contrast, washed out, jpeg artifacts, compression noise
  - blurry, out of focus, low resolution, pixelated, aliasing
  - ugly fonts, papyrus, comic sans, distorted typography
  - multiple windows overlapping, broken modal, z-index conflict
  - rainbow colors, neon overload, gradient abuse
  - fake metrics impossibly large, 999% growth, unrealistic numbers
  - hands, fingers, faces (a menos que o nicho exija foto)

3d_textures_seamless:
  - visible seam, tiling pattern, repeating motif
  - logo, brand mark, signature
  - high frequency noise that breaks tiling
```

---

## 11. Estado da arte — automação total

Análise de cada fase em termos de **autonomia CLI**:

| Fase | Tarefa | Automatizável CLI | Como |
|---|---|---|---|
| F0 | Instalar deps | ✅ 100% | `npm install` |
| F0 | Arquivar pastas legadas | ✅ 100% | `git mv`, `Move-Item` |
| F0 | Baixar HDRIs | ✅ 100% | `node scripts/fetch-hdri.mjs` (Poly Haven API) |
| F0 | Baixar PBR textures | ✅ 100% | `node scripts/fetch-pbr.mjs` (Poly Haven API) |
| F0 | Converter HDR→KTX2 | ✅ 100% | `toktx` CLI (Khronos) |
| F0 | Gerar MSDF fonts | ✅ 100% | `npx msdf-bmfont-xml` |
| F0 | Baixar LUTs | ✅ 100% | `curl` + script Python `colour-science` |
| F0.5 | Skill criada | ✅ 100% | já feito neste turno |
| F1-F5 | Código R3F | ✅ 100% | edição direta dos arquivos |
| F4 | Geração mockups SD | ✅ 100% | ComfyUI API via `node scripts/comfy-generate.mjs` |
| F4 | Upscale mockups | ✅ 100% | `realesrgan-ncnn-vulkan` CLI |
| F4 | Depth maps | ✅ 100% | `python scripts/depth-anything.py` |
| F4 | Geração caustics AnimateDiff | ✅ 100% | ComfyUI API + workflow específico |
| F4 | Otimização imagens | ✅ 100% | `cwebp` + `sharp` CLI |
| F6 | Lighthouse audit | ✅ 100% | `npx lighthouse --output=json` |
| F6 | Visual regression | ✅ 100% | `playwright` screenshots + `pixelmatch` diff |
| F6 | Bundle analysis | ✅ 100% | `@next/bundle-analyzer` |
| F7 | Deploy | ✅ 100% | `vercel --prod` |
| F7 | Smoke test prod | ✅ 100% | `playwright` headless contra URL |

**Conclusão: 100% automatizável.** Nada precisa ser feito manualmente.

---

## 12. Ferramentas a instalar (uma vez, autônoma)

```powershell
# Já instalado (presumido):
# - node 20+
# - git
# - python 3.10+
# - ComfyUI (rodando em :8188)
# - Stable Diffusion models (DreamShaper, Realistic Vision, etc.)

# A instalar:
winget install Khronos.KTXTools          # toktx para KTX2
pip install --upgrade colour-science     # gerar LUTs custom
pip install --upgrade depth-anything-v2  # depth maps
# Real-ESRGAN binary:
$url = "https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.5.0/realesrgan-ncnn-vulkan-20220424-windows.zip"
Invoke-WebRequest $url -OutFile $env:TEMP\esrgan.zip
Expand-Archive $env:TEMP\esrgan.zip -DestinationPath C:\tools\realesrgan
$env:PATH += ";C:\tools\realesrgan"

# CLI úteis npm:
npm install -g msdf-bmfont-xml @vercel/cli playwright
npx playwright install chromium
```

Tudo isso é encapsulado em um único script `scripts/bootstrap.ps1`.

---

## 13. Estrutura final de scripts (todos CLI-driven)

```
portifolioofc/
  scripts/
    bootstrap.ps1               # instala todas ferramentas externas
    fetch-hdri.mjs              # Poly Haven HDRI download
    fetch-pbr.mjs               # Poly Haven PBR textures
    fonts-msdf.ps1              # converte fontes para MSDF
    luts-generate.py            # cria LUTs custom com colour-science
    comfy-generate.mjs          # batch gerar mockups via ComfyUI API
    comfy-workflows/
      saas-landing.json
      crm-dashboard.json
      mobile-ios.json
      mobile-android.json
      ecommerce.json
      erp-admin.json
      institutional.json
      editorial.json
      educational.json
      immersive.json
      caustics-animatediff.json
      mercury-iridescent.json
    upscale-batch.ps1           # Real-ESRGAN em todos mockups
    depth-batch.py              # Depth Anything em todos mockups
    optimize-images.mjs         # sharp → WebP + AVIF
    audit-lighthouse.mjs        # Lighthouse CI
    visual-regression.mjs       # Playwright + pixelmatch
    deploy.ps1                  # vercel build + deploy + smoke test
```

---

## 14. Plano de execução por fases (V3)

| Fase | Entrega | CLI? | Saída esperada |
|---|---|---|---|
| **F0** Bootstrap | `scripts/bootstrap.ps1` instala tudo; `npm install` deps R3F | ✅ | máquina pronta |
| **F0.5** Skill `mockup-prompt-architect` | criada nesta sessão | ✅ | skill ativa |
| **F1** Aquisição assets base | HDRIs + PBR + LUTs + fontes MSDF | ✅ | `public/{hdri,textures,luts,fonts}/` populados |
| **F2** Hello Ocean | shader Gerstner + HDRI + ACES, navegação Lenis básica | ✅ | hero 3D funcional |
| **F3** Surface tension + manifesto | atravessamento + Text MSDF flutuante | ✅ | atos 1-2 prontos |
| **F4** Voronoi crystals (serviços) | 4 cristais com material refrativo + reveal scroll | ✅ | ato 3 pronto |
| **F5** Cases path + plate animations | 6 plates 3D com animações personalizadas + carrossel pin | ✅ | ato 4 pronto |
| **F5.5** Geração mockups SD (paralelo) | 10 mockups + caustics + texturas iridescentes via ComfyUI | ✅ | `public/images/cases/`, `public/textures/animated/` |
| **F6** Pós-processamento | Bloom + DOF + Chromatic + Vignette + LUT + ACES + Volumetric fog | ✅ | look Igloo-tier atingido |
| **F7** Abyss + CTA | god rays + WhatsApp magnético + scramble final | ✅ | ato 5 pronto |
| **F8** Mobile fallback + reduced-motion | detecção HW + versão simplificada | ✅ | mobile bom |
| **F9** Audit & deploy | Lighthouse ≥85 mobile + visual regression + Vercel prod | ✅ | site no ar |

**Tempo estimado total:** 10-14 sessões. Geração SD roda em background durante F2-F5.

---

## 15. Próximos passos imediatos (próxima sessão Edit)

1. Rodar `scripts/bootstrap.ps1` (instalar tools)
2. Rodar `npm install` para deps R3F
3. F1 — `node scripts/fetch-hdri.mjs && node scripts/fetch-pbr.mjs && pwsh scripts/fonts-msdf.ps1`
4. F1 — disparar `node scripts/comfy-generate.mjs --batch=all` em background (mockups SD começam a renderizar)
5. F2 — implementar `<Canvas>` + Hello Ocean
6. Iterar fases sequencialmente

---

## 16. Riscos e mitigações

| Risco | Mitigação |
|---|---|
| Bundle 140KB inicial | Hero HTML estática primeiro; `<Canvas>` lazy via `dynamic({ ssr: false })` |
| Vazamento GPU em HMR | usar `r3f-perf` em dev; hot-reload limpa cena via `useEffect` cleanup |
| iOS Safari WebGL | testar com Playwright + iPhone emulation; ACES tonemap é compatível |
| Mobile baixo FPS | `navigator.hardwareConcurrency < 4` → modo simplificado (sem postprocess, plane 64×64, sem volumetric fog) |
| ComfyUI offline | script verifica health endpoint antes; aborta com erro claro |
| HDRI VRAM (2× 2K = 64MB) | usar KTX2 compressão (ETC1S) → 8MB total |
| Acessibilidade | DOM layer com texto real navegável por teclado/screen-reader; canvas é decoração com `aria-hidden` |
| SEO | conteúdo em SSR; canvas client-only |
| `prefers-reduced-motion` | desabilita scrub, mostra versão estática slide-by-slide |

---

## 17. Histórico

- 4ffb4dff: commit base restaurado
- V1→V2: paleta + 5 atos + 12 mockups confirmados
- V2→V3: troca para Three+R3F (Igloo-tier), animações por plate, navegação B+A híbrida, sem áudio, automação CLI total
