import Link from "next/link";
import { Home } from "lucide-react";
import Button from "@/components/ui/Button";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-bold text-muted-foreground/20">404</p>
      <h1 className="mt-4 text-xl font-bold text-foreground">页面不存在</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        管理后台找不到这个页面
      </p>
      <div className="mt-8">
        <Link href="/admin">
          <Button variant="primary">
            <Home className="mr-1.5 h-4 w-4" /> 返回仪表盘
          </Button>
        </Link>
      </div>
    </div>
  );
}
