"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

const announcements = [
  "⚡ 每日5款限时抢购，低至九折",
  "💎 会员专享好物，最高享12%折扣",
  "🎉 新品首发，抢先体验",
];

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  if (dismissed) return null;

  return (
    <div className="relative h-8 overflow-hidden bg-gradient-to-r from-accent-500 to-accent-600 text-white">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-center px-4">
        <p className="animate-fade-in text-xs font-medium tabular-nums sm:text-sm" key={idx}>
          {announcements[idx]}
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-white/70 hover:text-white"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
