export const MEMBERSHIP_TIERS = [
  { name: "BRONZE", label: "青铜", minSpent: 0, discountPct: 0 },
  { name: "SILVER", label: "白银", minSpent: 1000, discountPct: 3 },
  { name: "GOLD", label: "黄金", minSpent: 5000, discountPct: 5 },
  { name: "PLATINUM", label: "铂金", minSpent: 10000, discountPct: 8 },
  { name: "DIAMOND", label: "钻石", minSpent: 25000, discountPct: 12 },
] as const;

export type TierName = (typeof MEMBERSHIP_TIERS)[number]["name"];

export function getTierConfig(totalSpent: number) {
  for (let i = MEMBERSHIP_TIERS.length - 1; i >= 0; i--) {
    if (totalSpent >= MEMBERSHIP_TIERS[i].minSpent) {
      return MEMBERSHIP_TIERS[i];
    }
  }
  return MEMBERSHIP_TIERS[0];
}

export function getNextTier(tierName: TierName) {
  const idx = MEMBERSHIP_TIERS.findIndex((t) => t.name === tierName);
  return idx < MEMBERSHIP_TIERS.length - 1 ? MEMBERSHIP_TIERS[idx + 1] : null;
}

export function getTierName(totalSpent: number): TierName {
  return getTierConfig(totalSpent).name;
}

export function getTierLabel(tierName: string): string {
  const tier = MEMBERSHIP_TIERS.find((t) => t.name === tierName);
  return tier?.label ?? tierName;
}

export function getTierIndex(tierName: string): number {
  return MEMBERSHIP_TIERS.findIndex((t) => t.name === tierName);
}
