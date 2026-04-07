import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import connectToDatabase from "@/lib/mongodb";
import User from "@/lib/models/User";
import { v4 as uuidv4 } from "uuid";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;
      await connectToDatabase();
      const existing = await User.findOne({ email: user.email!.toLowerCase() });
      if (!existing) {
        await User.create({
          email: user.email!.toLowerCase(),
          name: user.name || "Photographer",
          password: "google-oauth-" + uuidv4(),
          role: "photographer",
          status: "pending",
          uniqueLink: uuidv4(),
          googleId: account.providerAccountId,
        });
      } else if (!existing.googleId) {
        existing.googleId = account.providerAccountId;
        await existing.save();
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account?.provider === "google") {
        token.isGoogle = true;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.isGoogle && session.user?.email) {
        await connectToDatabase();
        const dbUser = await User.findOne({ email: session.user.email.toLowerCase() });
        if (dbUser) {
          (session as any).dbUser = {
            id: dbUser._id.toString(),
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role,
            status: dbUser.status,
            uniqueLink: dbUser.uniqueLink,
            businessName: dbUser.businessName,
            phone: dbUser.phone,
          };
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
