import Card from "@/components/ui/Card";

const faqs = [
  { q: "如何注册账号？", a: "点击右上角「注册」按钮，填写邮箱和密码即可完成注册。" },
  { q: "如何下单？", a: "浏览商品 → 点击加入购物车 → 进入购物车 → 点击去结算即可下单。" },
  { q: "如何查看订单状态？", a: "登录后点击右上角用户菜单 → 我的订单，即可查看所有订单及状态。" },
  { q: "如何取消订单？", a: "在订单详情页中，如果订单状态为「待付款」，可以点击「取消订单」按钮。" },
  { q: "会员等级如何升级？", a: "会员等级根据累计消费金额自动升级：青铜(0+)、白银(¥1000+)、黄金(¥5000+)、铂金(¥10000+)、钻石(¥25000+)。" },
  { q: "会员折扣如何使用？", a: "会员折扣在下单时自动应用，无需手动输入优惠码。" },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold text-foreground">帮助中心</h1>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <Card key={i} className="p-6">
            <h3 className="font-medium text-foreground">{faq.q}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
