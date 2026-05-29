"use client";

import { useCallback, useEffect, useState } from "react";
import type { Link } from "@/lib/supabase/types";

export function LinksList({ refreshKey }: { refreshKey: number }) {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const siteUrl =
    typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
      : "";

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/links");
    const json = await res.json();
    setLinks(json.links ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  async function remove(id: string) {
    if (!confirm("Hapus link ini?")) return;
    await fetch(`/api/links?id=${id}`, { method: "DELETE" });
    load();
  }

  function copy(url: string) {
    navigator.clipboard.writeText(url);
    alert("Disalin!");
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Memuat daftar link...</p>;
  }

  if (links.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
        Belum ada link. Buat dari generator di atas.
      </p>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {links.map((link) => {
        const redirectUrl = `${siteUrl}/r/${link.slug}`;
        return (
          <li
            key={link.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={link.image_url}
              alt={link.og_title}
              className="h-36 w-full object-cover"
            />
            <div className="p-4">
              <p className="font-bold text-sm text-slate-900">{link.og_title}</p>
              <p className="mt-1 truncate text-xs text-blue-600">{redirectUrl}</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => copy(redirectUrl)}
                  className="flex-1 rounded-lg bg-blue-600 py-2 text-xs font-bold text-white"
                >
                  Copy
                </button>
                <button
                  type="button"
                  onClick={() => remove(link.id)}
                  className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600"
                >
                  Hapus
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
