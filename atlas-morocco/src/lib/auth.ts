// src/lib/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { prisma } from "./db";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  useSecureCookies: process.env.NODE_ENV === "production",
  debug: process.env.NODE_ENV === "development",
  skipCSRFCheck: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
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

        // Normalize email and find user case-insensitively; do NOT auto-create on sign-in
        const email = (credentials.email as string).trim().toLowerCase();
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) return null;

        // Check if user has a password hash
        if (!(user as any).passwordHash) {
          // User exists but has no password hash (created before password system)
          // Return null to show "incorrect credentials" message
          return null;
        }

        // Verify password
        const ok = await bcrypt.compare(credentials.password as string, (user as any).passwordHash as string);
        if (!ok) return null;
        
        return { id: user.id, email: user.email, name: user.name };
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
      if (account?.provider === "credentials") {
        // block sign-in if user doesn't exist (authorize already ensures this)
        if (!user?.email) return false;
      } else if (account?.provider === "google") {
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
    error: "/auth/signin",
  },
  
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
});
