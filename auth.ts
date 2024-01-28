import NextAuth from "next-auth";
import {PrismaAdapter} from "@auth/prisma-adapter";

import {db} from "@/lib/db";
import {getUserById} from "@/data/user";
import authConfig from "@/auth.config";


export const {
  handlers: {GET, POST},
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "auth/error",
  },
  events: {
    async linkAccount({user}) {
      await db.user.update({
        where: {id: user.id},
        data: {emailVerified: new Date()}
      })
    },
  },
  callbacks: {
    async session({token, session}) {

      // pass user id to session
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      // pass user role to session
      if (token.role && session.user) {
        session.user.role = token.role;
      }

      return session;
    },
    async jwt({token}) {
      if (!token.sub) return token; // not logged in

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token; // user not found

      token.role = existingUser.role;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: {strategy: "jwt"},
  ...authConfig,
})