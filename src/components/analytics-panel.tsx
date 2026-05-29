"use client";

import { useCallback, useEffect, useState } from "react";

type AnalyticsData = {
  days: number;
  summary: {
    totalLinks: number;
    totalClicks: number;
    crawlerClicks: number;
    fbInAppClicks: number;
    otherClicks: number;
  };
  chartData: { date: string; clicks: number }[];
  topLinks: Array<{
    id: string;
    slug: string;
    og_title: string;
    clickCount: number;
    redirectUrl: string;
  }>;
};

export function AnalyticsPanel() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/analytics?days=${days}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  }, [days]);

  useEffect(() => {
    load();
  }, [load]);

  const maxClicks = Math.max(1, ...(data?.chartData.map((d) => d.clicks) ?? [1]));

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900">Analytics</h2>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
        >
          <option value={7}>7 hari</option>
          <option value={14}>14 hari</option>
          <option value={30}>30 hari</option>
        </select>
      </div>

      {loading || !data ? (
        <p className="text-sm text-slate-500">Memuat analytics...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            {[
              { label: "Total Link", value: data.summary.totalLinks },
              { label: "Klik", value: data.summary.totalClicks },
              { label: "FB Crawler", value: data.summary.crawlerClicks },
              { label: "FB In-App", value: data.summary.fbInAppClicks },
              { label: "Lainnya", value: data.summary.otherClicks },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <p className="text-xs font-bold uppercase text-slate-400">
                  {s.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="mb-4 text-xs font-bold uppercase text-slate-400">
              Klik per hari
            </p>
            <div className="flex h-32 items-end gap-1">
              {data.chartData.map((d) => (
                <div
                  key={d.date}
                  className="group flex flex-1 flex-col items-center gap-1"
                >
                  <div
                    className="w-full rounded-t bg-blue-600 transition-all"
                    style={{
                      height: `${Math.max(4, (d.clicks / maxClicks) * 100)}%`,
                      minHeight: d.clicks > 0 ? "8px" : "4px",
                    }}
                    title={`${d.date}: ${d.clicks}`}
                  />
                  <span className="hidden text-[9px] text-slate-400 group-hover:block">
                    {d.date.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="mb-4 text-xs font-bold uppercase text-slate-400">
              Top link
            </p>
            {data.topLinks.length === 0 ? (
              <p className="text-sm text-slate-500">Belum ada klik</p>
            ) : (
              <ul className="space-y-3">
                {data.topLinks.map((l) => (
                  <li
                    key={l.id}
                    className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{l.og_title}</p>
                      <p className="truncate text-xs text-blue-600">
                        {l.redirectUrl}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-lg bg-slate-900 px-2 py-1 text-xs font-bold text-white">
                      {l.clickCount}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </section>
  );
}
