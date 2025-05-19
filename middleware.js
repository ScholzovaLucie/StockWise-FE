import { NextResponse } from "next/server";

// Pomocná funkce pro získání hodnoty cookie podle jména
function getCookie(req, name) {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;
  const match = cookie.match(new RegExp(`${name}=([^;]+)`));
  return match ? match[1] : null;
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const accessToken = getCookie(req, "access_token");

  // Whitelist cest, které nevyžadují autentizaci
  if (
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/forgot-password") ||
    pathname.startsWith("/auth/reset-password") ||
    pathname.startsWith("/auth/registr") ||
    pathname.startsWith("/auth/login/reset-password") ||
    pathname.startsWith("/_next") || // statické soubory Next.js
    pathname.startsWith("/static") || // vlastní statické soubory
    /\.(.*)$/.test(pathname) // např. .css, .js, .ico, .png, ...
  ) {
    return NextResponse.next();
  }

  // Pokud chybí access_token cookie → přesměrování na přihlášení
  if (!accessToken) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Ověření tokenu pomocí backendu – volání /auth/me/
  return fetch(
    "http://localhost:8000/api/auth/me/",
    //"http://stockwise-backend:8000/api/auth/me/",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        withCredentials: true,
      },
    }
  )
    .then((res) => {
      if (!res.ok) {
        // Token je neplatný nebo expirovaný → přesměrování
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }

      return NextResponse.next();
    })
    .catch((e) => {
      // Backend není dostupný nebo došlo k chybě → přesměrování
      return NextResponse.redirect(new URL("/auth/login", req.url));
    });

  // Redundantní fallback (nikdy nenastane)
  return NextResponse.next();
}
