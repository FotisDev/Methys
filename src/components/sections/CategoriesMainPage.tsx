import { supabase } from "@/_lib/helpers";
import CategoriesSwiper from "@/components/swipers/CategoriesSwiper";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export default async function CategoriesMainPage() {
  const { data, error } = await supabase
    .from("categoriesformen")
    .select("id, name")
    .eq("parent_id", 1);

  if (error) {
    console.error("Error fetching categories:", error);
    return <div>Error loading categories</div>;
  }

  const categories = (data || []).map((cat) => {
  const rawName = cat.name?.toLowerCase() || "";
  let imageName = "";

  if (rawName.includes("t-shirt")) imageName = "retroTshirt.jpg";
  else if (rawName === "shirts") imageName = "retroshirt.jpg";
  else if (rawName === "jackets") imageName = "retrojacket.jpg";
  else if (rawName.includes("jeans") || rawName.includes("pants"))
    imageName = "retrojean.jpg";
  else if (rawName.includes("short")) imageName = "retroshort.jpg";
  else if (rawName.includes("accessories")) imageName = "accessories.webp";
  else if (rawName.includes("hoodie") || rawName.includes("knitwear"))
    imageName = "retrohood.jpg";
  else imageName = `${rawName.replace(/\s+/g, "-")}.jpg`;

  const image_url = `${supabaseUrl}/storage/v1/object/public/product-images/${imageName}`;

  return {
    id: cat.id,
    category_name: cat.name,
    image_url,
  };
});


  return <CategoriesSwiper categories={categories} />;
}
