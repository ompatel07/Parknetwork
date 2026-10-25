/**
 * Particle shaders for "The Signal".
 * Every particle carries a position for each scene; uniforms blend between
 * them. Per-scene motion (pulsing arcs, waveform, ripples, globe spin) is
 * computed here on the GPU.
 */

const noise = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

export const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uW0; // mark
uniform float uW1; // wave
uniform float uW2; // rings
uniform float uW3; // globe
uniform float uW4; // dust
uniform float uChaos;
uniform float uGlobeRot;
uniform float uSize;
uniform float uPixelRatio;
uniform float uAlpha;
uniform vec2 uMouse;
uniform float uMouseAmt;
uniform vec3 uOffset;
uniform float uScale;

attribute vec3 aWave;
attribute vec3 aRings;
attribute vec3 aGlobe;
attribute vec3 aDust;
attribute vec4 aRand;

varying vec3 vColor;
varying float vAlpha;

${noise}

vec3 rotY(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z); }
vec3 rotX(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z); }

void main() {
  float t = uTime;

  // MARK — arcs pulse outward like a live signal
  vec3 pm = position;
  float rm = length(pm.xy);
  pm.xy *= 1.0 + 0.045 * sin(t * 2.2 - rm * 5.0) * smoothstep(0.5, 0.9, rm);

  // WAVE — audio terrain
  vec3 pw = aWave;
  float env = smoothstep(3.6, 0.2, abs(pw.x)) * smoothstep(-3.4, -1.0, pw.z);
  float level = 0.6 + 0.4 * snoise(vec3(t * 0.35, 0.0, 0.0));
  pw.y += (sin(pw.x * 1.5 + t * 1.3) * 0.32 + sin(pw.x * 3.9 - t * 2.1 + pw.z * 1.4) * 0.13
         + snoise(vec3(pw.x * 0.55, pw.z * 0.7, t * 0.22)) * 0.35) * env * level;

  // RINGS — ripple travelling outward, tilted toward the viewer
  vec3 pr = aRings;
  float rr = length(pr.xy);
  pr.z += sin(rr * 4.2 - t * 2.4) * 0.11 * smoothstep(0.2, 0.8, rr);
  pr = rotX(pr, -0.95);
  pr = rotY(pr, sin(t * 0.15) * 0.25);

  // GLOBE — spinning, tilted to show the northern hemisphere
  vec3 pg = rotY(aGlobe, uGlobeRot);
  pg = rotX(pg, 0.3);

  // DUST — slow drift
  vec3 pd = aDust + vec3(
    snoise(aDust * 0.35 + vec3(0.0, 0.0, t * 0.05)),
    snoise(aDust * 0.35 + vec3(17.0, 0.0, t * 0.05)),
    0.0) * 0.35;

  vec3 pos = pm * uW0 + pw * uW1 + pr * uW2 + pg * uW3 + pd * uW4;

  // Turbulence: always a whisper, a storm while morphing
  float amp = (0.025 + uChaos * 0.85) * (0.4 + aRand.x);
  pos += vec3(
    snoise(pos * 0.9 + vec3(t * 0.3, 0.0, 0.0)),
    snoise(pos * 0.9 + vec3(31.0, t * 0.3, 0.0)),
    snoise(pos * 0.9 + vec3(57.0, 0.0, t * 0.3))) * amp;

  pos = pos * uScale + uOffset;

  // Cursor pushes particles away
  vec2 dm = pos.xy - uMouse;
  float dl = length(dm);
  pos.xy += normalize(dm + 1e-4) * smoothstep(0.85, 0.0, dl) * 0.42 * uMouseAmt;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;

  float flag = aRand.w;
  float hi = step(0.5, flag) * uW3;
  float hq = step(1.5, flag) * uW3;
  float ocean = step(flag, -0.5) * uW3;

  gl_PointSize = uSize * (0.35 + aRand.y) * (1.0 + hi * 1.4) * uPixelRatio * (6.0 / -mv.z);

  // Colour: violet → blue → cyan across the shape, like the logo
  float g = clamp(0.5 + (pos.x - uOffset.x) * 0.22 + (pos.y - uOffset.y) * 0.12 + (aRand.z - 0.5) * 0.45, 0.0, 1.0);
  vec3 violet = vec3(0.486, 0.361, 1.0);
  vec3 blue = vec3(0.239, 0.545, 1.0);
  vec3 cyan = vec3(0.31, 0.89, 1.0);
  vec3 red = vec3(1.0, 0.24, 0.43);
  vec3 c = mix(violet, blue, smoothstep(0.0, 0.55, g));
  c = mix(c, cyan, smoothstep(0.55, 1.0, g));
  c = mix(c, cyan, hi);
  c = mix(c, red, hq);
  vColor = c;

  float a = uAlpha * (0.45 + 0.55 * aRand.x);
  a *= 1.0 - ocean * 0.78;
  // back of the globe is dimmer
  a *= mix(1.0, 0.18 + 0.82 * smoothstep(-1.2, 0.5, pg.z), uW3);
  // far particles fade
  a *= clamp(1.0 - (-mv.z - 5.0) * 0.16, 0.15, 1.0);
  vAlpha = a;
}
`;

export const fragmentShader = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  a = a * a;
  gl_FragColor = vec4(vColor, a * vAlpha);
}
`;
