import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env:{
    MONGODB_URI:"mongodb://localhost:27017",
    CLIENT_URL:"http://localhost:3000",
    NEXTAUTH_SECRET : "F6LIA3uJ4KtpSK7cfQmrVDy8880OrOYaZAIHa66/xyk=",
    JWT_SECRET : "71lq8iAY1VxSPL9TwsBbukIp7ZFfr9Y+x2ple7Mh3GnK8mJ90npEOp8Y6Yj738kpNCT8hmRjYXHrFK/FDDyMNA==",
    JWT_REFRESH_SECRET : "zCuyT4fmBmfpNAnQjrMy5vIVxemnvQT75tkujJ/6V/JCGPVNyb636CFnLmKzVv8SVU+UV1PIGC37gCj/pIuOrQ==",
  }
};

export default nextConfig;
