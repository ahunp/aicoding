const tierColors: Record<string, string> = {
  BRONZE: "bg-amber-100 text-amber-800",
  SILVER: "bg-gray-100 text-gray-700",
  GOLD: "bg-yellow-100 text-yellow-800",
  PLATINUM: "bg-blue-100 text-blue-800",
  DIAMOND: "bg-purple-100 text-purple-800",
};

export default function TierBadge({ tier, label }: { tier: string; label: string }) {
  const color = tierColors[tier] || "bg-gray-100 text-gray-700";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${color}`}>
      {label}
    </span>
  );
}
