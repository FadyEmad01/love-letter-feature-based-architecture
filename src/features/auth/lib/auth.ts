import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@/lib/db";
import { user, session, account, verification, relations } from "../schema";
import { dash } from "@better-auth/infra";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification, relations },
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
    })
  ]
});

export type Session = typeof auth.$Infer.Session;
