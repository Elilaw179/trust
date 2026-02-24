
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
  CheckCircle2
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
          <div className="lg:col-span-1 space-y-1 overflow-x-auto pb-4 lg:pb-0">
            <nav className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-1">
              <SettingsNavItem label="Account" icon={UserIcon} active={activeTab === "account"} onClick={() => setActiveTab("account")} />
              <SettingsNavItem label="Security" icon={Shield} active={activeTab === "security"} onClick={() => setActiveTab("security")} />
              <SettingsNavItem label="Privacy" icon={Eye} active={activeTab === "privacy"} onClick={() => setActiveTab("privacy")} />
              <SettingsNavItem label="Devices" icon={Smartphone} active={activeTab === "devices"} onClick={() => setActiveTab("devices")} />
              <SettingsNavItem label="Apps" icon={LinkIcon} active={activeTab === "apps"} onClick={() => setActiveTab("apps")} />
            </nav>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {activeTab === "account" && (
              <Card className="border-none shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">Account Profile</CardTitle>
                  <CardDescription>Personal information associated with your Trust ID.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6 p-4 rounded-2xl bg-secondary/30">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary border-2 border-primary/20">
                      {user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Authenticated User</p>
                      <h3 className="text-lg font-bold">{user?.email}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-medium text-green-600">Secure Session Active</span>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Login Method</Label>
                      <div className="flex items-center gap-2 p-3 bg-secondary/20 rounded-xl border">
                        <Key className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold capitalize">{user?.providerData[0]?.providerId || "Password"}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Unique Trust ID</Label>
                      <div className="flex items-center gap-2 p-3 bg-secondary/20 rounded-xl border">
                        <Shield className="w-4 h-4 text-primary" />
                        <span className="text-sm font-mono">{user?.uid.substring(0, 12)}...</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "security" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" /> Security Configuration
                    </CardTitle>
                    <CardDescription>Configure how you protect your identity.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Biometric Login</Label>
                        <p className="text-sm text-muted-foreground">Use FaceID or TouchID to unlock your profile.</p>
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
                        <Label className="text-base">Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Highly recommended for identity protection.</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => toast({ title: "MFA Configuration", description: "Multi-factor authentication module is coming in the next update." })}>Configure</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">PIN Protection</Label>
                        <p className="text-sm text-muted-foreground">Require a 6-digit PIN for sensitive actions.</p>
                      </div>
                      <Switch 
                        checked={settings?.pinEnabled ?? false} 
                        onCheckedChange={(checked) => handleToggle("pinEnabled", checked)}
                        disabled={isUpdating}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-destructive/20 border-2 shadow-sm bg-destructive/5">
                  <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2">
                      <UserX className="w-5 h-5" /> Danger Zone
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">These actions are permanent and cannot be undone.</p>
                    <div className="flex flex-wrap gap-4">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" className="text-destructive hover:bg-destructive/10 border-destructive/20 h-10">Deactivate Account</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will disable your identity across all connected platforms. You can reactivate it within 30 days.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive text-destructive-foreground">Deactivate</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "privacy" && (
              <Card className="border-none shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary" /> Data & Privacy
                  </CardTitle>
                  <CardDescription>Control who sees your identity attributes.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Public Visibility</Label>
                      <p className="text-sm text-muted-foreground">Allow platforms to find you by your Trust ID.</p>
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
                      <Label className="text-base">Anonymous Analytics</Label>
                      <p className="text-sm text-muted-foreground">Help us improve by sharing anonymous usage data.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            )}

            {(activeTab === "devices" || activeTab === "apps" || activeTab === "billing") && (
              <Card className="border-none shadow-sm flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="p-4 rounded-full bg-primary/5 mb-4">
                  <Bell className="w-10 h-10 text-primary/40" />
                </div>
                <h3 className="text-lg font-bold">Coming Soon</h3>
                <p className="text-muted-foreground text-sm max-w-xs text-center">
                  This feature is currently under development for the next Trust ID update.
                </p>
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
      className={`whitespace-nowrap lg:w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
        active 
          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
          : 'text-muted-foreground hover:bg-secondary'
      }`}
    >
      <Icon className={`w-4 h-4 ${active ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}
