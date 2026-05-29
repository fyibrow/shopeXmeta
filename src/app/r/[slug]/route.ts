import { createAdminClient } from "@/lib/supabase/admin";
import { buildOgHeadHtml } from "@/lib/og-meta";
import { analyzeUserAgent } from "@/lib/user-agent";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const admin = createAdminClient();

  const { data: link, error } = await admin
    .from("links")
    .select("*")
    .eq("slug", slug)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !link) {
    return new Response("Link tidak ditemukan", { status: 404 });
  }

  const userAgent = request.headers.get("user-agent");
  const referrer = request.headers.get("referer");
  const { isCrawler, isFbInApp } = analyzeUserAgent(userAgent);

  await admin.from("clicks").insert({
    link_id: link.id,
    user_agent: userAgent,
    referrer,
    is_crawler: isCrawler,
    is_fb_in_app: isFbInApp,
  });

  const dest = escapeHtml(link.destination_url);
  const title = escapeHtml(link.og_title);
  const image = escapeHtml(link.image_url);
  const description = escapeHtml(link.og_description || "Facebook.com");
  const pageUrl = escapeHtml(new URL(request.url).href.split("?")[0] ?? "");
  const ogHead = buildOgHeadHtml({ title, image, pageUrl, description });

  if (isFbInApp) {
    return new Response(
      `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="referrer" content="no-referrer">
  <meta http-equiv="refresh" content="0;url=${dest}">
  <title>Redirect</title>
</head>
<body>
  <p>Menuju halaman produk...</p>
  <script>window.location.replace("${dest}");</script>
</body>
</html>`,
      {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      },
    );
  }

  if (isCrawler) {
    return new Response(
      `<!DOCTYPE html>
<html lang="id">
<head>
${ogHead}
</head>
<body><p>${title}</p></body>
</html>`,
      {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
        },
      },
    );
  }

  return new Response(
    `<!DOCTYPE html>
<html lang="id">
<head>
${ogHead}
<meta http-equiv="refresh" content="1;url=${dest}">
</head>
<body style="font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:#f0f2f5">
  <p>Memuat konten...</p>
  <script>setTimeout(function(){window.location.replace("${dest}");},1000);</script>
</body>
</html>`,
    {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    },
  );
}
