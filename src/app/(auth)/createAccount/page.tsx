"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/_lib/supabase/client";
import SignUpPage from "../login/page";
import Image from "next/image";
import {
  createAccountSchema,
  type CreateAccountForm,
} from "../../../_lib/utils/zod";

const CreateAccountPage = () => {
  const [showSignUpPage, setShowSignUpPage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      const { error: signUpError } = await supabase.auth.signUp({
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
        setError(signUpError.message);
      } else {
        setSuccess("Account created successfully! Check your email to verify.");
        reset();
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (showSignUpPage) {
    return <SignUpPage />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen text-vintage-green font-roboto">

      <div
        className="relative md:w-1/2 h-64 md:h-auto flex flex-col justify-between"
        // style={{
        //   backgroundImage: "url('AuthClothPhoto.jpg')",
        //   backgroundSize: "cover",
        //   backgroundPosition: "center",
        // }}
        >
        <Image 
        src={'/AuthClothPhoto.jpg'}
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
            <p>2025 <span className="text-default-yellow">UrbanValor</span>. All rights reserved.</p>
          </div>
        </div>
      </div>

      <div className="md:w-1/2 w-full flex flex-col items-center justify-center bg-gray-50 px-6 md:px-16 py-12 md:py-0">
        <div className="flex justify-end w-full mb-8  text-sm md:text-lg">
          <p className="mr-2 text-gray-900">Already a member?</p>
          <Link
            href="/login"
            onClick={handleSignInClick}
            className="text-vintage-green  hover:underline"
          >
            Sign in
          </Link>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-lg space-y-6"
        >
          <h1 className=" text-2xl text-vintage-green mb-4">Sign up</h1>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                {...register("firstName")}
                type="text"
                placeholder="First Name"
                className={`w-full h-12 rounded-xl px-4 text-center shadow-sm focus:ring-2 ${
                  errors.firstName ? "border-red-500" : "border-vintage-green"
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <input
                {...register("lastName")}
                type="text"
                placeholder="Last Name"
                className={`w-full h-12 rounded-xl px-4 text-center shadow-sm focus:ring-2  ${
                  errors.lastName ? "border-red-500" : "border-vintage-green"
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="birthday"
              className="block text-sm  text-vintage-green mb-1"
            >
              Birthday
            </label>
            <input
              {...register("birthday")}
              type="date"
              max={new Date().toISOString().split("T")[0]}
              className={`w-full h-12 rounded-xl px-4 text-center shadow-sm focus:ring-2  ${
                errors.birthday ? "border-red-500" : "border-vintage-green"
              }`}
            />
            {errors.birthday && (
              <p className="text-red-500 text-sm mt-1">
                {errors.birthday.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email Address"
              className={`w-full h-12 rounded-xl px-4 text-center shadow-sm focus:ring-2  ${
                errors.email ? "border-red-500" : "border-vintage-green"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("telephone")}
              type="tel"
              placeholder="Telephone"
              className={`w-full h-12 rounded-xl px-4 text-center shadow-sm focus:ring-2  ${
                errors.telephone ? "border-red-500" : "border-vintage-green"
              }`}
            />
            {errors.telephone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.telephone.message}
              </p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className={`w-full h-12 rounded-xl px-4 text-center shadow-sm focus:ring-2  ${
                  errors.password ? "border-red-500" : "border-vintage-green"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <input
                {...register("repeatPassword")}
                type="password"
                placeholder="Repeat Password"
                className={`w-full h-12 rounded-xl px-4 text-center shadow-sm focus:ring-2  ${
                  errors.repeatPassword ? "border-red-500" : "border-vintage-green"
                }`}
              />
              {errors.repeatPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.repeatPassword.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-vintage-green text-sm cursor-pointer select-none">
              <input
                {...register("acceptTerms")}
                type="checkbox"
                className="w-5 h-5 rounded border-vintage-green accent-vintage-green"
              />
              <span>
                I accept the{" "}
                <Link href="#" className="text-default-cold hover:underline">
                  Terms and Conditions
                </Link>
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="text-red-500 text-sm mt-1">
                {errors.acceptTerms.message}
              </p>
            )}
          </div>

          {error && (
            <div className="text-red-600  text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-600  text-center">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full hover-colors  rounded-xl py-3 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountPage;