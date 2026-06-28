import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTierConfig, getNextTier } from "@/lib/membership";
import MembershipCard from "@/components/membership/MembershipCard";
import Card from "@/components/ui/Card";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) redirect("/login");

  const currentTier = getTierConfig(user.totalSpent);
  const nextTier = getNextTier(currentTier.name);

  const membershipData = {
    currentTier: currentTier.name,
    currentLabel: currentTier.label,
    discountPct: currentTier.discountPct,
    totalSpent: user.totalSpent,
    nextTier: nextTier
      ? { name: nextTier.name, label: nextTier.label, minSpent: nextTier.minSpent }
      : null,
    amountToNext: nextTier ? Math.max(0, nextTier.minSpent - user.totalSpent) : 0,
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">个人中心</h1>

      <div className="space-y-4">
        <Card>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">姓名</span>
              <span className="text-foreground">{user.name || "未设置"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">邮箱</span>
              <span className="text-foreground">{user.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">角色</span>
              <span className="text-foreground">
                {user.role === "ADMIN" ? "管理员" : "普通用户"}
              </span>
            </div>
          </div>
        </Card>

        <MembershipCard data={membershipData} />
      </div>
    </div>
  );
}
