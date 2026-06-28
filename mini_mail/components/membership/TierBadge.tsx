import Badge from "@/components/ui/Badge";

const tierToVariant: Record<string, string> = {
  BRONZE: "bronze",
  SILVER: "silver",
  GOLD: "gold",
  PLATINUM: "platinum",
  DIAMOND: "diamond",
};

export default function TierBadge({ tier, label }: { tier: string; label: string }) {
  const variant = tierToVariant[tier] || "default";

  return <Badge variant={variant as any}>{label}</Badge>;
}
