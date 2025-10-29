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

// ✅ Schema Validation
const sizeVariantSchema = z.object({
  size: z.string(),
  price: z.number().min(0, "Η τιμή πρέπει να είναι θετική"),
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

// ✅ Διαθέσιμα μεγέθη
const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

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

  // 🔹 Φόρτωση κατηγοριών από Supabase
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

  // 🔹 Preview εικόνας
  const imageFile = watch("image");
  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  // ✅ Upload εικόνας στο Supabase
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

  // ✅ Submit προϊόντος
  const onSubmit = async (data: ProductFormValues) => {
    try {
      let imageUrl: string | null = null;

      if (data.image && data.image.length > 0) {
        imageUrl = await uploadImage(data.image[0]);
      }

      // Δημιουργία slug
      const slug = data.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

      // ✅ Εισαγωγή προϊόντος στον πίνακα products
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

      // ✅ Εισαγωγή μεγεθών στον πίνακα product_variants
      const variants = data.sizeVariants.map((variant) => ({
        product_id: productData.id,
        size: variant.size,
        price: variant.price,
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

  // ✅ Προσθήκη νέου μεγέθους
  function handleAddSize(size: string) {
    const exists = watch("sizeVariants").some((v) => v.size === size);
    if (exists) return alert(`Το μέγεθος ${size} υπάρχει ήδη.`);
    append({ size, price: 0, quantity: 0 });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6"
    >
      <h1 className="text-2xl font-semibold mb-4 text-center">
        ➕ Προσθήκη Νέου Προϊόντος
      </h1>

      {/* --- Όνομα --- */}
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

      {/* --- Περιγραφή --- */}
      <div>
        <label className="block text-sm font-medium mb-1">Περιγραφή</label>
        <textarea
          {...register("description")}
          className="border p-2 w-full rounded"
          rows={3}
        />
      </div>

      {/* --- Κατηγορία --- */}
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

      {/* --- Τιμή Βάσης --- */}
      <div>
        <label className="block text-sm font-medium mb-1">Τιμή (βασική)</label>
        <input
          type="number"
          step="0.01"
          {...register("basePrice", { valueAsNumber: true })}
          className="border p-2 w-full rounded"
        />
        {errors.basePrice && (
          <p className="text-red-500 text-sm">{errors.basePrice.message}</p>
        )}
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

      {/* --- Επιλογή Μεγεθών --- */}
      <div>
        <label className="block text-sm font-medium mb-1">Μεγέθη</label>
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
      </div>

      {/* --- Πίνακας Μεγεθών --- */}
      {fields.length > 0 && (
        <div className="space-y-4 mt-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border rounded-lg p-3 grid grid-cols-3 gap-3 items-center"
            >
              <p className="font-semibold">{field.size}</p>
              <input
                type="number"
                step="0.01"
                {...register(`sizeVariants.${index}.price`, {
                  valueAsNumber: true,
                })}
                placeholder="Τιμή"
                className="border p-2 rounded"
              />
              <input
                type="number"
                {...register(`sizeVariants.${index}.quantity`, {
                  valueAsNumber: true,
                })}
                placeholder="Ποσότητα"
                className="border p-2 rounded"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 text-sm col-span-3 text-right"
              >
                Διαγραφή
              </button>
            </div>
          ))}
        </div>
      )}

      {/* --- Submit --- */}
      <button
        type="submit"
        className="bg-black text-white px-6 py-2 rounded w-full hover:bg-gray-800"
      >
        Καταχώρηση Προϊόντος
      </button>
    </form>
  );
}
