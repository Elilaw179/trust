
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Shield, User, ShieldCheck, Activity, Settings, LayoutDashboard, LogOut, LogIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth, useUser } from "@/firebase"
import { signOut } from "firebase/auth"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "My Identity", href: "/identity", icon: User },
  { name: "Permissions", href: "/permissions", icon: ShieldCheck },
  { name: "Activity", href: "/activity", icon: Activity },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function NavSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const auth = useAuth()
  const { user, isUserLoading } = useUser()

  const handleSignOut = async () => {
    await signOut(auth)
    router.push("/login")
  }

  return (
    <aside className="w-64 border-r bg-card hidden md:flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-lg group-hover:bg-accent transition-colors">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-headline text-xl font-bold tracking-tight">Trust ID</span>
        </Link>
        <ThemeToggle />
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 mt-auto border-t">
        {!isUserLoading && (
          user ? (
            <div className="space-y-4">
              <div className="bg-secondary rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {user.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold truncate">{user.email}</p>
                  <p className="text-[10px] text-muted-foreground">Standard User</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={handleSignOut}
              >
                <LogOut className="w-5 h-5" />
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button className="w-full gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            </Link>
          )
        )}
      </div>
    </aside>
  )
}
