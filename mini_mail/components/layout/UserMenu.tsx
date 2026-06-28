"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { User } from "lucide-react";
import Button from "@/components/ui/Button";

export default function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  if (!session?.user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          登录
        </Link>
        <Link href="/register">
          <Button size="sm">注册</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded px-2 py-1 text-sm text-muted-foreground hover:bg-muted"
      >
        <User className="h-5 w-5" />
        <span>{session.user.name || session.user.email}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-48 rounded-lg border border-border bg-surface py-1 shadow-lg">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              个人中心
            </Link>
            <Link
              href="/orders"
              className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              我的订单
            </Link>
            {session.user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                管理后台
              </Link>
            )}
            <hr className="my-1 border-border" />
            <button
              onClick={() => signOut()}
              className="block w-full px-4 py-2 text-left text-sm text-danger-500 hover:bg-muted"
            >
              退出登录
            </button>
          </div>
        </>
      )}
    </div>
  );
}
