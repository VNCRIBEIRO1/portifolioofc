# Plano de Transformação — PixelCode Studio Immersive **V4 (Dive-through-text · 100% 3D · CLI-driven)**

> Documento mestre canônico. Substitui `IMMERSIVE_V3_PLAN.md` (mantido como histórico).
> Data: 03/05/2026 · Branch: `main` · Pasta oficial: `D:\desktop1\portfolio_pixel\portifolioofc`

---

## 0. TL;DR — diferenças face à V3

A V3 já entregou stack, paleta, rotas e estrutura inicial. A **V4 reforça os pontos fracos detectados na execução**:

| Sintoma reportado | Causa-raiz | Correção V4 |
|---|---|---|
| "scroll parece página comum, não mergulho" | gate `reducedMotion` ativa StaticHome em qualquer laptop com `width<760` ou `cores<4`; HeroSSR fica visível 1.4s e não tem perspectiva | Gate vira **detecção de WebGL real** (cria contexto) e só cai pra estático se WebGL falhar; HeroSSR vai pra `-z-20` (atrás do canvas) com fade em 600ms |
| "letras não fazem glitch" | glitch atual só faz jitter de posição (sutil demais) | Novo shader `RGBSplitGlitchMaterial` com chromatic offset + scanlines + UV punch a cada 2s |
| "câmera não passa entre PixelCode e Studio" | `Hero3DText` fica em y=±1.5 mas a câmera viaja em z=20→-2 olhando origem (interfere com o texto antes de "atravessar") | Ajustar lookAt para apontar levemente abaixo durante 0..0.05 e depois pra cima entre 0.05..0.10, criando o efeito de **pitch-up ao passar pelo gap** |
| "não há sensação de velocidade" | falta de partículas streak no eixo Z | adicionar `<SpeedStreaks>` (linhas alongadas paralelas ao eixo de movimento, alpha proporcional à velocidade Z) |
| "horizonte não emerge" | crystals já têm fadeIn por distância, ok; manifesto também — falta um **light cone emergente** no Z distante | adicionar `<HorizonGodRays>` cone fixo no centro distante, intensidade cresce conforme câmera se aproxima |
| "quero substituir cards de Showcase + Services por cristais" | já implementado: 11 cristais cobrem ambos | manter; **remover** qualquer remanescente DOM de Services/Showcase (verificar `sections/`) e excluir do build |
| "geração autônoma" | scripts ainda inexistentes | criar `scripts/` completa em F1 |

---

## 1. Decisões consolidadas (V4)

| # | Item | Escolha |
|---|------|---------|
| 1 | Pasta oficial | `D:\desktop1\portfolio_pixel\portifolioofc` |
| 2 | Stack 3D | Three 0.170 + R3F 8.17 + drei 9.114 + postprocessing 6.36 ✅ instalado |
| 3 | Roteiro | 5 atos com **mergulho horizontal Z** (não vertical) |
| 4 | Loading | HeroSSR atrás do canvas (-z-20), fade 600ms |
| 5 | Mockups | 4 reais + 7 a gerar via ComfyUI (acervo total = 11 cristais) |
| 6 | Paleta | A — Liquid Mercury (mantida) |
| 7 | Branch | `main` direto |
| 8 | Showcase nav | Cristais flutuantes ao longo do path Z + dolly-zoom no clique (sem carrossel pin) |
| 9 | Som | NÃO |
| 10 | Animação por plate | SIM — cada cristal tem entrada/saída próprias por `info.rotY` + fadeIn por distância |
| 11 | Fidelidade | Igloo-tier (Bloom + DOF + Vignette + ACES + RGB-split shader nos textos) |
| 12 | Execução | 100% CLI (`scripts/`) |
| 13 | **Câmera atravessa "PixelCode/Studio"** | Hero3DText: y=+1.5 (top) e y=-1.5 (bottom). Câmera viaja z=20→-2 olhando origem com pitch dinâmico |
| 14 | **Cards = cristais** | Services + Showcase mesclados em 11 cristais (4 serviços implícitos + 11 cases) — não há mais grid HTML |
| 15 | **Glitch a cada 2s** | RGB chromatic offset de 0.012 + jitter Y + flicker emissive (200ms duração) |
| 16 | **Dolly zoom no clique** | implementado; ajustar duração para 1.6s + retornar suave |

---

## 2. Roteiro — Mergulho em 5 atos (atualizado)

| Ato | Scroll % | Camera Z | Cena | Conteúdo |
|---|---|---|---|---|
| **1. Aproximação** | 0–10% | 20→-2 | Câmera avança em Z, atravessa o gap entre "PixelCode" (top) e "Studio" (bottom). Pitch ajusta para passar limpo. | Hero 3D Text + tagline com glitch |
| **2. Manifesto** | 10–22% | -2→-75 | Túnel líquido; manifesto MSDF flutua "Não fazemos sites / Construímos experiências / Que convertem" | 3 frases sequenciais |
| **3. Vale dos cristais** | 22–88% | -75→-245 | Câmera serpenteia entre 11 cristais facetados. Cada um traz mockup interno. | 11 cases (2 reais + 9 SD) |
| **4. Abismo** | 88–100% | -245→-285 | Tudo escurece. God ray central + WhatsApp magnético + scramble "Vamos conversar?" | CTA |

**Replay reverso:** scroll ↑ rebobina (já funciona — câmera é função pura de progress).

---

## 3. Hierarquia conceitual

- **4 serviços** (Sites · Sistemas · Apps · Imersivo) → conceitualmente representados pelos primeiros 4 cristais (jurídico/saúde/SaaS/CRM)
- **11 cristais** (acervo total = showcase completo)

### Cristais já em código (`CrystalShowcase.tsx` `CRYSTALS[]`)

| # | Slug | Título | Nicho | Mockup atual |
|---|------|--------|-------|--------------|
| 1 | cerbelera | Cerbelera & Oliveira | Jurídico | ✅ real |
| 2 | andresa | Dra. Andresa Martin | Saúde | ✅ real |
| 3 | apex | Apex Analytics | Landing SaaS B2B | ⏳ usa luciana-desktop temp |
| 4 | lumen | Lumen CRM | CRM Dashboard | ⏳ usa bozo-desktop temp |
| 5 | onda | Onda Banking | App iOS | ⏳ usa andresa-mobile temp |
| 6 | pulse | Pulse Fit | App Android | ⏳ usa luciana-mobile temp |
| 7 | atelier | Atelier | E-commerce Moda | ❌ placeholder canvas |
| 8 | forge | Forge | ERP / Admin | ❌ placeholder canvas |
| 9 | northwind | Northwind Capital | Institucional Premium | ❌ placeholder canvas |
| 10 | kira | Kira Tanaka | Portfolio Editorial | ❌ placeholder canvas |
| 11 | scholae | Scholae | Educacional | ❌ placeholder canvas |

**Pendência F5.5:** gerar 9 mockups SD definitivos (substituir 4 placeholders + 5 placeholders canvas).

---

## 4. Pipeline de scripts CLI (criar em F1)

```
portifolioofc/
  scripts/
    bootstrap.ps1                 # instala toktx, esrgan, playwright, lighthouse
    fetch-hdri.mjs                # Poly Haven API → public/hdri/
    fetch-pbr.mjs                 # Poly Haven API → public/textures/
    comfy-generate.mjs            # ComfyUI API batch → public/images/cases/
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
    optimize-images.mjs           # sharp WebP/AVIF + resize
    audit-lighthouse.mjs          # Lighthouse JSON
    smoke-playwright.mjs          # screenshot + assert canvas mounted
    README.md
```

NPM scripts adicionais (em `package.json`):

```json
{
  "scripts": {
    "assets:hdri":     "node scripts/fetch-hdri.mjs",
    "assets:pbr":      "node scripts/fetch-pbr.mjs",
    "assets:mockups":  "node scripts/comfy-generate.mjs --batch=all",
    "assets:optimize": "node scripts/optimize-images.mjs",
    "assets:all":      "npm run assets:hdri && npm run assets:pbr && npm run assets:mockups && npm run assets:optimize",
    "audit":           "node scripts/audit-lighthouse.mjs",
    "smoke":           "node scripts/smoke-playwright.mjs"
  }
}
```

---

## 5. Skill `3d-web-architect` (criada nesta iteração)

Localização: `c:\Users\Administrador\.agents\skills\3d-web-architect\SKILL.md`

Capacidades:
- **Blender Architect:** scripts `bpy` para geometria procedural + bake
- **Texture Artist:** ComfyUI/SD via API local para PBR
- **Web Integrator:** export GLB → R3F via `gltfjsx --transform`
- Templates de prompt SD com **negative prompts** consolidados
- Cheatsheet `bpy` em `references/bpy-cheatsheet.md`

---

## 6. Negative prompts — biblioteca V4

```yaml
sd_textures_pbr:
  - blurry, low resolution, watermark, text, grainy, distorted
  - messy patterns, organic noise, asymmetrical
  - inconsistent lighting, flat, cartoonish, oversaturated
  - visible seam, tiling pattern repeats, logo, brand mark

sd_mockups_ui:
  - lorem ipsum, placeholder text, gibberish text, garbled letters
  - deformed UI, broken alignment, asymmetric buttons, misaligned grid
  - cartoon, anime, illustration, painterly, hand drawn
  - watermark, signature, artist name, logo overlay
  - blurry, out of focus, low resolution, pixelated, aliasing
  - ugly fonts, papyrus, comic sans, distorted typography
  - rainbow colors, neon overload, gradient abuse
  - hands, fingers, faces (exceto se nicho exigir)

bpy_geometry:
  - n-gons, overlapping geometry, non-manifold edges
  - high-poly count, excessive vertices, unapplied transforms
  - loose parts, missing UV maps, flipped normals

igloo_aesthetic:
  - cluttered UI, jagged edges, low frame rate
  - flickering shadows, harsh lighting, dull colors
  - generic assets, slow transitions, non-responsive elements
```

---

## 7. Plano de execução (V4)

| Fase | Entrega | Estado | CLI? |
|---|---|---|---|
| F0 | Stack R3F instalado | ✅ feito (V3) | — |
| F0.5 | Skill `mockup-prompt-architect` | ✅ V3 |  |
| F0.6 | Skill `3d-web-architect` | ⏳ esta iteração | ✅ |
| F1 | `scripts/` criado: bootstrap, fetch-hdri, fetch-pbr, comfy-generate, optimize, audit, smoke | ⏳ esta iteração | ✅ |
| F2 | Refinar dive: gate WebGL real + lookAt dinâmico no Hero + speed streaks + horizonte god ray | ⏳ esta iteração | ✅ |
| F3 | RGBSplitGlitchMaterial nos textos 3D | ⏳ esta iteração | ✅ |
| F4 | (já feito) Crystal showcase + dolly | ✅ V3 — refinos só F8 |  |
| F5 | (já feito) Manifesto3D + CTAText3D | ✅ V3 |  |
| F5.5 | Rodar `npm run assets:mockups` → 9 mockups SD | ⏳ requer ComfyUI :8188 | ✅ |
| F6 | Pós-processamento já existe (Post.tsx) — adicionar LUT custom (opcional) | ⏳ opcional |  |
| F7 | Audit Lighthouse + visual regression | ⏳ esta iteração | ✅ |
| F8 | Polish: ajustar duração dolly, cor accent por nicho, easing | ⏳ rápido |  |
| F9 | Deploy `vercel --prod` | ⏳ no fim | ✅ |

---

## 8. Critérios de pronto V4

- [ ] Ao abrir `localhost:3003`, vê-se o título 3D `PixelCode / Studio`
- [ ] Ao rolar 5% da página, câmera começa a avançar e atravessa **entre** as duas linhas
- [ ] Letras pulsam glitch (RGB split visível) a cada 2s
- [ ] Após manifesto, surgem cristais flutuantes no horizonte e crescem conforme câmera se aproxima
- [ ] Hover num cristal mostra HUD com nicho + título
- [ ] Click num cristal aciona dolly-zoom (FOV cai de 55° para 28° em 1.4s, retorna em ~0.4s)
- [ ] Scroll reverso rebobina a animação inteira sem glitch de estado
- [ ] Lighthouse Performance ≥ 80 desktop, ≥ 70 mobile (canvas pesado é aceitável)
- [ ] `prefers-reduced-motion` ainda mostra StaticHome (acessibilidade)
- [ ] WebGL ausente → StaticHome (fallback)

---

## 9. Riscos e mitigações

| Risco | Mitigação |
|---|---|
| Câmera "atravessa" cedo demais e não dá tempo de ler "PixelCode/Studio" | aumentar duração do ato 1 de 0.10 → 0.14 do progresso |
| RGB split forte demais polui legibilidade | offset máximo 0.012 e duração 200ms — só pulse sutil |
| ComfyUI offline durante geração | `comfy-generate.mjs` faz health-check e aborta com erro claro; mockups placeholders mantêm site usável |
| Lighthouse < 70 mobile | reduzir count de bolhas em mobile (já implementado) + lazy mount canvas (já feito) |
| HeroSSR aparece e some de forma abrupta | duração 600ms + opacity ease-out + canvas tem `<color attach="background">` igual |

---

## 10. Histórico

- V1→V2: paleta + 5 atos + 12 mockups conceito
- V2→V3: stack Three+R3F + 11 cristais + automação CLI total (planejada)
- V3→V4: diagnóstico de execução (gate WebGL, lookAt dinâmico, RGB-split shader, scripts criados de fato), inclusão da skill `3d-web-architect`
