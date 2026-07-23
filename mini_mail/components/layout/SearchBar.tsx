"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/products?search=${encodeURIComponent(q.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="hidden sm:block relative">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="搜索商品..."
        className="w-40 rounded-full border border-border bg-muted py-1.5 pl-8 pr-3 text-xs placeholder:text-muted-foreground transition-all focus:w-56 focus:border-primary-500 focus:outline-none"
      />
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
    </form>
  );
}
