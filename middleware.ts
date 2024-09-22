import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserData } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const user = await getUserData();
  const protectedPaths = ["/dashboard", "/profile", "/settings"];

  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken && !request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (accessToken && request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))
  ) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
