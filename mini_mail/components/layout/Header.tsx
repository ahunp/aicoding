import Link from "next/link";
import { Store, Zap, Crown } from "lucide-react";
import { auth } from "@/lib/auth";
import CategoryMenu from "./CategoryMenu";
import UserMenu from "./UserMenu";
import CartIcon from "./CartIcon";
import ThemeToggle from "@/components/ui/ThemeToggle";
import SearchBar from "./SearchBar";
import AnnouncementBar from "./AnnouncementBar";

export default async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl supports-[backdrop-filter]:bg-surface/60">
      <AnnouncementBar />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between border-b border-border/50 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary-600">
            <Store className="h-5 w-5" />
            <span className="hidden sm:inline">简购</span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            <CategoryMenu />
            <Link href="/products?section=deals" className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <Zap className="h-3.5 w-3.5 text-accent-500" />
              限时抢购
            </Link>
            <Link href="/profile" className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <Crown className="h-3.5 w-3.5 text-primary-500" />
              会员
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <SearchBar />
          </div>
          <ThemeToggle />
          {session?.user && <CartIcon />}
          <UserMenu />
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-b from-black/[0.04] to-transparent" />
    </header>
  );
}
