/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { user_repo } from "@/lib/repository/UserRepository";

import { User } from "@/lib/db/model/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();


    const existingUser = await User.findOne({nationalCode:body.email});
    console.log(existingUser)
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "کاربری با این کد ملی وجود دارد",
          data: null,
        },
        { status: 400 }
      );
    }

    // ایجاد کاربر جدید با استفاده از کد ملی
    const newUser = await user_repo.create({
      ...body,
      nationalCode: body.email,
    });



    return NextResponse.json(
      {
        success: true,
        message: "ثبت نام با موفقیت انجام شد",
        data: newUser,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      {
        success: false,
        message: err.message,
        data: null,
      },
      { status: 400 }
    );
  }
}
