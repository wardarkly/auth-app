import UserTable from "@/app/(protected)/admin/users/UserTable";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function AdminPage() {
  const { users } = await auth.api.listUsers({
    headers: await headers(),
    query: { sortBy: "createdAt" },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">จัดการผู้ใช้งาน</h1>
      <UserTable users={users} />
    </div>
  );
}
