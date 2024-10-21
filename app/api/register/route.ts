import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { encrypt } from "@/lib/encryption";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_URL}/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.message }, { status: 400 });
    }

    const data = await response.json();
    return NextResponse.json({ message: data.message }, { status: 201 });
  } catch (error) {
    console.error("Error in registration:", error);
    return NextResponse.json(
      { message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
