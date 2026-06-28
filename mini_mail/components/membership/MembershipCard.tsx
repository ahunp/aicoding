import TierBadge from "./TierBadge";
import Card from "@/components/ui/Card";

interface MembershipData {
  currentTier: string;
  currentLabel: string;
  discountPct: number;
  totalSpent: number;
  nextTier: { name: string; label: string; minSpent: number } | null;
  amountToNext: number;
}

export default function MembershipCard({ data }: { data: MembershipData }) {
  const progress = data.nextTier
    ? Math.min(100, (data.totalSpent / data.nextTier.minSpent) * 100)
    : 100;

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-sm font-medium text-foreground">我的会员</h2>

      <div className="flex items-center gap-3">
        <TierBadge tier={data.currentTier} label={data.currentLabel} />
        <span className="text-sm text-muted-foreground">
          已消费 ¥{data.totalSpent.toFixed(2)}
        </span>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        当前享受 <strong className="text-primary-600">{data.discountPct}%</strong> 折扣
      </p>

      {data.nextTier && (
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-muted-foreground">
            <span>下一等级: {data.nextTier.label}</span>
            <span>
              ¥{data.totalSpent.toFixed(0)} / ¥{data.nextTier.minSpent}
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            再消费 ¥{data.amountToNext.toFixed(0)} 即可升级
          </p>
        </div>
      )}

      {!data.nextTier && (
        <p className="mt-3 text-xs text-muted-foreground">已达最高会员等级</p>
      )}
    </Card>
  );
}
