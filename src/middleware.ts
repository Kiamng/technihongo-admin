import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Các trang public mà không cần đăng nhập (sign-in, login, v.v.)
const publicRoutes = [ "/"];

// Các trang yêu cầu đăng nhập (home, dashboard, profile, v.v.)
const authRoutes = ["/dashboard"];

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Kiểm tra token trên console (optional)
  console.log("Path:", pathname, "Token:", token);

  // Nếu người dùng đã đăng nhập và cố gắng truy cập các trang public (sign-in) -> Chuyển hướng về /dashboard
  if (token && publicRoutes.some((path) => pathname.startsWith(path))) {
    // Nếu đang ở trang /sign-in thì không chuyển hướng nữa
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url)); // Chuyển hướng về /dashboard
    }
    return NextResponse.next(); // Cho phép tiếp tục nếu đang ở trang khác ngoài sign-in
  }

  // Nếu người dùng chưa đăng nhập và cố gắng truy cập các trang yêu cầu auth (dashboard) -> Chuyển hướng về /sign-in
  if (!token && authRoutes.some((path) => pathname.startsWith(path))) {
    // Nếu đang ở trang /dashboard thì không chuyển hướng nữa
    if (pathname === "/dashboard") {
      return NextResponse.redirect(new URL("/", req.url)); // Chuyển hướng về /sign-in
    }
    return NextResponse.next(); // Cho phép tiếp tục nếu đang ở trang khác ngoài dashboard
  }

  // Cho phép request tiếp tục nếu không vi phạm điều kiện trên
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
