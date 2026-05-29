/**
 * Resolves the public app URL for generated redirect links.
 * Priority: NEXT_PUBLIC_SITE_URL → VERCEL_URL (Vercel) → request origin → localhost
 */
export function getSiteUrl(request?: Request): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }

  const vercelHost = process.env.VERCEL_URL?.trim();
  if (vercelHost) {
    return `https://${vercelHost}`;
  }

  if (request) {
    return new URL(request.url).origin;
  }

  return "http://localhost:3000";
}
