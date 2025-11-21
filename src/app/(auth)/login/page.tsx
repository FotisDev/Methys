"use client";

import myImageLoader from "@/_lib/utils/myImageLoader";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { supabase } from "@/_lib/supabaseClient";

import Logo from "../../../svgs/logo";

import { signInSchema, type SignInForm } from "../../../_lib/utils/zod";

const SignUpPage = () => {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [onMouseOver, setOnMouseOver] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [forgotPassword, setForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleCreateAccountClick = () => {
    setShowCreateAccount(true);
  };

  const handleForgotPasswordClick = () => {
    setForgotPassword(true);
  };

  const onSubmit = async (data: SignInForm) => {
    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError) {
          setError("Δεν βρέθηκε ρόλος χρήστη");
          return;
        }

        if (profile.role === "admin") {
          router.push("/product-entry");
        } else {
          router.push("/offers");
        }
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col md:flex-row h-screen w-full font-roboto">
      <div
        className="relative md:w-1/2 h-64 md:h-auto flex flex-col justify-between"
      >
        <Image
          src={"/AuthClothPhoto.jpg"}
          alt="Methys"
          className="object-cover"
          fill
        />

        <div className="absolute inset-0 bg-gradient-to-r from-vintage-green/80 to-gray-50"></div>
        <div className="relative z-10 p-6 md:p-12 text-white flex flex-col justify-center h-full">
          <Link href="/" className="block mb-8 w-40 md:w-64">
            Methys
          </Link>
          <section className="mt-auto">
            <h1 className="text-3xl md:text-6xl  mb-4 text-vintage-green leading-tight">
              Dress Beyond Limits..
            </h1>
            <p className="text-base md:text-2xl  text-vintage-green max-w-md">
              Elevate your everyday. Explore styles designed to turn heads
              crafted for those who dont settle.
            </p>
          </section>
          <div className="mt-8 text-sm md:text-lg">
            <p>
              2025 <span className="text-default-yellow">UrbanValor</span>. All
              rights reserved.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gray-50 relative py-8 px-6 md:px-12">
        <div className="absolute top-6 right-6 md:top-28 md:right-24 text-sm md:text-lg ">
          <label htmlFor="remember-me" className="text-gray-900 mr-1">
            New user?
          </label>
          <Link
            href="/createAccount"
            onClick={handleCreateAccountClick}
            className="text-vintage-green hover:underline"
          >
            Create an account
          </Link>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-lg space-y-6 mt-16"
        >
          <h1 className="text-xl md:text-2xl  text-vintage-green">Sign in</h1>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <div
              onMouseEnter={() => handleMouseEnter("google")}
              onMouseLeave={handleMouseLeave}
              className={`flex items-center justify-start gap-4 px-4 py-2 cursor-pointer ${
                onMouseOver === "google"
                  ? "scale-105 shadow-2xl shadow-vintage-green"
                  : ""
              } transition-all rounded-3xl w-full`}
            >
              <Image
                src="/google.jpg"
                loader={myImageLoader}
                className="w-10 h-10 rounded-full opacity-70"
                width={40}
                height={40}
                alt="Google.jpg"
              />
              <p className="text-vintage-green  text-sm">Sign in with Google</p>
            </div>

            {/* Facebook Sign In */}
            <div
              onMouseEnter={() => handleMouseEnter("facebook")}
              onMouseLeave={handleMouseLeave}
              className={`flex items-center justify-start gap-4 px-4 py-2 cursor-pointer ${
                onMouseOver === "facebook"
                  ? "scale-105 shadow-2xl shadow-vintage-green"
                  : ""
              } transition-all rounded-3xl w-full`}
            >
              <Image
                src="/facebook.png"
                loader={myImageLoader}
                className="w-9 h-9 rounded-full opacity-70"
                width={40}
                height={40}
                alt="Facebook"
              />
              <p className="text-vintage-green  text-sm">
                Sign in with Facebook
              </p>
            </div>
          </div>

          <div className="text-center text-vintage-green text-sm ">
            or sign in using email
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm  text-vintage-green">Email</label>
              <input
                {...register("email")}
                type="email"
                className={`mt-1 block w-full h-12 rounded-xl text-center border shadow-sm  focus:ring-vintage-green focus:border-vintage-green ${
                  errors.email ? "border-red-500" : "border-vintage-green"
                }`}
                placeholder="Please enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm  text-vintage-green">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                className={`mt-1 block w-full h-12 rounded-xl text-center border shadow-sm  focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-sm">
            <label className="flex items-center gap-2 text-gray-900">
              <input
                {...register("rememberMe")}
                type="checkbox"
                className="h-4 w-4 text-vintage-green border-gray-300 rounded"
              />
              Remember me
            </label>
            <Link
              href="/forgot-password"
              onClick={handleForgotPasswordClick}
              className="text-vintage-green  hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full hover-colors py-2 rounded-full shadow-md  focus:outline-none focus:ring-2  focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {error && (
            <p className="text-red-600  text-center text-sm">{error}</p>
          )}
        </form>
      </div>
    </section>
  );
};

export default SignUpPage;
