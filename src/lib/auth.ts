import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder_google_client_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder_google_client_secret",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "placeholder_facebook_client_id",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "placeholder_facebook_client_secret",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_development",
  callbacks: {
    async session({ session, token }) {
      return session;
    },
  },
};
