import mongoose, { Schema, Document } from "mongoose";


export interface IUser extends Document {
  first_name: string;
  last_name: string;
  fullName?: string;
  avatar?: string;
  email: string;
  password: string;
  username?: string;
  nationalCode:string;
  phone?: string;
  isVerified: boolean;
  role: "user" | "admin" | "superadmin";
  permission: string[];
  createdAt: Date;
  updatedAt: Date;
  isMe?:boolean;
}

const userSchema = new Schema<IUser>(
  {
    first_name: { type: String},
    last_name: { type: String },
    avatar: { type: Buffer },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, unique: true },
    nationalCode:{type:String,unique:true},
    phone: { type: String,default:"" },
    isVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin","employee"],
      default: "user",
    },
    permission: { type: [String], default: [] },

  },
  { 
    timestamps: true,
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } 

  }
);


userSchema.virtual("fullName").get(function (this: IUser) {
  const first = this.first_name || "";
  const last = this.last_name || "";
  const fullName = `${first} ${last}`.trim();
  return fullName || "";
});

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
