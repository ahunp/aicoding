"use client";

import { useEffect, useState } from "react";

/**
 * 顶部极细彩色滚动进度条 + 右上角阅读进度百分比
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const scrollTop = window.scrollY;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(total > 0 ? Math.min(scrollTop / total, 1) : 0);
        setVisible(scrollTop > window.innerHeight * 0.25);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const pct = Math.round(progress * 100);

  return (
    <>
      {/* 顶部极细进度条 */}
      <div
        className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-white/10"
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-gold via-gold-light to-gold-deep transition-[width] duration-150 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* 右上角阅读进度百分比 */}
      <div
        className={`fixed right-4 top-4 z-[60] flex items-center gap-1.5 rounded-full border border-line bg-night-800/90 px-3.5 py-1.5 text-xs font-medium text-ink-soft shadow-sm backdrop-blur transition-all duration-300 ${
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <svg className="h-3.5 w-3.5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-gradient font-bold">{pct}%</span>
        已阅读
      </div>
    </>
  );
}
