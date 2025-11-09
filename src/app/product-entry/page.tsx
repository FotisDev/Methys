"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const sizeVariantSchema = z.object({
  size: z.string(),
  quantity: z.number().min(0, "Η ποσότητα πρέπει να είναι θετική"),
});

const productSchema = z.object({
  name: z.string().min(1, "Το όνομα είναι υποχρεωτικό"),
  description: z.string().optional(),
  category_men_id: z.number().min(1, "Επέλεξε κατηγορία"),
  basePrice: z.number().min(0, "Η τιμή είναι υποχρεωτική"),
  image: z.instanceof(FileList).optional(),
  sizeVariants: z.array(sizeVariantSchema).nonempty("Πρέπει να προσθέσεις τουλάχιστον ένα μέγεθος"),
});

type ProductFormValues = z.infer<typeof productSchema>;

const availableSizes = ["XS", "S", "M", "L", "XL"];

export default function AddProductForm() {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      sizeVariants: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sizeVariants",
  });

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("categoriesformen")
        .select("id, name")
        .order("id", { ascending: true });

      if (error) console.error("Error fetching categories:", error.message);
      else setCategories(data || []);
    }
    fetchCategories();
  }, []);

  const imageFile = watch("image");
  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  async function uploadImage(file: File): Promise<string | null> {
    setUploading(true);
    const filePath = `products/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);
    setUploading(false);

    if (error) {
      console.error("Error uploading image:", error.message);
      return null;
    }
    const { data: publicUrl } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);
    return publicUrl.publicUrl;
  }

  const onSubmit = async (data: ProductFormValues) => {
    try {
      let imageUrl: string | null = null;

      if (data.image && data.image.length > 0) {
        imageUrl = await uploadImage(data.image[0]);
      }

      const slug = data.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

      const { data: productData, error: productError } = await supabase
        .from("products")
        .insert([
          {
            name: data.name,
            description: data.description || "",
            price: data.basePrice,
            image_url: imageUrl,
            slug,
            category_men_id: data.category_men_id,
          },
        ])
        .select()
        .single();

      if (productError) throw productError;

      const variants = data.sizeVariants.map((variant) => ({
        product_id: productData.id,
        size: variant.size,
        price: data.basePrice, 
        quantity: variant.quantity,
        sku: `${slug}-${variant.size.toLowerCase()}`,
      }));

      const { error: variantError } = await supabase
        .from("product_variants")
        .insert(variants);

      if (variantError) throw variantError;

      alert("✅ Το προϊόν καταχωρήθηκε με επιτυχία!");
      reset();
      setImagePreview(null);
    } catch (err: any) {
      console.error("Error submitting product:", err.message);
      alert("❌ Σφάλμα κατά την καταχώρηση προϊόντος!");
    }
  };

  function handleAddSize(size: string) {
    const exists = watch("sizeVariants").some((v) => v.size === size);
    if (exists) return alert(`Το μέγεθος ${size} υπάρχει ήδη.`);
    append({ size, quantity: 0 });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6"
    >
      <h1 className="text-2xl font-semibold mb-4 text-center">
        ➕ Προσθήκη Νέου Προϊόντος
      </h1>

      <div>
        <label className="block text-sm font-medium mb-1">Όνομα προϊόντος</label>
        <input
          {...register("name")}
          className="border p-2 w-full rounded"
          placeholder="Π.χ. Basic T-Shirt"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Περιγραφή</label>
        <textarea
          {...register("description")}
          className="border p-2 w-full rounded"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Κατηγορία</label>
        <select
          {...register("category_men_id", { valueAsNumber: true })}
          className="border p-2 w-full rounded"
        >
          <option value="">Επέλεξε κατηγορία</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.category_men_id && (
          <p className="text-red-500 text-sm">
            {errors.category_men_id.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Τιμή προϊόντος (€)</label>
        <input
          type="number"
          step="0.01"
          {...register("basePrice", { valueAsNumber: true })}
          className="border p-2 w-full rounded"
          placeholder="π.χ. 29.99"
        />
        {errors.basePrice && (
          <p className="text-red-500 text-sm">{errors.basePrice.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Η τιμή θα ισχύει για όλα τα μεγέθη
        </p>
      </div>

      {/* --- Εικόνα --- */}
      <div>
        <label className="block text-sm font-medium mb-1">Εικόνα</label>
        <input type="file" accept="image/*" {...register("image")} />
        {uploading && <p>Φόρτωση...</p>}
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-3 w-40 h-40 object-cover rounded-lg"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Διαθέσιμα Μεγέθη</label>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((size) => (
            <button
              type="button"
              key={size}
              onClick={() => handleAddSize(size)}
              className="border px-3 py-1 rounded hover:bg-gray-100"
            >
              + {size}
            </button>
          ))}
        </div>
        {errors.sizeVariants && (
          <p className="text-red-500 text-sm mt-1">{errors.sizeVariants.message}</p>
        )}
      </div>

      {fields.length > 0 && (
        <div className="space-y-3 mt-4">
          <h3 className="font-medium text-sm">Ποσότητες ανά μέγεθος:</h3>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border rounded-lg p-3 flex items-center gap-3"
            >
              <span className="font-semibold text-lg w-12">{field.size}</span>
              <input
                type="number"
                {...register(`sizeVariants.${index}.quantity`, {
                  valueAsNumber: true,
                })}
                placeholder="Ποσότητα σε απόθεμα"
                className="border p-2 rounded flex-1"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 text-sm px-2"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* --- Submit --- */}
      <button
        type="submit"
        className="bg-black text-white px-6 py-3 rounded w-full hover:bg-gray-800 font-medium"
      >
        Καταχώρηση Προϊόντος
      </button>
    </form>
  );
}