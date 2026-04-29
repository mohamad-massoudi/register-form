import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { generateAccessToken, generateRefreshToken } from "@/config/token";


import { User } from "@/lib/db/model/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { username,password } = await req.json(); // دریافت کد ملی
    const user = await User.findOne({
  $or: [
    { email: username },
    { username: username },
    { user_phone: username },
    {nationalCode:username}
  ],
});
    if (!user) throw new Error("{success:false,message:'invalid credential'}");

    const isPasswordCorrect = user.password === password; 
    if (!isPasswordCorrect) {
      return NextResponse.json({
        success: false,
        message: "نام کاربری یا کلمه عبور اشتباه است",
        data: null,
      }, { status: 400 });
    }

    const accessToken = generateAccessToken({
      userId: user._id,
      username: user.username,
      nationalCode: user.nationalCode, // استفاده از کد ملی به جای ایمیل
      fullname: user.fullName,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      permission: user.permission,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id,
      username: user.username,
      nationalCode: user.nationalCode, // استفاده از کد ملی به جای ایمیل
      fullname: user.fullName,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      permission: user.permission,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Login success",
        data: {
          access_token: accessToken,
          refresh_token: refreshToken,
          username: user.username,
          isVerified: user.isVerified,
          first_name: user.first_name,
          fullname: user.fullName,
          last_name: user.last_name,
          nationalCode: user.nationalCode, // استفاده از کد ملی به جای ایمیل
          role: user.role,
          id: user._id,
          avatar: user.avatar,
        },
      },
      { status: 201 }
    );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      {
        success: false,
        message: err.response?.message || "An error occurred",
        data: null,
      },
      { status: 400 }
    );
  }
}
