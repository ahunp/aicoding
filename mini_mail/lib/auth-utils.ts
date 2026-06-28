import { hash, compare } from "bcryptjs";
import type { Session } from "next-auth";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

export async function getSession() {
  return auth();
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

export async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/login");
  }
  return session;
}

export function getUserId(session: Session | null): string {
  if (!session?.user?.id) throw new Error("Not authenticated");
  return session.user.id as string;
}
