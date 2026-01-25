import SignUpForm from "@/components/auth/signup-form";
import LicenseFooter from "@/components/LicenseFooter";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";

async function SignUpPage() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-center">
        <Card className="w-full border-none bg-white/90 shadow-xl backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center items-center">
            <h2 className="text-2xl font-bold text-purple-900">สมัครสมาชิก</h2>
            <p className="text-sm text-gray-500">
              กรุณากรอกข้อมูลเพื่อสร้างบัญชีผู้ใช้
            </p>
          </CardHeader>
          <CardContent>
            <SignUpForm />
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">มีบัญชีอยู่แล้ว? </span>
              <Link
                href="/sign-in"
                className="text-primary hover:underline font-medium"
              >
                เข้าสู่ระบบ
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

export default SignUpPage;
