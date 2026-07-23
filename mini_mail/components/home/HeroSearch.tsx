"use client";

import { Search, X, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getSearchHistory, addSearchQuery, clearSearchHistory } from "@/lib/search-history";

const suggestions = ["新品首发", "限时特惠", "会员专享", "蓝牙耳机", "机械键盘", "运动鞋"];

export default function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHistory(getSearchHistory());
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setFocused(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSearch(query: string) {
    const term = query.trim() || q.trim();
    if (!term) return;
    addSearchQuery(term);
    router.push(`/products?search=${encodeURIComponent(term)}`);
    setFocused(false);
  }

  const showDropdown = focused && (q.length === 0);

  return (
    <div ref={ref} className="relative mx-auto mb-6 max-w-2xl">
      <form onSubmit={(e) => { e.preventDefault(); handleSearch(q); }}>
        <div className="relative flex items-center">
          <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="搜索你想要的宝贝..."
            className="h-12 w-full rounded-full border border-white/20 bg-white/10 pl-12 pr-36 text-base text-white placeholder:text-white/40 backdrop-blur-sm transition-all focus:border-white/40 focus:bg-white/15 focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 h-9 -translate-y-1/2 rounded-full bg-accent-500 px-6 text-sm font-medium text-white transition-all hover:bg-accent-600 active:scale-[0.97]"
          >
            搜索
          </button>
        </div>
      </form>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-border bg-surface p-3 shadow-xl">
          {history.length > 0 && (
            <div className="mb-3">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">搜索历史</span>
                <button
                  type="button"
                  onClick={() => { clearSearchHistory(); setHistory([]); }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  清空
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {history.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => { setQ(h); handleSearch(h); }}
                    className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-foreground hover:bg-muted-foreground/20"
                  >
                    <Clock className="h-3 w-3" /> {h}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">热门搜索</span>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { setQ(s); handleSearch(s); }}
                  className="rounded-full bg-primary-50 px-3 py-1 text-xs text-primary-700 hover:bg-primary-100"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
