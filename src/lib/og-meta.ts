/**
 * Meta OG minimal untuk preview Facebook GAMBAR BESAR.
 * Jangan tambah og:description / og:site_name — FB akan pakai layout kecil (thumbnail kiri).
 */
export function buildOgHeadHtml(options: {
  title: string;
  image: string;
}): string {
  const { title, image } = options;

  return `
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:secure_url" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/jpeg">`.trim();
}
