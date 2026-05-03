# Plano de Transformação — PixelCode Studio Immersive V3

> Documento mestre da refatoração do site `pixelcodestudio.com.br` para experiência imersiva "single-canvas, single-camera, 3D dive" inspirada em **Igloo Inc** (igloo.inc).
> Data: 03/05/2026 · Versão: V3 · Branch: `main` · Commit base: `4ffb4dff`
> Mudanças V2→V3: ver §19.

---

## 1. Pasta oficial do projeto

`D:\desktop1\portfolio_pixel\portifolioofc`

- **Stack atual:** Next.js 14.2.15 + React 18 + TypeScript + Tailwind 3.4 + framer-motion + lucide-react
- **Vercel:** projeto `pixelcodestudio` (`prj_XpctKdeoFD31IeSZRF5Occi75eq7`), domínios `pixelcodestudio.com.br` e `www.pixelcodestudio.com.br`
- **Pastas legadas (arquivar):** `templates/pixelcodestudio` (Astro), `templates/pixelcodestudio-backup` (Next antigo)

---

## 2. Decisões confirmadas

| # | Item | Escolha |
|---|------|---------|
| 1 | Pasta oficial | `portifolioofc` ✅ |
| 2 | Stack do background | **OGL** (WebGL minimalista, ~8KB) |
| 3 | Roteiro 5 atos minimalista | aceito |
| 4 | Loading screen | **REMOVER** |
| 5 | Mockups | gerados via SD local + 2 cases reais |
| 6 | Paleta | **A — Liquid Mercury** (tons frios metálicos) |
| 7 | Branch | `main` direto |

---

## 3. Paleta — Liquid Mercury

| Token | Valor | Uso |
|-------|-------|-----|
| `--bg` | `#03030c` | Fundo base (quase preto azulado) |
| `--ink` | `#e8e8f0` | Texto principal (off-white frio) |
| `--dim` | `#6b6b80` | Texto secundário, captions |
| `--accent` | `#9ba3c4` | Linhas, bordas, acentos sutis |
| `--glow` | `#c5cde8` | Highlights metálicos no shader |
| `--ripple` | `#4a5375` | Cor base das ondas (mid-tone) |

Tipografia:
- **Display:** Inter Variable (já carregado) — `font-variation-settings: "wght" 200..900`
- **Mono:** JetBrains Mono Variable — para scramble e captions técnicos

---

## 4. Stack final & dependências

```json
{
  "manter": {
    "next": "14.2.15",
    "react": "^18.3.1",
    "framer-motion": "^11.11.0",
    "lucide-react": "^1.11.0",
    "tailwindcss": "^3.4.13"
  },
  "novas": {
    "ogl": "^1.0.x",
    "gsap": "^3.12.x",
    "lenis": "^1.3.x",
    "zustand": "^5.x",
    "@studio-freight/hamo": "^0.6.x",
    "splitting": "^1.0.6"
  }
}
```

**Bundle delta estimado:** ~45KB gzip.

---

## 5. Roteiro narrativo — 5 atos

| Ato | Scroll % | Visual | Conteúdo |
|---|---|---|---|
| **1. Liquid Hero** | 0–15% | Liquid mercury fullscreen + dolly zoom (cima→baixo) + card SVG desenhando (stroke-dashoffset) | `PIXELCODE STUDIO` + scramble: "experiências digitais sob medida" |
| **2. Manifesto** | 15–30% | Ondas se acalmam, viram corrente horizontal | Text-reveal por linha (3 linhas): "Não fazemos sites." / "Construímos experiências." / "Que convertem." |
| **3. O que fazemos** | 30–50% | Fluido vira grade Voronoi sutil, cada célula = serviço | 4 serviços: Sites · Sistemas · Apps · Imersivo |
| **4. Showcase** | 50–85% | Câmera "mergulha" em cada projeto | 6 cases (1 por categoria) — fluxo abaixo |
| **5. Contato** | 85–100% | Fluido volta a ondular, mais lento | Scramble "Vamos conversar?" + WhatsApp magnético |

---

## 6. Showcase — 6 categorias × 12 itens

### Cases reais (mantidos)
1. **Cerbelera & Oliveira Advogados** — `/images/projects/cerbelera-*.png`
2. **Dra. Andresa Martin** — `/images/projects/andresa-*.png`

### Cases gerados via Stable Diffusion local

| # | Tipo | Nicho fictício | Modelo SD | Resolução |
|---|------|----------------|-----------|-----------|
| 3 | Landing Page SaaS B2B | Apex Analytics — BI | `protogenX34Photorealism` | 768×1280 |
| 4 | CRM Dashboard | Lumen CRM — vendas | `dreamshaper_8` | 1280×800 |
| 5 | App Mobile iOS | Onda — banking | `realisticVisionV60B1` | 390×844 |
| 6 | App Mobile Android | Pulse Fit — fitness | `realisticVisionV60B1` | 412×915 |
| 7 | E-commerce | Atelier — moda autoral | `dreamshaper_8` | 1440×900 |
| 8 | Sistema Admin/ERP | Forge ERP — industrial | `dreamshaper_8` | 1440×900 |
| 9 | Site Institucional Premium | Northwind Capital | `protogenX34Photorealism` | 1440×900 |
| 10 | Portfólio/Editorial | Kira Tanaka — fotógrafa | `realisticVisionV60B1` | 1440×900 |
| 11 | Plataforma Educacional | Scholae — cursos | `dreamshaper_8` | 1280×800 |
| 12 | Site imersivo 3D | Atlas Studio | `deliberate_v6` | 1440×900 |

### Agrupamento final no showcase (1 por categoria, sem repetição)
- **Jurídico** → Cerbelera (real)
- **Saúde** → Dra. Andresa (real)
- **Landing/SaaS** → Apex Analytics (#3)
- **CRM/ERP** → escolher melhor render entre Lumen (#4) e Forge (#8)
- **Mobile** → galeria com Onda (#5) + Pulse Fit (#6)
- **Imersivo/Editorial** → galeria com Atlas (#12) + Kira (#10) + Northwind (#9)

> Atelier (#7) e Scholae (#11) ficam como **bônus rotativos** (aparecem se houver tempo de geração).

---

## 7. Showcase — fluxo de navegação (PENDENTE de definição)

**Ideia inicial:** scroll vertical com pin scrub mostrando case atrás do outro (estilo Lusion).

**Pendência levantada:** o usuário pediu poder **entrar manualmente em cada case com o mouse**, OU prosseguir com scroll automático.

### Opções a discutir no próximo modo Ask

| Opção | Como funciona | Prós | Contras |
|-------|---------------|------|---------|
| **A. Híbrido (recomendo)** | Scroll vertical pin com 6 cases em sequência. Cada case tem botão "Explorar →" que abre **modal cinematográfico** (clip-path radial expansão a partir do clique) com galeria detalhada do projeto. Continuar scroll pula para próximo case. | Mantém fluxo cinematográfico + permite drill-down | Mais código, modal global |
| **B. Carrossel horizontal pin** | Seção pinada por 600vh, scroll vertical move cards horizontalmente; click em card abre detalhe inline (acordeão expansível) | Linear, controle total via mouse OU scroll | Pode parecer "pesado" no mobile |
| **C. Galeria livre + hover preview** | Grid de 6 cards; hover mostra preview WebGL (efeito #22 do catálogo); click abre página dedicada `/case/[slug]` | Mais navegável, SEO friendly | Quebra a experiência "camada única" |
| **D. Stack 3D (deck shuffle)** | Cases empilhados como cartas; scroll vira a próxima; click nos lados muda manualmente | Visual diferenciado | Complexo de fazer minimalista |

**A decidir no modo Ask:** qual opção ou combinação? Considerar comportamento mobile (touch) também.

---

## 8. Negative prompts — biblioteca

Adicionada à skill `web-design-mastery` (arquivo `negative-prompts.md` a criar). Categorias:

```yaml
liquid_metal_shader:
  - blurry, low resolution, pixelation, banding, posterization
  - flat shading, no specular, no reflection, matte plastic look
  - cartoon water, anime water, stylized waves
  - obvious tiling, repeating pattern, seams visible

dolly_zoom_web:
  - uniform scale, no parallax, flat camera
  - linear easing, mechanical motion, no acceleration curve
  - abrupt transition, frame skip, stutter
  - background and foreground move at same speed

card_draw_animation:
  - instant appear, pop in, no progressive draw
  - broken stroke, gap in line, visible joint
  - all 4 sides at once, no directional sequence

scramble_text:
  - all letters change at same time, no left-to-right cascade
  - ascii only fallback (perde charme do glitch)
  - unreadable end state, characters not settling

mockups_sd_ui:
  - lorem ipsum, placeholder text, gibberish text, garbled letters
  - deformed UI, broken alignment, asymmetric buttons, misaligned grid
  - cartoon, anime, illustration, painterly, hand drawn
  - watermark, signature, artist name, logo overlay
  - low contrast, washed out, jpeg artifacts, compression noise
  - blurry, out of focus, low resolution, pixelated
  - ugly fonts, papyrus, comic sans, distorted typography
  - multiple windows overlapping, broken modal, z-index conflict
  - rainbow colors, neon overload, gradient abuse
  - fake metrics impossibly large, 999% growth, unrealistic numbers
```

---

## 9. Nova skill a criar — `mockup-prompt-architect`

> Pendente de implementação após confirmação no próximo modo Ask.

**Objetivo:** dado um case (tipo + nicho), gerar prompt SD/AnimateDiff refinado com:
- Análise estética baseada em referências renomadas da web (Linear, Stripe, Vercel, Apple, Notion, Figma, Cartier, OFF+BRAND…)
- Composição: layout, hierarquia, grid, tipografia, paleta, espaçamento
- Elementos UI específicos do tipo (CRM tem Kanban+gráficos; mobile tem nav bar+cards; SaaS tem hero+pricing)
- Negative prompt customizado por categoria
- Sugestão de Motion LoRA quando for animação (ZoomOut, PanDown, etc.)
- Parâmetros de sampling otimizados pra RTX 2060 6GB

**Estrutura proposta:**
```
.copilot/skills/mockup-prompt-architect/
  SKILL.md
  references/
    saas-landing-references.md   (Linear, Vercel, Stripe Atlas)
    crm-erp-references.md        (Linear app, Notion, Pipedrive)
    mobile-app-references.md     (Apple HIG, Material 3, Cash App)
    ecommerce-references.md      (Apple Store, SSENSE, Aimé Leon Dore)
    editorial-references.md      (NYT, Bloomberg, Cartier)
    immersive-3d-references.md   (Bruno Simon, Lusion, Active Theory)
  templates/
    base-prompt.md
    negative-base.md
    motion-lora-guide.md
```

---

## 10. Plano de execução por fases

| Fase | Entrega | Status |
|------|---------|--------|
| **F0** Cleanup & deps | Arquivar pastas legadas, criar `.planning/`, instalar `ogl gsap lenis zustand splitting @studio-freight/hamo` | pendente |
| **F0.5** Skill `mockup-prompt-architect` | Criar skill com refs estéticas detalhadas | pendente |
| **F1** Liquid Hero v2 | Shader OGL fluid sim + dolly real (parallax 3 camadas) + card draw + scramble + remover loading | pendente |
| **F2** Smooth scroll global | Lenis + ScrollTrigger global + Zustand store (`bannerPhase`, `scrollProgress`, `rippleIntensity`) + repaletizar Tailwind | pendente |
| **F3** Reestruturar `page.tsx` em 5 atos | Manifesto + Serviços (Voronoi) + Showcase shell + CTA | pendente |
| **F4** Geração mockups SD (paralelo com F3/F5) | 10 mockups + variações com SD + workflow ComfyUI | pendente |
| **F5** Showcase final (depende decisão #7) | Implementar opção A/B/C/D escolhida | pendente |
| **F6** Audit & polish | Lighthouse mobile ≥85, WCAG AA, prefers-reduced-motion fallback, testes mobile real | pendente |
| **F7** Deploy Vercel | Deploy preview → validar → promover via alias | pendente |

---

## 11. Próximos passos imediatos (quando voltar de Ask → Edit)

1. Definir fluxo do showcase (item #7)
2. Criar skill `mockup-prompt-architect` (item #9)
3. Iniciar F0 (cleanup + instalar deps)
4. Iniciar F0.5 + F1 em paralelo (skill define prompts enquanto Liquid Hero v2 é codado)

---

## 12. Histórico de decisões da conversa

- Restaurado repo para commit `4ffb4dff` (Juan Mora dark cinematic refactor)
- Identificado conflito de deploy: `pixelcodestudio-backup` tinha `.vercel/project.json` controlando o domínio
- Resolvido via `vercel alias set` apontando para deployment correto do `portifolioofc`
- Catalogados 24 efeitos awwwards no índice rápido + 42 efeitos detalhados (66 total) na skill `web-design-mastery`
- Banner liquid metal HTML analisado: simulação 2D Float32Array + scramble + SVG stroke draw → migrar para OGL para realismo
- Hardware do usuário: RTX 2060 6GB + 16GB RAM (suporta SD + AnimateDiff sem problemas)

---

## 13. Notas de risco

- **OGL bundle:** confirmar SSR safety no Next 14 (lazy load com `dynamic({ ssr: false })`)
- **Lenis + Next App Router:** garantir cleanup correto em route changes
- **GSAP ScrollTrigger:** pode conflitar com View Transitions API — testar isoladamente
- **SD geração:** 10 mockups em RTX 2060 ~12-15min total; rodar em background enquanto codo
- **prefers-reduced-motion:** desabilitar shader pesado e dolly; substituir por fade simples
- **Mobile (touch):** pin scrub pode "travar" o scroll; sempre dar opção de pular section
