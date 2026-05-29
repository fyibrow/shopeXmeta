import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <Suspense
        fallback={
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center text-sm text-slate-500">
            Memuat...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
