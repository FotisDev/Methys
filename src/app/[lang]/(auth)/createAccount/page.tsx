"use client";

import { useState } from "react";
import Link from "@/components/LocaleLink/LocaleLink";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabasePublic } from "@/_lib/supabase/client";
import SignUpPage from "../login/page";
import Image from "next/image";
import {
  createAccountSchema,
  type CreateAccountForm,
} from "../../../../_lib/utils/zod";
import { useT } from "@/i18n/client";
import { rich } from "@/i18n/rich";
import { translateDynamic } from "@/i18n/translate";
import { cn } from "@/_lib/utils/cn";

const CreateAccountPage = () => {
  const [showSignUpPage, setShowSignUpPage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const t = useT();
  const tv = (message?: string) =>
    message ? translateDynamic(t, message, message) : "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateAccountForm>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthday: "",
      email: "",
      telephone: "",
      password: "",
      repeatPassword: "",
      acceptTerms: false,
    },
  });

  const handleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSignUpPage(true);
  };

  const onSubmit = async (data: CreateAccountForm) => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const { error: signUpError } = await supabasePublic.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            telephone: data.telephone,
            birthdate: data.birthday,
            is_member: true,
          },
        },
      });

      if (signUpError) {
        console.error("Sign up failed:", signUpError.message);
        setError(t("auth.signUpFailed"));
      } else {
        setSuccess(t("auth.signUpSuccess"));
        reset();
      }
    } catch {
      setError(t("auth.genericError"));
    } finally {
      setLoading(false);
    }
  };

  if (showSignUpPage) {
    return <SignUpPage />;
  }

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row h-screen text-vintage-green font-roboto",
      )}
    >
      <div
        className={cn(
          "relative md:w-1/2 h-64 md:h-auto flex flex-col justify-between",
        )}
        // style={{
        //   backgroundImage: "url('AuthClothPhoto.jpg')",
        //   backgroundSize: "cover",
        //   backgroundPosition: "center",
        // }}
      >
        <Image
          src={"/AuthClothPhoto.jpg"}
          alt=""
          className={cn("object-cover")}
          fill
        />

        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-vintage-green/80 to-gray-50",
          )}
        ></div>
        <div
          className={cn(
            "relative z-10 p-6 md:p-12 text-white flex flex-col justify-center h-full",
          )}
        >
          <Link href="/" className={cn("block mb-8 w-40 md:w-64")}>
            Methys
          </Link>
          <section className={cn("mt-auto")}>
            <h1
              className={cn(
                "text-3xl md:text-6xl mb-4 text-vintage-green leading-tight",
              )}
            >
              {t("auth.heroTitle")}
            </h1>
            <p
              className={cn(
                "text-base md:text-2xl text-vintage-green max-w-md",
              )}
            >
              {t("auth.heroText")}
            </p>
          </section>
          <div className={cn("mt-8 text-sm md:text-lg")}>
            <p>
              {rich(t("auth.copyright", { year: new Date().getFullYear() }), {
                brand: (
                  <span className={cn("text-default-yellow")}>Methys</span>
                ),
              })}
            </p>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "md:w-1/2 w-full flex flex-col items-center justify-center bg-gray-50 px-6 md:px-16 py-12 md:py-0",
        )}
      >
        <div className={cn("flex justify-end w-full mb-8 text-sm md:text-lg")}>
          <p className={cn("mr-2 text-gray-900")}>{t("auth.alreadyMember")}</p>
          <Link
            href="/login"
            onClick={handleSignInClick}
            className={cn("text-vintage-green hover:underline")}
          >
            {t("auth.signIn")}
          </Link>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={cn("w-full max-w-lg space-y-6")}
        >
          <h2 className={cn("text-2xl text-vintage-green mb-4")}>
            {t("auth.signUp")}
          </h2>

          <div className={cn("flex flex-col md:flex-row gap-4")}>
            <div className={cn("flex-1")}>
              <input
                {...register("firstName")}
                type="text"
                placeholder={t("auth.firstName")}
                className={cn(
                  "w-full h-12 rounded-xl px-4 text-center shadow-sm focus:ring-2",
                  errors.firstName ? "border-red-500" : "border-vintage-green",
                )}
              />
              {errors.firstName && (
                <p className={cn("text-red-500 text-sm mt-1")}>
                  {tv(errors.firstName.message)}
                </p>
              )}
            </div>
            <div className={cn("flex-1")}>
              <input
                {...register("lastName")}
                type="text"
                placeholder={t("auth.lastName")}
                className={cn(
                  "w-full h-12 rounded-xl px-4 text-center shadow-sm focus:ring-2",
                  errors.lastName ? "border-red-500" : "border-vintage-green",
                )}
              />
              {errors.lastName && (
                <p className={cn("text-red-500 text-sm mt-1")}>
                  {tv(errors.lastName.message)}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="birthday"
              className={cn("block text-sm text-vintage-green mb-1")}
            >
              {t("auth.birthday")}
            </label>
            <input
              {...register("birthday")}
              type="date"
              max={new Date().toISOString().split("T")[0]}
              className={cn(
                "w-full h-12 rounded-xl px-4 text-center shadow-sm focus:ring-2",
                errors.birthday ? "border-red-500" : "border-vintage-green",
              )}
            />
            {errors.birthday && (
              <p className={cn("text-red-500 text-sm mt-1")}>
                {tv(errors.birthday.message)}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("email")}
              type="email"
              placeholder={t("auth.emailAddress")}
              className={cn(
                "w-full h-12 rounded-xl px-4 text-center shadow-sm focus:ring-2",
                errors.email ? "border-red-500" : "border-vintage-green",
              )}
            />
            {errors.email && (
              <p className={cn("text-red-500 text-sm mt-1")}>
                {tv(errors.email.message)}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("telephone")}
              type="tel"
              placeholder={t("auth.telephone")}
              className={cn(
                "w-full h-12 rounded-xl px-4 text-center shadow-sm focus:ring-2",
                errors.telephone ? "border-red-500" : "border-vintage-green",
              )}
            />
            {errors.telephone && (
              <p className={cn("text-red-500 text-sm mt-1")}>
                {tv(errors.telephone.message)}
              </p>
            )}
          </div>

          <div className={cn("flex flex-col md:flex-row gap-4")}>
            <div className={cn("flex-1")}>
              <input
                {...register("password")}
                type="password"
                placeholder={t("auth.password")}
                className={cn(
                  "w-full h-12 rounded-xl px-4 text-center shadow-sm focus:ring-2",
                  errors.password ? "border-red-500" : "border-vintage-green",
                )}
              />
              {errors.password && (
                <p className={cn("text-red-500 text-sm mt-1")}>
                  {tv(errors.password.message)}
                </p>
              )}
            </div>
            <div className={cn("flex-1")}>
              <input
                {...register("repeatPassword")}
                type="password"
                placeholder={t("auth.repeatPassword")}
                className={cn(
                  "w-full h-12 rounded-xl px-4 text-center shadow-sm focus:ring-2",
                  errors.repeatPassword
                    ? "border-red-500"
                    : "border-vintage-green",
                )}
              />
              {errors.repeatPassword && (
                <p className={cn("text-red-500 text-sm mt-1")}>
                  {tv(errors.repeatPassword.message)}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              className={cn(
                "flex items-center gap-2 text-vintage-green text-sm cursor-pointer select-none",
              )}
            >
              <input
                {...register("acceptTerms")}
                type="checkbox"
                className={cn(
                  "w-5 h-5 rounded border-vintage-green accent-vintage-green",
                )}
              />
              <span>
                {rich(t("auth.acceptTerms"), {
                  terms: (
                    <Link
                      href="/terms-conditions"
                      className={cn("text-default-cold hover:underline")}
                    >
                      {t("footer.termsConditions")}
                    </Link>
                  ),
                })}
              </span>
            </label>
            {errors.acceptTerms && (
              <p className={cn("text-red-500 text-sm mt-1")}>
                {tv(errors.acceptTerms.message)}
              </p>
            )}
          </div>

          {error && (
            <div className={cn("text-red-600 text-center")}>{error}</div>
          )}

          {success && (
            <div className={cn("text-green-600 text-center")}>{success}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full hover-colors rounded-xl py-3 transition disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            {loading ? t("auth.creatingAccount") : t("auth.createAccount")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountPage;
