/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Student } from "@/lib/db/model/Student";
import { requireRole } from "@/helpers/auth/permission";

export async function GET(req: NextRequest) {
  const { response } = requireRole(req, ["admin"]);
  if (response) return response;

  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const grade = searchParams.get("grade");
    const gender = searchParams.get("gender");
    const level = searchParams.get("level");
    const registerCode = searchParams.get("code")

    const filter: any = {};

    if (grade) filter.grade = grade;
    if (gender) filter.gender = gender;
    if (level) filter.level = level;
    if (registerCode) filter.registerCode = registerCode;

    const students = await Student.find(filter).sort({ createdAt: -1 });

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "خطا در دریافت اطلاعات" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body.fullName || !body.nationalId) {
      return NextResponse.json(
        { message: "نام و کد ملی الزامی است" },
        { status: 400 }
      );
    }

    const existing = await Student.findOne({
      nationalId: body.nationalId,
    });

    if (existing) {
      return NextResponse.json(
        { message: "این کد ملی قبلا ثبت شده است" },
        { status: 409 }
      );
    }
    body.has_academic_guidance = body.has_academic_guidance || "no";
    const student = await Student.create(body);

    return NextResponse.json(
      {
        message: "ثبت نام با موفقیت انجام شد",
        registerCode: student.registerCode,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "خطا در ایجاد دانش‌آموز" },
      { status: 500 }
    );
  }
}
