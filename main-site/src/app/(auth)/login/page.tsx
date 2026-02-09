"use client";

import { LoginFormData, loginSchema } from "@/app/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log("Login data ", data);
   
    

  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-[3rem] text-center mb-8">
        Log in to access your saved code
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg px-6">

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">
            Email address
          </label>
          <input
            {...register("email")}
            type="email"
            className="w-full px-3 py-3 bg-blue-50 border border-gray-200 rounded focus:outline-none"
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-500 mb-1">
            Password
          </label>

          <input
            {...register("password")}
            type="password"
            className="w-full px-3 py-3 bg-blue-50 border border-gray-200 rounded focus:outline-none"
          />

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className="w-full bg-pink-500 text-white py-3 rounded mb-6 hover:bg-pink-600 disabled:opacity-50"
        >
          {isSubmitting ? "Loging..." : "Login"}
        </button>

        <div className="text-center text-sm">
          <p className="mb-2">
            New to CodeSync? <a href="/register" className="text-blue-600 cursor-pointer">Sign up here.</a>
          </p>

          <a className="text-blue-600 cursor-pointer">
            Forgot your password?
          </a>
        </div>
      </form>
    </div>
  );
}
