import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const userId = cookies().get("userId")?.value;

  if (userId) {
    // Notify the backend to invalidate the refresh token
    await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
  }

  // Clear the cookies
  cookies().delete("accessToken");
  cookies().delete("userData");

  return NextResponse.json({ success: true });
}
