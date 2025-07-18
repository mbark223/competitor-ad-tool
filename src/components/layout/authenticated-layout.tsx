"use client"

import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3, Eye, Search, LogOut, Shield } from "lucide-react"
import { signOut } from "next-auth/react"

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  // Disable authentication for testing - allow all access
  if (true) {
    return (
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card">
          <div className="flex h-16 items-center justify-between border-b px-6">
            <Link href="/" className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <span className="font-bold">Competitor Ads</span>
            </Link>
          </div>
          
          <nav className="space-y-2 p-4">
            <Link href="/dashboard">
              <Button 
                variant={pathname === "/dashboard" ? "default" : "ghost"} 
                className="w-full justify-start"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/competitors">
              <Button 
                variant={pathname.startsWith("/competitors") ? "default" : "ghost"} 
                className="w-full justify-start"
              >
                <Search className="mr-2 h-4 w-4" />
                Company Lookup
              </Button>
            </Link>
            <Link href="/ads">
              <Button 
                variant={pathname === "/ads" ? "default" : "ghost"} 
                className="w-full justify-start"
              >
                <Eye className="mr-2 h-4 w-4" />
                Ad Explorer
              </Button>
            </Link>
            <Link href="/search">
              <Button 
                variant={pathname === "/search" ? "default" : "ghost"} 
                className="w-full justify-start"
              >
                <Search className="mr-2 h-4 w-4" />
                Search Intelligence
              </Button>
            </Link>
          </nav>

          {/* User info */}
          <div className="absolute bottom-0 left-0 right-0 w-64 border-t bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium">Internal User</span>
                <span className="text-xs text-muted-foreground">Competitor Intelligence</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    )
  }

  // Show authenticated layout
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <div className="flex h-16 items-center justify-between border-b px-6">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-green-600" />
            <span className="font-bold">Competitor Ads</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-green-600 font-medium">SECURE</span>
          </div>
        </div>
        
        <nav className="space-y-2 p-4">
          <Link href="/dashboard">
            <Button 
              variant={pathname === "/dashboard" ? "default" : "ghost"} 
              className="w-full justify-start"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/competitors">
            <Button 
              variant={pathname.startsWith("/competitors") ? "default" : "ghost"} 
              className="w-full justify-start"
            >
              <Search className="mr-2 h-4 w-4" />
              Company Lookup
            </Button>
          </Link>
          <Link href="/ads">
            <Button 
              variant={pathname === "/ads" ? "default" : "ghost"} 
              className="w-full justify-start"
            >
              <Eye className="mr-2 h-4 w-4" />
              Ad Explorer
            </Button>
          </Link>
          <Link href="/search">
            <Button 
              variant={pathname === "/search" ? "default" : "ghost"} 
              className="w-full justify-start"
            >
              <Search className="mr-2 h-4 w-4" />
              Search Intelligence
            </Button>
          </Link>
        </nav>

        {/* User info and logout */}
        <div className="absolute bottom-0 left-0 right-0 w-64 border-t bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-medium truncate">
                {session?.user?.name || session?.user?.email}
              </span>
              <span className="text-xs text-muted-foreground">
                {session?.user?.role || "User"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}