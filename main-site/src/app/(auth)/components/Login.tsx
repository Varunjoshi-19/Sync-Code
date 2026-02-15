"use client";

import { ApiEndPoints } from "@/app/Config/endPoints";
import { LoginFormData, loginSchema } from "@/app/schema/auth.schema";
import { useRoomStore } from "@/app/Store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";


export default function Login({ dilogBox = false, setClose }: { dilogBox?: boolean, setClose?: React.Dispatch<React.SetStateAction<boolean>> }) {

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
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Login failed");
        return;
      }

      const userInfo = {
        id: result.user.id,
        fullName: result.user.fullName,
        email: result.user.email,
      };

      toast.success("Logged in successfully!");
      setUser(userInfo);
      setLoggedIn(true);

      if (!dilogBox) {
        router.push("/");
      }
      if (setClose) setClose(false);
    } catch (err) {
      console.error("Login error", err);
    }
  };


  return (
    <div
      className={
        dilogBox
          ? "fixed inset-0 flex items-center justify-center bg-[#4d4d4da3] bg-opacity-50 z-50"
          : "min-h-screen flex flex-col items-center justify-center bg-white"
      }
      onClick={(e) => {
        if (setClose) setClose(false);

      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={
          dilogBox
            ? "bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
            : "w-full max-w-lg px-6"
        }
      >
        <h1 className="text-[2rem] text-center mb-6">
          Log in to access your saved code
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
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
            {isSubmitting ? "Logging..." : "Login"}
          </button>

          <div className="text-center text-sm">
            <p className="mb-2">
              New to CodeSync?{" "}
              <a href="/register" className="text-blue-600 cursor-pointer">
                Sign up here.
              </a>
            </p>
            <a className="text-blue-600 cursor-pointer">Forgot your password?</a>
          </div>
        </form>
      </div>
    </div>
  );

}
