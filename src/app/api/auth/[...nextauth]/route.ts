// import NextAuth, { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";

// import {  login } from "@/app/api/auth/auth.api";

// const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         try {
//           const user = await login(credentials?.email as string , credentials?.password as string);
          
//           if (user && (user.role === "Administrator" || user.role === "Content Manager")) {
//             return user;
//           }

//           return null;
//         } catch (error) {
//           console.error("Login failed", error);
//           return null;
//         }
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/",
//   },
//   callbacks: {
    
//     async jwt({ token, user }) {
//        if (user) {
//         token.userId = user.userId;
//         token.userName = user.userName;
//         token.email = user.email;
//         token.role = user.role;
//         token.token = user.token;
//       }

//       return token;
//     },
//     async session({ session, token }) {
//       session.user = {
//         id: token.userId,
//         userName: token.userName,
//         email: token.email,
//         role: token.role,
//         token: token.token,
//       };

//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   session: { strategy: "jwt", maxAge: 60 * 60 * 24 },
// };
// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };

import { authOptions } from "@/lib/authOption";
import NextAuth from "next-auth";


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
