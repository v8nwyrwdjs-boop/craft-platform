/*
 * Liquid-metal logo, WebGL.
 *
 * The shader is adapted from "Liquid Logo" by Alan Ang (https://github.com/collidingScopes/liquid-logo),
 * MIT licence, Copyright (c) 2025 Alan Ang. The full licence text is kept in licenses/liquid-logo.MIT.txt.
 * Alan Ang's project starts from XorDev's "Plasma" shader; the simplex noise is Ashima Arts / Stefan Gustavson (MIT).
 *
 * What was kept: the plasma loop, the edge detector that bends the flow around the logo outline, the simplex
 * noise, the Chrome preset. What changed for CRAFT:
 *  - the mask is not an uploaded image but our own mark drawn from lib/brand-mark.ts (C in alpha, brick in red);
 *  - the brick is tinted with the heat accent, the C stays metal;
 *  - premultiplied, anti-aliased output instead of a hard alpha threshold; mip-mapped mask for small sizes;
 *  - tanh is clamped (the original can produce NaN where the plasma is close to zero);
 *  - a pointer offset moves the flow, a tone switch keeps the mark readable on white and on dark grounds;
 *  - no file input, GUI, video export or background removal.
 */
import { markArcPath, markGeometry } from "./brand-mark";

const vertex = `attribute vec2 aVertexPosition;
void main() { gl_Position = vec4(aVertexPosition, 0.0, 1.0); }`;

const fragment = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_speed;
uniform float u_iterations;
uniform float u_scale;
uniform float u_dotFactor;
uniform float u_vOffset;
uniform float u_intensityFactor;
uniform float u_expFactor;
uniform vec3 u_colorFactors;
uniform float u_colorShift;
uniform float u_dotMultiplier;
uniform float u_noiseIntensity;
uniform sampler2D u_logoTexture;
uniform float u_logoInteractStrength;
uniform float u_texel;
uniform vec2 u_pointer;
uniform float u_dark;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

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
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
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

// Edge strength of the mask (the original reads the logo texture with a one-pixel step).
float detectEdges(vec2 uv, float threshold) {
  float d = u_texel;
  vec4 center = texture2D(u_logoTexture, uv);
  vec4 left = texture2D(u_logoTexture, uv - vec2(d, 0.0));
  vec4 right = texture2D(u_logoTexture, uv + vec2(d, 0.0));
  vec4 top = texture2D(u_logoTexture, uv - vec2(0.0, d));
  vec4 bottom = texture2D(u_logoTexture, uv + vec2(0.0, d));
  float diff = length(center.a - left.a) + length(center.a - right.a) + length(center.a - top.a) + length(center.a - bottom.a);
  return smoothstep(0.0, threshold, diff);
}

void main() {
  vec2 r = u_resolution;
  vec2 FC = gl_FragCoord.xy;
  float time = u_time * u_speed;
  vec2 uv = FC / r;
  vec2 logoUV = vec2(uv.x, 1.0 - uv.y);

  vec4 logo = texture2D(u_logoTexture, logoUV);
  float cover = smoothstep(0.12, 0.88, logo.a);
  if (cover < 0.004) { gl_FragColor = vec4(0.0); return; }
  float brick = smoothstep(0.35, 0.65, logo.r);

  float edge = detectEdges(logoUV, 0.2) * u_logoInteractStrength;

  vec2 p = (FC * 2.0 - r) / r.y + u_pointer * 0.22;
  vec2 l = vec2(0.0);
  float dotP = dot(p, p);
  l.x += abs(u_dotFactor - dotP) * u_dotMultiplier;

  float edgeInfluence = edge * 3.0;
  vec2 v = p * (1.0 - l.x) / u_scale;
  v += vec2(sin(edge * 10.0), cos(edge * 8.0)) * edgeInfluence;
  float flowNoise = snoise(vec3(p * 2.0, time * 0.15)) * u_noiseIntensity;
  v += vec2(flowNoise, flowNoise * 0.7);

  vec4 o = vec4(0.0);
  for (float i = 0.0; i < 16.0; i++) {
    if (i >= u_iterations) break;
    float idx = i + 1.0;
    vec2 offset = cos(v.yx * idx + vec2(0.0, idx) + time) / idx + u_vOffset;
    if (edge > 0.1) offset *= 1.0 + edge * 1.2;
    v += offset;
    o += (sin(vec4(v.x, v.y, v.y, v.x)) + 1.0) * abs(v.x - v.y) * u_intensityFactor;
  }

  if (u_colorShift > 0.0) o = o.wxyz * u_colorShift + o * (1.0 - u_colorShift);

  vec4 expPy = exp(p.y * vec4(u_colorFactors, 0.0));
  float expLx = exp(-u_expFactor * l.x);
  vec4 ratio = clamp(expPy * expLx / o, -20.0, 20.0);
  vec4 exp2x = exp(2.0 * ratio);
  o = (exp2x - 1.0) / (exp2x + 1.0);

  float grain = random(FC / 1.5 + time * 0.0004) * 0.06 - 0.03;
  float lum = clamp(dot(o.rgb, vec3(0.299, 0.587, 0.114)) + grain, 0.0, 1.0);

  // C: chrome with a trace of the plasma's own hue. Deep troughs on both grounds, a lifted floor on dark.
  vec3 metal = mix(vec3(lum), clamp(o.rgb, 0.0, 1.0), 0.4);
  vec3 floorC = mix(vec3(0.045, 0.055, 0.085), vec3(0.11, 0.12, 0.16), u_dark);
  metal = mix(floorC, vec3(0.97, 0.98, 1.0), pow(clamp(metal, 0.0, 1.0), vec3(1.45)));
  float rim = smoothstep(0.15, 1.0, edge * 1.4);
  metal += rim * vec3(0.5, 0.6, 0.7) * u_dark * 0.5;

  // Brick: the same flow, but molten: heat orange with a hotter core where the plasma peaks.
  vec3 heat = vec3(0.992, 0.416, 0.227);
  vec3 hot = vec3(1.0, 0.78, 0.52);
  vec3 molten = heat * (0.62 + 0.62 * lum) + hot * pow(lum, 4.0) * 0.4;

  vec3 col = mix(metal, molten, brick);
  // thin ink outline on white grounds keeps the silhouette crisp where the metal is bright
  float inner = smoothstep(0.5, 1.0, logo.a);
  col = mix(col * (1.0 - 0.55 * (1.0 - inner) * (1.0 - u_dark)), col, inner);
  col = clamp(col, 0.0, 1.0);
  gl_FragColor = vec4(col * cover, cover);
}`;

/** The "Chrome" preset of liquid-logo, the closest to polished metal. */
export const liquidPreset = {
  speed: 0.4,
  iterations: 15,
  scale: 3.12,
  dotFactor: 0.04,
  dotMultiplier: 0.21,
  vOffset: 5.1,
  intensityFactor: 0.07,
  expFactor: 0.2,
  noiseIntensity: 4.0,
  colorFactors: [1.1, 0.7, 0.9] as const,
  colorShift: 0.9,
  logoInteractStrength: 0.4,
};

const MASK = 256;

/** Mask texture: coverage in alpha, brick in red. Drawn from the same geometry as the SVG mark. */
function drawMask(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = MASK;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  const { c, brick } = markGeometry;
  const k = MASK / 64;
  ctx.scale(k, k);
  ctx.lineWidth = c.stroke;
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgb(0,0,0)";
  ctx.stroke(new Path2D(markArcPath));
  ctx.translate(brick.cx, brick.cy);
  ctx.rotate((brick.rotDeg * Math.PI) / 180);
  ctx.fillStyle = "rgb(255,0,0)";
  const x = -brick.w / 2;
  const y = -brick.h / 2;
  const r = brick.rx;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + brick.w, y, x + brick.w, y + brick.h, r);
  ctx.arcTo(x + brick.w, y + brick.h, x, y + brick.h, r);
  ctx.arcTo(x, y + brick.h, x, y, r);
  ctx.arcTo(x, y, x + brick.w, y, r);
  ctx.closePath();
  ctx.fill();
  return canvas;
}

export type LiquidLogo = {
  /** One frame. time in seconds; pointer is the cursor offset from the mark's centre, -1..1 on both axes. */
  draw: (time: number, pointer?: readonly [number, number]) => void;
  dispose: () => void;
};

/** Returns null when WebGL or the shader is unavailable; the caller then keeps the flat SVG mark. */
export function createLiquidLogo(canvas: HTMLCanvasElement, dark: boolean, onLost?: () => void): LiquidLogo | null {
  const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: "low-power" });
  if (!gl) return null;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    if (typeof process === "undefined" || process.env.NODE_ENV !== "production") console.warn("liquid logo shader:", gl.getShaderInfoLog(shader));
    return null;
  };
  const vs = compile(gl.VERTEX_SHADER, vertex);
  const fs = compile(gl.FRAGMENT_SHADER, fragment);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, drawMask());
  gl.generateMipmap(gl.TEXTURE_2D);

  const attribute = gl.getAttribLocation(program, "aVertexPosition");
  const u = (name: string) => gl.getUniformLocation(program, name);
  const loc = {
    resolution: u("u_resolution"), time: u("u_time"), speed: u("u_speed"), iterations: u("u_iterations"), scale: u("u_scale"),
    dotFactor: u("u_dotFactor"), vOffset: u("u_vOffset"), intensityFactor: u("u_intensityFactor"), expFactor: u("u_expFactor"),
    colorFactors: u("u_colorFactors"), colorShift: u("u_colorShift"), dotMultiplier: u("u_dotMultiplier"),
    noiseIntensity: u("u_noiseIntensity"), logoTexture: u("u_logoTexture"), interact: u("u_logoInteractStrength"),
    texel: u("u_texel"), pointer: u("u_pointer"), dark: u("u_dark"),
  };

  const lost = (event: Event) => {
    event.preventDefault();
    onLost?.();
  };
  canvas.addEventListener("webglcontextlost", lost);

  const preset = liquidPreset;
  return {
    draw(time, pointer = [0, 0]) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(attribute);
      gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(loc.resolution, canvas.width, canvas.height);
      gl.uniform1f(loc.time, time);
      gl.uniform1f(loc.speed, preset.speed);
      gl.uniform1f(loc.iterations, preset.iterations);
      gl.uniform1f(loc.scale, preset.scale);
      gl.uniform1f(loc.dotFactor, preset.dotFactor);
      gl.uniform1f(loc.vOffset, preset.vOffset);
      gl.uniform1f(loc.intensityFactor, preset.intensityFactor);
      gl.uniform1f(loc.expFactor, preset.expFactor);
      gl.uniform3f(loc.colorFactors, preset.colorFactors[0], preset.colorFactors[1], preset.colorFactors[2]);
      gl.uniform1f(loc.colorShift, preset.colorShift);
      gl.uniform1f(loc.dotMultiplier, preset.dotMultiplier);
      gl.uniform1f(loc.noiseIntensity, preset.noiseIntensity);
      gl.uniform1i(loc.logoTexture, 0);
      gl.uniform1f(loc.interact, preset.logoInteractStrength);
      gl.uniform1f(loc.texel, 1.5 / MASK);
      gl.uniform2f(loc.pointer, pointer[0], pointer[1]);
      gl.uniform1f(loc.dark, dark ? 1 : 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    dispose() {
      canvas.removeEventListener("webglcontextlost", lost);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
