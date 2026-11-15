import { randomUUID } from "crypto";
import sharp from "sharp";
import { supabaseAdmin } from "@/_lib/supabase/admin";
import {
  MAX_REVIEW_PHOTOS,
  MAX_REVIEW_PHOTO_BYTES,
  detectImageType,
} from "@/_lib/utils/reviews";

const BUCKET = "review-photos";

type UploadResult =
  | { ok: true; urls: string[]; paths: string[] }
  | {
      ok: false;
      message:
        | "reviews.errors.photoType"
        | "reviews.errors.photoSize"
        | "reviews.errors.photoCount"
        | "reviews.errors.failed";
    };

// Only real files the customer picked (an empty file input still sends one
// zero-byte entry).
export function photosFromForm(formData: FormData) {
  return formData
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);
}

// Checks, re-encodes and uploads review photos. Re-encoding with sharp proves
// the file really is an image, applies phone rotation, shrinks it, and strips
// EXIF metadata (which can include the GPS location of the customer's home).
export async function uploadReviewPhotos(
  files: File[],
  productId: number,
  userId: string,
): Promise<UploadResult> {
  if (files.length > MAX_REVIEW_PHOTOS) {
    return { ok: false, message: "reviews.errors.photoCount" };
  }

  const images: Buffer[] = [];
  for (const file of files) {
    if (file.size > MAX_REVIEW_PHOTO_BYTES) {
      return { ok: false, message: "reviews.errors.photoSize" };
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (!detectImageType(bytes)) {
      return { ok: false, message: "reviews.errors.photoType" };
    }
    try {
      images.push(
        await sharp(bytes)
          .rotate()
          .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer(),
      );
    } catch {
      return { ok: false, message: "reviews.errors.photoType" };
    }
  }

  const paths: string[] = [];
  for (const image of images) {
    const path = `${productId}/${userId}-${randomUUID()}.webp`;
    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(path, image, { contentType: "image/webp", upsert: false });
    if (error) {
      console.error("Review photo upload failed:", error.message);
      await removeReviewPhotos(paths);
      return { ok: false, message: "reviews.errors.failed" };
    }
    paths.push(path);
  }

  const urls = paths.map(
    (path) =>
      supabaseAdmin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl,
  );
  return { ok: true, urls, paths };
}

export async function removeReviewPhotos(paths: string[]) {
  if (paths.length === 0) return;
  const { error } = await supabaseAdmin.storage.from(BUCKET).remove(paths);
  if (error) console.error("Removing review photos failed:", error.message);
}
