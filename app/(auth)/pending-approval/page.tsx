import { CheckCircle, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PendingApprovalPage() {
  return (
    <Card className="w-full max-w-md border-border shadow-lg">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-purple-900/10 flex items-center justify-center">
          <Clock className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl text-purple-900">
            บัญชีอยู่ระหว่างรอการอนุมัติ
          </CardTitle>
          <CardDescription className="text-base">
            บัญชีของคุณถูกสร้างขึ้นเรียบร้อยแล้ว
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
            <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="font-medium text-sm">การลงทะเบียนเสร็จสมบูรณ์</p>
              <p className="text-sm text-muted-foreground">
                ข้อมูลของคุณถูกส่งไปเพื่อตรวจสอบแล้ว
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
            <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="font-medium text-sm">รอการอนุมัติจากผู้ดูแลระบบ</p>
              <p className="text-sm text-muted-foreground">
                ผู้ดูแลระบบจะตรวจสอบบัญชีของคุณ
                คุณจะสามารถลงชื่อเข้าใช้ได้เมื่อได้รับการอนุมัติแล้ว
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground text-center mb-4">
            โดยปกติแล้วจะใช้เวลา 1-2 วันทำการ
          </p>
          <Link href="/sign-in" className="block">
            <Button className="w-full bg-linear-to-r from-purple-600 to-pink-600 py-6 text-white transition-all hover:from-purple-700 hover:to-pink-700 hover:shadow-md">
              กลับไปที่หน้าเข้าสู่ระบบ
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
