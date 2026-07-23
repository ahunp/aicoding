"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, ArrowLeft, Check } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import AddressCard from "@/components/address/AddressCard";
import AddressForm from "@/components/address/AddressForm";
import { toast } from "@/lib/toast";

interface Address {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "";
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!session?.user) { router.push("/login"); return; }
    fetchAddresses();
  }, [session]);

  async function fetchAddresses() {
    try {
      const res = await fetch("/api/user/addresses");
      const json = await res.json();
      if (json.data) setAddresses(json.data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }

  async function handleSave(data: { name: string; phone: string; province: string; city: string; district: string; detail: string; isDefault: boolean }) {
    setSaving(true);
    try {
      const url = editing ? `/api/user/addresses/${editing.id}` : "/api/user/addresses";
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) { const d = await res.json(); toast(d.error || "保存失败", "error"); return; }
      toast(editing ? "地址已更新" : "地址已添加", "success");
      setShowForm(false);
      setEditing(null);
      fetchAddresses();
    } catch { toast("保存失败", "error"); }
    finally { setSaving(false); }
  }

  function handleSelectAddress(addr: Address) {
    const url = callbackUrl ? `${callbackUrl}?addressId=${addr.id}` : "/profile/addresses";
    router.push(url);
  }

  async function handleDelete(id: string) {
    if (!confirm("确定删除这个地址？")) return;
    try {
      const res = await fetch(`/api/user/addresses/${id}`, { method: "DELETE" });
      if (!res.ok) return;
      toast("地址已删除", "success");
      fetchAddresses();
    } catch { toast("删除失败", "error"); }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push(callbackUrl || "/profile")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">{callbackUrl ? "选择收货地址" : "收货地址"}</h1>
        </div>
        {!showForm && (
          <Button onClick={() => { setEditing(null); setShowForm(true); }} variant="primary" size="sm">
            <Plus className="mr-1 h-4 w-4" /> 新增
          </Button>
        )}
      </div>
      {callbackUrl && (
        <p className="mb-4 text-sm text-muted-foreground">选择一个地址用于本次配送</p>
      )}

      {showForm && (
        <Card className="mb-6 p-4">
          <AddressForm
            key={editing?.id ?? "new"}
            initial={editing ?? undefined}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditing(null); }}
            saving={saving}
          />
        </Card>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />)}
        </div>
      ) : addresses.length === 0 && !showForm ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">还没有收货地址</p>
          <Button onClick={() => setShowForm(true)} variant="primary" className="mt-4">添加地址</Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {addresses.map((a) => (
            <div key={a.id} className="relative">
              <AddressCard address={a} onEdit={(addr) => { setEditing(addr); setShowForm(true); }} onDelete={handleDelete} />
              {callbackUrl && (
                <button
                  type="button"
                  onClick={() => handleSelectAddress(a)}
                  className="mt-1 flex w-full items-center justify-center gap-1 rounded-lg border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-100"
                >
                  <Check className="h-3 w-3" /> 选择此地址
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
