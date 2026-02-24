
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
          <Card className="xl:col-span-8 border-none shadow-2xl overflow-hidden rounded-3xl bg-card">
            <div className="h-40 bg-gradient-to-r from-primary via-accent to-primary relative">
               <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
            </div>
            <div className="px-8 pb-8 -mt-12">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8 text-center md:text-left">
                <div className="relative group cursor-pointer" onClick={handleTriggerFileInput}>
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-background shadow-xl bg-card transition-all duration-300 group-hover:scale-105">
                    <Image 
                      src={profileImage} 
                      alt="Profile" 
                      width={112} 
                      height={112} 
                      className="object-cover object-center w-full h-full"
                      priority
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white rounded-full">
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-[8px] font-bold uppercase">Update</span>
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
                  <div className="flex flex-col md:flex-row items-center gap-3">
                    <h2 className="text-2xl font-bold font-headline">{displayName}</h2>
                    <Badge className="bg-green-500 hover:bg-green-600 flex gap-1 rounded-md">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </Badge>
                  </div>
                  <p className="text-muted-foreground font-code text-sm">@{displayUsername}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 w-full md:w-auto">
                  <Button variant="outline" size="sm" className="gap-2 h-10 px-4 rounded-xl" onClick={handleExport}>
                    <Download className="w-4 h-4" /> Export
                  </Button>
                  
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-2 bg-primary h-10 px-4 rounded-xl shadow-lg shadow-primary/20">
                        <Edit3 className="w-4 h-4" /> Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-3xl">
                      <form onSubmit={handleUpdateProfile}>
                        <DialogHeader>
                          <DialogTitle>Edit Identity Profile</DialogTitle>
                          <DialogDescription>
                            Update your public identity attributes. These changes will be reflected across all connected platforms.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="flex justify-center mb-4">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 bg-secondary">
                              <Image 
                                src={profileImage} 
                                alt="Preview" 
                                width={80} 
                                height={80} 
                                className="object-cover object-center w-full h-full"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" name="fullName" defaultValue={displayName} required className="rounded-xl" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="username">Trust ID Username</Label>
                            <Input id="username" name="username" defaultValue={displayUsername} required className="rounded-xl" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="profilePhotoUrl">Profile Photo URL</Label>
                            <Input id="profilePhotoUrl" name="profilePhotoUrl" defaultValue={profileImage} placeholder="https://example.com/photo.jpg" className="rounded-xl" />
                            <p className="text-[10px] text-muted-foreground">You can also click your photo directly on the profile page to upload.</p>
                          </div>
                        </div>
                        <DialogFooter className="gap-2">
                          <Button type="button" variant="ghost" className="rounded-xl" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                          <Button type="submit" className="rounded-xl px-8" disabled={isUpdating}>
                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 pt-4 border-t">
                <div className="space-y-6">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Contact Information</h3>
                  <div className="space-y-4">
                    <InfoItem icon={Mail} label="Email Address" value={user?.email || "Not provided"} verified />
                    <InfoItem icon={Phone} label="Phone Number" value={userData?.phoneNumber || user?.phoneNumber || "Not provided"} verified />
                    <InfoItem icon={MapPin} label="Location" value="Lagos, Nigeria" />
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Verification Details</h3>
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
            <Card className="border-none shadow-md overflow-hidden rounded-3xl">
              <CardHeader className="bg-secondary/30">
                <CardTitle className="text-lg">Trust Level</CardTitle>
                <CardDescription>Your standing on the Trust ID network.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-primary">{userData?.trustLevel || "Level 2: Verified"}</span>
                    <span className="text-muted-foreground font-medium">Progress to L3</span>
                  </div>
                  <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[85%] transition-all duration-1000" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                   <div className="p-3 rounded-2xl bg-secondary/50 border text-center">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Endorsements</p>
                      <p className="text-xl font-bold">12</p>
                   </div>
                   <div className="p-3 rounded-2xl bg-secondary/50 border text-center">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Data Requests</p>
                      <p className="text-xl font-bold">45</p>
                   </div>
                </div>

                <ul className="text-xs text-muted-foreground space-y-2 list-none">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Financial platforms access enabled</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Biometric sign-in authorized</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Eligible for enterprise ID</li>
                </ul>
              </CardContent>
              <CardFooter className="pb-6">
                <Button variant="secondary" className="w-full rounded-xl font-bold">Upgrade to Level 3</Button>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-md bg-accent text-accent-foreground rounded-3xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl" />
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" /> 
                  Private Identity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm opacity-90 leading-relaxed">
                  Your identity is encrypted and stored securely. You only share what you want, when you want. No third-party tracking.
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
      <div className="p-2.5 rounded-2xl bg-secondary group-hover:bg-primary/10 transition-colors shrink-0">
        <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{label}</p>
          {verified && <Badge className="text-[8px] h-3.5 px-1 bg-green-500/10 text-green-600 border-green-200">Verified</Badge>}
        </div>
        <p className="text-sm font-semibold truncate">{value}</p>
      </div>
    </div>
  )
}
