"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  colorIndex: number;
}

const SPRITE_COLORS = ["#f5a623", "#ffb84d", "#ffc94d", "#e8863a", "#f0b429"];
const MAX_PARTICLES = 50;

/**
 * 光标拖尾粒子（性能优化版）
 * - 预渲染径向渐变发光贴图，每帧 drawImage 绘制（避免逐粒子设置 shadowBlur —— 卡顿根源）
 * - 事件节流 ~60fps，粒子上限 50，寿命缩短，DPR 限制 2
 */
export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 预渲染发光粒子贴图
    const sprites = SPRITE_COLORS.map((color) => {
      const s = document.createElement("canvas");
      s.width = 64;
      s.height = 64;
      const sctx = s.getContext("2d");
      if (!sctx) return null;
      const g = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, color);
      g.addColorStop(0.45, color + "99");
      g.addColorStop(1, "rgba(0,0,0,0)");
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, 64, 64);
      return s;
    }).filter((s): s is HTMLCanvasElement => s !== null);

    let particles: Particle[] = [];
    let raf = 0;
    const last = { x: -9999, y: -9999 };
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = Math.round(window.innerWidth * DPR);
      canvas.height = Math.round(window.innerHeight * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = (x: number, y: number) => {
      if (particles.length >= MAX_PARTICLES) particles.shift();
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.2 + Math.random() * 0.8;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 10 + Math.random() * 14,
        life: 0,
        maxLife: 26 + Math.random() * 26,
        colorIndex: (Math.random() * sprites.length) | 0,
      });
    };

    let lastEventTime = 0;
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const now = performance.now();
      if (now - lastEventTime < 16) return; // 节流，避免事件风暴
      lastEventTime = now;
      const { clientX: x, clientY: y } = e;
      const dx = x - last.x;
      const dy = y - last.y;
      const dist = Math.hypot(dx, dy);
      // 快速移动按距离插值补点，保证拖尾连续
      const steps = Math.min(Math.floor(dist / 16), 5);
      for (let i = 1; i <= steps; i++) {
        spawn(last.x + (dx * i) / steps, last.y + (dy * i) / steps);
      }
      spawn(x, y);
      last.x = x;
      last.y = y;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = "lighter"; // 发光叠加
      particles = particles.filter((p) => p.life < p.maxLife);
      for (const p of particles) {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        const fade = 1 - p.life / p.maxLife;
        ctx.globalAlpha = fade * 0.45;
        const s = p.size * (0.6 + fade * 0.4);
        ctx.drawImage(sprites[p.colorIndex], p.x - s / 2, p.y - s / 2, s, s);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[35]"
    />
  );
}
