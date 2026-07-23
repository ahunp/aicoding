import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Toaster from "@/components/ui/Toast";
import BackToTop from "@/components/ui/BackToTop";

export const metadata: Metadata = {
  title: { default: "简购 - 精选好物，简单购物", template: "%s - 简购" },
  description: "简购是一个精选电商平台，从数码到家居，精选优质商品，享受会员折扣。",
  openGraph: {
    title: "简购 - 精选好物，简单购物",
    description: "从数码到家居，精选优质商品，尽在简购。",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=ZCOOL+XiaoWei&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem("theme")||(window.matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light");if(t==="dark")document.documentElement.classList.add("dark")}catch(e){}})()`
        }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SessionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
          <BackToTop />
        </SessionProvider>
      </body>
    </html>
  );
}
