"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getTierConfig, getNextTier } from "@/lib/membership";
import { formatDate } from "@/lib/utils";
import { toast } from "@/lib/toast";
import MembershipCard from "@/components/membership/MembershipCard";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { User, Package, Calendar, MapPin, Heart, Clock, MessageSquare } from "lucide-react";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [membershipData, setMembershipData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit name
  const [editName, setEditName] = useState("");
  const [nameSaving, setNameSaving] = useState(false);

  // Change password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    fetchUser();
  }, [session]);

  async function fetchUser() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/user");
      if (!res.ok) {
        setError("API 返回 " + res.status + " " + res.statusText);
        return;
      }
      const json = await res.json();
      if (json.data?.user) {
        setUser(json.data.user);
        setEditName(json.data.user.name || "");
        setMembershipData(json.data.membership);
      } else {
        setError(json.error || "未知错误");
      }
    } catch {
      setError("网络请求失败");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveName() {
    if (!editName.trim()) return;
    setNameSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        toast("姓名已更新", "success");
        setUser((prev: any) => ({ ...prev, name: editName.trim() }));
        update();
      } else {
        toast(data.error || "更新失败", "error");
      }
    } catch {
      toast("更新失败", "error");
    } finally {
      setNameSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    setPwSaving(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast("密码已修改", "success");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        toast(data.error || "修改失败", "error");
      }
    } catch {
      toast("修改失败", "error");
    } finally {
      setPwSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="space-y-4">
          <div className="h-8 w-28 animate-pulse rounded bg-muted" />
          <div className="h-40 animate-pulse rounded-lg bg-muted" />
          <div className="h-48 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Card className="p-6 text-center">
          <p className="text-danger-500 font-medium">加载失败</p>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <Button onClick={fetchUser} className="mt-4">重试</Button>
        </Card>
      </div>
    );
  }

  if (!user) return null;

  const finalMembershipData = membershipData || (() => {
    const ct = getTierConfig(user.totalSpent || 0);
    const nt = getNextTier(ct.name);
    return {
      currentTier: ct.name,
      currentLabel: ct.label,
      discountPct: ct.discountPct,
      totalSpent: user.totalSpent || 0,
      nextTier: nt ? { name: nt.name, label: nt.label, minSpent: nt.minSpent } : null,
      amountToNext: nt ? Math.max(0, nt.minSpent - (user.totalSpent || 0)) : 0,
    };
  })();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">个人中心</h1>

      <div className="space-y-6">
        {/* User Info Card */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium text-foreground">{user.name || "未设置"}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>注册时间：{user.createdAt ? formatDate(user.createdAt) : "—"}</span>
            </div>
          </div>
        </Card>

        {/* Edit Name */}
        <Card className="p-6">
          <h2 className="mb-3 text-sm font-medium text-foreground">修改姓名</h2>
          <div className="flex gap-2">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="你的名字"
              className="flex-1"
            />
            <Button onClick={handleSaveName} disabled={nameSaving}>
              {nameSaving ? "保存中..." : "保存"}
            </Button>
          </div>
        </Card>

        {/* Change Password */}
        <Card className="p-6">
          <h2 className="mb-3 text-sm font-medium text-foreground">修改密码</h2>
          <form onSubmit={handleChangePassword} className="space-y-3">
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="当前密码"
              required
            />
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="新密码（至少 6 位）"
              minLength={6}
              required
            />
            <Button type="submit" disabled={pwSaving} variant="secondary">
              {pwSaving ? "修改中..." : "修改密码"}
            </Button>
          </form>
        </Card>

        {/* My Orders Entry */}
        <Card className="p-6">
          <button
            onClick={() => router.push("/orders")}
            className="flex w-full items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">我的订单</p>
                <p className="text-xs text-muted-foreground">查看订单历史</p>
              </div>
            </div>
            <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </Card>

        {/* Addresses Entry */}
        <Card className="p-6">
          <button
            onClick={() => router.push("/profile/addresses")}
            className="flex w-full items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <MapPin className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">收货地址</p>
                <p className="text-xs text-muted-foreground">管理收货地址</p>
              </div>
            </div>
            <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </Card>

        {/* Wishlist Entry */}
        <Card className="p-6">
          <button onClick={() => router.push("/profile/wishlist")} className="flex w-full items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Heart className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">我的收藏</p>
                <p className="text-xs text-muted-foreground">收藏的商品</p>
              </div>
            </div>
            <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </Card>

        {/* History Entry */}
        <Card className="p-6">
          <button onClick={() => router.push("/profile/history")} className="flex w-full items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">浏览历史</p>
                <p className="text-xs text-muted-foreground">最近看过的商品</p>
              </div>
            </div>
            <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </Card>

        {/* My Reviews */}
        <Card className="p-6">
          <button onClick={() => router.push("/profile/reviews")} className="flex w-full items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">我的评价</p>
                <p className="text-xs text-muted-foreground">查看和管理的评价</p>
              </div>
            </div>
            <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </Card>

        {/* Membership */}
        <MembershipCard data={finalMembershipData} />
      </div>
    </div>
  );
}
