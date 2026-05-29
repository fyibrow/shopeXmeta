"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin-header";
import { AnalyticsPanel } from "@/components/analytics-panel";
import { LinkGenerator } from "@/components/link-generator";
import { LinksList } from "@/components/links-list";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const [email, setEmail] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [tab, setTab] = useState<"generator" | "analytics" | "links">(
    "generator",
  );

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? "");
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <AdminHeader email={email} />

        <div className="mb-6 inline-flex rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
          {(
            [
              ["generator", "Generator"],
              ["analytics", "Analytics"],
              ["links", "Semua Link"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-xl px-5 py-2 text-sm font-bold transition ${
                tab === id
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "generator" && (
          <LinkGenerator onCreated={() => setRefreshKey((k) => k + 1)} />
        )}
        {tab === "analytics" && <AnalyticsPanel />}
        {tab === "links" && (
          <section>
            <h2 className="mb-4 text-lg font-bold">Semua Link</h2>
            <LinksList refreshKey={refreshKey} />
          </section>
        )}
      </div>
    </div>
  );
}
