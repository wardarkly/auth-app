"use server";

import { auth } from "@/lib/auth";
import { AdminUserFormValues, adminUserSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function adminCreateUser(values: AdminUserFormValues) {
  // 1. ตรวจสอบสิทธิ์ Admin อีกครั้งที่ฝั่ง Server
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session?.user.role !== "admin") {
    throw new Error("Unauthorized: คุณไม่มีสิทธิ์ทำรายการนี้");
  }
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: values.email },
        { username: values.username },
        { cid: values.cid },
      ],
    },
  });
  if (existingUser) {
    // ตรวจสอบว่าตัวไหนที่ซ้ำแล้วส่ง Code กลับไป
    if (existingUser.email === values.email)
      return { success: false, code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" };

    // สำหรับ JSON field (ถ้าใช้ Prisma filter แบบ path)
    if (existingUser.cid === values.cid)
      return { success: false, code: "CID_ALREADY_EXISTS_USE_ANOTHER_CID" };
    if (existingUser.username === values.username)
      return {
        success: false,
        code: "USERNAME_IS_ALREADY_TAKEN_PLEASE_TRY_ANOTHER",
      };
  }
  // 2. Validate ข้อมูลด้วย Zod (Server-side)
  const result = adminUserSchema.safeParse(values);
  if (!result.success) {
    return {
      success: false,
      error: "ข้อมูลไม่ถูกต้องตามรูปแบบ",
      details: result.error.format(), // ส่ง Error ของ Zod กลับไปถ้าต้องการ
    };
  }
  const validatedData = result.data;
  try {
    // 3. เรียกใช้ Better Auth Server SDK
    const newUser = await auth.api.createUser({
      body: {
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.name,
        role: validatedData.role,
        data: {
          username: validatedData.username,
          displayUsername: validatedData.name,
          cid: validatedData.cid,
          tel: validatedData.tel,
          position: validatedData.position,
          department: validatedData.department,
          isActive: validatedData.isActive,
          isApproved: true,
          approvedAt: new Date(),
        },
      },
      headers: await headers(),
    });
    // 4. สั่ง Revalidate หน้าที่แสดงรายชื่อผู้ใช้
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      code: error.code || "UNKNOWN_ERROR",
      message: error.message,
    };
  }
}
