import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const publicRoutes = [
  "/"
]

export async function proxy(request: NextRequest) {
  const { user, response } = await updateSession(request);
  const  pathname = request.nextUrl.pathname;

  // Route unauthenticated users to login page
  if (!user && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Route authenticated users away from login page
  if (user && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on all requests except for:
     * - _next/static
     * - favicon.ico
     */
    "/((?!_next/static|favicon.ico).*)",
  ],
};
