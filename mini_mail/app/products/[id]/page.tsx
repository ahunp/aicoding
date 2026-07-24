import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Package, Crown } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import AddToCartButton from "@/components/cart/AddToCartButton";
import ReviewList from "@/components/products/ReviewList";
import ReviewStars from "@/components/products/ReviewStars";
import FavoriteButton from "@/components/products/FavoriteButton";
import TrackView from "@/components/products/TrackView";
import ProductImageCarousel from "@/components/products/ProductImageCarousel";
import { getTierLabel, getTierIndex } from "@/lib/membership";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const session = await auth();

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, images: { orderBy: { sort: "asc" } } },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  // Fetch reviews
  const [reviewsData, reviewsStats] = await Promise.all([
    prisma.review.findMany({
      where: { productId: product.id },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.review.aggregate({
      where: { productId: product.id },
      _avg: { rating: true },
      _count: true,
    }),
  ]);

  // Check member-exclusive tier restriction
  let memberTierBlock = false;
  let minTierLabel = "";
  if (product.isMemberExclusive && session?.user) {
    const [settings, user] = await Promise.all([
      prisma.memberSettings.findUnique({ where: { id: "singleton" } }),
      prisma.user.findUnique({ where: { id: session.user.id }, select: { membershipTier: true } }),
    ]);
    const minTier = settings?.minTierForExclusive ?? "GOLD";
    minTierLabel = getTierLabel(minTier);
    const userTierIndex = getTierIndex(user?.membershipTier ?? "BRONZE");
    const requiredIndex = getTierIndex(minTier);
    if (userTierIndex < requiredIndex) {
      memberTierBlock = true;
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <TrackView productId={product.id} />
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <a href="/" className="hover:text-foreground">首页</a>
        <span>/</span>
        {product.category && (
          <>
            <a href={`/products?category=${product.categoryId}`} className="hover:text-foreground">{product.category.name}</a>
            <span>/</span>
          </>
        )}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Image carousel */}
        <ProductImageCarousel
          images={product.images.length > 0 ? product.images.map((i) => i.url) : (product.imageUrl ? [product.imageUrl] : [])}
          alt={product.name}
        />

        {/* Info */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {product.category && (
              <Badge>{product.category.name}</Badge>
            )}
            {product.isMemberExclusive && (
              <Badge variant="info">会员专享</Badge>
            )}
            {product.isFlashDeal && (
              <Badge variant="danger">限时抢购</Badge>
            )}
          </div>

          <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-price">
                {product.isFlashDeal && product.flashDealDiscount > 0
                  ? formatPrice(product.price * (1 - product.flashDealDiscount / 100))
                  : formatPrice(product.price)}
              </p>
              {product.isFlashDeal && product.flashDealDiscount > 0 && (
                <>
                  <span className="text-lg text-muted-foreground line-through">{formatPrice(product.price)}</span>
                  <span className="rounded bg-danger-500 px-1.5 py-0.5 text-xs font-bold text-white">-{product.flashDealDiscount}%</span>
                </>
              )}
            </div>
            <FavoriteButton productId={product.id} />
          </div>

          <p className={`text-sm ${product.stock > 0 ? "text-success-500" : "text-danger-500"}`}>
            {product.stock > 0 ? `库存: ${product.stock} 件` : "暂时缺货"}
          </p>

          {product.description && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}

          {session?.user && !memberTierBlock && (
            <AddToCartButton productId={product.id} disabled={product.stock <= 0} />
          )}

          {session?.user && memberTierBlock && (
            <div className="rounded-lg bg-warning-50 p-4 text-center">
              <Crown className="mx-auto mb-1 h-6 w-6 text-warning-500" />
              <p className="text-sm font-medium text-warning-700">
                需要 {minTierLabel} 及以上等级才能购买
              </p>
            </div>
          )}

          {!session?.user && (
            <p className="text-sm text-muted-foreground">
              请先<a href="/login" className="text-primary-600 hover:underline"> 登录 </a>
              以加入购物车
            </p>
          )}
        </div>
      </div>

      {/* Reviews section */}
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="mb-4 text-lg font-bold text-foreground">商品评价</h2>
        <ReviewList
          reviews={reviewsData.map((r) => ({ id: r.id, rating: r.rating, content: r.content, createdAt: r.createdAt.toISOString(), user: r.user }))}
          avgRating={reviewsStats._avg.rating ?? 0}
          total={reviewsStats._count}
        />
        {reviewsData.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">暂无评价，快来第一个评价吧</p>
        )}
      </section>
    </div>
  );
}
