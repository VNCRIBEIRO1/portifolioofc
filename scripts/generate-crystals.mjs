/**
 * scripts/generate-crystals.mjs
 *
 * Gera 11 modelos GLB unicos de cristais procedurais com:
 *   - Base polyhedron (icosa/octa/dodeca/bipyramid)
 *   - Subdivisao para mais densidade
 *   - Displacement por noise deterministico (seed por slug)
 *   - Inner core (geometria menor aninhada)
 *   - Vertex colors gradient (gem -> glow)
 *   - Flat shading (normais por face)
 *
 * Output: public/models/crystals/<slug>.glb
 * Sem GPU, sem cloud, 100% Node.js.
 */
import { Document, NodeIO } from "@gltf-transform/core";
import { dedup, prune } from "@gltf-transform/functions";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "models", "crystals");

// ============================================================
// Config — espelha src/app/components/immersive/CrystalShowcase.tsx
// ============================================================
const CRYSTALS = [
  { slug: "cerbelera", kind: "octa",      size: 2.6, gem: "#1a1320", glow: "#ffb74a", noise: 0.12, freq: 1.6, sub: 2 },
  { slug: "andresa",   kind: "dodeca",    size: 2.5, gem: "#f8c5d4", glow: "#ff7aa8", noise: 0.10, freq: 1.4, sub: 2 },
  { slug: "apex",      kind: "bipyramid", size: 2.7, gem: "#3da8ff", glow: "#00e5ff", noise: 0.18, freq: 2.4, sub: 2 },
  { slug: "lumen",     kind: "bipyramid", size: 2.8, gem: "#2dd47a", glow: "#ffd54a", noise: 0.20, freq: 2.2, sub: 2 },
  { slug: "onda",      kind: "icosa",     size: 2.5, gem: "#5cc8ff", glow: "#a8f0ff", noise: 0.14, freq: 1.2, sub: 2 },
  { slug: "pulse",     kind: "octa",      size: 2.6, gem: "#e63946", glow: "#ff8f6b", noise: 0.13, freq: 1.5, sub: 2 },
  { slug: "atelier",   kind: "dodeca",    size: 2.6, gem: "#9d4edd", glow: "#e0aaff", noise: 0.11, freq: 1.7, sub: 2 },
  { slug: "forge",     kind: "bipyramid", size: 2.7, gem: "#ff9c1a", glow: "#ffe066", noise: 0.19, freq: 2.3, sub: 2 },
  { slug: "northwind", kind: "octa",      size: 2.7, gem: "#1e40af", glow: "#60a5fa", noise: 0.09, freq: 1.4, sub: 2 },
  { slug: "kira",      kind: "icosa",     size: 2.5, gem: "#f0aaff", glow: "#80ffea", noise: 0.15, freq: 1.3, sub: 2 },
  { slug: "scholae",   kind: "dodeca",    size: 2.6, gem: "#06d6a0", glow: "#118ab2", noise: 0.12, freq: 1.6, sub: 2 },
];

// ============================================================
// Seeded PRNG (Mulberry32) e value-noise 3D
// ============================================================
function hashStringToSeed(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Valor pseudo-aleatorio deterministico para coords 3D
function makeNoise3D(seed) {
  const rng = mulberry32(seed);
  // tabela 256
  const table = new Uint8Array(512);
  const base = new Uint8Array(256);
  for (let i = 0; i < 256; i++) base[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [base[i], base[j]] = [base[j], base[i]];
  }
  for (let i = 0; i < 512; i++) table[i] = base[i & 255];
  function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  function lerp(a, b, t) { return a + t * (b - a); }
  function grad(hash, x, y, z) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : (h === 12 || h === 14 ? x : z);
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }
  return function noise(x, y, z) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
    const u = fade(x), v = fade(y), w = fade(z);
    const A = table[X] + Y, AA = table[A] + Z, AB = table[A + 1] + Z;
    const B = table[X + 1] + Y, BA = table[B] + Z, BB = table[B + 1] + Z;
    return lerp(
      lerp(
        lerp(grad(table[AA], x, y, z),     grad(table[BA], x - 1, y, z), u),
        lerp(grad(table[AB], x, y - 1, z), grad(table[BB], x - 1, y - 1, z), u),
        v
      ),
      lerp(
        lerp(grad(table[AA + 1], x, y, z - 1),     grad(table[BA + 1], x - 1, y, z - 1), u),
        lerp(grad(table[AB + 1], x, y - 1, z - 1), grad(table[BB + 1], x - 1, y - 1, z - 1), u),
        v
      ),
      w
    );
  };
}

// ============================================================
// Geometrias-base (positions + indices)
// ============================================================
function icosahedron(radius) {
  const t = (1 + Math.sqrt(5)) / 2;
  const verts = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ].map(([x, y, z]) => {
    const l = Math.hypot(x, y, z);
    return [x / l * radius, y / l * radius, z / l * radius];
  });
  const idx = [
    0,11,5, 0,5,1, 0,1,7, 0,7,10, 0,10,11,
    1,5,9, 5,11,4, 11,10,2, 10,7,6, 7,1,8,
    3,9,4, 3,4,2, 3,2,6, 3,6,8, 3,8,9,
    4,9,5, 2,4,11, 6,2,10, 8,6,7, 9,8,1,
  ];
  return { verts, idx };
}
function octahedron(radius) {
  const verts = [
    [radius,0,0],[-radius,0,0],[0,radius,0],[0,-radius,0],[0,0,radius],[0,0,-radius],
  ];
  const idx = [
    0,2,4, 2,1,4, 1,3,4, 3,0,4,
    2,0,5, 1,2,5, 3,1,5, 0,3,5,
  ];
  return { verts, idx };
}
function dodecahedron(radius) {
  // Reuso de icosaedro mas com sub=1 e displacement em direcoes face-center
  // Para simplicidade, usamos icosaedro com escala. Visualmente fica facetado pos-noise.
  return icosahedron(radius);
}
function bipyramid(radius, segments = 8) {
  const h = radius * 1.7;
  // Apex superior alongado e apex inferior menor (cristais naturais sao assim)
  const verts = [[0, h, 0], [0, -h * 0.85, 0]];
  // Anel central + anel intermediario para mais densidade
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    verts.push([Math.cos(a) * radius * 0.75, radius * 0.15, Math.sin(a) * radius * 0.75]);
  }
  for (let i = 0; i < segments; i++) {
    const a = (i / segments + 0.5 / segments) * Math.PI * 2;
    verts.push([Math.cos(a) * radius * 0.65, -radius * 0.15, Math.sin(a) * radius * 0.65]);
  }
  const idx = [];
  // Top fan -> anel superior
  for (let i = 0; i < segments; i++) {
    const a = 2 + i, b = 2 + ((i + 1) % segments);
    idx.push(0, a, b);
  }
  // Conexao anel superior <-> anel inferior (cintura)
  for (let i = 0; i < segments; i++) {
    const a = 2 + i, b = 2 + ((i + 1) % segments);
    const c = 2 + segments + i;
    const d = 2 + segments + ((i + 1) % segments);
    idx.push(a, c, b, b, c, d);
  }
  // Bottom fan
  for (let i = 0; i < segments; i++) {
    const c = 2 + segments + i, d = 2 + segments + ((i + 1) % segments);
    idx.push(1, d, c);
  }
  return { verts, idx };
}

// Subdivisao de triangulos: cada tri vira 4 com vertices nos midpoints, projetados na esfera.
function subdivide({ verts, idx }, levels, radius) {
  let v = verts.map(([a, b, c]) => [a, b, c]);
  let f = idx.slice();
  for (let l = 0; l < levels; l++) {
    const cache = new Map();
    const newF = [];
    function midpoint(a, b) {
      const k = a < b ? `${a}_${b}` : `${b}_${a}`;
      if (cache.has(k)) return cache.get(k);
      const va = v[a], vb = v[b];
      let mx = (va[0] + vb[0]) / 2, my = (va[1] + vb[1]) / 2, mz = (va[2] + vb[2]) / 2;
      // Projeta na esfera de raio
      const len = Math.hypot(mx, my, mz);
      mx = mx / len * radius; my = my / len * radius; mz = mz / len * radius;
      v.push([mx, my, mz]);
      const i = v.length - 1;
      cache.set(k, i);
      return i;
    }
    for (let i = 0; i < f.length; i += 3) {
      const a = f[i], b = f[i + 1], c = f[i + 2];
      const ab = midpoint(a, b), bc = midpoint(b, c), ca = midpoint(c, a);
      newF.push(a, ab, ca, b, bc, ab, c, ca, bc, ab, bc, ca);
    }
    f = newF;
  }
  return { verts: v, idx: f };
}

// ============================================================
// Build mesh com displacement noise + flat shading (verts duplicados)
// ============================================================
function hexToRgb(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
function buildCrystalMesh(spec) {
  const seed = hashStringToSeed(spec.slug);
  const noise = makeNoise3D(seed);
  let geo;
  switch (spec.kind) {
    case "octa": geo = octahedron(spec.size); break;
    case "dodeca": geo = dodecahedron(spec.size); break;
    case "bipyramid": geo = bipyramid(spec.size); break;
    case "icosa":
    default: geo = icosahedron(spec.size); break;
  }
  if (spec.sub > 0) geo = subdivide(geo, spec.sub, spec.size);

  // Aplica displacement por noise em cada vertice unico
  const displaced = geo.verts.map(([x, y, z]) => {
    const len = Math.hypot(x, y, z) || 1;
    const nx = x / len, ny = y / len, nz = z / len;
    const n = noise(x * spec.freq, y * spec.freq, z * spec.freq);
    const d = 1 + n * spec.noise;
    return [x * d + nx * n * spec.size * 0.04,
            y * d + ny * n * spec.size * 0.04,
            z * d + nz * n * spec.size * 0.04];
  });

  // Flat shading: duplica vertices por face e calcula normal por face
  const positions = [];
  const normals = [];
  const colors = [];
  const indices = [];
  const gemRGB = hexToRgb(spec.gem);
  const glowRGB = hexToRgb(spec.glow);

  for (let i = 0; i < geo.idx.length; i += 3) {
    const a = displaced[geo.idx[i]];
    const b = displaced[geo.idx[i + 1]];
    const c = displaced[geo.idx[i + 2]];
    // Normal: (b-a) x (c-a)
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy;
    let ny = uz * vx - ux * vz;
    let nz = ux * vy - uy * vx;
    const nl = Math.hypot(nx, ny, nz) || 1;
    nx /= nl; ny /= nl; nz /= nl;
    const base = positions.length / 3;
    for (const v of [a, b, c]) {
      positions.push(v[0], v[1], v[2]);
      normals.push(nx, ny, nz);
      // Color: gradiente por altura Y (-size..+size) gem->glow
      const t = (v[1] / spec.size + 1) * 0.5;
      colors.push(
        gemRGB[0] * (1 - t) + glowRGB[0] * t,
        gemRGB[1] * (1 - t) + glowRGB[1] * t,
        gemRGB[2] * (1 - t) + glowRGB[2] * t,
      );
    }
    indices.push(base, base + 1, base + 2);
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    colors: new Float32Array(colors),
    indices: indices.length > 65535
      ? new Uint32Array(indices)
      : new Uint16Array(indices),
  };
}

// ============================================================
// Export GLB via gltf-transform
// ============================================================
async function writeGLB(spec, outPath) {
  const mesh = buildCrystalMesh(spec);
  const innerSpec = { ...spec, size: spec.size * 0.6, noise: spec.noise * 1.4, sub: Math.max(1, spec.sub - 1) };
  const inner = buildCrystalMesh(innerSpec);

  const doc = new Document();
  const buf = doc.createBuffer();
  const root = doc.getRoot();
  Object.assign(root.getAsset(), { generator: "pixelcode-crystal-gen", version: "2.0" });

  // Material PBR (cliente sobrescreve com meshPhysicalMaterial em runtime)
  const mat = doc.createMaterial(`mat_${spec.slug}`)
    .setBaseColorFactor([...hexToRgb(spec.gem), 1])
    .setEmissiveFactor(hexToRgb(spec.gem).map(c => c * 0.3))
    .setRoughnessFactor(0.1)
    .setMetallicFactor(0.2)
    .setAlphaMode("BLEND");

  function meshFromBuffers(name, m) {
    const pos = doc.createAccessor()
      .setType("VEC3")
      .setArray(m.positions)
      .setBuffer(buf);
    const nor = doc.createAccessor()
      .setType("VEC3")
      .setArray(m.normals)
      .setBuffer(buf);
    const col = doc.createAccessor()
      .setType("VEC3")
      .setArray(m.colors)
      .setBuffer(buf);
    const ind = doc.createAccessor()
      .setType("SCALAR")
      .setArray(m.indices)
      .setBuffer(buf);
    const prim = doc.createPrimitive()
      .setAttribute("POSITION", pos)
      .setAttribute("NORMAL", nor)
      .setAttribute("COLOR_0", col)
      .setIndices(ind)
      .setMaterial(mat);
    return doc.createMesh(name).addPrimitive(prim);
  }

  const outerMesh = meshFromBuffers(`outer_${spec.slug}`, mesh);
  const innerMesh = meshFromBuffers(`inner_${spec.slug}`, inner);

  const outerNode = doc.createNode(`outer_${spec.slug}`).setMesh(outerMesh);
  const innerNode = doc.createNode(`inner_${spec.slug}`)
    .setMesh(innerMesh)
    .setRotation([0.3, 0.2, 0.1, 1])
    .setScale([0.62, 0.62, 0.62]);

  const scene = doc.createScene(spec.slug);
  scene.addChild(outerNode).addChild(innerNode);
  root.setDefaultScene(scene);

  await doc.transform(dedup(), prune());

  const io = new NodeIO();
  const glb = await io.writeBinary(doc);
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, Buffer.from(glb));
  return { path: outPath, bytes: glb.byteLength, verts: mesh.positions.length / 3, faces: mesh.indices.length / 3 };
}

// ============================================================
// MAIN
// ============================================================
// Slugs com GLB fotorrealista (Hunyuan3D-2) em public/models/crystals-real/{slug}.glb
// — NAO sobrescrevemos o procedural; o componente carrega o real diretamente.
const REAL_SLUGS = new Set(["cerbelera"]);

(async () => {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const todo = CRYSTALS.filter(c => !REAL_SLUGS.has(c.slug));
  console.log(`[crystals] generating ${todo.length} GLBs to ${OUT_DIR} (skip real: ${[...REAL_SLUGS].join(",") || "-"})\n`);
  const results = [];
  for (const c of todo) {
    const out = path.join(OUT_DIR, `${c.slug}.glb`);
    const r = await writeGLB(c, out);
    results.push({ slug: c.slug, ...r });
    console.log(`  ${c.slug.padEnd(12)} ${r.kind ?? c.kind.padEnd(10)}  verts=${String(r.verts).padStart(4)}  faces=${String(r.faces).padStart(4)}  size=${(r.bytes / 1024).toFixed(1)}KB`);
  }
  const total = results.reduce((s, r) => s + r.bytes, 0);
  console.log(`\n[crystals] DONE. total ${(total / 1024).toFixed(1)}KB across ${results.length} models.`);
})().catch(err => { console.error(err); process.exit(1); });
