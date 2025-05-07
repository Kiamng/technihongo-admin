import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import {  login } from "@/app/api/auth/auth.api";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const user = await login(credentials?.email as string , credentials?.password as string);
          
          if (user && (user.role === "Administrator" || user.role === "Content Manager")) {
            return user;
          }

          return null;
        } catch (error) {
          console.error("Login failed", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    
    async jwt({ token, user }) {
       if (user) {
        token.userId = user.userId;
        token.userName = user.userName;
        token.email = user.email;
        token.role = user.role;
        token.token = user.token;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.userId,
        userName: token.userName,
        email: token.email,
        role: token.role,
        token: token.token,
      };

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 },
  cookies: {
    sessionToken: {
      name: "__Secure-next-auth.session-token", // Đảm bảo cookie có tên mạnh mẽ
      options: {
        httpOnly: true, // Chỉ server có thể truy cập cookie
        secure: process.env.NODE_ENV === "production", // Cookie chỉ được gửi qua HTTPS trong production
        sameSite: "Lax", // SameSite giúp bảo vệ chống CSRF
        path: "/", // Cookie có thể được truy cập trên toàn bộ website
        maxAge: 60 * 60 * 24 * 7, // Thời gian sống của cookie (ví dụ: 1 tuần)
      },
    },
    csrfToken: {
      name: "__Secure-next-auth.csrf-token", // Tên cookie CSRF token
      options: {
        httpOnly: true, // Chỉ có thể truy cập từ server
        secure: process.env.NODE_ENV === "production", // Cookie chỉ gửi qua HTTPS trong production
        sameSite: "Lax", // SameSite giúp bảo vệ chống CSRF
        path: "/",
      },
    },
  },
};
