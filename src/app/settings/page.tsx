import { NavSidebar } from "@/components/layout/nav-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Shield, Key, Smartphone, Eye, UserX, LogOut, ChevronRight, Fingerprint, Lock } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen">
      <NavSidebar />
      <main className="flex-1 p-4 md:p-8 lg:p-12 space-y-8">
        <header>
          <h1 className="text-3xl font-headline font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account security and privacy preferences.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-1">
            <SettingsNav />
          </div>

          <div className="md:col-span-2 space-y-6">
            {/* Security Section */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" /> Security
                </CardTitle>
                <CardDescription>Configure how you protect your identity.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Biometric Login</Label>
                    <p className="text-sm text-muted-foreground">Use FaceID or TouchID to unlock your profile.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Highly recommended for identity protection.</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Change PIN</Label>
                    <p className="text-sm text-muted-foreground">Update your 6-digit security code.</p>
                  </div>
                  <Button variant="outline" size="sm">Update</Button>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Section */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" /> Privacy
                </CardTitle>
                <CardDescription>Control who sees your identity attributes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Identity Searchability</Label>
                    <p className="text-sm text-muted-foreground">Allow platforms to find you by your Trust ID.</p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Share Analytics</Label>
                    <p className="text-sm text-muted-foreground">Help us improve by sharing anonymous usage data.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/20 border-2 shadow-sm">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <UserX className="w-5 h-5" /> Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">These actions are permanent and cannot be undone.</p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline" className="text-destructive hover:bg-destructive/5 border-destructive/20">Deactivate Account</Button>
                  <Button variant="destructive">Delete All My Data</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

function SettingsNav() {
  const items = [
    { label: "Account Information", active: true },
    { label: "Security & Login", active: false },
    { label: "Devices & Sessions", active: false },
    { label: "Connected Apps", active: false },
    { label: "Data & Privacy", active: false },
    { label: "Billing & Plans", active: false },
  ]
  return (
    <nav className="space-y-1">
      {items.map((item) => (
        <button
          key={item.label}
          className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
            item.active ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-secondary'
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}