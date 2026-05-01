import mongoose, { Schema, Document } from "mongoose";

export interface IStudent extends Document {
  fullName: string;
  nationalId: string;
  level?: string;
  grade?: string;
  field_study?: string;
  lastSchool?: string;
  homeAddress?: string;
  studentPhone?: string;
  gender?: "male" | "female";

  birthday?: Date;
  grade_point?: string;

  academic_guidance_a?: string;
  academic_guidance_b?: string;

  fatherName?: string;
  motherName?: string;

  motherWork?: string;
  motherPhone?: string;
  fatherWork?: string;
  fatherPhone?: string;

  registerCode?: string;

  createdAt: Date;
  updatedAt: Date;
}

function generateRegisterCode(): string {
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  const timePart = Date.now().toString().slice(-4);

  return `STD-${timePart}${randomPart}`;
}

const studentSchema = new Schema<IStudent>(
  {
    fullName: { type: String, required: true },

    nationalId: { type: String, required: true, unique: true },

    grade: { type: String },
    level: { type: String },
    field_study: { type: String },
    birthday: { type: Date },
    grade_point: { type: String },

    academic_guidance_a: {
      type: String,
      enum: ["تجربی", "ریاضی", "انسانی", "فنی", ""],
      default: "",
    },

    academic_guidance_b: {
      type: String,
      enum: ["تجربی", "ریاضی", "انسانی", "فنی", ""],
      default: "",
    },

    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },

    lastSchool: { type: String },
    homeAddress: { type: String },
    studentPhone: { type: String },
    gender: { type: String, enum: ["male", "female"] },

    motherWork: { type: String },
    motherPhone: { type: String },
    fatherWork: { type: String },
    fatherPhone: { type: String },

    registerCode: { type: String, unique: true },
  },
  { timestamps: true }
);


studentSchema.pre("save", function (next) {
  if (!this.registerCode) {
    this.registerCode = generateRegisterCode();
  }
  next();
});

export const Student =
  mongoose.models.Student ||
  mongoose.model<IStudent>("Student", studentSchema);
