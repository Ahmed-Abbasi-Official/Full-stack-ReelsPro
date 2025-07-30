// middleware.ts
import withAuth from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        if (
          pathname.startsWith('/api/auth') ||
          pathname === '/login' ||
          pathname === '/register' ||
          pathname.startsWith("/.well-known") ||
          pathname === '/' ||
          pathname === '/api/video' ||
          pathname === '/reels' 
        ) {
          return true;
        }

        return !!token;
      }
    }
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|_next/|public/).*)"],
};
