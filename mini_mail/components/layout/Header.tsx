import Link from "next/link";
import { Store } from "lucide-react";
import { auth } from "@/lib/auth";
import UserMenu from "./UserMenu";
import CartIcon from "./CartIcon";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-surface/80 backdrop-blur-xl supports-[backdrop-filter]:bg-surface/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary-600">
            <Store className="h-5 w-5" />
            <span className="hidden sm:inline">Mini Mall</span>
          </Link>
          <nav className="hidden items-center gap-6 sm:flex">
            <Link href="/products" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              商品
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session?.user && <CartIcon />}
          <UserMenu />
        </div>
      </div>

      {/* Scroll shadow */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-b from-black/[0.04] to-transparent" />
    </header>
  );
}
