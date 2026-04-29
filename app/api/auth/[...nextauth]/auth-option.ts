import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { User as NextAuthUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import axios from "axios";
import { GoogleProfile } from "@/types/User";

async function refreshAccessToken(token: JWT) {
  if (!token.refreshToken) return token;

  try {
    const res = await axios.post(
      `${process.env.CLIENT_URL}/api/auth/refresh-token/`,
      {
        token: token.refreshToken,
      },
      {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      }
    );
    const data = await res.data;
    if (data.error) {
      return {
        ...token,
        error: "RefreshTokenError",
      }
    }

    return {
      ...token,
      accessToken: data.data.access_token,
      accessTokenExpires: Date.now() + 3 * 60 * 1000, 
    };
  } catch (error) {
    console.error("Refresh token error", error);
    return {
      ...token,
      error: "RefreshTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
      },
      authorize: async (credentials): Promise<NextAuthUser | null> => {
        const res = await fetch(`${process.env.CLIENT_URL}/api/auth/login/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          }),
        });
        const result = await res.json();
        if (!result.success) {
          throw new Error(JSON.stringify(result));
        }
        
        if (result.success) {
          const userData = result.data;

          return {
            id: userData.id || "",
            email: userData.email || "",
            username: userData.username,
            fullname: userData.fullName || "",
            first_name: userData.first_name || "",
            last_name: userData.last_name || "",
            role:userData.role || "",
            nationalCode:userData.nationalCode || "",
            token: userData.access_token,
            refreshToken: userData.refresh_token,
          };
        }

        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account?.provider === "google" && account.access_token) {
        console.log(account.refresh_token);
        const googleProfile = profile as GoogleProfile;
        if (profile) {
          token.googleAccessToken = account.access_token;
          token.provider = "google";
          token.email = googleProfile.email;
          token.fullname = googleProfile.name;
          token.first_name = googleProfile.given_name;
          token.last_name = googleProfile.family_name;
          token.image = googleProfile.picture;
          // token.accessTokenExpires = Date.now() + 5 * 60 * 1000;
        }
        return token;
      }

      if (user) {
        token.id = user.id;
        token.accessToken = user.token;
        token.refreshToken = user.refreshToken;
        token.image = user.image;
        token.email = user.email;
        token.role = user.role;
        token.nationalCode = user.nationalCode;
        token.username = user.username;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.accessTokenExpires = Date.now() + 5 * 60 * 1000; // 3 minutes
      }

      if (Date.now() < (token.accessTokenExpires || 0)) {
        return token;
      }

      if (token.accessTokenExpires) {
        return await refreshAccessToken(token);
      }
      return token;
    },

    async session({ session, token }) {
      session.token = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.time = token.accessTokenExpires;
      session.error = token.error;
      session.user = {
        id: token.id,
        email: token.email,
        first_name: token.first_name,
        role: token.role,
        nationalCode:token.nationalCode,
        last_name: token.last_name,
        username: token.username,
        image: token.image,
      };
      return session;
    },

    async redirect({ url }) {
      return url
    }
  },
  pages: {
    signIn: "/auth/login/",
    signOut: "/",
  },
  secret: process.env.NEXTAUTH_SECRET!,
  jwt: {
    secret: process.env.JWT_SECRET!,
  },
};
