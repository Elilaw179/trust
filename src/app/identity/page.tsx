import { NavSidebar } from "@/components/layout/nav-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShieldCheck, User, Mail, Phone, MapPin, Calendar, Camera, Download, History, Edit3 } from "lucide-react"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"

export default function IdentityPage() {
  const userImage = PlaceHolderImages.find(img => img.id === "profile-user")

  return (
    <div className="flex min-h-screen">
      <NavSidebar />
      <main className="flex-1 p-4 md:p-8 lg:p-12 space-y-8 bg-background">
        <header>
          <h1 className="text-3xl font-headline font-bold">My Digital Identity</h1>
          <p className="text-muted-foreground">Manage your verified credentials and personal details.</p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Main Card */}
          <Card className="xl:col-span-8 border-none shadow-2xl overflow-hidden rounded-2xl">
            <div className="h-32 bg-gradient-to-r from-primary via-accent to-primary" />
            <div className="px-8 pb-8 -mt-16">
              <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-background shadow-xl bg-card">
                    <Image 
                      src={userImage?.imageUrl || ""} 
                      alt="Profile" 
                      width={128} 
                      height={128} 
                      className="object-cover"
                    />
                  </div>
                  <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white rounded-3xl">
                    <Camera className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold font-headline">Elisha Sunday</h2>
                    <Badge className="bg-green-500 hover:bg-green-600">Verified</Badge>
                  </div>
                  <p className="text-muted-foreground font-code">@elisha.sunday</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" /> Export Card
                  </Button>
                  <Button size="sm" className="gap-2 bg-primary">
                    <Edit3 className="w-4 h-4" /> Edit Profile
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Contact Information</h3>
                  <div className="space-y-4">
                    <InfoItem icon={Mail} label="Email Address" value="elisha.sunday@example.com" verified />
                    <InfoItem icon={Phone} label="Phone Number" value="+234 812 345 6789" verified />
                    <InfoItem icon={MapPin} label="Location" value="Lagos, Nigeria" />
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Verification Details</h3>
                  <div className="space-y-4">
                    <InfoItem icon={ShieldCheck} label="Identity Score" value="98 / 100" />
                    <InfoItem icon={Calendar} label="Member Since" value="October 2023" />
                    <InfoItem icon={History} label="Last Verified" value="2 days ago" />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Verification Stats */}
          <div className="xl:col-span-4 space-y-6">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Trust Level</CardTitle>
                <CardDescription>Your current standing on the platform.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Level 2: Verified User</span>
                  <span className="text-primary font-bold">Progress to L3</span>
                </div>
                <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[85%] transition-all duration-1000" />
                </div>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Can access financial platforms</li>
                  <li>Enabled biometric sign-in</li>
                  <li>Eligible for enterprise identity</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" className="w-full">Upgrade to Level 3</Button>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-md bg-accent text-accent-foreground">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" /> 
                  Reusable Identity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm opacity-90 leading-relaxed">
                  Your identity is encrypted and stored locally. You only share what you want, when you want.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

function InfoItem({ icon: Icon, label, value, verified }: { icon: any, label: string, value: string, verified?: boolean }) {
  return (
    <div className="flex gap-4 group">
      <div className="p-2 rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors shrink-0">
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          {verified && <Badge className="text-[10px] h-4 px-1 bg-green-500/10 text-green-600 border-green-200">Verified</Badge>}
        </div>
        <p className="text-sm font-semibold truncate">{value}</p>
      </div>
    </div>
  )
}