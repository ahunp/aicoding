"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";

interface Props {
  images: string[];
  alt: string;
  className?: string;
}

export default function ProductImageCarousel({ images, alt, className = "" }: Props) {
  const [current, setCurrent] = useState(0);

  // Deduplicate and filter empty
  const unique = [...new Set(images.filter(Boolean))];

  if (unique.length === 0) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-surface shadow-card min-h-80 ${className}`}>
        <Package className="h-24 w-24 text-muted" />
      </div>
    );
  }

  const hasMultiple = unique.length > 1;

  function prev() {
    setCurrent((c) => (c === 0 ? unique.length - 1 : c - 1));
  }

  function next() {
    setCurrent((c) => (c === unique.length - 1 ? 0 : c + 1));
  }

  return (
    <div className={`relative flex items-center justify-center rounded-lg bg-surface shadow-card min-h-80 overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.2 }}
          className="relative h-full w-full"
          style={{ aspectRatio: "1 / 1" }}
        >
          <Image
            src={unique[current]}
            alt={`${alt} - ${current + 1}`}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={current === 0}
          />
        </motion.div>
      </AnimatePresence>

      {hasMultiple && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
            aria-label="上一张"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
            aria-label="下一张"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {unique.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current ? "w-5 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`第 ${i + 1} 张图片`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
