"use client";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SignUpPage from "../login/page";
import Logo from "../../../svgs/logo";

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
      const res = await fetch("/api/create-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password, 
          firstname: data.firstName, // Changed from full_name to firstname
          lastname: data.lastName,
          telephone: data.telephone,
          birthday: data.birthday,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Failed to create account.");
      } else {
        setSuccess("Account created successfully!");
        reset();
      }
    } catch (error) {
      console.log(error);
      
      setError("Something went wrong.");
      setLoading(false);
    } 
  };

  if (showSignUpPage) {
    return <SignUpPage />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen text-black">
      {/* Left Section */}
      <div
        className="relative md:w-1/2 h-64 md:h-auto flex flex-col justify-between"
        style={{
          backgroundImage: "url('AuthClothPhoto.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/50 to-white"></div>
        <div className="relative z-10 p-6 md:p-12 text-white flex flex-col justify-center h-full">
          <Link href="/" className="block mb-8 w-40 md:w-64">
            <Logo size={250} />
          </Link>
          <section className="mt-auto">
            <h1 className="text-3xl md:text-6xl font-bold mb-4 text-cyan-900/80 leading-tight">
              Dress Beyond Limits..
            </h1>
            <p className="text-base md:text-2xl font-roboto text-cyan-900/80 max-w-md">
              Elevate your everyday. Explore styles designed to turn heads
              crafted for those who dont settle.
            </p>
          </section>
          <div className="mt-8 text-sm md:text-lg">
            <p>2025 UrbanValor. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="md:w-1/2 w-full flex flex-col items-center justify-center bg-white px-6 md:px-16 py-12 md:py-0">
        <div className="flex justify-end w-full mb-8 font-poppins text-sm md:text-lg">
          <p className="mr-2 text-gray-900">Already a member?</p>
          <a
            href="#"
            onClick={handleSignInClick}
            className="text-cyan-800 font-semibold hover:underline"
          >
            Sign in
          </a>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-lg space-y-6"
        >
          <h1 className="font-bold text-2xl text-cyan-800 mb-4">Sign up</h1>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                {...register("firstName")}
                type="text"
                placeholder="First Name"
                className={`w-full h-12 rounded-xl px-4 text-center shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
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
                className={`w-full h-12 rounded-xl px-4 text-center shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
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
              className="block text-sm font-poppins text-black mb-1"
            >
              Birthday
            </label>
            <input
              {...register("birthday")}
              type="date"
              max={new Date().toISOString().split("T")[0]}
              className={`w-full h-12  rounded-xl px-4 text-center shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.birthday ? "border-red-500" : "border-gray-300"
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
              className={`w-full h-12  rounded-xl px-4 text-center shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
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
              className={`w-full h-12  rounded-xl px-4 text-center shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.telephone ? "border-red-500" : "border-gray-300"
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
                className={`w-full h-12 rounded-xl px-4 text-center shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
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
                className={`w-full h-12  rounded-xl px-4 text-center shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.repeatPassword ? "border-red-500" : "border-gray-300"
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
            <label className="flex items-center gap-2 text-gray-900 text-sm cursor-pointer select-none">
              <input
                {...register("acceptTerms")}
                type="checkbox"
                className="w-5 h-5 rounded border-gray-400 accent-blue-600"
              />
              <span>
                I accept the{" "}
                <a href="#" className="text-cyan-600 hover:underline">
                  Terms and Conditions
                </a>
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="text-red-500 text-sm mt-1">
                {errors.acceptTerms.message}
              </p>
            )}
          </div>

          {error && (
            <div className="text-red-600 font-semibold text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-600 font-semibold text-center">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-900 hover:bg-cyan-700 text-white font-semibold rounded-xl py-3 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountPage;
