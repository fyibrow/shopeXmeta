"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(authError ? "Login gagal. Coba lagi." : "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"
    >
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Admin Login</h1>
      <p className="mb-6 text-sm text-slate-500">
        Masuk dengan akun Supabase Auth Anda
      </p>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <label className="mb-1 block text-xs font-semibold uppercase text-slate-400">
        Email
      </label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400"
        placeholder="admin@example.com"
      />

      <label className="mb-1 block text-xs font-semibold uppercase text-slate-400">
        Password
      </label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="mb-6 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400"
        placeholder="••••••••"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-slate-900 py-3.5 font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
      >
        {loading ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}
