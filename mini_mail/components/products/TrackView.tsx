"use client";

import { useEffect } from "react";
import { addViewedId } from "@/lib/history";

export default function TrackView({ productId }: { productId: string }) {
  useEffect(() => {
    addViewedId(productId);
  }, [productId]);

  return null;
}
