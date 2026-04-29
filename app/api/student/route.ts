import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Student } from "@/lib/db/model/Student";
import { requireRole } from "@/helpers/auth/permission";

export async function GET(req: NextRequest) {
    const { response }  = requireRole(req,["admin"])
    if(response) return response
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const grade = searchParams.get("grade");
    const gender = searchParams.get("gender");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (grade) filter.grade = grade;
    if (gender) filter.gender = gender;

    const students = await Student.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "خطا در دریافت اطلاعات" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // اعتبارسنجی ساده
    if (!body.fullName || !body.nationalId) {
      return NextResponse.json(
        { message: "fullName و nationalId الزامی هستند" },
        { status: 400 }
      );
    }

    // بررسی یکتا بودن nationalId
    const existing = await Student.findOne({ nationalId: body.nationalId });
    if (existing) {
      return NextResponse.json(
        { message: "کد ملی تکراری است" },
        { status: 409 }
      );
    }

    const student = await Student.create(body);
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "خطا در ایجاد دانش‌آموز" }, { status: 500 });
  }
}
