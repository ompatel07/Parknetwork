import { WORLD, WORLD_DOTS } from "@/data/world-dots";
import { site } from "@/config/site";

/** Deterministic RNG so every visit forms the same shapes. */
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Stroke = { len: number; at: (u: number) => [number, number, number, number] }; // x, y, nx, ny

const arc = (r: number, center: number, span: number): Stroke => ({
  len: r * span * 2,
  at: (u) => {
    const a = center - span + u * span * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    return [c * r, s * r, c, s];
  },
});

const line = (x1: number, y1: number, x2: number, y2: number): Stroke => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  return { len, at: (u) => [x1 + dx * u, y1 + dy * u, -dy / len, dx / len] };
};

const toRad = (d: number) => (d * Math.PI) / 180;
const sphere = (lat: number, lng: number, r: number): [number, number, number] => {
  const la = toRad(lat);
  const lo = toRad(lng);
  return [r * Math.cos(la) * Math.sin(lo), r * Math.sin(la), r * Math.cos(la) * Math.cos(lo)];
};

/**
 * Builds every particle target. Each particle has one position per scene
 * plus random attributes: x = variation, y = size, z = colour shift,
 * w = flag (-1 ocean, 0 normal, 1 highlighted country, 2 HQ).
 */
export function buildShapes(n: number) {
  const rand = rng(20261025);
  const mark = new Float32Array(n * 3);
  const wave = new Float32Array(n * 3);
  const rings = new Float32Array(n * 3);
  const globe = new Float32Array(n * 3);
  const dust = new Float32Array(n * 3);
  const attrs = new Float32Array(n * 4);

  // ── MARK: the logo — play triangle inside two pairs of signal arcs ──
  const strokes: Stroke[] = [
    arc(1.25, Math.PI, toRad(40)),
    arc(1.25, 0, toRad(40)),
    arc(0.78, Math.PI, toRad(42)),
    arc(0.78, 0, toRad(42)),
    line(-0.27, 0.34, 0.4, 0),
    line(0.4, 0, -0.27, -0.34),
    line(-0.27, -0.34, -0.27, 0.34),
  ];
  const total = strokes.reduce((s, k) => s + k.len, 0);
  let acc = 0;
  const cumulative = strokes.map((k) => (acc += k.len / total));
  const pickStroke = (u: number) => strokes[cumulative.findIndex((c) => u <= c)] ?? strokes[0]!;

  // ── GLOBE: land dots from the world map, ocean as a faint sphere ──
  const STEP = 360 / WORLD.cols;
  const land: [number, number][] = [];
  for (const m of WORLD_DOTS.matchAll(/M([\d.]+) (\d+)h0/g)) {
    const x = Number(m[1]);
    const y = Number(m[2]);
    land.push([WORLD.latTop - (y + 0.5) * STEP, (x + 0.5) * STEP - 180]);
  }
  const regions = site.regions;
  const R = 1.32;
  const regionCluster = 36;
  const reserved = Math.min(n * 0.15, regions.length * regionCluster);
  const landCount = Math.floor(n * 0.6);

  // ── RINGS ──
  const ringRadii = Array.from({ length: 11 }, (_, i) => 0.32 + i * 0.25);
  const ringTotal = ringRadii.reduce((s, r) => s + r, 0);

  for (let i = 0; i < n; i++) {
    const i3 = i * 3;
    const i4 = i * 4;
    const r1 = rand();
    attrs[i4] = r1;
    attrs[i4 + 1] = rand();
    attrs[i4 + 2] = rand();
    attrs[i4 + 3] = 0;

    // MARK (88% strokes, 12% halo dust)
    if (rand() < 0.88) {
      const s = pickStroke(rand());
      const [x, y, nx, ny] = s.at(rand());
      const th = (rand() - 0.5) * 0.09 + (rand() - 0.5) * 0.04;
      mark[i3] = x + nx * th;
      mark[i3 + 1] = y + ny * th;
      mark[i3 + 2] = (rand() - 0.5) * 0.14;
    } else {
      const a = rand() * Math.PI * 2;
      const r = 1.55 + rand() * 1.1;
      mark[i3] = Math.cos(a) * r;
      mark[i3 + 1] = Math.sin(a) * r * 0.85;
      mark[i3 + 2] = (rand() - 0.5) * 1.2;
      attrs[i4 + 1] = (attrs[i4 + 1] ?? 0) * 0.5;
    }

    // WAVE: a terrain grid seen from slightly above
    const cols = Math.ceil(Math.sqrt(n * 2.4));
    const gx = i % cols;
    const gz = Math.floor(i / cols);
    const rows = Math.ceil(n / cols);
    wave[i3] = -3.4 + (gx / (cols - 1)) * 6.8 + (rand() - 0.5) * 0.02;
    wave[i3 + 1] = -0.75;
    wave[i3 + 2] = -3.2 + (gz / Math.max(1, rows - 1)) * 4.6;

    // RINGS: concentric broadcast rings (flat; tilted + rippled in the shader)
    let pick = rand() * ringTotal;
    let rr = ringRadii[0]!;
    for (const r of ringRadii) {
      pick -= r;
      if (pick <= 0) {
        rr = r;
        break;
      }
    }
    const ra = rand() * Math.PI * 2;
    const rj = (rand() - 0.5) * 0.035;
    rings[i3] = Math.cos(ra) * (rr + rj);
    rings[i3 + 1] = Math.sin(ra) * (rr + rj);
    rings[i3 + 2] = (rand() - 0.5) * 0.05;

    // GLOBE
    let g: [number, number, number];
    if (i < reserved) {
      const reg = regions[Math.floor(i / regionCluster) % regions.length]!;
      const isHq = reg === regions[0];
      g = sphere(reg.lat + (rand() - 0.5) * 2.4, reg.lng + (rand() - 0.5) * 2.4, R * 1.004);
      attrs[i4 + 3] = isHq ? 2 : 1;
    } else if (i < reserved + landCount) {
      const [lat, lng] = land[i % land.length]!;
      g = sphere(lat + (rand() - 0.5) * STEP * 0.7, lng + (rand() - 0.5) * STEP * 0.7, R);
    } else {
      // Fibonacci sphere for the ocean
      const k = i - reserved - landCount;
      const m = n - reserved - landCount;
      const y = 1 - (k / Math.max(1, m - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const theta = k * 2.399963229728653;
      g = [Math.cos(theta) * rad * R * 0.985, y * R * 0.985, Math.sin(theta) * rad * R * 0.985];
      attrs[i4 + 3] = -1;
    }
    globe[i3] = g[0];
    globe[i3 + 1] = g[1];
    globe[i3 + 2] = g[2];

    // DUST: loose field filling the view
    dust[i3] = (rand() - 0.5) * 9;
    dust[i3 + 1] = (rand() - 0.5) * 5.4;
    dust[i3 + 2] = -3 + rand() * 4.2;
  }

  return { mark, wave, rings, globe, dust, attrs };
}
