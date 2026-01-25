"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/generated/prisma/client";
import { BadgeCustomColor } from "@/components/ui/badgeCustom";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import UserActionDropDown from "./UserActionDropDown";

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "nameAndEmail",
    accessorFn: (row) => `${row.name} ${row.email}`,
    // header: "Name & Email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Name & Email"} />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex flex-col space-x-2">
          <div className="font-medium leading-none">{user.name}</div>
          <div className="text-muted-foreground text-sm">{user.email}</div>
        </div>
      );
    },
  },
  {
    id: "department",
    accessorKey: "department",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"หน่วยบริการ"} />
    ),
  },
  {
    accessorKey: "position",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"ตำแหน่ง"} />
    ),
  },

  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Role"} />
    ),
  },
  {
    id: "status",
    accessorFn: (row) => {
      switch (true) {
        case !row.isApproved && row.isActive && !row.banned:
          return "pending";
        case row.banned:
          return "ban";
        case row.isApproved && row.isActive && !row.banned:
          return "active";
        case row.isApproved && !row.isActive && !row.banned:
          return "inactive";
        default:
          return "all";
      }
    },
    header: "Status",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="">
          {!user.isApproved && <BadgeCustomColor status="pending" />}
          {user.isApproved && !user.isActive && <BadgeCustomColor />}
          {user.banned && <BadgeCustomColor status="ban" />}
          {user.isApproved && user.isActive && !user.banned && (
            <BadgeCustomColor status="active" />
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const user = row.original;
      return <UserActionDropDown user={user} />;
    },
  },
];
