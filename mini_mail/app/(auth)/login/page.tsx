import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import Card from "@/components/ui/Card";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <Card className="w-full max-w-sm p-6">
        <h1 className="mb-6 text-center text-xl font-semibold text-foreground">登录</h1>
        <LoginForm />
      </Card>
    </div>
  );
}
