import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { dash } from "@better-auth/infra";
import { waitUntil } from "@vercel/functions";
import { betterAuth } from "better-auth";
// import { sendEmail } from "@/features/auth/lib/email"; // Disabled: requires verified Resend domain
import { db } from "@/lib/db";
import { account, rateLimit, session, user, verification } from "../schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification, rateLimit },
  }),
  emailAndPassword: {
    enabled: true,
    //  requireEmailVerification: true,
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          },
        }
      : {}),
  },
  // Disabled: requires verified Resend domain to send emails.
  // To re-enable, uncomment the sendEmail import above and restore this block.
  // emailVerification: {
  //   sendOnSignUp: true,
  //   autoSignInAfterVerification: true,
  //   expiresIn: 3600,
  //   sendVerificationEmail: async ({ user, url }) => {
  //     await sendEmail({
  //       to: user.email,
  //       subject: "Verify your email address",
  //       html: `<p>Click <a href="${url}">here</a> to verify your email address.</p>`,
  //     });
  //   },
  // },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  trustedOrigins: ["http://localhost:3000", "https://lovely-letter.vercel.app"],
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    storage: "database",
    customRules: {
      "/sign-in/email": {
        window: 60,
        max: 5,
      },
      "/sign-up/email": {
        window: 60,
        max: 5,
      },
    },
  },
  account: {
    encryptOAuthTokens: true,
  },
  advanced: {
    backgroundTasks: {
      handler: (promise) => {
        waitUntil(promise);
      },
    },
  },
  plugins: [
    dash({
      apiKey: process.env.BETTER_AUTH_API_KEY,
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
