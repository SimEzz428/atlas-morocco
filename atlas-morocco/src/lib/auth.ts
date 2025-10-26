import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./db";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
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

        try {
          const email = (credentials.email as string).trim().toLowerCase();
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.passwordHash) {
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password as string, user.passwordHash);
          if (!isValid) {
            return null;
          }
          
          return { id: user.id, email: user.email, name: user.name };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    }),
  ],
  
  callbacks: {
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
  
  session: {
    strategy: "jwt",
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  trustHost: true,
  useSecureCookies: process.env.NODE_ENV === "production",
  skipCSRFCheck: process.env.NODE_ENV === "development",
});