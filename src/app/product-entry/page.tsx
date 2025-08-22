"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase, fetchCategories, Category } from "@/_lib/helpers";

// Define the form data type
interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  category_id: number;
  imageFile?: FileList;
  is_offer: boolean;
}

// Define the Zod schema
const productSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name cannot exceed 100 characters"),
  
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
  
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a valid number",
    })
    .min(0.01, "Price must be greater than 0")
    .max(999999.99, "Price cannot exceed 999,999.99"),
  
  category_id: z
    .number({
      required_error: "Category is required",
      invalid_type_error: "Category must be a valid number",
    })
    .min(1, "Category is required"),
  
  imageFile: z
    .any()
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return files[0] instanceof File;
    }, "Invalid file")
    .refine((files) => {
      if (!files || files.length === 0) return true;
      const file = files[0];
      const maxSize = 10 * 1024 * 1024; // 5MB
      return file.size <= maxSize;
    }, "File size must be less than 5MB")
    .refine((files) => {
      if (!files || files.length === 0) return true;
      const file = files[0];
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      return allowedTypes.includes(file.type);
    }, "Only JPG, PNG, and WebP files are allowed"),
  
  is_offer: z.boolean(),
});

// Utility function to generate a slug from the product name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
};

export default function ProductEntryPage() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category_id: 0,
      is_offer: false,
    },
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Watch for image file changes to show preview
  const watchedImageFile = watch("imageFile");

  // Fetch categories from Supabase
  useEffect(() => {
    async function loadCategories() {
      try {
        const categoriesData = await fetchCategories();
        if (!categoriesData) {
          throw new Error("No categories data returned from Supabase");
        }
        console.debug("Fetched categories:", categoriesData);
        if (categoriesData.length === 0) {
          setError("No categories found in the database. Please add categories in Supabase.");
        }
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error loading categories:", err);
        setError(
          err instanceof Error
            ? `Failed to load categories: ${err.message}. Please check your Supabase configuration or refresh the page.`
            : "Failed to load categories. Please check your Supabase configuration or refresh the page."
        );
        setCategories([]);
      }
    }
    loadCategories();
  }, []);

  // Handle image preview
  useEffect(() => {
    if (watchedImageFile && watchedImageFile.length > 0) {
      const file = watchedImageFile[0];
      if (file instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setImagePreview(null);
    }
  }, [watchedImageFile]);

  const validateFile = (file: File): string | null => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    
    if (file.size > maxSize) {
      return "File size must be less than 5MB";
    }
    
    if (!allowedTypes.includes(file.type)) {
      return "Only JPG, PNG, and WebP files are allowed";
    }
    
    return null;
  };

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    setError(null);
    setSuccess(null);
    setUploadProgress(0);

    try {
      let fileUrl: string | null = null;

      // Upload image if provided
      if (data.imageFile && data.imageFile.length > 0) {
        const image = data.imageFile[0];
        
        // Validate file
        const fileError = validateFile(image);
        if (fileError) {
          setError(fileError);
          return;
        }

        const fileExt = image.name.split(".").pop()?.toLowerCase();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `product-images/${fileName}`;

        setUploadProgress(25);

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, image, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }

        setUploadProgress(50);

        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);
        
        fileUrl = urlData.publicUrl;
      }

      setUploadProgress(75);

      // Generate slug from product name
      const slug = generateSlug(data.name);

      // Insert product into Supabase
      const { error: insertError } = await supabase.from("products").insert({
        name: data.name.trim(),
        description: data.description?.trim() || null,
        price: parseFloat(data.price.toString()),
        category_id: data.category_id,
        image_url: fileUrl || "/placeholder.png",
        is_offer: data.is_offer || false,
        slug,
        created_at: new Date().toISOString(),
      });

      if (insertError) {
        throw new Error(`Failed to save product: ${insertError.message}`);
      }

      setUploadProgress(100);
      setSuccess("Product added successfully!");
      
      // Reset form and preview
      reset({
        name: "",
        description: "",
        price: 0,
        category_id: 0,
        is_offer: false,
      });
      setImagePreview(null);
      
      // Clear progress after a delay
      setTimeout(() => setUploadProgress(0), 2000);
      
    } catch (err) {
      console.error("Error adding product:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred while adding the product");
      setUploadProgress(0);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Καταχώρηση Προϊόντος</h1>
        <p className="text-gray-600">Add a new product to your catalog</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter product name"
            onChange={clearMessages}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            {...register("description")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="Describe your product (optional)"
            onChange={clearMessages}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Price and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price (€) *
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              {...register("price", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              onChange={clearMessages}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category_id"
              {...register("category_id", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={clearMessages}
            >
              <option value="0">-- Select a category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="mt-1 text-sm text-red-600">{errors.category_id.message}</p>
            )}
            {categories.length === 0 && (
              <p className="mt-1 text-sm text-red-600">No categories available. Please add categories in Supabase.</p>
            )}
          </div>
        </div>

        {/* Product Image */}
        <div>
          <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 mb-2">
            Product Image
          </label>
          <input
            id="imageFile"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            {...register("imageFile")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={clearMessages}
          />
          <p className="mt-1 text-xs text-gray-500">
            Max file size: 5MB. Supported formats: JPG, PNG, WebP
          </p>
          {errors.imageFile && (
            <p className="mt-1 text-sm text-red-600">{errors.imageFile.message}</p>
          )}
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="w-32 h-32 object-cover rounded-md border border-gray-300"
                />
              </div>
            </div>
          )}
        </div>

        {/* Is Offer Checkbox */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register("is_offer")}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              onChange={clearMessages}
            />
            <span className="text-sm font-medium text-gray-700">Mark as Special Offer</span>
          </label>
        </div>

        {/* Progress Bar */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-2 px-6 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Saving Product..." : "Save Product"}
          </button>

          <Link
            href="/"
            className="flex-1 sm:flex-none bg-gray-600 text-white py-2 px-6 rounded-md font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-center"
          >
            Back to Homepage
          </Link>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}