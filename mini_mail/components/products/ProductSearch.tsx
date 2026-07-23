"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Clock, X } from "lucide-react";
import Input from "@/components/ui/Input";
import { getSearchHistory, addSearchQuery, clearSearchHistory } from "@/lib/search-history";

export default function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") || "");
  const [history, setHistory] = useState<string[]>([]);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHistory(getSearchHistory());
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setFocused(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const term = value.trim();
    if (!term) return;
    addSearchQuery(term);
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", term);
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div ref={ref} className="relative">
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="搜索商品..."
          className="w-48"
        />
      </form>
      {focused && history.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-border bg-surface p-2 shadow-lg">
          <div className="mb-1 flex items-center justify-between px-1">
            <span className="text-xs text-muted-foreground">最近搜索</span>
            <button onClick={() => { clearSearchHistory(); setHistory([]); }} className="text-xs text-muted-foreground hover:text-foreground">
              <X className="h-3 w-3" />
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {history.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => { setValue(h); addSearchQuery(h); router.push(`/products?search=${encodeURIComponent(h)}`); }}
                className="flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs text-foreground hover:bg-muted-foreground/20"
              >
                <Clock className="h-3 w-3" /> {h}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
