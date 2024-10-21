import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  let accessToken = cookies().get("accessToken")?.value;
  const userId = cookies().get("userId")?.value;

  if (!accessToken) {
    // Attempt to refresh the access token
    const refreshResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      }
    );

    if (refreshResponse.ok) {
      const { accessToken: newAccessToken } = await refreshResponse.json();
      // Update the access token cookie
      cookies().set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      accessToken = newAccessToken;
    } else {
      // Unable to refresh, redirect to login
      return NextResponse.redirect("/login");
    }
  }

  // Use the access token to make the authenticated request
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/protected`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (response.ok) {
    const data = await response.json();
    return NextResponse.json(data);
  } else {
    // If the access token is invalid, clear cookies and redirect to login
    cookies().delete("accessToken");
    cookies().delete("userId");
    return NextResponse.redirect("/login");
  }
}
