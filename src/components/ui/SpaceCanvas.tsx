"use client";

import { useEffect, useRef } from "react";

/** The loader's background plate is authored at this size and scales like object-fit: cover. */
const PLATE_W = 1672;
const PLATE_H = 941;
/** Planet horizon on the plate: a circle touching this peak. */
const HORIZON = { x: 836, peak: 808, radius: 1357 };

const STAR_COUNT = 380;
const PARTICLE_COUNT = 70;
const MAX_DPR = 1.5;
const TAU = Math.PI * 2;

/** Shooting stars start near where the design places them, then fall down-left. */
const METEOR_STARTS = [
  { x: 470, y: 225 },
  { x: 1225, y: 65 },
  { x: 1590, y: 612 },
  { x: 760, y: 60 },
  { x: 1400, y: 300 },
];

const random = (min: number, max: number) => min + Math.random() * (max - min);

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  speed: number;
  phase: number;
  sprite: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
}

interface Meteor {
  x: number;
  y: number;
  age: number;
  life: number;
  speed: number;
  length: number;
}

function makeSprite(color: string) {
  const size = 32;
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = size;
  const ctx = sprite.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "#ffffff");
  g.addColorStop(0.18, color);
  g.addColorStop(0.45, `${color}55`);
  g.addColorStop(1, `${color}00`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return sprite;
}

/**
 * Everything in the space scene that moves per-frame: twinkling stars, drifting particles,
 * shooting stars and the light travelling along the planet horizon. One canvas keeps hundreds
 * of stars out of the DOM.
 */
export function SpaceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sprites = [makeSprite("#7dffcf"), makeSprite("#26e6a0"), makeSprite("#c9fff0")];

    let width = 0;
    let height = 0;
    let scale = 1;
    let originX = 0;
    let originY = 0;

    // Stars live in unit space so they stay evenly spread on any screen shape.
    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() < 0.08 ? random(4, 7) : random(1.6, 3.4),
      alpha: random(0.25, 0.95),
      speed: random(0.5, 2.2),
      phase: random(0, TAU),
      sprite: Math.floor(Math.random() * sprites.length),
    }));
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => {
      const angle = random(0, TAU);
      const speed = random(0.004, 0.016);
      return {
        x: Math.random(),
        y: Math.random(),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: random(2.5, 5.5),
        alpha: random(0.2, 0.6),
        phase: random(0, TAU),
      };
    });
    const meteors: Meteor[] = [];
    let nextMeteor = 0.5;
    let meteorIndex = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scale = Math.max(width / PLATE_W, height / PLATE_H);
      originX = (width - PLATE_W * scale) / 2;
      originY = height - PLATE_H * scale;
    };

    const horizonCenterX = () => originX + HORIZON.x * scale;
    const horizonCenterY = () => originY + (HORIZON.peak + HORIZON.radius) * scale;
    const belowHorizon = (px: number, py: number) => {
      const dx = px - horizonCenterX();
      const dy = py - horizonCenterY();
      return dx * dx + dy * dy < (HORIZON.radius * scale) ** 2;
    };

    const spawnMeteor = () => {
      const start = METEOR_STARTS[meteorIndex++ % METEOR_STARTS.length];
      meteors.push({
        x: originX + (start.x + random(-40, 40)) * scale,
        y: originY + (start.y + random(-30, 30)) * scale,
        age: 0,
        life: random(0.8, 1.2),
        speed: random(520, 760) * scale,
        length: random(110, 170) * scale,
      });
    };

    const drawHorizonLight = (t: number) => {
      const r = HORIZON.radius * scale;
      const cx = horizonCenterX();
      const cy = horizonCenterY();
      // A soft highlight that wanders either way along the atmosphere line
      const center = -Math.PI / 2 + Math.sin(t * 0.32) * 0.34;
      const spread = 0.14;
      const x0 = cx + Math.cos(center - spread) * r;
      const y0 = cy + Math.sin(center - spread) * r;
      const x1 = cx + Math.cos(center + spread) * r;
      const y1 = cy + Math.sin(center + spread) * r;
      const g = ctx.createLinearGradient(x0, y0, x1, y1);
      g.addColorStop(0, "rgba(120,255,200,0)");
      g.addColorStop(0.5, "rgba(190,255,225,0.75)");
      g.addColorStop(1, "rgba(120,255,200,0)");
      ctx.strokeStyle = g;
      ctx.lineCap = "round";
      ctx.lineWidth = Math.max(1.2, 2.2 * scale);
      ctx.beginPath();
      ctx.arc(cx, cy, r, center - spread, center + spread);
      ctx.stroke();
    };

    const draw = (t: number, dt: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (const s of stars) {
        const px = s.x * width;
        const py = s.y * height;
        if (belowHorizon(px, py)) continue;
        ctx.globalAlpha = s.alpha * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
        ctx.drawImage(sprites[s.sprite], px - s.size / 2, py - s.size / 2, s.size, s.size);
      }

      for (const p of particles) {
        p.x = (p.x + p.vx * dt + 1) % 1;
        p.y = (p.y + p.vy * dt + 1) % 1;
        const px = p.x * width;
        const py = p.y * height;
        if (belowHorizon(px, py)) continue;
        ctx.globalAlpha = p.alpha * (0.6 + 0.4 * Math.sin(t * 0.7 + p.phase));
        ctx.drawImage(sprites[1], px - p.size / 2, py - p.size / 2, p.size, p.size);
      }

      ctx.globalAlpha = 1;
      drawHorizonLight(t);

      nextMeteor -= dt;
      if (nextMeteor <= 0) {
        spawnMeteor();
        nextMeteor = random(1.4, 3);
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.age += dt;
        if (m.age >= m.life) {
          meteors.splice(i, 1);
          continue;
        }
        // Falls down-left at the design's shallow angle, tail trailing up-right.
        const dirX = -0.86;
        const dirY = 0.51;
        m.x += dirX * m.speed * dt;
        m.y += dirY * m.speed * dt;
        const fade = Math.sin((m.age / m.life) * Math.PI);
        const tailX = m.x - dirX * m.length;
        const tailY = m.y - dirY * m.length;
        const g = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        g.addColorStop(0, `rgba(235,255,247,${fade})`);
        g.addColorStop(0.25, `rgba(110,255,200,${0.6 * fade})`);
        g.addColorStop(1, "rgba(60,255,170,0)");
        ctx.strokeStyle = g;
        ctx.lineWidth = Math.max(1, 1.6 * scale);
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
        const head = 9 * Math.max(scale, 0.7);
        ctx.globalAlpha = fade;
        ctx.drawImage(sprites[2], m.x - head / 2, m.y - head / 2, head, head);
        ctx.globalAlpha = 1;
      }
      ctx.globalCompositeOperation = "source-over";
    };

    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    if (reduced) {
      nextMeteor = Infinity;
      draw(1, 0);
      const redraw = () => draw(1, 0);
      window.addEventListener("resize", redraw);
      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("resize", redraw);
      };
    }

    let last = performance.now();
    const loop = (now: number) => {
      // Clamped so a backgrounded tab doesn't teleport everything on return
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      draw(now / 1000, dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />;
}
