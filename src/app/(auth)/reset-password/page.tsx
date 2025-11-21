"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../../_lib/supabaseClient";
import { ResetPasswordFormData, resetPasswordSchema } from "@/_lib/utils/zod";
import Link from "next/link";

function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const access_token = searchParams.get("access_token");
    const refresh_token = searchParams.get("refresh_token");
    
    if (access_token && refresh_token) {
      supabase.auth.setSession({
        access_token,
        refresh_token,
      });
      
      supabase.auth.getUser().then(({ data: { user } }) => {
        console.log("Password reset for user:", user?.email);
        setUserEmail(user?.email || null);
      });
    }
  }, [searchParams]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError(null);
    setLoading(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
    
      if (!sessionData.session) {
        setError("No active session found. Please click the reset link again.");
        setLoading(false);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password
      });
      
      if (updateError) {
        setError('Password update failed: ' + updateError.message);
        setLoading(false);
        return;
      }
      
      setSuccess(true);
      await supabase.auth.signOut();
      setLoading(false);
    
      setTimeout(() => {
        router.push(`/login?message=password-updated&email=${encodeURIComponent(userEmail || '')}`);
      }, 1500);
      
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center relative justify-center bg-default-color">
      <span className="absolute top-10 text-white left-10">Methys</span>
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-vintage-green mb-2">Reset Password</h2>
            {userEmail && (
              <p className="text-sm text-vintage-green mb-4">
                Resetting password for: <span className="font-semibold">{userEmail}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-vintage-green mb-2">
              New Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-3 py-2 border border-vintage-green rounded-md"
              placeholder="Enter new password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="w-full px-3 py-2 border border-vintage-green rounded-md"
              placeholder="Confirm new password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-600 text-sm">
                Password updated successfully! Redirecting to login...
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full hover-colors py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Remember your password?
            <Link
              href={'/login'}
              className="font-medium text-vintage-green ml-1"             >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-vintage-green">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"></div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}