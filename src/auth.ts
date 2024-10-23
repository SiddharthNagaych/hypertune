import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { FirestoreAdapter } from "@auth/firebase-adapter"
import { cert } from "firebase-admin/app"


 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
})