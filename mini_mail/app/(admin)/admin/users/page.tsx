import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { getTierLabel } from "@/lib/membership";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Link from "next/link";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    role?: string;
    tier?: string;
  }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const search = sp.search || "";
  const roleFilter = sp.role || "";
  const tierFilter = sp.tier || "";
  const limit = 20;

  const where: any = {};
  if (search) {
    where.OR = [{ name: { contains: search } }, { email: { contains: search } }];
  }
  if (roleFilter) where.role = roleFilter;
  if (tierFilter) where.membershipTier = tierFilter;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: { id: true, name: true, email: true, role: true, totalSpent: true, membershipTier: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  const tiers = ["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"];
  const roles = ["USER", "ADMIN"];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">用户管理</h1>

      <form className="mb-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          <Input
            name="search"
            defaultValue={search}
            placeholder="搜索用户名或邮箱..."
            className="max-w-xs"
          />
          <select name="role" defaultValue={roleFilter} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm">
            <option value="">全部角色</option>
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <select name="tier" defaultValue={tierFilter} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm">
            <option value="">全部等级</option>
            {tiers.map((t) => (
              <option key={t} value={t}>{getTierLabel(t)}</option>
            ))}
          </select>
          <Button type="submit" variant="secondary">筛选</Button>
          {(search || roleFilter || tierFilter) && (
            <Link href="/admin/users" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              清空
            </Link>
          )}
        </div>
        <p className="text-xs text-muted-foreground">共 {total} 位用户</p>
      </form>

      <Card className="overflow-x-auto" padding={false}>
        <table className="w-full text-sm">
          <thead className="border-b bg-muted text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">姓名</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">邮箱</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">角色</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">累计消费</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">会员等级</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">注册时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  没有找到匹配的用户
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-muted">
                  <td className="px-4 py-3 text-foreground">{u.name || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant={u.role === "ADMIN" ? "info" : "default"}>
                      {u.role === "ADMIN" ? "管理员" : "用户"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-foreground">{formatPrice(u.totalSpent)}</td>
                  <td className="px-4 py-3"><Badge variant={(u.membershipTier || "").toLowerCase() as any}>{getTierLabel(u.membershipTier)}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(u.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const params = new URLSearchParams();
            params.set("page", String(p));
            if (search) params.set("search", search);
            if (roleFilter) params.set("role", roleFilter);
            if (tierFilter) params.set("tier", tierFilter);
            return (
              <a
                key={p}
                href={`/admin/users?${params.toString()}`}
                className={`rounded px-3 py-1 text-sm ${p === page ? "bg-primary-600 text-white" : "bg-muted text-foreground hover:bg-muted-foreground/20"}`}
              >
                {p}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
