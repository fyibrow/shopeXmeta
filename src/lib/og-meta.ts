/** Teks deskripsi di preview (baris abu-abu di bawah judul). */
export const FACEBOOK_OG_DESCRIPTION = "Facebook.com";

/**
 * Meta OG untuk crawler Facebook — sama seperti versi PHP asli.
 * og:url HARUS URL halaman ini agar gambar & judul ikut ter-scrape.
 * Jangan arahkan og:url ke facebook.com (preview jadi rusak).
 */
export function buildOgHeadHtml(options: {
  title: string;
  image: string;
  pageUrl: string;
  description?: string;
}): string {
  const title = options.title;
  const image = options.image;
  const pageUrl = options.pageUrl;
  const desc = options.description ?? FACEBOOK_OG_DESCRIPTION;

  return `
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta property="og:type" content="website">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:site_name" content="facebook.com">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:secure_url" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/jpeg">`.trim();
}
