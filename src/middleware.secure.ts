import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { checkIPWhitelist, rateLimitCheck, logSecurityEvent } from "./lib/security/middleware"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow public routes
  const publicRoutes = [
    "/login",
    "/api/auth",
    "/_next",
    "/favicon.ico"
  ]
  
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  if (isPublicRoute) {
    return NextResponse.next()
  }
  
  // Security checks for all protected routes
  
  // 1. IP Whitelist Check
  if (!checkIPWhitelist(request)) {
    logSecurityEvent("IP_BLOCKED", request, { 
      reason: "IP not in whitelist" 
    })
    
    return NextResponse.json(
      { error: "Access denied from this IP address" },
      { status: 403 }
    )
  }
  
  // 2. Rate Limiting
  if (!rateLimitCheck(request)) {
    logSecurityEvent("RATE_LIMIT_EXCEEDED", request)
    
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429 }
    )
  }
  
  // 3. Authentication Check
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })
  
  if (!token) {
    logSecurityEvent("UNAUTHORIZED_ACCESS", request, {
      reason: "No valid session"
    })
    
    // Redirect to login for page requests
    if (!pathname.startsWith("/api")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    
    // Return 401 for API requests
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    )
  }
  
  // 4. Log authorized access
  logSecurityEvent("AUTHORIZED_ACCESS", request, {
    userId: token.sub,
    userEmail: token.email
  })
  
  // 5. Add security headers
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  )
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  )
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)",
  ],
}