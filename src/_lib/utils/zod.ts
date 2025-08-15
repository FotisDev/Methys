import { z } from "zod";

//product Entry schema



export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  imageFile: z
    .custom<FileList>((files) => files instanceof FileList, {
      message: "Invalid file input",
    })
    .refine((files) => files.length === 0 || files[0]?.type.startsWith("image/"), {
      message: "Must be an image",
    })
    .optional(),
});


// Sign In Schema
export const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional()
});

// Create Account Schema
export const createAccountSchema = z.object({
  firstName: z.string().min(1, "First name is required").min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(1, "Last name is required").min(2, "Last name must be at least 2 characters"),
  birthday: z.string().min(1, "Birthday is required").refine((date) => {
    const today = new Date();
    const birthDate = new Date(date);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 13;
    }
    return age >= 13;
  }, "You must be at least 13 years old"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  telephone: z.string().min(1, "Telephone is required").regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  repeatPassword: z.string().min(1, "Please confirm your password"),
  acceptTerms: z.boolean().refine((val) => val === true, "You must accept the Terms and Conditions")
}).refine((data) => data.password === data.repeatPassword, {
  message: "Passwords do not match",
  path: ["repeatPassword"]
});

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address")
});

// Reset Password Schema
export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


// Contact Form Schema
export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required").min(5, "Subject must be at least 5 characters"),
  message: z.string().min(1, "Message is required").min(10, "Message must be at least 10 characters")
});

// Product Form Schema (for admin)
export const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required").min(2, "Product name must be at least 2 characters"),
  description: z.string().min(1, "Description is required").min(10, "Description must be at least 10 characters"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  stock: z.number().min(0, "Stock cannot be negative"),
  images: z.array(z.string().url("Please provide valid image URLs")).min(1, "At least one image is required")
});

// User Profile Update Schema
export const userProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(1, "Last name is required").min(2, "Last name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  telephone: z.string().min(1, "Telephone is required").regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number"),
  birthday: z.string().min(1, "Birthday is required").optional(),
  address: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "ZIP code is required").regex(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code"),
    country: z.string().min(1, "Country is required")
  }).optional()
});

// Change Password Schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string().min(1, "Please confirm your password")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

// Type exports for TypeScript
export type SignInForm = z.infer<typeof signInSchema>;
export type CreateAccountForm = z.infer<typeof createAccountSchema>;
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
export type ContactForm = z.infer<typeof contactFormSchema>;
export type ProductForm = z.infer<typeof productFormSchema>;
export type UserProfileForm = z.infer<typeof userProfileSchema>;
export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;