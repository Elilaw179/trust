import { NavSidebar } from "@/components/layout/nav-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle2, AlertCircle, ArrowRight, Activity, Smartphone } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"

export default function Dashboard() {
  const userImage = PlaceHolderImages.find(img => img.id === "profile-user")

  return (
    <div className="flex min-h-screen">
      <NavSidebar />
      <main className="flex-1 p-4 md:p-8 lg:p-12 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold text-foreground">Welcome back, Elisha</h1>
            <p className="text-muted-foreground">Manage your secure identity and sharing permissions.</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-3 py-1 flex gap-2 items-center text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Verified Identity
            </Badge>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Identity Card Mini */}
          <Card className="lg:col-span-2 overflow-hidden border-none shadow-lg bg-gradient-to-br from-primary/10 via-background to-accent/10">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="font-headline">Digital Identity</CardTitle>
                <Link href="/identity">
                  <Button variant="ghost" size="sm" className="gap-2">
                    View Full Card <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <CardDescription>Your verified credentials and trust level.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-xl ring-2 ring-primary/20">
                    <Image 
                      src={userImage?.imageUrl || ""} 
                      alt="Profile" 
                      width={96} 
                      height={96} 
                      className="object-cover"
                      data-ai-hint="professional headshot"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-full border-2 border-background">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <h3 className="text-2xl font-bold">Elisha Sunday</h3>
                  <p className="text-sm font-code text-muted-foreground">trust.id/elisha.sunday</p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    <Badge variant="outline">Email Verified</Badge>
                    <Badge variant="outline">Phone Verified</Badge>
                    <Badge variant="outline">ID Document Verified</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="h-full border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Security Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-4">
                <Shield className="w-8 h-8 text-green-600 shrink-0" />
                <div>
                  <p className="font-semibold text-green-900">Maximum Trust</p>
                  <p className="text-xs text-green-700">All identity markers verified.</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-4">
                <Smartphone className="w-8 h-8 text-blue-600 shrink-0" />
                <div>
                  <p className="font-semibold text-blue-900">2 Devices Linked</p>
                  <p className="text-xs text-blue-700">Manage your active sessions.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Permissions */}
          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Recent Consents</CardTitle>
              <Link href="/permissions">
                <Button variant="link" size="sm">Manage All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Neon Analytics", date: "2 hours ago", status: "Approved", icon: PlaceHolderImages.find(i => i.id === "platform-logo-1")?.imageUrl },
                  { name: "Vercel Connect", date: "Yesterday", status: "Pending", icon: PlaceHolderImages.find(i => i.id === "platform-logo-2")?.imageUrl },
                ].map((app, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-border flex items-center justify-center overflow-hidden">
                        <Image src={app.icon || ""} alt={app.name} width={40} height={40} className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium">{app.name}</p>
                        <p className="text-xs text-muted-foreground">{app.date}</p>
                      </div>
                    </div>
                    <Badge variant={app.status === "Approved" ? "default" : "secondary"}>{app.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Mini */}
          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Security Activity</CardTitle>
              <Link href="/activity">
                <Button variant="link" size="sm">View Log</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { event: "Login Attempt", detail: "Success - Chrome Windows", time: "10m ago", icon: Activity },
                  { event: "ID Verified", detail: "Driver License Upload", time: "3d ago", icon: CheckCircle2 },
                ].map((act, i) => (
                  <div key={i} className="flex items-start gap-4 p-3">
                    <div className="mt-1 bg-primary/10 p-2 rounded-full">
                      <act.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{act.event}</p>
                      <p className="text-xs text-muted-foreground">{act.detail} • {act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}