"use client";

import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { id: "home", label: "首页" },
  { id: "about", label: "关于我" },
  { id: "education", label: "教育" },
  { id: "skills", label: "技能" },
  { id: "experience", label: "经历" },
  { id: "projects", label: "项目" },
  { id: "contact", label: "联系" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 通过 IntersectionObserver 高亮当前可见区块
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line bg-night-900/80 shadow-lg shadow-black/20 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="section-container flex h-16 items-center justify-between">
        <a href="#home" className="group flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold to-gold-deep text-sm font-bold text-night-900 transition-transform group-hover:rotate-6">
            胡
          </span>
          <span className="text-lg font-semibold text-ink">胡金城</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`relative rounded-lg px-4 py-2 text-sm transition-colors ${
                  active === id
                    ? "font-medium text-gold"
                    : "text-ink-faint hover:text-ink"
                }`}
              >
                {label}
                {active === id && (
                  <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-gold to-gold-light" />
                )}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden rounded-lg border border-gold-border px-4 py-1.5 text-sm text-gold transition-all hover:bg-gold-soft md:block"
        >
          联系我
        </a>
      </nav>
    </header>
  );
}
