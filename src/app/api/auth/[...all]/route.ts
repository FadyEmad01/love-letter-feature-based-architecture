import { auth } from "@/features/auth";

const handler = auth.handler;

export { handler as GET, handler as POST };
