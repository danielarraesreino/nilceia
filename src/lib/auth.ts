import { NextAuthOptions } from "next-auth";
import type { Provider } from "next-auth/providers/index";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

function getEnvValue(name: string, fallback: string): string {
  return process.env[name] || fallback;
}

const providers: Provider[] = [
  GoogleProvider({
    clientId: getEnvValue("GOOGLE_CLIENT_ID", "dev_google_client_id_not_configured"),
    clientSecret: getEnvValue("GOOGLE_CLIENT_SECRET", "dev_google_client_secret_not_configured"),
  }),
];

if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  providers.push(
    FacebookProvider({
      clientId: getEnvValue("FACEBOOK_CLIENT_ID", "dev_facebook_client_id_not_configured"),
      clientSecret: getEnvValue("FACEBOOK_CLIENT_SECRET", "dev_facebook_client_secret_not_configured"),
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  secret: getEnvValue("NEXTAUTH_SECRET", "dev_nextauth_secret_not_configured"),
  callbacks: {
    async session({ session }) {
      return session;
    },
  },
};
