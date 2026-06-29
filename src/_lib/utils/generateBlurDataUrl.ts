// _lib/utils/generateBlurDataUrl.ts
import sharp from "sharp";

export async function generateBlurDataUrl(imageUrl: string): Promise<string | null> {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) return null;

    const buffer = Buffer.from(await res.arrayBuffer());

    const resized = await sharp(buffer)
      .resize(16) // πολύ μικρό, αρκεί για blur
      .toBuffer();

    const base64 = resized.toString("base64");
    const mimeType = "image/jpeg";

    return `data:${mimeType};base64,${base64}`;
  } catch (err) {
    console.error("Failed to generate blur for", imageUrl, err);
    return null;
  }
}