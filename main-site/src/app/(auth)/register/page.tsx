"use client";
import { registrationSchema, RegisterFormData } from "../../schema/auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function RegisterForm() {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registrationSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    console.log("Signup data:", data);

    // call your API here
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-[3rem] text-center mb-8">
        Sign up to save code
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg px-6">

        {/* FULL NAME */}
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">
            Your full name
          </label>

          <input
            {...register("fullName")}
            type="text"
            className="w-full px-3 py-3 bg-blue-50 border border-gray-200 rounded focus:outline-none"
          />

          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* EMAIL */}
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

        {/* PASSWORD */}
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
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </button>

        <div className="text-center text-sm">
          <p className="mb-2">
            Already signed up?{" "}
            <a href="/login" className="text-blue-600 cursor-pointer">
              Log in here.
            </a>
          </p>
        </div>
      </form>
    </div>
  );

}
