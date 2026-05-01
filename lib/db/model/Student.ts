import mongoose, { Schema, Document  } from "mongoose";

export interface IStudent extends Document {
  fullName: string;
  nationalId: string;
  level?: string;
  grade?: string;
  field_study?: string;
  lastSchool?: string;
  homeAddress?: string;
  studentPhone?: string;
  gender?: "male" | "female" ;
  birthday?:Date;
  grade_point?:string;
  academic_guidance?: string;
  fatherName?:string;
  mothername?:string
  motherWork?: string;
  motherPhone?: string;
  fatherWork?: string;
  fatherPhone?: string;
  registerCode?: string;
  createdAt: Date;
  updatedAt: Date;
}
function generateRegisterCode(phone: string): string {
  
  const randomPart = Math.floor(100000 + Math.random() * 900000).toString();
  return `${phone}-${randomPart}`;
}
const studentSchema = new Schema<IStudent>(
  {
    fullName: { type: String, required: true },
    nationalId: { type: String, required: true, unique: true },
    grade: { type: String },
    level: { type: String },
    field_study: { type: String },
    birthday:{type:Date},
    grade_point:{type:String},
    academic_guidance:{type:String},
    fatherName:{type:String},
    mothername:{type:String},
    lastSchool: { type: String },
    homeAddress: { type: String },
    studentPhone: { type: String },
    gender: { type: String, enum: ["male", "female"] },
    motherWork: { type: String },
    motherPhone: { type: String },
    registerCode: { type: String, unique: true },
    fatherWork: { type: String },
    fatherPhone: { type: String },
  },
  { timestamps: true }
);
studentSchema.pre("save", function (next) {
  if (!this.registerCode && this.studentPhone) {
    this.registerCode = generateRegisterCode(this.studentPhone);
  }
  next();
});
export const Student =
  mongoose.models.Student || mongoose.model<IStudent>("Student", studentSchema);