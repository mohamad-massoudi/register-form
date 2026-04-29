import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { Student } from "@/lib/db/model/Student";
import { connectDB } from "@/lib/db/mongoose";
import { requireRole } from "@/helpers/auth/permission";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    const { response }  = requireRole(req,["admin"])
    if(response) return response
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "آیدی نامعتبر است" }, { status: 400 });
    }

    const student = await Student.findById(id);
    if (!student) {
      return NextResponse.json({ message: "دانش‌آموز یافت نشد" }, { status: 404 });
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "خطا در دریافت اطلاعات" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }>}
) {
  const { response }  = requireRole(req,["admin"])
  if(response) return response  
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "آیدی نامعتبر است" }, { status: 400 });
    }

    const student = await Student.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!student) {
      return NextResponse.json({ message: "دانش‌آموز یافت نشد" }, { status: 404 });
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "خطا در بروزرسانی" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response }  = requireRole(req,["admin"])
  if(response) return response  
  try {
    await connectDB();
    const { id } = await params;
    const updates = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "آیدی نامعتبر است" }, { status: 400 });
    }

    const student = await Student.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!student) {
      return NextResponse.json({ message: "دانش‌آموز یافت نشد" }, { status: 404 });
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "خطا در بروزرسانی جزئی" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response }  = requireRole(req,["admin"])
  if (response) return response  
  try {

    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "آیدی نامعتبر است" }, { status: 400 });
    }

    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return NextResponse.json({ message: "دانش‌آموز یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({ message: "حذف با موفقیت انجام شد" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "خطا در حذف" }, { status: 500 });
  }
}