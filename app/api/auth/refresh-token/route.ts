import { decodeRefreshJWT, generateAccessToken } from "@/config/token";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json(
        {
          statusCode: 400,
          error: true,
          data: null,
          message: "token required",
        },
        { status: 201 }
      );
    }
    const authorization = req.headers.get("authorization");
    if (!authorization) {
      return NextResponse.json(
        {
          statusCode: 401,
          error: true,
          data: null,
          message: "Unauthorized",
        },
        { status: 201 }
      );
    }

    const decode_token = decodeRefreshJWT(token);

    if (!decode_token) {
      return NextResponse.json(
        {
          statusCode: 401,
          error: true,
          data: null,
          message: "jwt expired",
        },
        { status: 201 }
      );
    }

    if (decode_token) {
      const accessToken = generateAccessToken({
        userId: decode_token.payload.userId,
        email: decode_token.payload.email,
        first_name: decode_token.payload.first_name,
        last_name: decode_token.payload.last_name,
        fullname: decode_token.payload.fullName,
        username: decode_token.payload.username,
        role: decode_token.payload.role,
        permission: decode_token.payload.permission,
      });
      return NextResponse.json(
        {
          statusCode: 201,
          error: false,
          data: {
            access_token: accessToken,
          },
          message: "access token created successfully",
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        {
          statusCode: 201,
          error: true,
          data: null,
          message: "error accured",
        },
        { status: 201 }
      );
    }
  } catch {
    return NextResponse.json(
      {
        statusCode: 400,
        error: true,
        data: null,
        message: "body required",
      },
      { status: 400 }
    );
  }
}
