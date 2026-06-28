export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface py-6">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Mini Mall. 微型电商项目.</p>
      </div>
    </footer>
  );
}
