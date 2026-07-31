import type { Metadata } from "next";
import CursorTrail from "@/components/CursorTrail";
import ScrollProgress from "@/components/ScrollProgress";
import "./globals.css";

export const metadata: Metadata = {
  title: "胡金城 | 个人主页",
  description:
    "胡金城 — 计算机科学与技术本科，Java 后端开发方向，熟悉 Spring Boot、MySQL、Redis，熟练运用 Claude Code 等 AI 工具。",
  keywords: ["胡金城", "个人主页", "Java", "Spring Boot", "后端开发"],
  authors: [{ name: "胡金城" }],
  openGraph: {
    title: "胡金城 | 个人主页",
    description:
      "计算机科学与技术本科 · Java 后端开发 · AI 驱动开发实践者",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body className="font-sans">
        <CursorTrail />
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
