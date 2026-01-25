import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicPaths = ["/sign-in", "/pending-approval", "/favicon.ico",'/sign-up',"/hospital-logo.png"];
  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  if (
    isPublic ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/")
  ) {
    return NextResponse.next();
  }

  // ---- Authentication check (better-auth session) -----
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    // ถ้าไม่ได้ login -> ไปหน้า login
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // ---- Load User from Prisma ----
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) {
    // session มีแต่ไม่มี user ใน prisma -> ไปหน้า login
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // ---- Approval check ----
  if (!user.isApproved) {
    // ถ้ายังไม่ได้ approve -> ไปหน้า pending
    return NextResponse.redirect(new URL("/pending-approval", request.url));
  }

  // ---- Admin section ----
  if (pathname.startsWith("/admin")) {
    if (user.role !== "admin") {
      // ถ้าไม่ใช่ admin -> ไปหน้าแรก
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }
    // return NextResponse.redirect(new URL("/dashboard", request.url));
  // ---- Protected → allow ----
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
      ใช้ matcher เพื่อกำหนดว่าควรให้ middleware ตรวจที่ path ไหนบ้าง
      - ตรวจทุก path ที่ไม่ใช่ public (login, pending, api, _next)
    */
    "/((?!api|_next|login|pending-approval|favicon.ico).*)",
  ],
};
