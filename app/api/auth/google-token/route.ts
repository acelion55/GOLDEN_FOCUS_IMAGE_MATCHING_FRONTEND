import { NextResponse } from "next/server";
import { auth } from "@/lib/next-auth";
import { createToken } from "@/lib/jwt";

export async function GET() {
  const session = await auth();
  const dbUser = (session as any)?.dbUser;

  if (!dbUser) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const token = await createToken({
    userId: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    role: dbUser.role,
    status: dbUser.status,
  });

  return NextResponse.json({ token, user: dbUser });
}
