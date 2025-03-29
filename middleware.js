import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("access_token")?.value;

  if (
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/forgot-password") ||
    pathname.startsWith("/auth/reset-password") ||
    pathname.startsWith("/auth/registr") ||
    pathname.startsWith("/auth/login/reset-password") ||
    pathname.startsWith("/auth/login/forgot-password") ||
    pathname.startsWith("/auth/registr") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (!accessToken) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  try {
    const response = await fetch("http://localhost:8000/api/auth/me/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 200) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    const user = await response.json();
  } catch (error) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}
