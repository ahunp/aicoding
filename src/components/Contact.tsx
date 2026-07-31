"use client";

import { useState } from "react";
import Reveal from "./Reveal";

const CONTACT_ITEMS = [
  {
    label: "电话",
    value: "13065418282",
    href: "tel:13065418282",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
        />
      </svg>
    ),
  },
  {
    label: "邮箱",
    value: "2276303879@qq.com",
    href: "mailto:2276303879@qq.com",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
        />
      </svg>
    ),
  },
  {
    label: "微信",
    value: "hjc13065418282",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
        />
      </svg>
    ),
  },
];

export default function Contact() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  };

  return (
    <section id="contact" className="relative py-24">
      <div className="glow left-1/2 top-[10%] h-[360px] w-[360px] -translate-x-1/2 bg-gold/8" />
      <div className="section-container relative">
        <Reveal>
          <h2 className="section-title text-center">
            <span className="text-gradient">联系方式</span>
          </h2>
          <p className="section-subtitle text-center">
            期待与您交流合作，点击卡片即可快速联系
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {CONTACT_ITEMS.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.1}>
              <div className="card card-hover group h-full p-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-soft text-gold transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-gold group-hover:to-gold-deep group-hover:text-night-900">
                  {item.icon}
                </div>
                <div className="text-sm text-ink-faint">{item.label}</div>
                <div className="mt-1 break-all font-medium text-ink">
                  {item.href ? (
                    <a href={item.href} className="transition-colors hover:text-gold">
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </div>
                <button
                  onClick={() => copy(item.value, item.label)}
                  className="mt-4 rounded-lg border border-line bg-night-700 px-4 py-1.5 text-xs text-ink-faint transition-all hover:border-gold-border hover:bg-gold-soft hover:text-gold active:scale-95"
                >
                  {copied === item.label ? "✓ 已复制" : "复制"}
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
