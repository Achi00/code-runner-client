import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_URL}/reset-email-verify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.message }, { status: 400 });
    }
    const data = await response.json();
    return NextResponse.json({ message: data.message }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
