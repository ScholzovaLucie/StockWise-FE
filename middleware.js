import { NextResponse } from "next/server";

export async function middleware(req) {
  console.log("Middleware běží pro URL:", req.nextUrl.pathname);

  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("access_token")?.value;

  console.log("Přijaté cookies:", req.cookies.get("access_token"));

  if (
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/registr") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (!accessToken) {
    console.log("Žádný token nalezen - přesměrování na login");
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  console.log("Token nalezen:", accessToken);

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
