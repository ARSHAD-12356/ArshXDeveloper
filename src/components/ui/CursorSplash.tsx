"use client";

import { useEffect, useRef } from "react";

/**
 * WebGL fluid "splash" cursor: the pointer injects coloured dye and momentum into a
 * stable-fluids simulation (advection, vorticity confinement, pressure projection), so
 * colour billows out behind the cursor, swirls and slowly dissolves - like ink in water.
 *
 * The loop only runs while there is something to show (recent pointer movement, or the
 * gentle idle drift in the hero) and pauses when the tab is hidden.
 */

const CONFIG = {
  SIM_RESOLUTION: 128,
  DYE_RESOLUTION: 512,
  DENSITY_DISSIPATION: 3.2,
  VELOCITY_DISSIPATION: 2,
  PRESSURE: 0.1,
  PRESSURE_ITERATIONS: 10,
  CURL: 3,
  SPLAT_RADIUS: 0.22,
  SPLAT_FORCE: 6000,
  COLOR_INTENSITY: 0.16,
  COLOR_UPDATE_SPEED: 8,
  IDLE_STOP_MS: 4500,
};

const VERT = `
precision highp float;
attribute vec2 aPosition;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform vec2 texelSize;
void main () {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const CLEAR = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uTexture;
uniform float value;
void main () { gl_FragColor = value * texture2D(uTexture, vUv); }`;

const SPLAT = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 point;
uniform float radius;
void main () {
  vec2 p = vUv - point.xy;
  p.x *= aspectRatio;
  vec3 splat = exp(-dot(p, p) / radius) * color;
  vec3 base = texture2D(uTarget, vUv).xyz;
  gl_FragColor = vec4(base + splat, 1.0);
}`;

const ADVECTION = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float dissipation;
void main () {
  vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
  vec4 result = texture2D(uSource, coord);
  float decay = 1.0 + dissipation * dt;
  gl_FragColor = result / decay;
}`;

const DIVERGENCE = `
precision mediump float;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uVelocity, vL).x;
  float R = texture2D(uVelocity, vR).x;
  float T = texture2D(uVelocity, vT).y;
  float B = texture2D(uVelocity, vB).y;
  vec2 C = texture2D(uVelocity, vUv).xy;
  if (vL.x < 0.0) { L = -C.x; }
  if (vR.x > 1.0) { R = -C.x; }
  if (vT.y > 1.0) { T = -C.y; }
  if (vB.y < 0.0) { B = -C.y; }
  float div = 0.5 * (R - L + T - B);
  gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
}`;

const CURL = `
precision mediump float;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uVelocity, vL).y;
  float R = texture2D(uVelocity, vR).y;
  float T = texture2D(uVelocity, vT).x;
  float B = texture2D(uVelocity, vB).x;
  float vorticity = R - L - T + B;
  gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
}`;

const VORTICITY = `
precision highp float;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
void main () {
  float L = texture2D(uCurl, vL).x;
  float R = texture2D(uCurl, vR).x;
  float T = texture2D(uCurl, vT).x;
  float B = texture2D(uCurl, vB).x;
  float C = texture2D(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;
  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity += force * dt;
  velocity = min(max(velocity, -1000.0), 1000.0);
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}`;

const PRESSURE = `
precision mediump float;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main () {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  float divergence = texture2D(uDivergence, vUv).x;
  float pressure = (L + R + B + T - divergence) * 0.25;
  gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
}`;

const GRADIENT_SUBTRACT = `
precision mediump float;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity.xy -= vec2(R - L, T - B);
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}`;

// Soft lighting from the dye's own gradient gives the smoke its volume.
const DISPLAY = `
precision highp float;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uTexture;
uniform vec2 texelSize;
void main () {
  vec3 c = texture2D(uTexture, vUv).rgb;
  vec3 lc = texture2D(uTexture, vL).rgb;
  vec3 rc = texture2D(uTexture, vR).rgb;
  vec3 tc = texture2D(uTexture, vT).rgb;
  vec3 bc = texture2D(uTexture, vB).rgb;
  float dx = length(rc) - length(lc);
  float dy = length(tc) - length(bc);
  vec3 n = normalize(vec3(dx, dy, length(texelSize)));
  float diffuse = clamp(dot(n, vec3(0.0, 0.0, 1.0)) + 0.7, 0.7, 1.0);
  c *= diffuse;
  float a = max(c.r, max(c.g, c.b));
  gl_FragColor = vec4(c, a);
}`;

type GL = WebGL2RenderingContext;

interface FBO {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach: (id: number) => number;
}
interface DoubleFBO {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: FBO;
  write: FBO;
  swap: () => void;
}

function hsvToRgb(h: number, s: number, v: number) {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  const m = i % 6;
  const [r, g, b] = [
    [v, t, p],
    [q, v, p],
    [p, v, t],
    [p, q, v],
    [t, p, v],
    [v, p, q],
  ][m];
  return { r, g, b };
}

function randomColor() {
  const c = hsvToRgb(Math.random(), 1, 1);
  const k = CONFIG.COLOR_INTENSITY;
  return { r: c.r * k, g: c.g * k, b: c.b * k };
}

export function CursorSplash() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false }) as GL | null;
    if (!gl) return; // no WebGL2: skip the effect entirely
    if (!gl.getExtension("EXT_color_buffer_float") && !gl.getExtension("EXT_color_buffer_half_float")) return;

    // ---------- GL helpers ----------
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
      return s;
    };
    const vert = compile(gl.VERTEX_SHADER, VERT);
    const program = (frag: string) => {
      const p = gl.createProgram()!;
      gl.attachShader(p, vert);
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, frag));
      gl.bindAttribLocation(p, 0, "aPosition");
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "link");
      const uniforms: Record<string, WebGLUniformLocation | null> = {};
      const count = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS) as number;
      for (let i = 0; i < count; i++) {
        const name = gl.getActiveUniform(p, i)!.name;
        uniforms[name] = gl.getUniformLocation(p, name);
      }
      return { p, u: uniforms, use: () => gl.useProgram(p) };
    };

    let progs: Record<string, ReturnType<typeof program>>;
    try {
      progs = {
        clear: program(CLEAR),
        splat: program(SPLAT),
        advection: program(ADVECTION),
        divergence: program(DIVERGENCE),
        curl: program(CURL),
        vorticity: program(VORTICITY),
        pressure: program(PRESSURE),
        gradient: program(GRADIENT_SUBTRACT),
        display: program(DISPLAY),
      };
    } catch {
      return;
    }

    // Full-screen quad
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    const blit = (target: FBO | null) => {
      if (target) {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      } else {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    };

    const createFBO = (w: number, h: number, internal: number, format: number): FBO => {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, gl.HALF_FLOAT, null);
      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX: 1 / w,
        texelSizeY: 1 / h,
        attach(id) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        },
      };
    };
    const createDouble = (w: number, h: number, internal: number, format: number): DoubleFBO => {
      let a = createFBO(w, h, internal, format);
      let b = createFBO(w, h, internal, format);
      return {
        width: w,
        height: h,
        texelSizeX: a.texelSizeX,
        texelSizeY: a.texelSizeY,
        get read() {
          return a;
        },
        get write() {
          return b;
        },
        swap() {
          const t = a;
          a = b;
          b = t;
        },
      };
    };

    const resolution = (res: number) => {
      let aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (aspect < 1) aspect = 1 / aspect;
      const min = Math.round(res);
      const max = Math.round(res * aspect);
      return gl.drawingBufferWidth > gl.drawingBufferHeight ? { w: max, h: min } : { w: min, h: max };
    };

    let dye: DoubleFBO;
    let velocity: DoubleFBO;
    let divergence: FBO;
    let curl: FBO;
    let pressure: DoubleFBO;

    const initFramebuffers = () => {
      const sim = resolution(CONFIG.SIM_RESOLUTION);
      const dyeRes = resolution(CONFIG.DYE_RESOLUTION);
      dye = createDouble(dyeRes.w, dyeRes.h, gl.RGBA16F, gl.RGBA);
      velocity = createDouble(sim.w, sim.h, gl.RG16F, gl.RG);
      divergence = createFBO(sim.w, sim.h, gl.R16F, gl.RED);
      curl = createFBO(sim.w, sim.h, gl.R16F, gl.RED);
      pressure = createDouble(sim.w, sim.h, gl.R16F, gl.RED);
    };

    const resizeCanvas = () => {
      const w = Math.floor(window.innerWidth);
      const h = Math.floor(window.innerHeight);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        return true;
      }
      return false;
    };
    resizeCanvas();
    initFramebuffers();

    // ---------- Simulation ----------
    const aspect = () => canvas.width / canvas.height;

    const splat = (x: number, y: number, dx: number, dy: number, color: { r: number; g: number; b: number }) => {
      const s = progs.splat;
      s.use();
      gl.uniform1i(s.u.uTarget, velocity.read.attach(0));
      gl.uniform1f(s.u.aspectRatio, aspect());
      gl.uniform2f(s.u.point, x, y);
      gl.uniform3f(s.u.color, dx, dy, 0);
      let radius = CONFIG.SPLAT_RADIUS / 100;
      if (aspect() > 1) radius *= aspect();
      gl.uniform1f(s.u.radius, radius);
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(s.u.uTarget, dye.read.attach(0));
      gl.uniform3f(s.u.color, color.r, color.g, color.b);
      blit(dye.write);
      dye.swap();
    };

    const step = (dt: number) => {
      gl.disable(gl.BLEND);

      progs.curl.use();
      gl.uniform2f(progs.curl.u.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(progs.curl.u.uVelocity, velocity.read.attach(0));
      blit(curl);

      progs.vorticity.use();
      gl.uniform2f(progs.vorticity.u.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(progs.vorticity.u.uVelocity, velocity.read.attach(0));
      gl.uniform1i(progs.vorticity.u.uCurl, curl.attach(1));
      gl.uniform1f(progs.vorticity.u.curl, CONFIG.CURL);
      gl.uniform1f(progs.vorticity.u.dt, dt);
      blit(velocity.write);
      velocity.swap();

      progs.divergence.use();
      gl.uniform2f(progs.divergence.u.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(progs.divergence.u.uVelocity, velocity.read.attach(0));
      blit(divergence);

      progs.clear.use();
      gl.uniform1i(progs.clear.u.uTexture, pressure.read.attach(0));
      gl.uniform1f(progs.clear.u.value, CONFIG.PRESSURE);
      blit(pressure.write);
      pressure.swap();

      progs.pressure.use();
      gl.uniform2f(progs.pressure.u.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(progs.pressure.u.uDivergence, divergence.attach(0));
      for (let i = 0; i < CONFIG.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(progs.pressure.u.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      progs.gradient.use();
      gl.uniform2f(progs.gradient.u.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(progs.gradient.u.uPressure, pressure.read.attach(0));
      gl.uniform1i(progs.gradient.u.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      progs.advection.use();
      gl.uniform2f(progs.advection.u.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      const vId = velocity.read.attach(0);
      gl.uniform1i(progs.advection.u.uVelocity, vId);
      gl.uniform1i(progs.advection.u.uSource, vId);
      gl.uniform1f(progs.advection.u.dt, dt);
      gl.uniform1f(progs.advection.u.dissipation, CONFIG.VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(progs.advection.u.uVelocity, velocity.read.attach(0));
      gl.uniform1i(progs.advection.u.uSource, dye.read.attach(1));
      gl.uniform1f(progs.advection.u.dissipation, CONFIG.DENSITY_DISSIPATION);
      blit(dye.write);
      dye.swap();
    };

    const render = () => {
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      gl.clearColor(0, 0, 0, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clear(gl.COLOR_BUFFER_BIT);
      progs.display.use();
      gl.uniform2f(progs.display.u.texelSize, 1 / gl.drawingBufferWidth, 1 / gl.drawingBufferHeight);
      gl.uniform1i(progs.display.u.uTexture, dye.read.attach(0));
      blit(null);
    };

    // ---------- Input ----------
    const pointer = { x: 0, y: 0, px: 0, py: 0, moved: false, color: randomColor(), primed: false };
    let colorTimer = 0;
    let lastInput = 0;

    const correctDelta = (dx: number, dy: number) => {
      const a = aspect();
      if (a < 1) dx *= a;
      if (a > 1) dy /= a;
      // Clamp delta to prevent sudden explosive splats on fast re-entry or jumps
      const maxDelta = 0.06;
      const dist = Math.hypot(dx, dy);
      if (dist > maxDelta && dist > 0) {
        const factor = maxDelta / dist;
        dx *= factor;
        dy *= factor;
      }
      return [dx, dy];
    };

    const feed = (clientX: number, clientY: number) => {
      const x = clientX / canvas.width;
      const y = 1 - clientY / canvas.height;
      if (!pointer.primed) {
        pointer.px = x;
        pointer.py = y;
        pointer.x = x;
        pointer.y = y;
        pointer.primed = true;
        pointer.moved = false;
        return;
      }

      const dx = x - pointer.x;
      const dy = y - pointer.y;
      const dist = Math.hypot(dx, dy);

      // If jump is abnormally large (e.g. mouse re-entered window or tab switched), don't spray dye across screen
      if (dist > 0.2) {
        pointer.px = x;
        pointer.py = y;
        pointer.x = x;
        pointer.y = y;
        pointer.moved = false;
        return;
      }

      pointer.px = pointer.x;
      pointer.py = pointer.y;
      pointer.x = x;
      pointer.y = y;
      pointer.moved = dist > 0.0005;
    };

    // ---------- Loop ----------
    let raf = 0;
    let running = false;
    let last = performance.now();
    let isScrolling = false;
    let scrollTimer: ReturnType<typeof setTimeout> | undefined;

    const frame = (now: number) => {
      // Yield GPU processing during active scroll to ensure 100% fluid 60-120fps page scrolling
      if (isScrolling) {
        lastInput = now;
        raf = requestAnimationFrame(frame);
        return;
      }

      const dt = Math.min((now - last) / 1000, 0.016666);
      last = now;
      if (resizeCanvas()) initFramebuffers();

      colorTimer += dt * CONFIG.COLOR_UPDATE_SPEED;
      if (colorTimer >= 1) {
        colorTimer %= 1;
        pointer.color = randomColor();
      }

      if (pointer.moved) {
        pointer.moved = false;
        const [dx, dy] = correctDelta(pointer.x - pointer.px, pointer.y - pointer.py);
        splat(pointer.x, pointer.y, dx * CONFIG.SPLAT_FORCE, dy * CONFIG.SPLAT_FORCE, pointer.color);
      }

      step(dt);
      render();

      if (now - lastInput > CONFIG.IDLE_STOP_MS) {
        running = false;
        gl.clear(gl.COLOR_BUFFER_BIT);
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (running || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      feed(e.clientX, e.clientY);
      lastInput = performance.now();
      wake();
    };
    const onDown = (e: PointerEvent) => {
      feed(e.clientX, e.clientY);
      const c = randomColor();
      splat(pointer.x, pointer.y, (Math.random() - 0.5) * 1000, 1000 * (Math.random() - 0.2), { r: c.r * 10, g: c.g * 10, b: c.b * 10 });
      lastInput = performance.now();
      wake();
    };
    const onLeave = () => {
      pointer.primed = false;
    };
    const onScroll = () => {
      isScrolling = true;
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        isScrolling = false;
      }, 100);
    };
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        running = false;
      } else {
        pointer.primed = false;
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      if (scrollTimer) clearTimeout(scrollTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}