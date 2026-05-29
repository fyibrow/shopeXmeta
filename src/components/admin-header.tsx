"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AdminHeader({ email }: { email: string }) {
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">ShopeXmeta</h1>
        <p className="text-sm text-slate-500">Admin · Facebook affiliate</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-slate-500 sm:inline">{email}</span>
        <button
          type="button"
          onClick={logout}
          className="rounded-lg bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
