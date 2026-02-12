import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const protectedRoutes = ["/codes", "/settings"]
const authRoutes = ["/login", "/register"]

export function middleware(req: NextRequest) {
    const accessToken = req.cookies.get("access-token")?.value
    const { pathname } = req.nextUrl

    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    )

    const isAuthRoute = authRoutes.some(route =>
        pathname.startsWith(route)
    )

    if (!accessToken && isProtectedRoute) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    if (accessToken && isAuthRoute) {
        return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/codes/:path*", "/settings/:path*", "/login", "/register"],
}
