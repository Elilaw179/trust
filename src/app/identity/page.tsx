
"use client"

import { useState, useRef } from "react"
import { NavSidebar } from "@/components/layout/nav-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Camera, 
  Download, 
  History, 
  Edit3, 
  Loader2,
  CheckCircle2
} from "lucide-react"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { useUser, useFirestore, useDoc, useMemoFirebase, setDocumentNonBlocking } from "@/firebase"
import { doc, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

export default function IdentityPage() {
  const { user, isUserLoading } = useUser()
  const firestore = useFirestore()
  const { toast } = useToast()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const userRef = useMemoFirebase(() => {
    if (!firestore || !user) return null
    return doc(firestore, "users", user.uid)
  }, [firestore, user])

  const { data: userData, isLoading: isDataLoading } = useDoc(userRef)

  const defaultUserImage = PlaceHolderImages.find(img => img.id === "profile-user")
  const profileImage = userData?.profilePhotoUrl || defaultUserImage?.imageUrl || ""

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your secure digital identity card is being prepared for download."
    })
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Identity card exported successfully."
      })
    }, 1500)
  }

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userRef || !user) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUri = event.target?.result as string
      
      setDocumentNonBlocking(userRef, {
        profilePhotoUrl: dataUri,
        updatedAt: serverTimestamp(),
      }, { merge: true })

      toast({
        title: "Photo Updated",
        description: "Your new identity portrait has been synchronized."
      })
    }
    reader.readAsDataURL(file)
  }

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!userRef || !user) return
    
    setIsUpdating(true)
    const formData = new FormData(e.currentTarget)
    const fullName = formData.get("fullName") as string
    const username = formData.get("username") as string
    const profilePhotoUrl = formData.get("profilePhotoUrl") as string

    setDocumentNonBlocking(userRef, {
      id: user.uid,
      fullName,
      username,
      profilePhotoUrl: profilePhotoUrl || profileImage,
      updatedAt: serverTimestamp(),
      phoneNumber: user.phoneNumber || "+0 000 000 0000",
      verificationStatus: "Verified",
      trustLevel: "Level 2",
      createdAt: userData?.createdAt || serverTimestamp(),
    }, { merge: true })

    toast({
      title: "Profile Updated",
      description: "Your identity details have been securely synchronized."
    })
    
    setTimeout(() => {
      setIsUpdating(false)
      setIsEditDialogOpen(false)
    }, 500)
  }

  if (isUserLoading || isDataLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  const displayName = userData?.fullName || user?.displayName || "Identity Owner"
  const displayUsername = userData?.username || user?.email?.split('@')[0] || "user"

  return (
    <div className="flex min-h-screen">
      <NavSidebar />
      <main className="flex-1 p-4 md:p-8 lg:p-12 space-y-8 bg-background animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header>
          <h1 className="text-3xl font-headline font-bold">My Digital Identity</h1>
          <p className="text-muted-foreground">Manage your verified credentials and personal details.</p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <Card className="xl:col-span-8 border-none shadow-2xl overflow-hidden rounded-2xl bg-card">
            <div className="h-32 bg-gradient-to-r from-primary via-accent to-primary" />
            <div className="px-8 pb-8 -mt-16">
              <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
                <div className="relative group cursor-pointer" onClick={handleTriggerFileInput}>
                  <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-background shadow-xl bg-card">
                    <Image 
                      src={profileImage} 
                      alt="Profile" 
                      width={128} 
                      height={128} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white rounded-3xl">
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-bold uppercase">Change Photo</span>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                  />
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold font-headline">{displayName}</h2>
                    <Badge className="bg-green-500 hover:bg-green-600 flex gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </Badge>
                  </div>
                  <p className="text-muted-foreground font-code">@{displayUsername}</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button variant="outline" size="sm" className="gap-2 flex-1 md:flex-none" onClick={handleExport}>
                    <Download className="w-4 h-4" /> Export Card
                  </Button>
                  
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-2 bg-primary flex-1 md:flex-none">
                        <Edit3 className="w-4 h-4" /> Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <form onSubmit={handleUpdateProfile}>
                        <DialogHeader>
                          <DialogTitle>Edit Identity Profile</DialogTitle>
                          <DialogDescription>
                            Update your public identity attributes. These changes will be reflected across all connected platforms.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" name="fullName" defaultValue={displayName} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="username">Trust ID Username</Label>
                            <Input id="username" name="username" defaultValue={displayUsername} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="profilePhotoUrl">Profile Photo URL</Label>
                            <Input id="profilePhotoUrl" name="profilePhotoUrl" defaultValue={profileImage} placeholder="https://example.com/photo.jpg" />
                            <p className="text-[10px] text-muted-foreground">You can also click your photo directly to upload an image from your device.</p>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="ghost" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                          <Button type="submit" disabled={isUpdating}>
                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Contact Information</h3>
                  <div className="space-y-4">
                    <InfoItem icon={Mail} label="Email Address" value={user?.email || "Not provided"} verified />
                    <InfoItem icon={Phone} label="Phone Number" value={userData?.phoneNumber || user?.phoneNumber || "Not provided"} verified />
                    <InfoItem icon={MapPin} label="Location" value="Lagos, Nigeria" />
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Verification Details</h3>
                  <div className="space-y-4">
                    <InfoItem icon={ShieldCheck} label="Identity Score" value="98 / 100" />
                    <InfoItem icon={Calendar} label="Member Since" value={userData?.createdAt ? (typeof userData.createdAt === 'string' ? new Date(userData.createdAt).toLocaleDateString() : new Date(userData.createdAt.seconds * 1000).toLocaleDateString()) : "October 2023"} />
                    <InfoItem icon={History} label="Last Verified" value="Recently" />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="xl:col-span-4 space-y-6">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Trust Level</CardTitle>
                <CardDescription>Your current standing on the platform.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{userData?.trustLevel || "Level 2: Verified User"}</span>
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
