import Link from "next/link";
import { auth } from "@/lib/auth";
import UserMenu from "./UserMenu";
import CartIcon from "./CartIcon";

export default async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold text-blue-600">
            Mini Mall
          </Link>
          <nav className="hidden items-center gap-4 sm:flex">
            <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900">
              商品
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {session?.user && <CartIcon />}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
