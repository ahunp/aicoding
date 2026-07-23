import Card from "@/components/ui/Card";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold text-foreground">关于简购</h1>

      <div className="space-y-6">
        <Card className="p-8">
          <h2 className="mb-3 text-lg font-semibold text-foreground">我们的故事</h2>
          <p className="leading-relaxed text-muted-foreground">
            简购是一个轻量级电商平台，致力于为用户提供简洁、高效的购物体验。
            我们精选优质商品，从数码到家居，让每一次购物都简单愉快。
          </p>
        </Card>

        <Card className="p-8">
          <h2 className="mb-3 text-lg font-semibold text-foreground">技术栈</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {[
              { name: "Next.js 16", desc: "React 框架" },
              { name: "TypeScript", desc: "类型安全" },
              { name: "Prisma 5", desc: "ORM 数据库" },
              { name: "TailwindCSS 4", desc: "样式系统" },
              { name: "Auth.js v5", desc: "用户认证" },
              { name: "SQLite", desc: "轻量数据库" },
            ].map((tech) => (
              <div key={tech.name} className="rounded-lg bg-muted p-4">
                <p className="font-medium text-foreground">{tech.name}</p>
                <p className="text-xs text-muted-foreground">{tech.desc}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="mb-3 text-lg font-semibold text-foreground">联系我们</h2>
          <p className="text-sm text-muted-foreground">
            如有问题或建议，欢迎通过邮件联系我们。
          </p>
          <p className="mt-2 text-sm text-primary-600">contact@jiangou.com</p>
        </Card>
      </div>
    </div>
  );
}
