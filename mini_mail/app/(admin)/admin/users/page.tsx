import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const search = sp.search || "";
  const limit = 20;

  const where = search
    ? { OR: [{ name: { contains: search } }, { email: { contains: search } }] }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: { id: true, name: true, email: true, role: true, totalSpent: true, membershipTier: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">用户管理</h1>

      <form className="mb-4">
        <input
          name="search"
          defaultValue={search}
          placeholder="搜索用户名或邮箱..."
          className="w-full max-w-xs rounded border border-gray-300 px-3 py-2 text-sm"
        />
        <button type="submit" className="ml-2 rounded bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200">搜索</button>
      </form>

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-600">姓名</th>
              <th className="px-4 py-3 font-medium text-gray-600">邮箱</th>
              <th className="px-4 py-3 font-medium text-gray-600">角色</th>
              <th className="px-4 py-3 font-medium text-gray-600">累计消费</th>
              <th className="px-4 py-3 font-medium text-gray-600">会员等级</th>
              <th className="px-4 py-3 font-medium text-gray-600">注册时间</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900">{u.name || "—"}</td>
                <td className="px-4 py-3 text-gray-700">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${u.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}>
                    {u.role === "ADMIN" ? "管理员" : "用户"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-900">{formatPrice(u.totalSpent)}</td>
                <td className="px-4 py-3 text-gray-700">{u.membershipTier}</td>
                <td className="px-4 py-3 text-gray-500">{formatDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/admin/users?page=${p}${search ? `&search=${search}` : ""}`}
              className={`rounded px-3 py-1 text-sm ${p === page ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
