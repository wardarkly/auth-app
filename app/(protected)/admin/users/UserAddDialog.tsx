"use client";

import { pcuList } from "@/components/auth/signup-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { authClient } from "@/lib/auth-client";
import { getThaiAuthError } from "@/lib/auth-error";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  HatGlasses,
  Hospital,
  IdCard,
  Lock,
  Mail,
  Phone,
  ShieldUser,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import { adminUserSchema } from "@/lib/schemas";
import { adminCreateUser } from "./actions";

const roleList: { roleid: string; rolename: "user" | "admin" }[] = [
  { roleid: "1", rolename: "user" },
  { roleid: "2", rolename: "admin" },
];

export default function UserAddDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof adminUserSchema>>({
    resolver: zodResolver(adminUserSchema),
    defaultValues: {
      name: "",
      cid: "",
      tel: "",
      email: "",
      position: "",
      department: "",
      username: "",
      password: "",
      confirmPassword: "",
      role: "user",
      isActive: true,
    },
  });
  const onSubmit = async (values: z.infer<typeof adminUserSchema>) => {
    setIsLoading(true);
    const result = await adminCreateUser(values);
    if (result.success) {
      toast.success("เพิ่มผู้ใช้สำเร็จ");
      form.reset();
      setOpen(false);
    } else {
      // --- การจัดการ Error โดยใช้ Code ที่ส่งมาจาก Server ---

      // 1. แสดง Toast เตือนภาพรวม
      toast.warning("เกิดข้อผิดพลาด");

      // 2. แยก Error ลงรายฟิลด์ (Mapping)
      switch (result.code) {
        case "CID_ALREADY_EXISTS_USE_ANOTHER_CID":
          form.setError("cid", {
            message: "เลขประจำตัวประชาชนนี้ถูกใช้งานแล้ว",
          });
          break;

        case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
          form.setError("email", { message: "อีเมลนี้ถูกใช้งานแล้ว" });
          break;

        case "USERNAME_IS_ALREADY_TAKEN_PLEASE_TRY_ANOTHER":
          form.setError("username", { message: "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว" });
          break;

        default:
          // ถ้าเป็น error อื่นๆ ให้แสดงที่ root (ก้อนใหญ่ด้านล่างฟอร์ม)
          form.setError("root", {
            message: getThaiAuthError({
              code: result.code,
              message: result.message,
              status: 400, // ใส่ค่า dummy ไว้เพื่อให้ตรงกับ type AuthError ของคุณ
              statusText: "Bad Request",
            }),
          });
          break;
      }
    }
    setIsLoading(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="overflow-auto max-h-[90vh] w-full sm:w-125 lg:w-175">
        <DialogHeader>
          <DialogTitle>เพิ่มผู้ใช้งาน</DialogTitle>
        </DialogHeader>
        {/* Form content for adding a user goes here */}
        <Form {...form}>
          {/* Form fields and submit button */}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 px-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0 lg:px-0 lg:items-start"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <Input
                        placeholder="ชื่อ-นามสกุล"
                        disabled={isLoading}
                        {...field}
                        className="pl-10 h-12 border-gray-200"
                      />
                    </div>
                  </FormControl>
                  {/* <FormDescription></FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cid"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                        <IdCard className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <Input
                        placeholder="เลขประจําตัวประชาชน"
                        disabled={isLoading}
                        {...field}
                        className="pl-10 h-12 border-gray-200"
                      />
                    </div>
                  </FormControl>
                  {/* <FormDescription></FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tel"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <Input
                        placeholder="เบอร์ติดต่อ"
                        disabled={isLoading}
                        {...field}
                        className="pl-10 h-12 border-gray-200"
                      />
                    </div>
                  </FormControl>
                  {/* <FormDescription></FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>ชื่อผู้ใช้</FormLabel> */}
                  <FormControl>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <Input
                        placeholder="อีเมล"
                        disabled={isLoading}
                        {...field}
                        className="pl-10 h-12 border-gray-200"
                      />
                    </div>
                  </FormControl>
                  {/* <FormDescription></FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>ชื่อผู้ใช้</FormLabel> */}
                  <FormControl>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                        <HatGlasses className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <Input
                        placeholder="ตำแหน่ง"
                        disabled={isLoading}
                        {...field}
                        className="pl-10 h-12 border-gray-200"
                      />
                    </div>
                  </FormControl>
                  {/* <FormDescription></FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>ชื่อผู้ใช้</FormLabel> */}
                  <FormControl>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                        <Hospital className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="pl-10 min-h-12 border-gray-200 w-full">
                          <SelectValue placeholder="หน่วยงาน / สังกัด" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned" side="bottom">
                          {pcuList.map((pcu) => (
                            <SelectItem key={pcu.pcucode} value={pcu.pcuname}>
                              {pcu.pcuname}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                  {/* <FormDescription></FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  {/* <FormLabel>ชื่อผู้ใช้</FormLabel> */}
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="ชื่อผู้ใช้ Username"
                        disabled={isLoading}
                        {...field}
                        className="pl-10 h-12 border-gray-200"
                      />
                    </div>
                  </FormControl>
                  {/* <FormDescription></FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="รหัสผ่าน"
                        disabled={isLoading}
                        {...field}
                        type="password"
                        className="pl-10 h-12 border-gray-200"
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="hidden lg:block">
                    รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร มี A-Z, a-z และตัวเลข
                    (ไม่อนุญาตให้วางรหัสผ่าน)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="ยืนยันรหัสผ่าน"
                        disabled={isLoading}
                        type="password"
                        {...field}
                        className="pl-10 h-12 border-gray-200"
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="lg:hidden">
                    รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร มี A-Z, a-z และตัวเลข
                    (ไม่อนุญาตให้วางรหัสผ่าน)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormControl>
                    <div className="relative">
                      <ShieldUser className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="pl-10 min-h-12 border-gray-200 w-full">
                          <SelectValue placeholder="สิทธิ์การใช้งาน" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned" side="bottom">
                          {roleList.map((role) => (
                            <SelectItem key={role.roleid} value={role.rolename}>
                              {role.rolename}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormControl>
                    <div className="flex items-center justify-between gap-3 px-2">
                      <div className="flex flex-col">
                        <FormLabel htmlFor="switch-active">
                          เปิดใช้งานผู้ใช้
                        </FormLabel>
                        <FormDescription>
                          ปิดการใช้งานผู้ใช้จะไม่สามารถเข้าสู่ระบบได้
                        </FormDescription>
                      </div>
                      <Switch
                        id="switch-active"
                        disabled={isLoading}
                        onCheckedChange={field.onChange}
                        checked={field.value as boolean}
                        defaultChecked={true}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <p className="text-sm text-destructive col-span-2">
                {form.formState.errors.root.message}
              </p>
            )}
            <Button
              type="submit"
              className="w-full py-6 transition-all col-span-2"
              disabled={isLoading}
            >
              {isLoading ? "กำลังเพิ่มผู้ใช้..." : "เพิ่มผู้ใช้"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
