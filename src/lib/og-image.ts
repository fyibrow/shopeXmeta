import sharp from "sharp";

/** Rasio standar Facebook link preview besar (1.91:1). */
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/** Crop & resize ke 1200×630 agar FB tampilkan preview gambar besar. */
export async function processOgImage(input: Buffer): Promise<Buffer> {
  return sharp(input)
    .rotate()
    .resize(OG_WIDTH, OG_HEIGHT, {
      fit: "cover",
      position: "centre",
    })
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();
}
