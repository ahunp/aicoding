"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

export default function CategoryFilter({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") || "";

  function handleClick(categoryId: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId === active) {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete("category");
          params.delete("page");
          router.push(`/products?${params.toString()}`);
        }}
        className={cn(
          "rounded-full px-4 py-1.5 text-sm transition-colors",
          !active
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        )}
      >
        全部
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleClick(cat.id)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm transition-colors",
            active === cat.id
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
