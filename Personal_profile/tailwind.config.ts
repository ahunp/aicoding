import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // 背景（映射 CSS 变量）
        night: {
          900: "var(--bg-primary)",
          800: "var(--bg-card)",
          700: "var(--bg-card-hover)",
          600: "var(--bg-elevated)",
        },
        // 金色主色
        gold: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          light: "var(--color-primary-light)",
          deep: "var(--color-primary-deep)",
          soft: "var(--color-primary-soft)",
          "soft-strong": "var(--color-primary-soft-strong)",
          border: "var(--color-primary-border)",
        },
        // 文字
        ink: {
          DEFAULT: "var(--text-primary)",
          soft: "var(--text-secondary)",
          faint: "var(--text-muted)",
        },
        // 通用边框
        line: "var(--border)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "PingFang SC",
          "Hiragino Sans GB",
          "Microsoft YaHei",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(245, 166, 35, 0.5)" },
          "50%": { boxShadow: "0 0 0 14px rgba(245, 166, 35, 0)" },
        },
        "bounce-x": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(5px)" },
        },
        wobble: {
          "0%, 100%": { transform: "translate(-50%, 0) rotate(-3deg)" },
          "50%": { transform: "translate(-50%, -6px) rotate(3deg)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        blink: "blink 1s step-end infinite",
        gradient: "gradient 8s ease infinite",
        "spin-slow": "spin-slow 10s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-out infinite",
        "bounce-x": "bounce-x 1.2s ease-in-out infinite",
        wobble: "wobble 1.6s ease-in-out infinite",
      },
      boxShadow: {
        card: "0 4px 24px -8px rgba(245, 166, 35, 0.1)",
        "card-hover": "0 16px 48px -12px rgba(245, 166, 35, 0.22)",
      },
    },
  },
  plugins: [],
};

export default config;
