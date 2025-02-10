import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("access_token")?.value;

  if (pathname.startsWith("/auth") || pathname === "/") {
    return NextResponse.next();
  }

  if (!accessToken) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  return NextResponse.next();
}
