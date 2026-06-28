import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === "ADMIN";

  // Protected routes
  const protectedPaths = ["/cart", "/orders", "/profile"];
  const adminPaths = ["/admin"];

  const needsAuth = protectedPaths.some((p) => pathname.startsWith(p));
  const needsAdmin = adminPaths.some((p) => pathname.startsWith(p));

  if (needsAuth && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (needsAdmin && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/cart/:path*", "/orders/:path*", "/profile/:path*", "/admin/:path*"],
};
