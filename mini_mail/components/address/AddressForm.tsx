"use client";

import { useState, useMemo } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { provinceList, getCities, getDistricts, isMunicipality } from "@/lib/regions";

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

  const cities = useMemo(() => form.province ? getCities(form.province) : [], [form.province]);
  const districts = useMemo(() => form.province && form.city ? getDistricts(form.province, form.city) : [], [form.province, form.city]);
  const isMunicipal = isMunicipality(form.province);

  function setProvince(val: string) {
    setForm({ ...form, province: val, city: "", district: "" });
  }

  function setCity(val: string) {
    setForm({ ...form, city: val, district: "" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.province) {
      alert("请填写完整地址信息");
      return;
    }
    if (!isMunicipal && !form.city) {
      alert("请选择城市");
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

      {/* Province / City / District cascading selects */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">省/直辖市</label>
          <select
            value={form.province}
            onChange={(e) => setProvince(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
            required
          >
            <option value="">请选择</option>
            {provinceList.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            {isMunicipal ? "城区" : "市"}
          </label>
          <select
            value={form.city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
            required={!isMunicipal}
            disabled={!form.province}
          >
            <option value="">{isMunicipal ? "请选择城区" : "请选择"}</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">区/县</label>
          <select
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
            disabled={!form.city}
          >
            <option value="">请选择</option>
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
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
