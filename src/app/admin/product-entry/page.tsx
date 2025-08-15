"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { supabase } from "@/_lib/supabaseClient";
import Link from "next/link";
import { ProductFormData, productSchema } from "@/_lib/utils/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@/_lib/types";

export default function ProductEntryPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch categories from Supabase
  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("id, category_name")
        .order("category_name", { ascending: true });

      if (error) {
        console.error("Error loading categories:", error);
        setError("Failed to load categories");
        return;
      }
      setCategories(data || []);
    }
    fetchCategories();
  }, []);

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const checkSlugExists = async (slug: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return !!data;
    } catch (err) {
      console.error("Error checking slug:", err);
      return false;
    }
  };

  const generateUniqueSlug = async (name: string): Promise<string> => {
    const baseSlug = generateSlug(name);
    let slug = baseSlug;
    let counter = 1;
    while (await checkSlugExists(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    return slug;
  };

  const onSubmit = async (data:  ProductFormData) => {
    setError(null);
    setSuccess(null);

    try {
      const slug = await generateUniqueSlug(data.name);
      let fileUrl: string | null = null;

      // Upload image
      if (data.imageFile && data.imageFile.length > 0) {
        const image = data.imageFile[0];
        const fileExt = image.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        fileUrl = urlData.publicUrl;
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          price: parseFloat(data.price.toString()),
          category: data.category, // This will now be the UUID
          image_url: fileUrl,
          slug,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to save product");
      }

      setSuccess("Product added successfully!");
      reset();
    } catch (error) {
      console.log(error);
      setError("An error occurred");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-6">Καταχώρηση Προϊόντος</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name *</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="w-full p-2 border rounded"
          />
          {typeof errors.name?.message === "string" && (
            <p className="text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            {...register("description")}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Price *</label>
            <input
              type="number"
              step="0.01"
              {...register("price", {
                required: "Price is required",
                valueAsNumber: true,
              })}
              className="w-full p-2 border rounded"
            />
            {typeof errors.price?.message === "string" && (
              <p className="text-red-600">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Category *</label>
            <select
              {...register("category", { required: "Category is required" })}
              className="w-full p-2 border rounded"
              disabled={categories.length === 0}
            >
              <option value="">-- Select a category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </option>
              ))}
            </select>

            {typeof errors.category?.message === "string" && (
              <p className="text-red-600">{errors.category.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Product Image *</label>
          <input
            type="file"
            accept="image/*"
            {...register("imageFile", { required: "Image is required" })}
          />
          {typeof errors.imageFile?.message === "string" && (
            <p className="text-red-600">{errors.imageFile.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Product"}
        </button>

        <Link href="/" className="bg-amber-500">
          Back to homepage..
        </Link>

        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
      </form>
    </div>
  );
}
