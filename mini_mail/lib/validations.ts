import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "姓名至少2个字符").max(50).optional(),
  email: z.string().email("请输入有效的邮箱"),
  password: z.string().min(6, "密码至少6个字符").max(100),
});

export const loginSchema = z.object({
  email: z.string().email("请输入有效的邮箱"),
  password: z.string().min(1, "请输入密码"),
});

export const productSchema = z.object({
  name: z.string().min(1, "商品名称不能为空").max(200),
  description: z.string().optional(),
  price: z.number().positive("价格必须大于0"),
  imageUrl: z.string().optional(),
  stock: z.number().int().min(0, "库存不能为负数").default(0),
  categoryId: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

export const categorySchema = z.object({
  name: z.string().min(1, "分类名称不能为空").max(100),
  description: z.string().optional(),
});

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive("数量必须大于0").default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive("数量必须大于0"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type CartItemInput = z.infer<typeof cartItemSchema>;
