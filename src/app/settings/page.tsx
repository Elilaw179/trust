
"use client"

import { useState } from "react"
import { NavSidebar } from "@/components/layout/nav-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  Shield, 
  Key, 
  Smartphone, 
  Eye, 
  UserX, 
  LogOut, 
  ChevronRight, 
  Fingerprint, 
  Lock, 
  Loader2, 
  User as UserIcon,
  CreditCard,
  Link as LinkIcon,
  Bell,
  CheckCircle2,
  Settings2
} from "lucide-react"
import { useUser, useFirestore, useDoc, useMemoFirebase, setDocumentNonBlocking } from "@/firebase"
import { doc, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type SettingsTab = "account" | "security" | "devices" | "apps" | "privacy" | "billing"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account")
  const { user, isUserLoading: isAuthLoading } = useUser()
  const firestore = useFirestore()
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)

  const settingsRef = useMemoFirebase(() => {
    if (!firestore || !user) return null
    return doc(firestore, "users", user.uid, "userSettings", "userSettings")
  }, [firestore, user])

  const { data: settings, isLoading: isSettingsLoading } = useDoc(settingsRef)

  const handleToggle = (key: string, value: boolean) => {
    if (!settingsRef) return
    setIsUpdating(true)

    const updatedData = {
      [key]: value,
      userId: user?.uid,
      updatedAt: serverTimestamp(),
    }

    if (!settings) {
      Object.assign(updatedData, {
        createdAt: serverTimestamp(),
        themeMode: "light",
        pinEnabled: false,
        dataVisibilityPublic: false,
        biometricLoginEnabled: false,
      })
    }

    setDocumentNonBlocking(settingsRef, updatedData, { merge: true })
    
    toast({
      title: "Setting Updated",
      description: `Your preferences have been saved securely.`
    })
    
    setTimeout(() => setIsUpdating(false), 300)
  }

  if (isAuthLoading || isSettingsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <NavSidebar />
      <main className="flex-1 p-4 md:p-8 lg:p-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto w-full">
        <header>
          <h1 className="text-3xl font-headline font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account security and privacy preferences.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
              <SettingsNavItem label="Account" icon={UserIcon} active={activeTab === "account"} onClick={() => setActiveTab("account")} />
              <SettingsNavItem label="Security" icon={Shield} active={activeTab === "security"} onClick={() => setActiveTab("security")} />
              <SettingsNavItem label="Privacy" icon={Eye} active={activeTab === "privacy"} onClick={() => setActiveTab("privacy")} />
              <SettingsNavItem label="Devices" icon={Smartphone} active={activeTab === "devices"} onClick={() => setActiveTab("devices")} />
              <SettingsNavItem label="Connected Apps" icon={LinkIcon} active={activeTab === "apps"} onClick={() => setActiveTab("apps")} />
            </nav>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {activeTab === "account" && (
              <Card className="border-none shadow-lg animate-in fade-in slide-in-from-right-4 duration-300 rounded-3xl overflow-hidden">
                <CardHeader className="bg-secondary/30 pb-6">
                  <CardTitle className="text-xl">Account Profile</CardTitle>
                  <CardDescription>The core identity details linked to your Trust ID.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="flex items-center gap-6 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary border-2 border-background shadow-sm">
                      {user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Authenticated User</p>
                      <h3 className="text-lg font-bold">{user?.email}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-medium text-green-600">Secure Session Active</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Login Method</Label>
                      <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl border">
                        <div className="flex items-center gap-3">
                          <Key className="w-4 h-4 text-primary" />
                          <span className="text-sm font-semibold capitalize">{user?.providerData[0]?.providerId || "Password"}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 rounded-lg text-primary text-xs">Update</Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Unique Trust ID</Label>
                      <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-2xl border">
                        <Shield className="w-4 h-4 text-primary" />
                        <span className="text-xs font-mono text-muted-foreground">{user?.uid}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "security" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <Card className="border-none shadow-lg rounded-3xl overflow-hidden">
                  <CardHeader className="bg-secondary/30 pb-6">
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" /> Security Center
                    </CardTitle>
                    <CardDescription>Multi-layered protection for your digital credentials.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base font-bold">Biometric Login</Label>
                        <p className="text-sm text-muted-foreground">Use FaceID or TouchID for rapid, secure authentication.</p>
                      </div>
                      <Switch 
                        checked={settings?.biometricLoginEnabled ?? false} 
                        onCheckedChange={(checked) => handleToggle("biometricLoginEnabled", checked)}
                        disabled={isUpdating}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base font-bold">Two-Factor Auth (2FA)</Label>
                        <p className="text-sm text-muted-foreground">Require a secondary code for every login attempt.</p>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-xl h-9" onClick={() => toast({ title: "Module Locked", description: "2FA configuration is handled by your system administrator." })}>Configure</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base font-bold">Master PIN</Label>
                        <p className="text-sm text-muted-foreground">Secure sensitive data with a dedicated security PIN.</p>
                      </div>
                      <Switch 
                        checked={settings?.pinEnabled ?? false} 
                        onCheckedChange={(checked) => handleToggle("pinEnabled", checked)}
                        disabled={isUpdating}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-destructive/20 border-2 shadow-lg bg-destructive/5 rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2 text-lg">
                      <UserX className="w-5 h-5" /> Danger Zone
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Permanent actions that will disconnect your identity and revoke all current sessions.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" className="text-destructive hover:bg-destructive hover:text-white border-destructive/20 h-10 rounded-xl font-bold">Deactivate Account</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-3xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Permanent Deactivation?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will immediately disable your Trust ID across all linked platforms. This action is critical and requires review.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive text-destructive-foreground rounded-xl px-8">Confirm Deactivation</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Button variant="ghost" className="text-muted-foreground h-10" onClick={() => toast({ title: "Session Cleared", description: "All other active sessions have been terminated." })}>Sign Out Everywhere</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "privacy" && (
              <Card className="border-none shadow-lg animate-in fade-in slide-in-from-right-4 duration-300 rounded-3xl overflow-hidden">
                <CardHeader className="bg-secondary/30 pb-6">
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary" /> Data & Privacy
                  </CardTitle>
                  <CardDescription>Fine-tune who can discover and interact with your Trust ID.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-bold">Discoverable Profile</Label>
                      <p className="text-sm text-muted-foreground">Allow verified platforms to find you by your Trust ID handle.</p>
                    </div>
                    <Switch 
                      checked={settings?.dataVisibilityPublic ?? false} 
                      onCheckedChange={(checked) => handleToggle("dataVisibilityPublic", checked)}
                      disabled={isUpdating}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-bold">AI Usage Analysis</Label>
                      <p className="text-sm text-muted-foreground">Allow our AI to provide personalized security tips based on your logs.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                   <div className="space-y-4">
                      <Label className="text-base font-bold">Data Sovereignty</Label>
                      <p className="text-sm text-muted-foreground">Request a full export of all data associated with your identity.</p>
                      <Button variant="outline" className="w-full rounded-xl h-10 gap-2 border-dashed">
                        Request Data Export <ChevronRight className="w-4 h-4" />
                      </Button>
                   </div>
                </CardContent>
              </Card>
            )}

            {(activeTab === "devices" || activeTab === "apps") && (
              <Card className="border-none shadow-lg flex flex-col items-center justify-center py-24 animate-in fade-in slide-in-from-right-4 duration-300 rounded-3xl">
                <div className="p-5 rounded-full bg-primary/10 mb-6 relative">
                  <Settings2 className="w-10 h-10 text-primary animate-spin-slow" />
                  <div className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full" />
                </div>
                <h3 className="text-xl font-bold">Feature Coming Soon</h3>
                <p className="text-muted-foreground text-sm max-w-xs text-center mt-2 px-4">
                  We are building a comprehensive device management and app connectivity dashboard for the next major update.
                </p>
                <Button variant="link" className="mt-4 text-primary" onClick={() => setActiveTab("account")}>Return to Account</Button>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function SettingsNavItem({ label, icon: Icon, active, onClick }: { label: string, icon: any, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap lg:w-full text-left px-5 py-3.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-3 border ${
        active 
          ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 border-primary' 
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground border-transparent'
      }`}
    >
      <Icon className={`w-4 h-4 ${active ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
      <span>{label}</span>
    </button>
  )
}
