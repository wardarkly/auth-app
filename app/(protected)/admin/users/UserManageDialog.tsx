"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/generated/prisma/client";
import { Dispatch, SetStateAction } from "react";

export default function UserManageDialog({
  user,
  open,
  onOpenChange,
}: {
  user?: User;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>จัดการผู้ใช้งาน</DialogTitle>
        </DialogHeader>
        <form className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
          {/* ==== Section: User Info ==== */}
          <div className="lg:col-span-2 text-sm font-semibold text-muted-foreground">
            ข้อมูลผู้ใช้ {user?.name}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
