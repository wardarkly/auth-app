import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/generated/prisma/client";
import { Dispatch, SetStateAction, useState } from "react";
import { adminDeleteUser } from "./actions";
import { toast } from "sonner";

export default function UserDeleteDialog({
  user,
  open,
  onOpenChange,
}: {
  user: User;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = async (userId: string) => {
    setIsLoading(true);
    const result = await adminDeleteUser(userId);
    if (result.success) {
      toast.success("ลบผู้ใช้สำเร็จ");
      setIsLoading(false);
      onOpenChange(false);
    } else {
      toast.error("ลบผู้ใช้ไม่สำเร็จ", {
        description: result.message,
      });
      setIsLoading(false);
    }
  };
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ต้องการลบผู้ใช้งานนี้หรือไม่?</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
            {/* ==== Section: User Info ==== */}
            <div className="lg:col-span-2 text-sm font-semibold text-muted-foreground">
              <div>ข้อมูลผู้ใช้</div>
              <div>ชื่อ: {user.name}</div>
              <div>อีเมล: {user.email}</div>
              <div>ตำแหน่ง: {user.position}</div>
              <div>หน่วยบริการ: {user.department}</div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant={"destructive"}
                disabled={isLoading}
                onClick={() => handleDelete(user.id)}
              >
                {isLoading ? "กําลังลบ..." : "ยืนยันการลบ"}
              </Button>
              <Button
                variant={"outline"}
                disabled={isLoading}
                onClick={() => onOpenChange(false)}
              >
                ยกเลิก
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
