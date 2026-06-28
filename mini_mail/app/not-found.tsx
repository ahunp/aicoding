import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-muted">404</h1>
        <p className="mt-4 text-lg text-muted-foreground">页面不存在</p>
        <Link
          href="/"
          className={buttonVariants({ variant: "primary", className: "mt-6" })}
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
