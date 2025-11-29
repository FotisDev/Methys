"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addProductAction } from "@/_lib/backend/AddProductAction/action";
import { supabase } from "@/_lib/supabase/client";
import { ProductInsert, VariantInsert } from "@/_lib/types";
import { getErrorMessage } from "@/_lib/helpers";

const sizeVariantSchema = z.object({
  size: z.string(),
  quantity: z.coerce.number().min(0, "Η ποσότητα πρέπει να είναι θετική"),
});

const productSchema = z.object({
  name: z.string().min(1, "Το όνομα είναι υποχρεωτικό"),
  description: z.string().optional(),
  category_men_id: z.coerce.number().min(1, "Επέλεξε κατηγορία"),
  basePrice: z.coerce.number().min(0.01, "Η τιμή είναι υποχρεωτική"),
  image: z.any().optional(),
  size_description: z.string().optional(),
  sizeVariants: z
    .array(sizeVariantSchema)
    .nonempty("Πρέπει να προσθέσεις τουλάχιστον ένα μέγεθος"),
});

type ProductFormValues = z.infer<typeof productSchema>;

const availableSizes = ["XS", "S", "M", "L", "XL"] as const;

export default function AddProductForm() {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      sizeVariants: [],
      basePrice: 0,
      category_men_id: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sizeVariants",
  });

  // Φόρτωση κατηγοριών
  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("categoriesformen")
        .select("id, name")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching categories:", error.message);
      } else {
        setCategories(data || []);
      }
    }
    fetchCategories();
  }, []);

  // Preview εικόνας
  const imageFile = watch("image");
  useEffect(() => {
    if (imageFile?.[0]) {
      const file = imageFile[0] as File;
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);

  // Upload εικόνας
  async function uploadImage(file: File): Promise<string | null> {
    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);

    setUploading(false);

    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);
    return data.publicUrl;
  }

  // Submit
  const onSubmit = async (formData: ProductFormValues) => {
    try {
      let imageUrl: string | null = null;

      if (formData.image?.[0]) {
        const file = formData.image[0] as File;
        imageUrl = await uploadImage(file);
        if (!imageUrl) throw new Error("Αποτυχία ανεβάσματος εικόνας");
      }

      const slug = formData.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const baseProductData: ProductInsert = {
        name: formData.name,
        slug,
        price: formData.basePrice,
        description: formData.description ?? "",
        size_description: formData.size_description ?? "",
        image_url: imageUrl,
        category_men_id: formData.category_men_id,
        is_offer: false,
      };

      const variants: VariantInsert[] = formData.sizeVariants.map((v) => ({
        size: v.size,
        quantity: v.quantity,
        price: formData.basePrice,
        slug: `${slug}-${v.size.toLowerCase()}`,
      }));

      await addProductAction(baseProductData, variants);

      alert("Product comfirmed!");
      reset();
      setImagePreview(null);
    } catch (err) {
      console.error(err);
      alert("Order failed: " + getErrorMessage(err));
    }
  };

  const handleAddSize = (size: string) => {
    const exists = fields.some((f) => f.size === size);
    if (exists) {
      alert(`The size ${size} already exists.`);
      return;
    }
    append({ size, quantity: 0 });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6"
    >
      <h1 className="text-2xl font-semibold mb-4 text-center">
        Add new Product
      </h1>

      {/* Όνομα */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Name of Product
        </label>
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
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          {...register("description")}
          className="border p-2 w-full rounded"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          sizeDescription
        </label>
        <textarea
          {...register("size_description")}
          className="border p-2 w-full rounded"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          {...register("category_men_id")}
          className="border p-2 w-full rounded"
        >
          <option value="">Choose Category</option>
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
        <label className="block text-sm font-medium mb-1">
          Price of Product (€)
        </label>
        <input
          type="number"
          step="0.01"
          {...register("basePrice")}
          className="border p-2 w-full rounded"
          placeholder="π.χ. 29.99"
        />
        {errors.basePrice && (
          <p className="text-red-500 text-sm">{errors.basePrice.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Price is the same for all sizes
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Image</label>
        <input type="file" accept="image/*" {...register("image")} />
        {uploading && <p>Loading Image...</p>}
        {imagePreview && (
          <div className="mt-3 relative w-40 h-40">
            <Image
              src={imagePreview}
              alt="Preview"
              className="object-cover rounded-lg shadow"
              fill
              sizes="160px"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Available Sizes
        </label>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((size) => (
            <button
              type="button"
              key={size}
              onClick={() => handleAddSize(size)}
              className="border px-3 py-1 rounded hover:bg-gray-100 transition"
            >
              + {size}
            </button>
          ))}
        </div>
        {errors.sizeVariants && !Array.isArray(errors.sizeVariants) && (
          <p className="text-red-500 text-sm mt-1">
            {errors.sizeVariants.message}
          </p>
        )}
      </div>

      {fields.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Quantity per size:</h3>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border rounded-lg p-3 flex items-center gap-3 bg-gray-50"
            >
              <span className="font-semibold text-lg w-12">{field.size}</span>
              <input
                type="number"
                {...register(`sizeVariants.${index}.quantity`)}
                placeholder="Quantity"
                className="border p-2 rounded flex-1"
                min="0"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-600 hover:text-red-800 font-bold"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="submit"
        className="bg-black text-white px-6 py-3 rounded w-full hover:bg-gray-800 font-medium transition"
      >
        Καταχώρηση Προϊόντος
      </button>
    </form>
  );
}
