import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";

// Create the handler
const handler = NextAuth(authOptions);

// Export only the required route handlers
export { handler as GET, handler as POST };