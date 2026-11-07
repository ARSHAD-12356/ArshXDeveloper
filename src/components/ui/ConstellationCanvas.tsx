"use client";

import { useEffect, useRef } from "react";

/** One node per this many square pixels, kept between the limits below. */
const AREA_PER_NODE = 9000;
const MIN_NODES = 44;
const MAX_NODES = 160;
/** Nodes closer than this are linked; the line fades out as they drift apart. */
const LINK_DISTANCE = { wide: 128, narrow: 104 };
const LINE_ALPHA = 0.3;
/** Lines are grouped into this many opacity steps and drawn in one go per step. */
const ALPHA_STEPS = 6;
/** A moving cursor shoves only what it actually touches, and only as hard as it's moving. */
const PUSH_RADIUS = 62;
const PUSH_STRENGTH = 6;
const PUSH_MAX_SPEED = 900;
/** A node can be picked up by pressing this close to it. */
const GRAB_RADIUS = 30;
const GRAB_FOLLOW = 22;
/** How strongly a node returns to its own spot, and how quickly it loses speed. */
const HOME_SPRING = 1.3;
const DAMPING = 2.8;
const TAU = Math.PI * 2;

const random = (min: number, max: number) => min + Math.random() * (max - min);

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  homeX: number;
  homeY: number;
  /** Size and speed of the slow loop around its home. */
  wander: number;
  wanderX: number;
  wanderY: number;
  size: number;
  alpha: number;
  phase: number;
  speed: number;
}

/** One node inside each cell of a grid, which keeps the whole area evenly filled. */
function makeNodes(width: number, height: number) {
  const count = Math.round(Math.min(MAX_NODES, Math.max(MIN_NODES, (width * height) / AREA_PER_NODE)));
  const cols = Math.max(1, Math.round(Math.sqrt((count * width) / height)));
  const rows = Math.max(1, Math.round(count / cols));
  const cellW = width / cols;
  const cellH = height / rows;
  const nodes: Node[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const homeX = (col + random(0.15, 0.85)) * cellW;
      const homeY = (row + random(0.15, 0.85)) * cellH;
      // A few larger hubs among many small points give the network its hierarchy.
      const hub = Math.random() < 0.18;
      nodes.push({
        x: homeX,
        y: homeY,
        vx: 0,
        vy: 0,
        homeX,
        homeY,
        wander: Math.min(cellW, cellH) * random(0.4, 0.8),
        wanderX: random(0.14, 0.34),
        wanderY: random(0.14, 0.34),
        size: hub ? random(2.6, 3.8) : random(0.9, 2),
        alpha: hub ? random(0.55, 0.75) : random(0.3, 0.55),
        phase: random(0, TAU),
        speed: random(0.3, 0.8),
      });
    }
  }
  return nodes;
}

/**
 * Light connected-particle field that fills its positioned parent. It moves by itself; a moving
 * cursor pushes the few nodes it touches, and a node can be pressed and dragged to a new spot, where
 * it bonds with whatever is near. Drawn on one canvas without any React state, and only runs while
 * on screen and the tab is visible.
 */
export function ConstellationCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let linkDistance = LINK_DISTANCE.wide;
    let nodes: Node[] = [];

    // Latest mouse position on screen; turned into canvas coordinates once per frame.
    let pointerClientX = 0;
    let pointerClientY = 0;
    let pointerSeen = false;
    let lastClientX = 0;
    let lastClientY = 0;
    let lastValid = false;
    let pointerInside = false;
    let pointerX = 0;
    let pointerY = 0;
    let grabbed: Node | null = null;
    let hovered: Node | null = null;

    const buckets: number[][] = Array.from({ length: ALPHA_STEPS }, () => []);

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      for (const bucket of buckets) bucket.length = 0;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          if (a === grabbed || b === grabbed) continue;
          const dx = a.x - b.x;
          if (dx > linkDistance || dx < -linkDistance) continue;
          const dy = a.y - b.y;
          if (dy > linkDistance || dy < -linkDistance) continue;
          const distance = Math.hypot(dx, dy);
          if (distance >= linkDistance) continue;
          const step = Math.min(ALPHA_STEPS - 1, Math.floor((1 - distance / linkDistance) * ALPHA_STEPS));
          buckets[step].push(a.x, a.y, b.x, b.y);
        }
      }

      // Grey lines on the light panel, soft light lines when dark mode is on.
      const tone = document.documentElement.dataset.theme === "dark" ? "175, 188, 182" : "62, 66, 70";
      ctx.lineWidth = 0.75;
      buckets.forEach((bucket, step) => {
        if (!bucket.length) return;
        ctx.strokeStyle = `rgba(${tone}, ${((step + 1) / ALPHA_STEPS) * LINE_ALPHA})`;
        ctx.beginPath();
        for (let k = 0; k < bucket.length; k += 4) {
          ctx.moveTo(bucket[k], bucket[k + 1]);
          ctx.lineTo(bucket[k + 2], bucket[k + 3]);
        }
        ctx.stroke();
      });

      // The dragged node's own bonds stand out, so each new connection reads clearly.
      if (grabbed) {
        ctx.lineWidth = 1.2;
        for (const node of nodes) {
          if (node === grabbed) continue;
          const distance = Math.hypot(node.x - grabbed.x, node.y - grabbed.y);
          if (distance >= linkDistance) continue;
          ctx.strokeStyle = `rgba(0, 190, 120, ${0.25 + (1 - distance / linkDistance) * 0.6})`;
          ctx.beginPath();
          ctx.moveTo(grabbed.x, grabbed.y);
          ctx.lineTo(node.x, node.y);
          ctx.stroke();
        }
      }

      for (const node of nodes) {
        const active = node === grabbed || node === hovered;
        const twinkle = 0.82 + 0.18 * Math.sin(time * 0.001 * node.speed + node.phase);
        ctx.fillStyle = active ? "rgb(0, 190, 120)" : `rgba(${tone}, ${node.alpha * twinkle})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, active ? Math.max(node.size, 3) + 1.5 : node.size, 0, TAU);
        ctx.fill();
      }
    };

    const resize = () => {
      const nextWidth = canvas.clientWidth;
      const nextHeight = canvas.clientHeight;
      if (!nextWidth || !nextHeight || (nextWidth === width && nextHeight === height)) return;
      width = nextWidth;
      height = nextHeight;

      const narrow = width < 768;
      // Phones repaint a tall canvas every frame, so they trade a little sharpness for speed.
      const dpr = Math.min(window.devicePixelRatio || 1, narrow ? 1.5 : 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      linkDistance = narrow ? LINK_DISTANCE.narrow : LINK_DISTANCE.wide;
      grabbed = null;
      hovered = null;
      nodes = makeNodes(width, height);

      if (reduced || !running) draw(0);
    };

    let raf = 0;
    let running = false;
    let last = 0;
    let onScreen = false;

    const readPointer = () => {
      if (!pointerSeen) {
        pointerInside = false;
        return;
      }
      const rect = canvas.getBoundingClientRect();
      pointerX = pointerClientX - rect.left;
      pointerY = pointerClientY - rect.top;
      pointerInside = pointerX >= 0 && pointerX <= width && pointerY >= 0 && pointerY <= height;
    };

    const nearestNode = () => {
      let nearest: Node | null = null;
      let best = GRAB_RADIUS;
      for (const node of nodes) {
        const distance = Math.hypot(node.x - pointerX, node.y - pointerY);
        if (distance < best) {
          best = distance;
          nearest = node;
        }
      }
      return nearest;
    };

    const frame = (time: number) => {
      const dt = Math.min((time - last) / 1000, 0.05);
      last = time;
      readPointer();
      hovered = pointerInside && !grabbed ? nearestNode() : null;

      // Measured on screen, so scrolling the page under a still cursor doesn't count as a shove.
      let moveX = 0;
      let moveY = 0;
      if (pointerSeen && lastValid && dt > 0) {
        moveX = (pointerClientX - lastClientX) / dt;
        moveY = (pointerClientY - lastClientY) / dt;
      }
      lastClientX = pointerClientX;
      lastClientY = pointerClientY;
      lastValid = pointerSeen;
      const moveSpeed = Math.min(Math.hypot(moveX, moveY), PUSH_MAX_SPEED);

      const seconds = time * 0.001;
      const damping = Math.exp(-DAMPING * dt);
      for (const node of nodes) {
        if (node === grabbed) {
          const follow = Math.min(1, GRAB_FOLLOW * dt);
          node.x += (pointerX - node.x) * follow;
          node.y += (pointerY - node.y) * follow;
          node.vx = 0;
          node.vy = 0;
          continue;
        }

        const targetX = node.homeX + Math.cos(seconds * node.wanderX + node.phase) * node.wander;
        const targetY = node.homeY + Math.sin(seconds * node.wanderY + node.phase * 1.7) * node.wander;
        const ax = (targetX - node.x) * HOME_SPRING;
        const ay = (targetY - node.y) * HOME_SPRING;
        node.vx = (node.vx + ax * dt) * damping;
        node.vy = (node.vy + ay * dt) * damping;

        if (pointerInside && !grabbed && moveSpeed > 0) {
          const dx = node.x - pointerX;
          const dy = node.y - pointerY;
          const distance = Math.hypot(dx, dy) || 1;
          if (distance < PUSH_RADIUS) {
            // Away from the cursor and along its path, like a finger sweeping through.
            const impulse = (1 - distance / PUSH_RADIUS) * moveSpeed * PUSH_STRENGTH * dt;
            const speed = Math.hypot(moveX, moveY) || 1;
            node.vx += (dx / distance + moveX / speed) * 0.5 * impulse;
            node.vy += (dy / distance + moveY / speed) * 0.5 * impulse;
          }
        }

        node.x += node.vx * dt;
        node.y += node.vy * dt;
      }

      draw(time);
      raf = requestAnimationFrame(frame);
    };

    const sync = () => {
      const shouldRun = onScreen && !document.hidden && !reduced;
      if (shouldRun === running) return;
      running = shouldRun;
      if (running) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else {
        cancelAnimationFrame(raf);
      }
    };

    const release = () => {
      if (!grabbed) return;
      // It settles where it was dropped and keeps moving around that spot.
      const seconds = performance.now() * 0.001;
      grabbed.homeX = grabbed.x - Math.cos(seconds * grabbed.wanderX + grabbed.phase) * grabbed.wander;
      grabbed.homeY = grabbed.y - Math.sin(seconds * grabbed.wanderY + grabbed.phase * 1.7) * grabbed.wander;
      grabbed = null;
    };

    // Only a mouse or pen interacts: a finger on a phone is there to scroll.
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pointerClientX = e.clientX;
      pointerClientY = e.clientY;
      pointerSeen = true;
    };
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch" || e.button !== 0) return;
      if ((e.target as Element | null)?.closest?.("a, button, input, textarea, select, header")) return;
      onPointerMove(e);
      readPointer();
      if (pointerInside) grabbed = nearestNode();
    };
    const onPointerLeave = () => {
      release();
      pointerSeen = false;
    };
    // Dragging a node must not also start selecting the text around it.
    const onSelectStart = (e: Event) => {
      if (grabbed) e.preventDefault();
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (!onScreen) release();
      sync();
    });
    intersectionObserver.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    // Repaint a paused canvas in the new colours when the theme flips.
    const onTheme = () => {
      if (reduced || !running) draw(0);
    };
    window.addEventListener("themechange", onTheme);
    if (!reduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerdown", onPointerDown, { passive: true });
      window.addEventListener("pointerup", release, { passive: true });
      window.addEventListener("pointercancel", release, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);
      document.addEventListener("selectstart", onSelectStart);
    }

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("themechange", onTheme);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("selectstart", onSelectStart);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
