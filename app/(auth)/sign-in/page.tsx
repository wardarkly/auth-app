import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import LicenseFooter from "@/components/LicenseFooter";

export default function SignInPage() {
  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-md border-none bg-white/90 shadow-xl backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center items-center">
            <div className="flex items-center justify-center">
              <Image
                src="/hospital-logo.png"
                alt="โรงพยาบาลบ้านนา Logo"
                width={80}
                height={80}
                className="h-16 w-auto"
                priority
              />
            </div>
            <h2 className="text-2xl font-bold text-primary">
              เข้าสู่ระบบ Lab Viewer
            </h2>
            <p className="text-sm text-muted-foreground">
              กรุณาใส่ข้อมูลเพื่อเข้าสู่ระบบ
            </p>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">
                ยังไม่ได้เป็นสมาชิก?{" "}
              </span>
              <Link
                href="/sign-up"
                className="text-primary hover:underline font-medium"
              >
                ลงทะเบียน
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center justify-center space-y-2 pb-6">
            <LicenseFooter />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
