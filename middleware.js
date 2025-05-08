import { NextResponse } from "next/server";


function getCookie(req, name) {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;
  const match = cookie.match(new RegExp(`${name}=([^;]+)`));
  return match ? match[1] : null;
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const accessToken = getCookie(req, "access_token");

  if (
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/forgot-password") ||
    pathname.startsWith("/auth/reset-password") ||
    pathname.startsWith("/auth/registr") ||
    pathname.startsWith("/auth/login/reset-password") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (!accessToken) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return fetch('http://stockwise-backend:8000/api/auth/me/', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      withCredentials: true,
    },
  }).then((res) => {
    if (!res.ok) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    return NextResponse.next()
  }).catch((e) => {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  })

  return NextResponse.next();
}
