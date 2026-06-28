"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";

interface Category {
  id: string;
  name: string;
}

export default function CategoryFilter({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") || "";

  function navigate(categoryId: string) {
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
      <Button
        onClick={() => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete("category");
          params.delete("page");
          router.push(`/products?${params.toString()}`);
        }}
        variant={!active ? "primary" : "secondary"}
        size="sm"
      >
        全部
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat.id}
          onClick={() => navigate(cat.id)}
          variant={active === cat.id ? "primary" : "secondary"}
          size="sm"
        >
          {cat.name}
        </Button>
      ))}
    </div>
  );
}
