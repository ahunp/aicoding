"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "@/lib/toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function FavoriteButton({ productId, className = "" }: { productId: string; className?: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  // Determine if favorited on mount
  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/user/wishlist")
      .then((r) => r.json())
      .then((d) => {
        if (d.data) setFavorited(d.data.some((i: any) => i.productId === productId));
      })
      .catch(() => {});
  }, [session, productId]);

  async function handleToggle() {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const d = await res.json();
      if (res.ok) {
        setFavorited(d.data.favorited);
        toast(d.data.favorited ? "已收藏" : "已取消收藏", "success");
      }
    } catch {
      toast("操作失败", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`rounded-full p-2 transition-all ${className} ${
        favorited ? "text-danger-500" : "text-muted-foreground hover:text-danger-400"
      }`}
    >
      <Heart className={`h-5 w-5 ${favorited ? "fill-current" : ""}`} />
    </button>
  );
}
