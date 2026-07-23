"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/lib/toast";
import Button from "@/components/ui/Button";
import { MapPin, ChevronRight, Plus } from "lucide-react";

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

export default function CheckoutButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  // Check if returning from address management with a selected address
  const preselected = searchParams.get("addressId");

  useEffect(() => {
    fetch("/api/user/addresses")
      .then((r) => r.json())
      .then((d) => {
        if (d.data) {
          setAddresses(d.data);
          // Priority: preselected from URL > default > first
          if (preselected) {
            setSelectedAddressId(preselected);
          } else {
            const def = d.data.find((a: Address) => a.isDefault);
            if (def) setSelectedAddressId(def.id);
            else if (d.data.length > 0) setSelectedAddressId(d.data[0].id);
          }
        }
      })
      .catch(() => {});
  }, [preselected]);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  async function handleCheckout() {
    if (!selectedAddressId) {
      toast("请先添加收货地址", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId: selectedAddressId }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast(data.error || "下单失败", "error");
        return;
      }

      toast("下单成功", "success");
      window.dispatchEvent(new CustomEvent("cart-updated"));
      router.push(`/orders/${data.data.id}/pay`);
      router.refresh();
    } catch {
      toast("下单失败，请稍后重试", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Address section */}
      <div>
        <p className="mb-2 text-sm font-medium text-foreground">收货地址</p>

        {selectedAddress ? (
          <div className="rounded-lg border border-border bg-surface p-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{selectedAddress.name}</span>
                    <span className="text-xs text-muted-foreground">{selectedAddress.phone}</span>
                    {selectedAddress.isDefault && (
                      <span className="rounded bg-primary-100 px-1.5 py-0.5 text-[10px] text-primary-700">默认</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {selectedAddress.province}{selectedAddress.city}{selectedAddress.district} {selectedAddress.detail}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => router.push("/profile/addresses?callbackUrl=/cart")}
            className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground hover:border-primary-300"
          >
            <Plus className="h-4 w-4" />
            添加收货地址
          </button>
        )}

        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => router.push("/profile/addresses?callbackUrl=/cart")}
            className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
          >
            切换地址 <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      <Button
        onClick={handleCheckout}
        disabled={loading || !selectedAddress}
        variant="accent"
        size="lg"
        className="w-full"
      >
        {loading ? "下单中..." : "去结算"}
      </Button>
    </div>
  );
}
