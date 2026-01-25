import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function AdminPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">จัดการผู้ใช้งาน</h1>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">ชื่อ</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">สถานะ</th>
              <th className="px-4 py-2">การจัดการ</th>
            </tr>
          </thead>

          <tbody></tbody>
        </table>
      </div>
    </div>
  );
}
