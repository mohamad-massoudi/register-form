// lib/permissions.ts
import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "./auth";

export function requireRole(req: NextRequest, roles: string[]) {
  const auth = isAuthenticated(req);

  if (!auth.ok) {
    return { response: auth.response, user: null };
  }

  const user = auth.user;

  if (!roles.includes(user?.role)) {
    return {
      response: NextResponse.json(
        { success:false,message: "Forbidden: Permission denied",data:null },
        { status: 403 }
      ),
      user: null
    };
  }

  return { response: null, user }; // ✅ اجازه داده شده → user برمی‌گرده
}
