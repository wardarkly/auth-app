"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { getThaiAuthError } from "@/lib/auth-error";
import { Lock, User } from "lucide-react";

const signInSchema = z.object({
  username: z
    .string()
    .min(2, { message: "ชื่อผู้ใช้ควรมากกว่า 4 ตัวอักษร" })
    .max(50),
  password: z
    .string()
    .min(8, { message: "รหัสผ่านควรมากกว่า 8 ตัวอักษร" })
    .max(50),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await authClient.signIn.username({
        username: values.username,
        password: values.password,
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/dashboard";
          },
          onError: (ctx) => {
            signInForm.setError("root", {
              message: getThaiAuthError(ctx.error),
            });
          },
        },
      });
    } catch (error) {
      signInForm.setError("root", {
        message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form {...signInForm}>
      <form
        className={cn("space-y-4 px-6", className)}
        onSubmit={signInForm.handleSubmit(onSubmit)}
      >
        <FormField
          control={signInForm.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>ชื่อผู้ใช้</FormLabel> */}
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="ชื่อผู้ใช้"
                    disabled={isLoading}
                    {...field}
                    className="pl-10 py-6"
                  />
                </div>
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={signInForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>รหัสผ่าน</FormLabel> */}
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="••••••••"
                    {...field}
                    type="password"
                    className="pl-10 py-6 "
                  />
                </div>
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {signInForm.formState.errors.root && (
          <p className="text-sm text-destructive">
            {signInForm.formState.errors.root.message}
          </p>
        )}
        <Button
          type="submit"
          // className="w-full bg-linear-to-r from-purple-600 to-pink-600 py-6 text-white transition-all hover:from-purple-700 hover:to-pink-700 hover:shadow-md"
          className="w-full py-6"
          disabled={isLoading}
        >
          {isLoading ? "กำลังลงชื่อเข้าใช้..." : "ลงชื่อเข้าใช้"}
        </Button>
      </form>
    </Form>
  );
}
