import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";
import jwt, { JwtPayload } from "jsonwebtoken";
interface CustomJwtPayload extends JwtPayload {
  role?: string; // role có thể là string hoặc không
}
// Các trang public mà không cần đăng nhập
const publicRoutes = ["/"];

// Các trang dành cho Admin
const authRoutes = ["/dashboard", "/user-management", "/violation-management", "/achievement-management","/supscription-management"];

// Các trang dành cho Content Manager
const CMRoutes = ["/course-management", "/system-configuration" , "/meeting-management", "/learning-path" , "/difficultylevel-management"];

export default async function middleware(req: NextRequest) {
  // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const token = req.cookies.get("__Secure-next-auth.session-token");
  

  

  // 🛑 Nếu chưa đăng nhập, chỉ cho phép vào publicRoutes (trang đăng nhập)
  if (!token) {
    if (!publicRoutes.includes(req.nextUrl.pathname)) {
      console.log("🚫 Chưa đăng nhập, chuyển hướng về / (trang đăng nhập)");
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

 let role: string | undefined;
  try {
    // Giải mã token JWT và lấy thông tin người dùng
    const decodedToken = jwt.verify(token.value, process.env.JWT_SECRET as string) as CustomJwtPayload;
    
    // Log thông tin decodedToken để kiểm tra
    console.log("Decoded Token:", decodedToken); // Kiểm tra giá trị của decodedToken

    role = decodedToken?.role; // Lấy role từ decoded token
  } catch (error) {
    console.error("Lỗi giải mã token:", error);
    return NextResponse.redirect(new URL("/not-found", req.url)); // Redirect nếu token không hợp lệ
  }

const { pathname } = req.nextUrl;
console.log("🌍 Path:", pathname, "🛂 Role:", role, "token:", token);
  // 🔄 Nếu đã đăng nhập mà vẫn vào trang đăng nhập, chuyển hướng về dashboard phù hợp
  if (pathname === "/") {
    console.log("🔄 Đã đăng nhập, chuyển hướng đến trang phù hợp...");
    return NextResponse.redirect(new URL(role === "Administrator" ? "/dashboard" : "/course-management", req.url));
  }

  // ✅ Nếu role là Content Manager, chỉ cho phép truy cập CMRoutes
  if (role === "Content Manager" && !CMRoutes.some((path) => pathname.startsWith(path))) {
    console.log("⛔ Content Manager bị chặn truy cập:", pathname);
    return NextResponse.redirect(new URL("/not-found", req.url));
  }

  // ✅ Nếu role là Administrator, chỉ cho phép truy cập authRoutes
  if (role === "Administrator" && !authRoutes.some((path) => pathname.startsWith(path))) {
    console.log("⛔ Administrator bị chặn truy cập:", pathname);
    return NextResponse.redirect(new URL("/not-found", req.url));
  }

  // ✅ Nếu hợp lệ, tiếp tục truy cập
  console.log("✅ Truy cập hợp lệ:", pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|not-found).*)"],
};
