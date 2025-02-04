// src/lib/authOptions.ts
import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
// Import your DB or user model if you need to verify user credentials
import { connectToDB } from './db'
import User from '@/models/User' // We'll define a user schema below

export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt',  // or 'database' if using sessions in DB
  },
  providers: [
    // Example of a simple "credentials" provider
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // 1. connect to DB
        await connectToDB()

        // 2. find the user by email
        const user = await User.findOne({ email: credentials?.email }).select('+password')
        if (!user) {
          throw new Error('Invalid credentials')
        }
        
        // 3. check password
        const isValid = await user.comparePassword(credentials!.password)
        if (!isValid) {
          throw new Error('Invalid credentials')
        }

        // 4. return user object if valid
        return {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
        }
      }
    })
  ],
  pages: {
    signIn: '/login', // a custom login page you might create
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id
      }
      return session
    }
  }
}