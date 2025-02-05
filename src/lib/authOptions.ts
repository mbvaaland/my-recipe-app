// Example: authOptions.ts

import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs"; // or bcrypt
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // 1) Connect to DB
        await connectToDB();

        // 2) Find user by email
        const user = await User.findOne({ email: credentials?.email }).select("+password");
        if (!user) {
          throw new Error("No user found with this email");
        }

        // 3) Check password
        const isValid = await bcrypt.compare(credentials!.password, user.password);
        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        // 4) Return an object that includes _id
        return {
          _id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // user is only defined on the first sign in
      if (user) {
        token._id = user._id;
      }
      return token;
    },
    async session({ session, token }) {
      // Transfer data from token to session
      if (token) {
        session.user._id = token._id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // must be set in .env
};