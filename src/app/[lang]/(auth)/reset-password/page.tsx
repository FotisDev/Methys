"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { supabasePublic } from "../../../../_lib/supabase/client";
import { ResetPasswordFormData, resetPasswordSchema } from "@/_lib/utils/zod";
import Link, { useLocalizedPath } from "@/components/LocaleLink/LocaleLink";
import { useT } from "@/i18n/client";
import { translateDynamic } from "@/i18n/translate";

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
  const router = useRouter();
  const localizePath = useLocalizedPath();
  const t = useT();
  const tv = (message?: string) =>
    message ? translateDynamic(t, message, message) : "";

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError(null);
    setLoading(true);

    try {
      const { error: updateError } = await supabasePublic.auth.updateUser({
        password: data.password,
      });

      if (updateError) {
        console.error("Password update failed:", updateError.message);
        setError(t("auth.passwordUpdateFailed"));
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        router.push(localizePath("/login"));
      }, 1500);
    } catch {
      setError(t("auth.genericError"));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center relative justify-center bg-default-color">
      <span className="absolute top-10 text-white left-10">Methys</span>
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-vintage-green mb-2">
              {t("auth.resetPassword")}
            </h1>
          </div>

          <div>
            <label className="block text-sm font-medium text-vintage-green mb-2">
              {t("auth.newPassword")}
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-3 py-2 border border-vintage-green rounded-md"
              placeholder={t("auth.enterNewPassword")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {tv(errors.password.message)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("auth.confirmPassword")}
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="w-full px-3 py-2 border border-vintage-green rounded-md"
              placeholder={t("auth.confirmNewPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {tv(errors.confirmPassword.message)}
              </p>
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
                {t("auth.passwordUpdated")}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full hover-colors py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t("auth.updating") : t("auth.updatePassword")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t("auth.rememberPassword")}
            <Link
              href={"/login"}
              className="font-medium text-vintage-green ml-1"
            >
              {t("auth.signIn")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-vintage-green">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"></div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
