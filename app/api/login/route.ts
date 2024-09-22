import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { encrypt } from "@/lib/encryption";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return NextResponse.json({ error: errorData.message }, { status: 401 });
  }

  const { accessToken, user } = await response.json();

  // Set the access token as an HTTP-only cookie
  cookies().set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  // Encrypt and store user data in a cookie
  const encryptedUserData = encrypt(JSON.stringify(user));
  cookies().set("userData", encryptedUserData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return NextResponse.json({ success: true });
}
