"use client";

import { useState} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/_lib/supabase/client";
import CreateAccountPage from "../createAccount/page";
import SignUpPage from "../login/page";
import Link from "next/link";

import {
  ForgotPasswordForm,
  forgotPasswordSchema,
} from "../../../_lib/utils/zod";

const ForgotPasswordPage = () => {
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showSignUpPage, setShowSignUpPage] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSubmitted(true);
    }
  } catch {
    setErrorMsg("An unexpected error occurred. Please try again.");
  }
};

  if (showCreateAccount) return <CreateAccountPage />;
  if (showSignUpPage) return <SignUpPage />;

  return (
    <div className="flex flex-col md:flex-row h-full min-h-screen font-roboto">
      {/* LEFT */}
      <div className="relative w-full md:w-1/2 h-[70vh] md:h-auto flex flex-col justify-between">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('AuthClothPhoto.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-vintage-green/90 to-gray-50" />
        <div className="relative z-10 p-6 md:p-8 text-white">
         <Link href="/" className="block mb-8 w-40 md:w-64">
            Methys
          </Link>

          <section className="flex flex-col mt-10 md:mt-48">
            <h1 className="text-3xl md:text-7xl font-bold mb-3 md:mb-4 text-vintage-green">
              Dress Beyond Limits..
            </h1>
            <p className="text-lg md:text-4xl font-roboto text-vintage-green">
              Elevate your everyday. Explore styles designed to turn heads
              crafted for those who don’t settle.
            </p>
          </section>
        </div>
        <div className="relative z-10 p-6 md:p-8">
          <p className="text-sm md:text-xl text-white">
            2025 <span className="text-default-yellow">UrbanValor</span>. All
            rights reserved.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full md:w-1/2 flex flex-col bg-gray-50 items-center justify-center relative py-10 px-6">
        <div className="absolute top-4 right-4 md:top-28 md:right-24 font-poppins text-sm md:text-lg">
          <label className="text-lg text-black">New user?</label>
          <span>
            <Link
              href="/createAccount"
              onClick={() => setShowCreateAccount(true)}
              className="text-lg text-vintage-green hover:underline"
            
            >
              Create an account
            </Link>
          </span>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-[440px] mt-8 flex flex-col gap-4 px-4"
        >
          <label className="text-start font-poppins text-sm md:text-base text-vintage-green">
            Your email
          </label>
          <input
            type="email"
            className="w-full h-12 md:h-14 rounded-3xl text-center text-base font-poppins border border-vintage-green"
            placeholder="Enter your email"
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-600 text-sm font-poppins">
              {errors.email.message}
            </span>
          )}
          {errorMsg && <span className="text-red-600 text-sm">{errorMsg}</span>}
          {submitted && (
            <span className="text-vintage-green text-sm">
              Check your email for the reset link.
            </span>
          )}
          <button
            type="submit"
            className="w-full h-12 md:h-14 rounded-3xl hover-colors"
          >
            Submit
          </button>
          <div className="flex justify-start">
            <Link
              href="/login"
              onClick={() => setShowSignUpPage(true)}
              className="text-sm text-vintage-green font-poppins hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;