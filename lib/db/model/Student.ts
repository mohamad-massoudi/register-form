import mongoose, { Schema, Document } from "mongoose";

export interface IStudent extends Document {
  fullName: string;
  nationalId: string;
  grade?: string;
  lastSchool?: string;
  homeAddress?: string;
  studentPhone?: string;
  gender?: "male" | "female" ;
  motherWork?: string;
  motherPhone?: string;
  fatherWork?: string;
  fatherPhone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new Schema<IStudent>(
  {
    fullName: { type: String, required: true },
    nationalId: { type: String, required: true, unique: true },
    grade: { type: String },
    lastSchool: { type: String },
    homeAddress: { type: String },
    studentPhone: { type: String },
    gender: { type: String, enum: ["male", "female"] },
    motherWork: { type: String },
    motherPhone: { type: String },
    fatherWork: { type: String },
    fatherPhone: { type: String },
  },
  { timestamps: true }
);

export const Student =
  mongoose.models.Student || mongoose.model<IStudent>("Student", studentSchema);