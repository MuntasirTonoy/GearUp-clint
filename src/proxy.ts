import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Role } from "@/types";

const ROLE_DASHBOARDS: Record<Role, string> = {
  CUSTOMER: "/dashboard/customer",
  PROVIDER: "/dashboard/provider",
  ADMIN: "/dashboard/admin",
};

const PROTECTED_ROUTES: Record<string, Role[]> = {
  "/dashboard/customer": ["CUSTOMER"],
  "/dashboard/provider": ["PROVIDER"],
  "/dashboard/admin": ["ADMIN"],
  "/checkout": ["CUSTOMER"],
};

const LOGIN_ROUTE = "/login";
const REGISTER_ROUTE = "/register";

const decodeRole = (token: string): Role | null => {
  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(
      Buffer.from(base64, "base64").toString("utf-8")
    ) as { role?: Role };
    return decoded.role ?? null;
  } catch {
    return null;
  }
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;
  const role = token ? decodeRole(token) : null;

  const isAuthPage = pathname === LOGIN_ROUTE || pathname === REGISTER_ROUTE;

  if (isAuthPage) {
    if (role) {
      return NextResponse.redirect(
        new URL(ROLE_DASHBOARDS[role] ?? "/", request.url)
      );
    }
    return NextResponse.next();
  }

  const protectedEntry = Object.entries(PROTECTED_ROUTES).find(
    ([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (protectedEntry) {
    const allowedRoles = protectedEntry[1];

    if (!token || !role) {
      const url = new URL(LOGIN_ROUTE, request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    if (!allowedRoles.includes(role)) {
      const fallback = ROLE_DASHBOARDS[role] ?? "/";
      if (pathname === fallback) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL(fallback, request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/checkout/:path*"],
};
