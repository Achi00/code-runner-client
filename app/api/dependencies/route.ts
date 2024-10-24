import { getUserData } from "@/lib/auth";
import { getPackages } from "@/lib/fetch";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const userData = await getUserData();
  const userId = userData.id;
  if (!userId) {
    console.log(userData);
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const dependencies = await getPackages(userId);
  return NextResponse.json(dependencies);
}
