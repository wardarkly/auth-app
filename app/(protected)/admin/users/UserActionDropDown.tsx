"use client";

import { User } from "@/generated/prisma/client";
import { useState } from "react";
import UserEditDialog from "./UserEditDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserPen } from "lucide-react";
import UserDeleteDialog from "./UserDeleteDialog";

export default function UserActionDropDown({ user }: { user: User }) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  return (
    <>
      <UserEditDialog
        user={user}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
      <UserDeleteDialog
        user={user}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-center">
            <Button size="icon-sm">
              <span className="sr-only">Open menu</span>
              <UserPen />
            </Button>
          </div>
          {/* <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
              </Button> */}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {/* <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
              >
              Copy payment ID
              </DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            แก้ไขข้อมูล
          </DropdownMenuItem>
          <DropdownMenuItem>จัดการสิทธิ์</DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            ลบ
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
