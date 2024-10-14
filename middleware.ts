import { NextRequest, NextResponse } from "next/server";
import { routePermissions } from "./constant/constants";

export default function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (routePermissions[path]) {
    const userRole = req.cookies.get("user_role")?.value;
    console.log(userRole, "userRole");
    if (!userRole) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    if (userRole === "undefined") {
      return NextResponse.rewrite(new URL("/chat", req.nextUrl));
    }
    if (!routePermissions[path].includes(userRole)) {
      return NextResponse.redirect(new URL("/404", req.nextUrl));
    }
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
