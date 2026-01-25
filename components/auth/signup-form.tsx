"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getThaiAuthError } from "@/lib/auth-error";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  HatGlasses,
  Hospital,
  IdCard,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const pcuList: { pcucode: string; pcuname: string }[] = [
  { pcucode: "10864", pcuname: "รพ.บ้านนา" },
  { pcucode: "10196", pcuname: "รพ.สต.บ้านกะเหรี่ยง" },
  { pcucode: "02422", pcuname: "รพ.สต.บ้านละว้า" },
  { pcucode: "02421", pcuname: "รพ.สต.บ้านเขาน้อย" },
  { pcucode: "02420", pcuname: "รพ.สต.บ้านเขาเพิ่ม" },
  { pcucode: "02419", pcuname: "รพ.สต.บ้านกร่างประตูวัง" },
  { pcucode: "02418", pcuname: "รพ.สต.บ้านแหลมไม้ย้อย" },
  { pcucode: "02417", pcuname: "รพ.สต.บ้านบางอ้อ" },
  { pcucode: "02416", pcuname: "รพ.สต.บ้านคลอง 30" },
  { pcucode: "02415", pcuname: "รพ.สต.บ้านทองหลาง" },
  { pcucode: "02414", pcuname: "รพ.สต.บ้านไผ่ขวาง" },
  { pcucode: "02413", pcuname: "รพ.สต.บ้านพริก" },
  { pcucode: "02411", pcuname: "รพ.สต.บ้านทางกระบือ" },
  { pcucode: "02410", pcuname: "รพ.สต.บ้านหนองรี" },
  { pcucode: "01412", pcuname: "รพ.สต.บ้านหนองคันจาม" },
];

const signUpSchema = z
  .object({
    name: z.string().min(2, { message: "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร" }),
    cid: z.string().regex(/^\d{13}$/, {
      message: "เลขประจำตัวประชาชนต้องเป็นตัวเลข 13 หลัก",
    }),
    tel: z.string().regex(/^0\d{8,9}$/, {
      message: "เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 0 และมี 9 หรือ 10 หลัก",
    }),
    email: z.email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }),
    position: z
      .string()
      .min(2, { message: "ตำแหน่งต้องมีอย่างน้อย 2 ตัวอักษร" }),
    department: z
      .string()
      .min(2, { message: "หน่วยงานต้องมีอย่างน้อย 2 ตัวอักษร" }),
    username: z
      .string()
      .min(4, { message: "ชื่อผู้ใช้ต้องมีอย่างน้อย 4 ตัวอักษร" })
      .max(50),
    password: z
      .string()
      .min(8, { message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message: "รหัสผ่านต้องมีตัวพิมพ์เล็ก ตัวพิมพ์ใหญ่ และตัวเลข",
      }),

    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"], // 👈 ผูก error กับ field นี้
        message: "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน",
        code: "custom",
      });
    }
  });

export default function SignUpForm() {
  const preventPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
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
    },
  });
  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    setIsLoading(true);
    try {
      await authClient.signUp.email({
        email: values.email,
        name: values.name,
        cid: values.cid,
        tel: values.tel,
        position: values.position,
        department: values.department,
        username: values.username,
        password: values.password,
        isActive: true,
        isApproved: false,
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/pending-approval";
          },
          onError: (ctx) => {
            if (ctx.error.code === "CID_ALREADY_EXISTS_USE_ANOTHER_CID") {
              signUpForm.setError("cid", {
                message: "เลขประจำตัวประชาชนนี้ถูกใช้งานแล้ว",
              });
            } else {
              signUpForm.setError("root", {
                message: getThaiAuthError(ctx.error),
              });
            }
          },
        },
      });
    } catch (error) {
      signUpForm.setError("root", {
        message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form {...signUpForm}>
      <form
        className={cn(
          "space-y-4 px-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0 lg:px-0 lg:items-start"
        )}
        onSubmit={signUpForm.handleSubmit(onSubmit)}
      >
        <FormField
          control={signUpForm.control}
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
          control={signUpForm.control}
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
          control={signUpForm.control}
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
          control={signUpForm.control}
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
          control={signUpForm.control}
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
          control={signUpForm.control}
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
                      {/* <SelectItem value="โรงพยาบาลบ้านนา">
                        โรงพยาบาลบ้านนา
                      </SelectItem>
                      <SelectItem value="รพ.สต.ทองหลาง">
                        รพ.สต.ทองหลาง
                      </SelectItem> */}
                    </SelectContent>
                  </Select>
                  {/* <Input
                    placeholder="หน่วยงาน / สังกัด"
                    disabled={isLoading}
                    {...field}
                    className="pl-10 h-12 border-gray-200"
                  /> */}
                </div>
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={signUpForm.control}
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
          control={signUpForm.control}
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
                    onPaste={preventPaste}
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
          control={signUpForm.control}
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
                    onPaste={preventPaste}
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
        {signUpForm.formState.errors.root && (
          <p className="text-sm text-destructive col-span-2">
            {signUpForm.formState.errors.root.message}
          </p>
        )}
        <Button
          type="submit"
          className="w-full py-6 transition-all col-span-2"
          disabled={isLoading}
        >
          {isLoading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
        </Button>
      </form>
    </Form>
  );
}
