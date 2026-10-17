// scripts/backfill-blur-placeholders.ts
import "./load-env";
import { generateBlurDataUrl } from "@/_lib/utils/generateBlurDataUrl";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/env";

const supabaseAdmin = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
);

async function run() {
  const { data: products, error } = await supabaseAdmin
    .from("products")
    .select("id, image_url")
    .is("blur_data_url", null);

  if (error || !products) {
    console.error(error);
    return;
  }

  console.log(`Found ${products.length} products without blur placeholder`);

  for (const product of products) {
    const firstImage = product.image_url?.[0];
    if (!firstImage) continue;

    const blurDataUrl = await generateBlurDataUrl(firstImage);
    if (!blurDataUrl) continue;

    await supabaseAdmin
      .from("products")
      .update({ blur_data_url: blurDataUrl })
      .eq("id", product.id);

    console.log(`✓ ${product.id}`);
  }

  console.log("Done.");
}

run();
