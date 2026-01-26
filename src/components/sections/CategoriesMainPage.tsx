import { getAllCategoriesWithSubcategories } from "@/_lib/backend/categoryBySlug/action";
import CategoriesSwiper from "@/components/swipers/CategoriesSwiper";

export default async function CategoriesMainPage() {
  const allCategories = await getAllCategoriesWithSubcategories();

  const mainCategories = allCategories.filter(cat => cat.parent_id === null);
  const subCategories = allCategories.filter(cat => cat.parent_id !== null);

  const slides = mainCategories.flatMap((mainCat) => {
    const categorySubcategories = subCategories.filter(
      sub => sub.parent_id === mainCat.id
    );

    return categorySubcategories.map((subCat) => ({
      category: {
        id: mainCat.id,
        category_name: mainCat.name,
        slug: mainCat.slug,
        image_url: mainCat.image_url,
      },
      subcategory: {
        id: subCat.id,
        name: subCat.name,
        slug: subCat.slug,
        image_url: subCat.image_url,
        parent_id: subCat.parent_id,
      },
    }));
  });

  return <CategoriesSwiper categories={slides} />;
}