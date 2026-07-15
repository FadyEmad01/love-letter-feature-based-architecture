import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { dash } from "@better-auth/infra";
import { betterAuth } from "better-auth";
import { db } from "@/lib/db";
import {
  account,
  rateLimit,
  relations,
  session,
  user,
  verification,
} from "../schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification, rateLimit, relations },
  }),
  // experimental: { joins: true },
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  trustedOrigins: [
    "http://localhost:3000",
    "https://lovely-letter.vercel.app",
    "https://localhost:3000",
  ],
  plugins: [
    dash({
      apiUrl: process.env.BETTER_AUTH_URL,
      apiKey: process.env.BETTER_AUTH_API_KEY,
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
