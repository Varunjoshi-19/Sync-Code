"use client";

import { LoginFormData, loginSchema } from "@/app/schema/auth.schema";
import { useRoomStore } from "@/app/Store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

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

  const router = useRouter();
  const { setUser, setLoggedIn } = useRoomStore();


  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Login failed");
        return;
      }

      console.log(result);
      toast.success("Logged In successfully !!");
      localStorage.setItem("user-detail", JSON.stringify(result.user));
      setUser(result.user);
      setLoggedIn(true);
      router.push("/");
    } catch (err) {
      console.log("Login error", err);
    }
  };


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
