import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/database/prisma"
import bcrypt from "bcryptjs"

// Authorized users - in production, move to database or environment variables
const AUTHORIZED_USERS = [
  {
    id: "1",
    email: process.env.ADMIN_EMAIL || "admin@company.com",
    password: process.env.ADMIN_PASSWORD_HASH || "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewDFdJnQaFaF9iBG", // "securepassword123"
    name: "Admin User",
    role: "admin"
  }
]

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@company.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Find user in authorized list
        const user = AUTHORIZED_USERS.find(u => u.email === credentials.email)
        if (!user) {
          return null
        }

        // Verify password
        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },
  jwt: {
    maxAge: 8 * 60 * 60, // 8 hours
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Helper function to hash passwords (for setup)
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}