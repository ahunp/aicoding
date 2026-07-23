import Link from "next/link";
import { Home, Search } from "lucide-react";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-bold text-muted-foreground/20">404</p>
      <h1 className="mt-4 text-2xl font-bold text-foreground">页面不存在</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        你访问的页面不存在或已被移除
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/">
          <Button variant="primary">
            <Home className="mr-1.5 h-4 w-4" /> 返回首页
          </Button>
        </Link>
        <Link href="/products">
          <Button variant="outline">
            <Search className="mr-1.5 h-4 w-4" /> 去购物
          </Button>
        </Link>
      </div>
    </div>
  );
}
