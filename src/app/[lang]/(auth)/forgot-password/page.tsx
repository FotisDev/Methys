"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabasePublic } from "@/_lib/supabase/client";
import CreateAccountPage from "../createAccount/page";
import SignUpPage from "../login/page";
import Link from "@/components/LocaleLink/LocaleLink";
import { useLocale, useT } from "@/i18n/client";
import { rich } from "@/i18n/rich";
import { translateDynamic } from "@/i18n/translate";

import {
  ForgotPasswordForm,
  forgotPasswordSchema,
} from "../../../../_lib/utils/zod";
import { cn } from "@/_lib/utils/cn";

const ForgotPasswordPage = () => {
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showSignUpPage, setShowSignUpPage] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const t = useT();
  const locale = useLocale();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setErrorMsg(null);
    setSubmitted(false);

    try {
      const { error } = await supabasePublic.auth.resetPasswordForEmail(
        data.email,
        {
          redirectTo: `${window.location.origin}/${locale}/reset-password`,
        },
      );

      if (error) {
        console.error("Password reset request failed:", error.message);
        setErrorMsg(t("auth.genericError"));
      } else {
        setSubmitted(true);
      }
    } catch {
      setErrorMsg(t("auth.genericError"));
    }
  };

  if (showCreateAccount) return <CreateAccountPage />;
  if (showSignUpPage) return <SignUpPage />;

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row h-full min-h-screen font-roboto",
      )}
    >
      {/* LEFT */}
      <div
        className={cn(
          "relative w-full md:w-1/2 h-[70vh] md:h-auto flex flex-col justify-between",
        )}
      >
        <div
          className={cn("absolute inset-0 bg-cover bg-center")}
          style={{ backgroundImage: "url('/AuthClothPhoto.jpg')" }}
        />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-vintage-green/90 to-gray-50",
          )}
        />
        <div className={cn("relative z-10 p-6 md:p-8 text-white")}>
          <Link href="/" className={cn("block mb-8 w-40 md:w-64")}>
            Methys
          </Link>

          <section className={cn("flex flex-col mt-10 md:mt-48")}>
            <h1
              className={cn(
                "text-3xl md:text-7xl font-bold mb-3 md:mb-4 text-vintage-green",
              )}
            >
              {t("auth.heroTitle")}
            </h1>
            <p
              className={cn(
                "text-lg md:text-4xl font-roboto text-vintage-green",
              )}
            >
              {t("auth.heroText")}
            </p>
          </section>
        </div>
        <div className={cn("relative z-10 p-6 md:p-8")}>
          <p className={cn("text-sm md:text-xl text-white")}>
            {rich(t("auth.copyright", { year: new Date().getFullYear() }), {
              brand: <span className={cn("text-default-yellow")}>Methys</span>,
            })}
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div
        className={cn(
          "w-full md:w-1/2 flex flex-col bg-gray-50 items-center justify-center relative py-10 px-6",
        )}
      >
        <div
          className={cn(
            "absolute top-4 right-4 md:top-28 md:right-24 fond-sans text-sm md:text-lg",
          )}
        >
          <label className={cn("text-lg text-black")}>
            {t("auth.newUser")}
          </label>
          <span>
            <Link
              href="/createAccount"
              onClick={() => setShowCreateAccount(true)}
              className={cn("text-lg text-vintage-green hover:underline")}
            >
              {" "}
              {t("auth.createAccountLink")}
            </Link>
          </span>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={cn("w-full max-w-[440px] mt-8 flex flex-col gap-4 px-4")}
        >
          <label
            className={cn(
              "text-start fond-sans text-sm md:text-base text-vintage-green",
            )}
          >
            {t("auth.yourEmail")}
          </label>
          <input
            type="email"
            className={cn(
              "w-full h-12 md:h-14 rounded-3xl text-center text-base fond-sans border border-vintage-green",
            )}
            placeholder={t("auth.enterEmail")}
            {...register("email")}
          />
          {errors.email && (
            <span className={cn("text-red-600 text-sm fond-sans")}>
              {translateDynamic(
                t,
                errors.email.message ?? "",
                errors.email.message ?? "",
              )}
            </span>
          )}
          {errorMsg && (
            <span className={cn("text-red-600 text-sm")}>{errorMsg}</span>
          )}
          {submitted && (
            <span className={cn("text-vintage-green text-sm")}>
              {t("auth.resetLinkSent")}
            </span>
          )}
          <button
            type="submit"
            className={cn("w-full h-12 md:h-14 rounded-3xl hover-colors")}
          >
            {t("auth.submit")}
          </button>
          <div className={cn("flex justify-start")}>
            <Link
              href="/login"
              onClick={() => setShowSignUpPage(true)}
              className={cn(
                "text-sm text-vintage-green fond-sans hover:underline",
              )}
            >
              {t("auth.backToSignIn")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
