// // // middleware.ts
// // import withAuth from "next-auth/middleware";
// // import { NextRequest, NextResponse } from "next/server";

// // export default withAuth(
// //   function middleware(req: NextRequest) {
// //     return NextResponse.next();
// //   },
// //   {
// //     callbacks: {
// //       authorized: ({ token, req }) => {
// //         const { pathname } = req.nextUrl;

// //         if (
// //           pathname.startsWith('/api/auth') ||
// //           pathname === '/login' ||
// //           pathname === '/register' ||
// //           pathname.startsWith("/.well-known") ||
// //           pathname === '/'
// //         ) {
// //           return true;
// //         }

// //         return !!token;
// //       }
// //     }
// //   }
// // );

// // export const config = {
// //   matcher: ["/((?!_next/static|_next/image|favicon.ico|_next/|public/).*)"],
// // };


// // middleware.ts
// import { withAuth } from "next-auth/middleware"
// import { NextRequest } from "next/server"

// export default withAuth({
//   callbacks: {
//     authorized: ({ token, req }: { token: any; req: NextRequest }) => {
//       const pathname = req.nextUrl.pathname;

//       // Public routes
//       const publicRoutes = [
//         '/',
//         '/login',
//         '/register',
//       ];

//       const isPublic =
//         publicRoutes.includes(pathname) ||
//         pathname.startsWith('/api/auth') ||
//         pathname.startsWith('/.well-known');

//       if (isPublic) return true;

//       // Protected routes
//       return !!token;
//     },
//   },
// })

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// }
