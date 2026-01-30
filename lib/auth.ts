import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { admin, username } from "better-auth/plugins";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { AuditLogsPlugin } from "./auth-audit-plugin";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      cid: { type: "string" },
      tel: { type: "string" },
      position: { type: "string" },
      department: { type: "string" },
      isApproved: { type: "boolean" },
      isActive: { type: "boolean" },
      approvedAt: { type: "date", input: false },
    },
  },
  plugins: [
    username(),
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
    AuditLogsPlugin(),
  ],
  session: {
    expiresIn: 60 * 60 * 8, // 8 hours
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-in/username") {
        const body = ctx.body;

        const login = String(body?.username);
        const password = String(body?.password);

        if (!login || !password) {
          return;
        }
        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: login }, { username: login }],
          },
        });

        if (!user) {
          return;
        }

        if (!user.isApproved) {
          throw new APIError("UNAUTHORIZED", {
            code: "USER_NOT_APPROVED",
            message:
              "บัญชีของคุณยังไม่ได้รับการอนุมัติการใช้งาน กรุณาติดต่อผู้ดูแลระบบ",
          });
        }

        if (!user.isActive) {
          throw new APIError("UNAUTHORIZED", {
            code: "USER_DISABLED",
            message: "บัญชีของคุณถูกปิดการใช้งาน กรุณาติดต่อผู้ดูแลระบบ",
          });
        }
      }
      if (ctx.path === "/sign-up/email") {
        const body = ctx.body;
        const cid = String(body?.cid ?? "").trim();

        if (!cid) return;

        // 🔎 เช็ค cid ซ้ำ
        const exists = await prisma.user.findUnique({
          where: { cid },
          select: { id: true },
        });

        if (exists) {
          throw new APIError("BAD_REQUEST", {
            code: "CID_ALREADY_EXISTS_USE_ANOTHER_CID",
            message: "เลขประจำตัวประชาชนนี้ถูกใช้งานแล้ว",
          });
        }
      }
      return;
    }),
  },
});
