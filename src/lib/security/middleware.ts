import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// IP whitelist - add your office/home IPs here
const ALLOWED_IPS = [
  "127.0.0.1", // localhost
  "::1", // localhost IPv6
  // Add your trusted IPs here:
  // "203.0.113.1", // Example office IP
  // "198.51.100.1", // Example home IP
]

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 100 // requests per window

export async function authenticateRequest(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })
  
  if (!token) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    )
  }
  
  return null // No error, proceed
}

export function checkIPWhitelist(request: NextRequest): boolean {
  // Skip IP check in development
  if (process.env.NODE_ENV === "development") {
    return true
  }

  const ip = getClientIP(request)
  
  // If no IP whitelist is configured, allow all (not recommended for production)
  if (ALLOWED_IPS.length <= 2) { // Only localhost IPs
    console.warn("⚠️  No IP whitelist configured. Add trusted IPs to ALLOWED_IPS array.")
    return true
  }
  
  return ALLOWED_IPS.includes(ip)
}

export function rateLimitCheck(request: NextRequest): boolean {
  const ip = getClientIP(request)
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW
  
  const clientData = rateLimitStore.get(ip)
  
  if (!clientData || clientData.resetTime <= now) {
    // Reset or create new entry
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    })
    return true
  }
  
  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false // Rate limit exceeded
  }
  
  clientData.count++
  return true
}

export function validateAPIKey(request: NextRequest): boolean {
  const apiKey = request.headers.get("x-api-key")
  const validApiKey = process.env.INTERNAL_API_KEY
  
  // If no API key is configured, skip validation
  if (!validApiKey) {
    return true
  }
  
  return apiKey === validApiKey
}

function getClientIP(request: NextRequest): string {
  // Check various headers for the real IP
  const forwarded = request.headers.get("x-forwarded-for")
  const real = request.headers.get("x-real-ip")
  const remote = request.headers.get("remote-addr")
  
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  
  return real || remote || "unknown"
}

export function logSecurityEvent(
  event: string, 
  request: NextRequest, 
  details?: Record<string, any>
) {
  const ip = getClientIP(request)
  const userAgent = request.headers.get("user-agent") || "unknown"
  const timestamp = new Date().toISOString()
  
  const logEntry = {
    timestamp,
    event,
    ip,
    userAgent,
    url: request.url,
    ...details
  }
  
  // In production, send to your security monitoring system
  console.log("🔒 Security Event:", JSON.stringify(logEntry, null, 2))
  
  // You can integrate with services like:
  // - Datadog
  // - Sentry
  // - Custom security dashboard
}