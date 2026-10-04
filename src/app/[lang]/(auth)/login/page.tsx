"use client";

import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link, { useLocalizedPath } from "@/components/LocaleLink/LocaleLink";
import { signInSchema, type SignInForm } from "../../../../_lib/utils/zod";
import { signInAction } from "@/_lib/backend/loginAction/action";
import { useT } from "@/i18n/client";
import { rich } from "@/i18n/rich";
import { translateDynamic } from "@/i18n/translate";


const SignInPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [onMouseOver, setOnMouseOver] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const localizePath = useLocalizedPath();
  const t = useT();
  const tv = (message?: string) => (message ? translateDynamic(t, message, message) : "");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleMouseEnter = (option: string) => {
    setOnMouseOver(option);
  };

  const handleMouseLeave = () => {
    setOnMouseOver(null);
  };

  const onSubmit = async (data: SignInForm) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    try {
      const result = await signInAction(formData);

      if (result.success) {
        window.location.href = localizePath(result.role === "admin" ? "/product-entry" : "/offers");
      } else {
        console.error("Sign in failed:", result.error);
        setError(t("auth.invalidCredentials"));
        setLoading(false);
      }
    } catch (err) {
      console.error("Sign in failed:", err);
      setError(t("auth.genericError"));
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col md:flex-row h-screen w-full font-roboto">
      {/* Left Side - Hero Image */}
      <div className="relative md:w-1/2 h-64 md:h-auto flex flex-col justify-between">
        <Image
          src="/AuthClothPhoto.jpg"
          alt=""
          className="object-cover"
          fill
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-r from-vintage-green/80 to-gray-50" />

        <div className="relative z-10 p-6 md:p-12 text-white flex flex-col justify-center h-full">
          <Link href="/" className="block mb-8 w-40 md:w-64">
            Methys
          </Link>

          <section className="mt-auto">
            <h1 className="text-3xl md:text-6xl mb-4 text-vintage-green leading-tight font-bold">
              {t("auth.heroTitle")}
            </h1>
            <p className="text-base md:text-2xl text-vintage-green max-w-md">
              {t("auth.heroText")}
            </p>
          </section>

          <div className="mt-8 text-sm md:text-lg">
            <p>
              {rich(t("auth.copyright", { year: new Date().getFullYear() }), {
                brand: <span className="text-default-yellow">Methys</span>,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gray-50 relative py-8 px-6 md:px-12">
        <div className="absolute top-6 right-6 md:top-28 md:right-24 text-sm md:text-lg">
          <span className="text-gray-900 mr-1">{t("auth.newUser")}</span>
          <Link
            href="/createAccount"
            className="text-vintage-green hover:underline font-medium"
          >
            {t("auth.createAccountLink")}
          </Link>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-lg space-y-6 mt-16"
        >
          <h2 className="text-xl md:text-2xl font-bold text-vintage-green">
            {t("auth.signIn")}
          </h2>

          {/* Social Sign In Buttons */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Google Sign In */}
            <button
              type="button"
              onMouseEnter={() => handleMouseEnter("google")}
              onMouseLeave={handleMouseLeave}
              className={`flex items-center justify-start gap-4 px-4 py-2 border border-gray-300 bg-vintage-white/50 rounded-3xl w-full transition-all ${
                onMouseOver === "google"
                  ? "scale-105 shadow-2xl shadow-vintage-green"
                  : "hover:bg-gray-100"
              }`}
            >
              <Image
                src="/google.jpg"
               
                className="w-10 h-10 rounded-full"
                width={40}
                height={40}
                alt="Google"
              />
              <p className="text-vintage-green text-sm font-medium">
                {t("auth.signInWithGoogle")}
              </p>
            </button>

            {/* Facebook Sign In */}
            <button
              type="button"
              onMouseEnter={() => handleMouseEnter("facebook")}
              onMouseLeave={handleMouseLeave}
              className={`flex items-center justify-start gap-4 px-4 py-2 border border-gray-300 bg-vintage-white/50 rounded-3xl w-full transition-all ${
                onMouseOver === "facebook"
                  ? "scale-105 shadow-2xl shadow-vintage-green"
                  : "hover:bg-gray-100"
              }`}
            >
              <Image
                src="/facebook.png"
               
                className="w-9 h-9 rounded-full"
                width={40}
                height={40}
                alt="Facebook"
              />
              <p className="text-vintage-green text-sm font-medium">
                {t("auth.signInWithFacebook")}
              </p>
            </button>
          </div>

          <div className="text-center text-vintage-green text-sm">
            {t("auth.orSignInWithEmail")}
          </div>

          {/* Email and Password Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-vintage-green mb-1">
                {t("auth.email")}
              </label>
              <input
                {...register("email")}
                type="email"
                disabled={loading}
                className={`mt-1 block w-full h-12 rounded-xl px-4 border shadow-sm focus:ring-2 focus:ring-vintage-green focus:border-vintage-green transition-colors ${
                  errors.email ? "border-red-500" : "border-vintage-green"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder={t("auth.emailPlaceholder")}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {tv(errors.email.message)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-vintage-green mb-1">
                {t("auth.password")}
              </label>
              <input
                {...register("password")}
                type="password"
                disabled={loading}
                className={`mt-1 block w-full h-12 rounded-xl px-4 border shadow-sm focus:ring-2 focus:ring-vintage-green focus:border-vintage-green transition-colors ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder={t("auth.passwordPlaceholder")}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {tv(errors.password.message)}
                </p>
              )}
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-sm">
            <label className="flex items-center gap-2 text-gray-900 cursor-pointer">
              <input
                {...register("rememberMe")}
                type="checkbox"
                disabled={loading}
                className="h-4 w-4 text-vintage-green border-gray-300 rounded focus:ring-vintage-green disabled:opacity-50"
              />
              {t("auth.rememberMe")}
            </label>
            <Link
              href="/forgot-password"
              className="text-vintage-green hover:underline font-medium"
            >
              {t("auth.forgotPassword")}
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-vintage-green hover:bg-vintage-green/90 text-white py-3 rounded-full shadow-md font-medium focus:outline-none focus:ring-2 focus:ring-vintage-green focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? t("auth.signingIn") : t("auth.signIn")}
          </button>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-center text-sm">{error}</p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default SignInPage;