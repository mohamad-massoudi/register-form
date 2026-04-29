// lib/axiosInstance.ts

import { authOptions } from "@/app/api/auth/[...nextauth]/auth-option";
import axios from "axios";
import { getServerSession } from "next-auth";

export const axiosInstance = axios.create({
  baseURL: process.env.CLIENT_URL+"/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getServerSession(authOptions);
    console.log(session)
    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);