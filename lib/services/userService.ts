// import bcrypt from "bcryptjs";
// import { UserRepository } from "../repository/UserRepository";
// import { generateAccessToken, generateRefreshToken } from "@/config/token";
import { APIResult } from "@/types/api_result";
import { IUser } from "../db/model/User";
import axios from "axios";
import { toast } from "sonner";
import bcrypt from "bcryptjs";
import { axiosInstance } from "@/config/axiosInstance";
import { axiosClient } from "@/config/axiosClient";

// const repo = new UserRepository();
export type IUserService<T> = APIResult<T>

class UserService {
  private base_route = process.env.CLIENT_URL+"/api/users"


  async getSession(){
    try{
      const res = await axios.post(process.env.CLIENT_URL+"/api/auth/session")
      return res.data
    }
    catch {
        return {
          success:false,
          message:"Not Fount",
          data:null
        }
    }
  }

  async getAllUsers():Promise<IUserService<IUser[]>> {
    try {
      const res = await axiosClient.get("users/")
      return res.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        return error.response   
    }
  }
  async getUserById(id: string):Promise<IUserService<IUser>> {
    try {
      const res = await axiosInstance.get("users/"+id)
      return res.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        return error.response   
    }
  }
  async getByUsername(username:string):Promise<IUserService<IUser>> {
    try {
      const res = await axiosClient.get(`users/${username}`)
      return res.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        return error.response   
    }
  }

  async checkUsernameAvailable(username:string):Promise<IUserService<IUser>> {
    try {
      const res = await axios.post(`${this.base_route}/check-username-available`,{username})
      return res.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        return error.response.data
    }
  }

  async updateUser(id: string, data: Partial<IUser>) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const res = await axios.patch(`${this.base_route}/${id}`,data)
    if (res.data.success){
      toast.success("موفقیت",{
        description:res.data.message
      })
      return res
    } else {
      toast.error("خطا",{
        description:res.data.message
      })
      return res
    }

  }

  async createUserByAdmin(user:Partial<IUser>) {
    const { email, password } = user;
    if (!email || !password) {
      throw new Error(
        "فیلد ایمیل و کلمه عبور اجباری است"
      );
    }
    try {
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const res = await axiosClient.post(`/users/admin/`,{...user,password:hashedPassword})
      if (res.data.success){
        toast.success("موفقیت",{
          description:res.data.message
        })
        return res
      } else {
        toast.error("خطا",{
          description:res.data.message
        })
        return res
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      toast.error("خطا",{
          description:error.response.data.message
        })
      
    }
  }

  async registerUser(user:Partial<IUser>) {
    const { email, password } = user;
  
    if (!email || !password) {
      throw new Error(
        "فیلد ایمیل و کلمه عبور اجباری است"
      );
   
    }

    const existingUser = await this.getByUsername(email);
    if (existingUser.success) {
      toast.error("خطا",{
        description:"این ایمیل قبلا ثبت شده است"
      })
      return false
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const res = await axios.post(`${process.env.CLIENT_URL}/api/auth/register`,{
      email,
      first_name:user.first_name,
      last_name:user.last_name,
      password: hashedPassword,
    })
    if(res.status == 201){
        toast.success("ثبت نام",{
          description:res.data.message
        })
        return true
    } else if (!res.data.success) {
      toast.error("خطا",{
        description:res.data.message
      })
      return false
    }
    if(res.status==400){
      toast.error("خطا",{
        description:res.data.message
      })
      return false
    }

  }


  async deleteUser(id: string) {
    const res = await axiosClient.delete(`${this.base_route}/${id}`)
    if (res.data.success){
      toast.success("موفقیت",{
        description:res.data.message
      })
      return res.data
    } else {
      toast.error("خطا",{
        description:res.data.message
      })
      return res.data
    }
  }

  async getCurrencies(){
    try {
      const res = await axiosClient.get("/currencies/")
      return res.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        return error.response   
    }
  }
  async getMyInfo(){
    try {
      const res = await axiosClient.get("/users/me")
      return res.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        return error.response   
    }
  }
}


export const user_service = new UserService()