"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Input from "@/components/ui/Input";

export default function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") || "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="搜索商品..."
        className="w-48"
      />
    </form>
  );
}
