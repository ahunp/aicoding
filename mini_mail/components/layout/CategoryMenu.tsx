"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

export default function CategoryMenu() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => {
        if (d.data) setCategories(d.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        全部分类
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          onMouseLeave={() => setOpen(false)}
          className="absolute left-0 top-full z-50 mt-1 w-44 rounded-xl border border-border bg-surface p-2 shadow-xl"
        >
          <Link
            href="/products"
            className="block rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            全部分类
          </Link>
          <div className="mx-2 border-t border-border" />
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}`}
              className="block rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
