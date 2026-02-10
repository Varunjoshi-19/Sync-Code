"use client";
import { registrationSchema, RegisterFormData } from "../../schema/auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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

  const router = useRouter();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Registeration failed");
        return;
      }

      toast.success("Registeration successfully !!");
      router.push("/login");
    } catch (err) {
      console.log("Registeration error", err);
    }
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
