import TierBadge from "./TierBadge";

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
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-sm font-medium text-gray-900">我的会员</h2>

      <div className="flex items-center gap-3">
        <TierBadge tier={data.currentTier} label={data.currentLabel} />
        <span className="text-sm text-gray-600">
          已消费 ¥{data.totalSpent.toFixed(2)}
        </span>
      </div>

      <p className="mt-3 text-sm text-gray-600">
        当前享受 <strong className="text-blue-600">{data.discountPct}%</strong> 折扣
      </p>

      {data.nextTier && (
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-gray-500">
            <span>下一等级: {data.nextTier.label}</span>
            <span>
              ¥{data.totalSpent.toFixed(0)} / ¥{data.nextTier.minSpent}
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-blue-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            再消费 ¥{data.amountToNext.toFixed(0)} 即可升级
          </p>
        </div>
      )}

      {!data.nextTier && (
        <p className="mt-3 text-xs text-gray-500">已达最高会员等级</p>
      )}
    </div>
  );
}
