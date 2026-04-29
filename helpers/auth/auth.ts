import { decodeJWT } from "@/config/token";
import { NextRequest, NextResponse } from "next/server";

export function isAuthenticated(req: NextRequest) {
  const token = req.headers.get("authorization");

  if (!token) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      )
    };
  }

  const payload = decodeJWT(token);

  if (!payload) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Unauthorized: Invalid or expired token" },
        { status: 401 }
      )
    };
  }


  return { ok: true, user: payload };
}
