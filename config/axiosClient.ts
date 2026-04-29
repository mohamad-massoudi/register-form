// axiosClient.ts
import axios from "axios";
import { getSession } from "next-auth/react";

export const axiosClient = axios.create({
  baseURL: process.env.CLIENT_URL+"/api", 
  headers: { "Content-Type": "application/json" },
});

// اضافه کردن interceptor برای افزودن توکن
axiosClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }

  return config;
});