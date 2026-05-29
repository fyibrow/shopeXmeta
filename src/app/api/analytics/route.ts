import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const days = Math.min(90, Math.max(1, Number(searchParams.get("days") ?? 7)));

  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceIso = since.toISOString();

  const [
    { count: totalLinks },
    { count: totalClicks },
    { data: clicks },
    { data: links },
  ] = await Promise.all([
    supabase
      .from("links")
      .select("*", { count: "exact", head: true })
      .is("deleted_at", null),
    supabase
      .from("clicks")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sinceIso),
    supabase
      .from("clicks")
      .select("id, link_id, is_crawler, is_fb_in_app, created_at")
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: false }),
    supabase
      .from("links")
      .select("id, slug, og_title, destination_url, created_at")
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
  ]);

  const clickList = clicks ?? [];
  const crawlerClicks = clickList.filter((c) => c.is_crawler).length;
  const fbInAppClicks = clickList.filter((c) => c.is_fb_in_app).length;
  const otherClicks = clickList.length - crawlerClicks - fbInAppClicks;

  const clicksByDay = new Map<string, number>();
  for (const c of clickList) {
    const day = c.created_at.slice(0, 10);
    clicksByDay.set(day, (clicksByDay.get(day) ?? 0) + 1);
  }

  const chartData = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const key = d.toISOString().slice(0, 10);
    return { date: key, clicks: clicksByDay.get(key) ?? 0 };
  });

  const countsByLink = new Map<string, number>();
  for (const c of clickList) {
    countsByLink.set(c.link_id, (countsByLink.get(c.link_id) ?? 0) + 1);
  }

  const linkMap = new Map((links ?? []).map((l) => [l.id, l]));
  const topLinks = Array.from(countsByLink.entries())
    .map(([linkId, count]) => ({
      linkId,
      count,
      link: linkMap.get(linkId),
    }))
    .filter((x) => x.link)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const siteUrl = getSiteUrl(request);

  return NextResponse.json({
    days,
    summary: {
      totalLinks: totalLinks ?? 0,
      totalClicks: totalClicks ?? 0,
      crawlerClicks,
      fbInAppClicks,
      otherClicks: Math.max(0, otherClicks),
    },
    chartData,
    topLinks: topLinks.map((t) => ({
      ...t.link,
      clickCount: t.count,
      redirectUrl: siteUrl ? `${siteUrl}/r/${t.link!.slug}` : `/r/${t.link!.slug}`,
    })),
    recentClicks: clickList.slice(0, 20),
  });
}
