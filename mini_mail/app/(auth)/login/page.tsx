import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import Card from "@/components/ui/Card";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Decorative panel - hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 items-center justify-center p-12">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold">Mini Mall</h2>
          <p className="mt-4 text-white/70">发现精选好物，享受会员折扣</p>
          <div className="mt-8 flex justify-center gap-3">
            <div className="h-16 w-16 rounded-full bg-white/10" />
            <div className="h-16 w-16 rounded-full bg-white/15" />
            <div className="h-16 w-16 rounded-full bg-white/10" />
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex w-full items-center justify-center md:w-1/2 p-4">
        <Card className="w-full max-w-sm p-8 shadow-lg">
          <h1 className="mb-6 text-center text-xl font-semibold text-foreground">登录</h1>
          <LoginForm />
        </Card>
      </div>
    </div>
  );
}
