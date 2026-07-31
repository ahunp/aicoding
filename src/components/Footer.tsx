export default function Footer() {
  return (
    <footer className="border-t border-line bg-night-900/60 py-8">
      <div className="section-container flex flex-col items-center justify-between gap-4 text-sm text-ink-faint md:flex-row">
        <p>
          © {new Date().getFullYear()} 胡金城 · 个人主页
        </p>
        <p className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
          Powered by Next.js · Tailwind CSS · Framer Motion
        </p>
      </div>
    </footer>
  );
}
