import { NextRequest, NextResponse } from "next/server";

export default function proxy(req: NextRequest) {
  const isAdmin = req.nextUrl.pathname.startsWith("/admin");
  const isLogin = req.nextUrl.pathname === "/login";

  // Allow public routes and the auth API
  if (!isAdmin) return NextResponse.next();
  if (isLogin) return NextResponse.next();

  // NextAuth may prefix cookies with __Secure- on HTTPS (e.g. Vercel).
  const hasToken = req.cookies.getAll().some((c) =>
    c.name.includes("session-token")
  );

  if (!hasToken) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
