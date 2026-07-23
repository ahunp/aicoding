"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface AddressFormData {
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

interface AddressFormProps {
  initial?: Partial<AddressFormData>;
  onSave: (data: AddressFormData) => Promise<void>;
  onCancel?: () => void;
  saving?: boolean;
}

export default function AddressForm({ initial, onSave, onCancel, saving }: AddressFormProps) {
  const [form, setForm] = useState<AddressFormData>({
    name: initial?.name ?? "",
    phone: initial?.phone ?? "",
    province: initial?.province ?? "",
    city: initial?.city ?? "",
    district: initial?.district ?? "",
    detail: initial?.detail ?? "",
    isDefault: initial?.isDefault ?? false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.province || !form.city || !form.detail) {
      alert("请填写完整地址信息");
      return;
    }
    await onSave(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Input label="收货人" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Input label="手机号" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Input label="省" value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} required />
        <Input label="市" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
        <Input label="区" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
      </div>
      <Input label="详细地址" value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} required />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="rounded border-border" />
        设为默认地址
      </label>
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>{saving ? "保存中..." : "保存"}</Button>
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>取消</Button>}
      </div>
    </form>
  );
}
