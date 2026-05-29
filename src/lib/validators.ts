import { z } from "zod";

const ALLOWED_DESTINATION_HOSTS = ["ngelink.net"] as const;

export function isAllowedDestinationUrl(raw: string): boolean {
  try {
    const { hostname } = new URL(raw);
    const host = hostname.toLowerCase();
    if (host.includes("shopee")) return true;
    return ALLOWED_DESTINATION_HOSTS.some(
      (allowed) => host === allowed || host.endsWith(`.${allowed}`),
    );
  } catch {
    return false;
  }
}

export const createLinkSchema = z.object({
  destinationUrl: z
    .string()
    .url("URL tidak valid")
    .refine(
      isAllowedDestinationUrl,
      "URL hanya boleh mengarah ke Shopee atau ngelink.net",
    ),
  ogTitle: z.string().min(3, "Judul minimal 3 karakter").max(120),
  ogDescription: z.string().max(200).optional(),
});

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
