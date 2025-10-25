// src/lib/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { prisma } from "./db";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Demo credentials provider
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // For demo purposes, accept any email/password combination
        // In production, you would validate against your database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user) {
          // Create a demo user if they don't exist
          const hashedPassword = await bcrypt.hash(credentials.password as string, 12);
          const newUser = await prisma.user.create({
            data: {
              email: credentials.email as string,
              name: (credentials.email as string).split('@')[0],
            }
          });
          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
          };
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
    }),
    
    // Google provider (optional, behind env)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
  ],
  
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // Handle Google sign-in
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! }
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name,
            }
          });
        }
      }
      return true;
    },
    
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  
  pages: {
    signIn: "/auth/signin",
  },
  
  session: {
    strategy: "jwt",
  },
  
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
});
