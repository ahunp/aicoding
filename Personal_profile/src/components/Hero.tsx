"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ROLES = [
  "Java 后端开发工程师",
  "Spring Boot 应用开发者",
  "Vibe Coding 实践者",
  "Claude Code 深度用户",
];

/** 打字机效果 */
function useTypewriter(texts: string[]) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[index % texts.length];
    const speed = deleting ? 40 : 90;

    const timer = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) setTimeout(() => setDeleting(true), 1600);
      } else {
        const next = current.slice(0, text.length - 1);
        setText(next);
        if (next === "") {
          setDeleting(false);
          setIndex((i) => (i + 1) % texts.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [text, deleting, index, texts]);

  return text;
}

export default function Hero() {
  const typed = useTypewriter(ROLES);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* 背景：深色 + 金色光晕 */}
      <div className="absolute inset-0 bg-gradient-to-b from-night-900 via-[#0e1112] to-night-900" />
      <div className="glow left-[-10%] top-[-5%] h-[420px] w-[420px] bg-gold/10" />
      <div className="glow right-[-10%] top-[30%] h-[380px] w-[380px] bg-gold/8" />
      <div className="glow bottom-[-20%] left-[30%] h-[400px] w-[400px] bg-gold-deep/8" />
      {/* 网格纹理 */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#f5a623 1px, transparent 1px), linear-gradient(90deg, #f5a623 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      {/* 浮动几何装饰 */}
      <motion.div
        className="absolute left-[12%] top-[22%] h-16 w-16 rounded-xl border border-gold-border bg-night-800/50 animate-float"
        animate={{ rotate: [0, 12, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[15%] top-[28%] h-10 w-10 rounded-full border border-gold-border bg-night-800/50 animate-float"
        style={{ animationDelay: "1.2s" }}
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[28%] left-[20%] h-6 w-6 rotate-45 border border-gold-border bg-night-800/50 animate-float"
        style={{ animationDelay: "2s" }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 左上角头像（桌面端） */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute left-6 top-24 z-10 hidden md:block lg:left-10"
      >
        <div className="group animate-float">
          <div className="relative h-24 w-24">
            {/* 旋转渐变光环 */}
            <div
              className="absolute -inset-2 rounded-full animate-spin-slow opacity-80"
              style={{
                background:
                  "conic-gradient(from 0deg, #f5a623, #ffc94d, #e8863a, #f5a623)",
              }}
            />
            {/* 头像（深色底遮住光环内部，只露出外圈） */}
            <div className="relative h-full w-full overflow-hidden rounded-full bg-night-800 ring-4 ring-night-800 shadow-lg shadow-gold/20 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/me.jpg"
                alt="胡金城"
                fill
                sizes="96px"
                priority
                className="object-cover"
              />
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-ink-faint">
            <span className="font-medium text-ink">胡金城</span>
            <br />
            Java 开发 · AI 实践者
          </p>
        </div>
      </motion.div>

      <div className="section-container relative z-10 text-center">
        {/* 欢迎徽章 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center"
        >
          <div className="absolute -inset-1.5 rounded-full border-2 border-dashed border-gold/30 animate-spin-slow" />
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-night-700 to-night-800 text-3xl shadow-inner ring-1 ring-gold-border/60">
            👋
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-3 text-sm tracking-[0.4em] text-ink-faint"
        >
          你好，我是
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-6xl font-bold tracking-tight text-ink md:text-7xl"
        >
          胡金城
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-6 text-xl text-ink-soft md:text-2xl"
        >
          <span className="text-gradient font-semibold">{typed}</span>
          <span className="ml-0.5 inline-block h-[1.2em] w-[2px] translate-y-1 bg-gold animate-blink" />
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mx-auto mt-6 max-w-2xl text-ink-faint"
        >
          计算机科学与技术本科在读，热爱用技术解决问题。
          <br className="hidden md:block" />
          熟悉 Java 全栈开发，享受 AI 驱动的开发方式带来的效率提升。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <div className="group relative">
            {/* 诱导点击气泡：摆动 + 指向按钮 */}
            <div className="absolute -bottom-12 left-1/2 animate-wobble">
              <span className="block whitespace-nowrap rounded-full bg-gradient-to-r from-gold to-gold-deep px-4 py-1.5 text-xs font-semibold text-night-900 shadow-lg shadow-gold/30 transition-transform duration-300 group-hover:scale-110">
                👆 点我查看项目
              </span>
              <span className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 bg-gold-deep" />
            </div>
            <a
              href="#projects"
              className="relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-deep px-8 py-3 font-semibold text-night-900 transition-all hover:brightness-110 active:scale-95 animate-pulse-glow"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                  clipRule="evenodd"
                />
              </svg>
              查看项目
            </a>
          </div>
          <a
            href="#contact"
            className="rounded-xl border border-line bg-night-800 px-8 py-3 font-medium text-ink transition-all hover:border-gold-border hover:bg-gold-soft hover:text-gold active:scale-95"
          >
            联系我
          </a>
        </motion.div>
      </div>

      {/* 滚动提示 */}
      <motion.a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-ink-faint transition-colors hover:text-gold"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        aria-label="向下滚动"
      >
        <svg
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </motion.a>
    </section>
  );
}
