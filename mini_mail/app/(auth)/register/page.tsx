import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/auth/RegisterForm";

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <div className="w-full max-w-sm rounded-lg border p-6 shadow-sm">
        <h1 className="mb-6 text-center text-xl font-semibold">注册</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
