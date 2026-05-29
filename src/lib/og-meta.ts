/** Label domain di preview Facebook (bukan URL situs kita). */
export const FACEBOOK_OG_DOMAIN = "facebook.com";
export const FACEBOOK_OG_DESCRIPTION = "Facebook.com";
export const FACEBOOK_OG_URL = "https://www.facebook.com/";

export function buildOgHeadHtml(options: {
  title: string;
  image: string;
}): string {
  const title = options.title;
  const image = options.image;
  const desc = FACEBOOK_OG_DESCRIPTION;
  const siteName = FACEBOOK_OG_DOMAIN;
  const ogUrl = FACEBOOK_OG_URL;

  return `
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="${ogUrl}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${ogUrl}">
  <meta property="og:site_name" content="${siteName}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:secure_url" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/jpeg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:domain" content="${siteName}">
  <meta name="twitter:url" content="${ogUrl}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:image" content="${image}">`.trim();
}
