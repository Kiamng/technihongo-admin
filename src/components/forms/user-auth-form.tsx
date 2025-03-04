"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Lock, Mail } from "lucide-react";
import { signIn } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

interface LoginFormValues {
  email: string;
  password: string;
}
export default function UserAuthForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsPending(true);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
    });

    setIsPending(false);

    if (result?.error) {
      toast.error("Login failed, check your email and password again!");
    } else {
      toast.success("Login successfully!");
    }
    const res = await fetch("/api/auth/session");
    const session = await res.json();

    if (session?.user?.role === "Administrator") {
      router.push("/dashboard");
    } else if (session?.user?.role === "Content Manager") {
      router.push("/course-management");
    }

  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-5"
      >
        <div className="grid w-full items-center gap-1.5 relative">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <Mail className="w-5 h-5" />
            </span>
            <Input
              className="pl-10"
              disabled={isPending}
              id="email"
              placeholder="Nhập email tại đây"
              type="email"
              {...register("email", {
                required: "Bạn cần phải nhập email",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email không hợp lệ",
                },
              })}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="grid w-full items-center gap-1.5 relative">
          <Label htmlFor="password">Mật khẩu</Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <Lock className="w-5 h-5" />
            </span>
            <Input
              className="pl-10 pr-10"
              disabled={isPending}
              id="password"
              placeholder="Nhập mật khẩu tại đây"
              type={"password"}
              {...register("password", {
                required: "Bạn cần phải nhập mật khẩu"
              })}
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button disabled={isPending} className="ml-auto w-full" type="submit">
          Login
        </Button>
      </form>
    </>
  );
}
