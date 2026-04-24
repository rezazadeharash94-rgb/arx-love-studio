import { loginAction } from "@/lib/actions";
import { Lock } from "lucide-react";

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center justify-center p-5">
      <section className="shell-strong w-full p-8">
        <div className="mb-6 inline-flex rounded-2xl bg-white/70 p-4 text-gold">
          <Lock className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-black">ورود به پنل آرش و رکسانا</h1>
        <p className="mt-3 text-sm font-bold leading-7 text-stone-500">برای مدیریت سایت، PIN اختصاصی را وارد کن.</p>
        {searchParams.error && <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-black text-red-600">PIN اشتباه است.</div>}
        <form action={loginAction} className="mt-6 grid gap-4">
          <input className="input" name="pin" type="password" placeholder="PIN" />
          <button className="btn-primary">ورود</button>
        </form>
      </section>
    </main>
  );
}
