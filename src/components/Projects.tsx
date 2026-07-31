"use client";

import { useState } from "react";
import Reveal from "./Reveal";

const PROJECTS = [
  {
    title: "基于 Web 的大学生资料共享平台",
    role: "项目负责人",
    tag: "核心项目",
    description:
      "一款专为在校大学生打造的学习资料共享网站。通过 Web 进行文件共享并提供评分机制，采用前后端分离架构，有效解决了校园内复习文件检索难、质量无保障的痛点。",
    features: [
      "使用 Java + Spring Boot 搭建基础服务端工程，独立设计 MySQL 数据库的核心业务表",
      "提供账号注册登录、文件分类检索、资料存取、互动评价及排行榜机制",
      "用户端与管理端分离，管理端进行账号评论监管，避免恶意评论",
      "核心检索接口的平均响应时间稳定",
    ],
    techs: ["Java", "Spring Boot", "MySQL", "前后端分离"],
    featured: false,
  },
];

const BLOG = {
  title: "个人技术博客",
  platform: "CSDN",
  url: "https://blog.csdn.net/qq_65596720",
  views: "194,551",
  articles: 75,
  description:
    "持续输出 C / C++ 编程、数据结构与算法刷题笔记，记录从入门到进阶的学习成长与技术积累。",
  techs: ["C", "C++", "数据结构", "算法刷题"],
};

const FEATURED_PROJECT = {
  title: "「简购」轻量级电商网站",
  role: "项目负责人",
  tag: "★ 重点项目 · 已上线",
  online: "http://150.158.144.133:3000",
  demoAccount: { email: "admin@minimall.com", password: "admin123" },
  description:
    "面向 C 端的轻量级电商平台，支持用户注册登录、商品浏览与分类筛选、购物车管理、订单结算、会员等级与折扣体系、模拟支付全流程。后端集成管理后台，支持商品 / 订单 / 分类 / 用户的 CRUD 管理与仪表盘数据统计。",
  features: [
    "完整用户购物链路：注册 → 浏览 → 加购 → 结算 → 支付",
    "会员等级与折扣体系，支持差异化定价",
    "后端集成管理后台，支持商品 / 订单 / 分类 / 用户 CRUD 管理",
    "仪表盘数据统计，运营数据一目了然",
  ],
  techs: ["Java", "Spring Boot", "MySQL", "管理后台", "数据统计"],
};

export default function Projects() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  };

  return (
    <section id="projects" className="relative py-24">
      <div className="glow left-[-10%] top-[15%] h-[320px] w-[320px] bg-gold/8" />
      <div className="section-container relative">
        <Reveal>
          <h2 className="section-title">
            <span className="text-gradient">项目经历</span>
          </h2>
          <p className="section-subtitle">从 0 到 1 的完整交付实践</p>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-gold to-gold-deep px-4 py-1.5 text-xs font-semibold text-night-900 shadow-md shadow-gold/25">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                clipRule="evenodd"
              />
            </svg>
            重点项目支持在线体验
          </span>
        </Reveal>

        {/* 布局顺序：简购（全宽）→ 博客 + 资料平台（并排），由 grid order 控制 */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* ===== 个人技术博客 ===== */}
          <Reveal className="lg:order-2">
            <article className="card card-hover group relative flex h-full flex-col overflow-hidden p-8">
              {/* 顶部渐变条 */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold via-amber-400 to-gold-deep opacity-60 transition-opacity group-hover:opacity-100" />
              <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gold/8 blur-2xl" />

              <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
                {/* 左侧：博客信息 */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold leading-snug text-ink md:text-xl">
                      {BLOG.title}
                    </h3>
                    <span className="rounded-full bg-[#fc5531] px-3 py-1 text-xs font-bold text-white shadow-sm">
                      CSDN
                    </span>
                    <span className="rounded-full border border-gold-border bg-gold-soft px-3 py-1 text-xs text-gold">
                      原创内容 · 持续更新
                    </span>
                  </div>
                  <p className="mt-3 leading-relaxed text-ink-soft">
                    {BLOG.description}
                  </p>

                  {/* 数据统计 */}
                  <div className="mt-5 flex items-center gap-8">
                    <div>
                      <div className="text-3xl font-bold text-gradient">
                        {BLOG.views}
                      </div>
                      <div className="mt-1 text-xs text-ink-faint">总访问量</div>
                    </div>
                    <div className="h-10 w-px bg-white/10" />
                    <div>
                      <div className="text-3xl font-bold text-gradient">
                        {BLOG.articles}
                      </div>
                      <div className="mt-1 text-xs text-ink-faint">篇原创文章</div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {BLOG.techs.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg bg-gold-soft px-3 py-1 text-xs font-medium text-gold"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 右侧：访问按钮 */}
                <div className="shrink-0 md:border-l md:border-white/10 md:pl-8">
                  <a
                    href={BLOG.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-amber-500 px-6 py-3 font-semibold text-night-900 shadow-lg shadow-gold/25 transition-all hover:brightness-110 hover:shadow-gold/40 active:scale-95"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                      />
                    </svg>
                    访问博客
                    <svg className="h-3 w-3 text-night-900/60 transition-transform group-hover/btn:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </a>
                  <p className="mt-3 text-center text-xs text-ink-faint">
                    blog.csdn.net/qq_65596720
                  </p>
                </div>
              </div>
            </article>
          </Reveal>

          {/* ===== 重点推荐：简购（最上方全宽） ===== */}
          <Reveal className="lg:col-span-2 lg:order-first">
            <article className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gold via-gold-light to-gold-deep p-[2px] shadow-card-hover transition-shadow duration-300 hover:shadow-[0_0_60px_-12px_rgba(245,166,35,0.55)]">
              <div className="relative h-full overflow-hidden rounded-[14px] bg-night-800 p-8 md:p-10">
              {/* 顶部渐变条 + 浅色渐变背景 */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold via-gold-light to-gold-deep" />
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gold/8 blur-2xl transition-all group-hover:bg-gold/12" />
              <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-gold-deep/8 blur-2xl" />

              <div className="relative">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-ink md:text-2xl">
                        {FEATURED_PROJECT.title}
                      </h3>
                      <span className="rounded-full bg-gradient-to-r from-gold to-gold-deep px-3 py-1 text-xs font-semibold text-night-900 shadow-sm">
                        {FEATURED_PROJECT.tag}
                      </span>
                    </div>
                    <p className="mt-1 text-gold">{FEATURED_PROJECT.role}</p>
                  </div>

                  {/* 在线体验按钮（呼吸发光引导点击） */}
                  <div className="shrink-0">
                    <a
                      href={FEATURED_PROJECT.online}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn relative inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-deep px-7 py-3.5 text-base font-semibold text-night-900 shadow-lg shadow-gold/30 transition-all hover:brightness-110 active:scale-95 animate-pulse-glow"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                        />
                      </svg>
                      立即在线体验
                      <svg className="h-4 w-4 text-night-900/70 animate-bounce-x transition-transform group-hover/btn:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </a>
                    <p className="mt-2 text-center text-xs text-ink-faint">
                      无需注册 · 点击直达
                    </p>
                  </div>
                </div>

                {/* 模拟浏览器窗口：一眼看出是网站 */}
                <div className="mt-5 overflow-hidden rounded-xl border border-line bg-night-900/60 shadow-sm">
                  {/* 窗口标题栏 */}
                  <div className="flex items-center gap-2 border-b border-line bg-night-700 px-4 py-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <span className="ml-3 flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md bg-night-600 px-3 py-1 font-mono text-xs text-ink-faint ring-1 ring-line">
                      <svg className="h-3 w-3 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                        />
                      </svg>
                      {FEATURED_PROJECT.online.replace("http://", "")}
                    </span>
                  </div>
                  {/* 页面示意：导航 + 商品区 */}
                  <div className="px-4 py-3.5">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                        <span className="flex h-4 w-4 items-center justify-center rounded bg-gradient-to-br from-gold to-gold-deep text-[8px] font-bold text-night-900">
                          简
                        </span>
                        简购
                      </span>
                      <span className="flex gap-2">
                        <span className="h-2 w-8 rounded-full bg-white/10" />
                        <span className="h-2 w-8 rounded-full bg-white/10" />
                        <span className="h-2 w-8 rounded-full bg-white/10" />
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-4 gap-2.5">
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="rounded-lg border border-line bg-night-700 p-2">
                          <div
                            className={`h-8 rounded-md ${
                              i === 0
                                ? "bg-gradient-to-br from-gold/30 to-gold-deep/20"
                                : "bg-white/5"
                            }`}
                          />
                          <div className="mt-1.5 h-1.5 w-3/4 rounded-full bg-white/10" />
                          <div className="mt-1 h-1.5 w-1/2 rounded-full bg-white/10" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 演示账号 */}
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-dashed border-gold-border bg-gold-soft/40 px-5 py-3 text-sm">
                  <span className="flex items-center gap-1.5 font-medium text-gold">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                    管理员演示账号
                  </span>
                  <button
                    onClick={() => copy(FEATURED_PROJECT.demoAccount.email, "email")}
                    className="flex items-center gap-1.5 rounded-lg border border-line bg-night-800 px-3 py-1 font-mono text-ink-soft transition-all hover:border-gold hover:text-gold active:scale-95"
                    title="点击复制"
                  >
                    {FEATURED_PROJECT.demoAccount.email}
                    <svg className="h-3.5 w-3.5 text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                      />
                    </svg>
                    {copied === "email" ? "✓" : ""}
                  </button>
                  <button
                    onClick={() => copy(FEATURED_PROJECT.demoAccount.password, "password")}
                    className="flex items-center gap-1.5 rounded-lg border border-line bg-night-800 px-3 py-1 font-mono text-ink-soft transition-all hover:border-gold hover:text-gold active:scale-95"
                    title="点击复制"
                  >
                    {FEATURED_PROJECT.demoAccount.password}
                    <svg className="h-3.5 w-3.5 text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                      />
                    </svg>
                    {copied === "password" ? "✓" : ""}
                  </button>
                </div>

                <p className="mt-5 leading-relaxed text-ink-soft">
                  {FEATURED_PROJECT.description}
                </p>

                <ul className="mt-5 grid gap-2.5 md:grid-cols-2">
                  {FEATURED_PROJECT.features.map((feature, fi) => (
                    <li
                      key={fi}
                      className="flex gap-2 text-sm leading-relaxed text-ink-soft"
                    >
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-5">
                  {FEATURED_PROJECT.techs.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg bg-gold-soft px-3 py-1 text-xs font-medium text-gold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              </div>
            </article>
          </Reveal>

          {/* 其他项目 */}
          {PROJECTS.map((project, i) => (
            <Reveal key={project.title} delay={i * 0.12} className="lg:order-3">
              <article className="card card-hover group relative flex h-full flex-col overflow-hidden p-8">
                {/* 顶部渐变条 */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 to-gold opacity-60 transition-opacity group-hover:opacity-100" />

                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold leading-snug text-ink md:text-xl">
                    {project.title}
                  </h3>
                  <span className="shrink-0 rounded-full border border-gold-border bg-gold-soft px-3 py-1 text-xs text-gold">
                    {project.tag}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gold">
                  {project.role}
                </p>

                <p className="mt-4 leading-relaxed text-ink-soft">
                  {project.description}
                </p>

                <ul className="mt-5 flex-1 space-y-2.5">
                  {project.features.map((feature, fi) => (
                    <li
                      key={fi}
                      className="flex gap-2 text-sm leading-relaxed text-ink-soft"
                    >
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-5">
                  {project.techs.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg bg-gold-soft px-3 py-1 text-xs font-medium text-gold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
