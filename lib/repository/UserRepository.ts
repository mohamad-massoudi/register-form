import mongoose, { FilterQuery } from "mongoose";
import { IUser, User } from "../db/model/User";
import { createUniqueUsername } from "../utils";



class UserRepository {
  async create(data: Partial<IUser>) {
    return await User.create({...data,username:createUniqueUsername()});
  }

  async findAll() {
    return await User.find().sort({ createdAt: -1 });
  }

  async findById(id: string) {
    return await User.findById(id);
  }


  async getOnlyUserIds() {
    return await User.find({}, "_id");
  }


  async getMyInfo(value: string) {
     const conditions: FilterQuery<IUser>[] = [{ email: value }, { username: value }];

  if (mongoose.Types.ObjectId.isValid(value)) {
    conditions.push({ _id: value });
  }

  return await User.findOne({ $or: conditions });
  }


  async findByIdOrEmailOrUsername(value: string) {
  const conditions: FilterQuery<IUser>[] = [{ email: value }, { username: value }];

  if (mongoose.Types.ObjectId.isValid(value)) {
    conditions.push({ _id: value });
  }

  return await User.findOne({ $or: conditions }).select("-password -email -avatar -likes -subscribers");
}

  async updateById(id: string, data: Partial<IUser>) {
    return await User.findByIdAndUpdate(id, data, { new: true });
  }


  
  async deleteById(id: string) {
    return await User.findByIdAndDelete(id);
  }
}


export const user_repo = new UserRepository()