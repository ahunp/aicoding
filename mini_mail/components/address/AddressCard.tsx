import { MapPin, Pencil, Trash2 } from "lucide-react";

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

interface AddressCardProps {
  address: Address;
  onEdit?: (a: Address) => void;
  onDelete?: (id: string) => void;
  selected?: boolean;
  onSelect?: (a: Address) => void;
}

export default function AddressCard({ address, onEdit, onDelete, selected, onSelect }: AddressCardProps) {
  const showActions = onEdit && onDelete;

  const body = (
    <div className={`relative rounded-lg border p-4 text-left transition-all ${
      selected ? "border-primary-500 bg-primary-50" : "border-border bg-surface hover:border-primary-300"
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <MapPin className={`h-4 w-4 ${selected ? "text-primary-500" : "text-muted-foreground"}`} />
          <span className="font-medium text-foreground">{address.name}</span>
          <span className="text-sm text-muted-foreground">{address.phone}</span>
          {address.isDefault && (
            <span className="rounded bg-primary-100 px-1.5 py-0.5 text-[10px] text-primary-700">默认</span>
          )}
        </div>
        {showActions && (
          <div className="flex gap-1 shrink-0">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onEdit(address); }}
              className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDelete(address.id); }}
              className="rounded p-1.5 text-muted-foreground hover:bg-danger-50 hover:text-danger-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {address.province}{address.city}{address.district} {address.detail}
      </p>
    </div>
  );

  if (onSelect) {
    return (
      <button type="button" onClick={() => onSelect(address)} className="w-full text-left">
        {body}
      </button>
    );
  }

  return body;
}
