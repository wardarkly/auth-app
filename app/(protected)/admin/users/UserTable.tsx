"use client";

import { User } from "@/generated/prisma/client";
import { columns } from "@/app/(protected)/admin/users/columns";
import { DataTable } from "@/app/(protected)/admin/users/data-table";
import { UserWithRole } from "better-auth/plugins";

const UserTable = ({ users }: { users: UserWithRole[] | User[] | never[] }) => {
  return (
    <div className="container mex-auto">
      <DataTable data={users as User[]} columns={columns} />
    </div>
  );
};
export default UserTable;
