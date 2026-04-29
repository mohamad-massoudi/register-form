import  { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    token?: string;
    refreshToken?: string;
    time?:number;
    error?:string;
    user?: {
        id?: string;
        first_name?:string;
        last_name?:string;
        username?:string;
        fullname?:string;
        role?:string;
        email?: string;
        nationalCode:string;
        image?:string;

    };
  }

  interface User extends DefaultUser {
    id: string;
    email?: string;
    token?: string;
    username?:string;
    fullname?:string;
    role?:string;
    first_name?:string;
    last_name?:string;
    image?:string;
    refreshToken?: string;
        nationalCode:string;



  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
    refreshToken?: string;
    email?: string;
    first_name?:string;
    fullname?:string;
    role?:string;
    last_name?:string;
    image?:string;
    username?:string;
    nationalCode:string;

    accessTokenExpires?: number;
    error?:string;
  }
}
