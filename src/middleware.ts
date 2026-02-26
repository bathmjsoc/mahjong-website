import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { user, response } = await updateSession(request);
  const isLoginPage = request.nextUrl.pathname === "/";

  // Route unauthenticated users to login page
  if (!user && !isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Route authenticated users away from login page
  if (user && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
