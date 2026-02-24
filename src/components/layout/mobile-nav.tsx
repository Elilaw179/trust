
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, LayoutDashboard, User, ShieldCheck, Activity, Settings, LogOut, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useAuth, useUser } from "@/firebase"
import { signOut } from "firebase/auth"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import { BrandLogo } from "./brand-logo"

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "My Identity", href: "/identity", icon: User },
  { name: "Permissions", href: "/permissions", icon: ShieldCheck },
  { name: "Activity", href: "/activity", icon: Activity },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()
  const auth = useAuth()
  const { user, isUserLoading } = useUser()

  return (
    <div className="md:hidden flex items-center justify-between p-4 bg-card border-b sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2 group">
        <BrandLogo />
        <span className="font-headline text-lg font-bold tracking-tight">Trust ID</span>
      </Link>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <SheetHeader className="p-6 text-left border-b">
              <SheetTitle className="flex items-center gap-2">
                <BrandLogo />
                Trust ID
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col p-4 space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                )
              })}
              
              <div className="pt-4 mt-4 border-t">
                {isUserLoading ? (
                  <div className="flex justify-center p-2">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                ) : user ? (
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      signOut(auth)
                      setOpen(false)
                    }}
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </Button>
                ) : (
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button className="w-full">Sign In</Button>
                  </Link>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
