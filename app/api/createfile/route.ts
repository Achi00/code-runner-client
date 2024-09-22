import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userId, fileName } = await request.json();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/create-files`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, fileName }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    return NextResponse.json({ error: errorData.message }, { status: 400 });
  }
}
