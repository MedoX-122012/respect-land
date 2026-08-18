import { NextRequest, NextResponse } from "next/server";

export default function proxy(req: NextRequest) {
  const token = req.cookies.get("authjs.session-token");
  const isAdmin = req.nextUrl.pathname.startsWith("/admin");

  // Allow public routes and the auth API
  if (!isAdmin) return NextResponse.next();
  if (req.nextUrl.pathname === "/login") return NextResponse.next();

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
