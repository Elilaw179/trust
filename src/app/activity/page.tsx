
"use client"

import { useState } from "react"
import { NavSidebar } from "@/components/layout/nav-sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Filter, ShieldAlert, Key, Globe, LogIn, Sparkles, ChevronRight, Info, AlertTriangle } from "lucide-react"
import { clarifySecurityEvent } from "@/ai/flows/clarify-security-event-flow"
import { useToast } from "@/hooks/use-toast"

const LOGS = [
  { id: "1", type: "Login", event: "auth.login_success", detail: "Login success from 192.168.1.1 (Chrome, MacOS)", time: "10 minutes ago", severity: "Low" },
  { id: "2", type: "Security", event: "identity.mfa_failed", detail: "Multiple failed 2FA attempts detected in short succession.", time: "1 hour ago", severity: "High" },
  { id: "3", type: "Permission", event: "consent.granted", detail: "Access granted to 'Neon Analytics' for profile data.", time: "4 hours ago", severity: "Low" },
  { id: "4", type: "Account", event: "account.pin_changed", detail: "Security PIN updated via verified mobile device.", time: "Yesterday", severity: "Medium" },
  { id: "5", type: "Access", event: "auth.new_device", detail: "New login detected on iPhone 15 Pro, London, UK.", time: "2 days ago", severity: "Medium" },
]

export default function ActivityPage() {
  const [loadingAI, setLoadingAI] = useState<string | null>(null)
  const [clarifications, setClarifications] = useState<{ [key: string]: any }>({})
  const { toast } = useToast()

  const handleClarify = async (id: string, logEntry: string) => {
    setLoadingAI(id)
    try {
      const result = await clarifySecurityEvent({ securityEventLog: logEntry })
      setClarifications(prev => ({ ...prev, [id]: result }))
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Clarification Failed",
        description: "Unable to clarify the security event right now."
      })
    } finally {
      setLoadingAI(null)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "Login": return LogIn
      case "Security": return ShieldAlert
      case "Permission": return Globe
      case "Account": return Key
      default: return Info
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "destructive"
      case "Medium": return "secondary"
      case "Low": return "default"
      default: return "outline"
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <NavSidebar />
      <main className="flex-1 p-4 md:p-8 lg:p-12 space-y-8 max-w-7xl mx-auto w-full">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div>
            <h1 className="text-3xl font-headline font-bold">Security Activity</h1>
            <p className="text-muted-foreground">Monitor and understand every action on your Trust ID.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search logs..." className="pl-10 w-full md:w-64 h-10 rounded-xl" />
            </div>
            <Button variant="outline" size="sm" className="gap-2 h-10 rounded-xl border-dashed">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>
        </header>

        <Card className="border-none shadow-lg overflow-hidden rounded-3xl bg-card">
          <CardHeader className="bg-secondary/30 pb-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Recent Events</CardTitle>
                <CardDescription>Activity from the last 30 days.</CardDescription>
              </div>
              <Badge variant="outline" className="bg-background">Total: {LOGS.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y border-t">
              {LOGS.map((log, idx) => {
                const Icon = getIcon(log.type)
                const isClarified = clarifications[log.id]
                return (
                  <div key={log.id} className="p-4 md:p-6 hover:bg-secondary/10 transition-colors animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-2xl ${log.severity === 'High' ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-code text-[10px] font-bold uppercase tracking-tight text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{log.event}</span>
                            <Badge variant={getSeverityColor(log.severity) as any} className="text-[10px] h-4 px-1.5 rounded-sm">
                              {log.severity}
                            </Badge>
                            <span className="text-xs text-muted-foreground">• {log.time}</span>
                          </div>
                          <p className="font-semibold text-foreground text-sm md:text-base">{log.detail}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-2 text-primary hover:text-primary hover:bg-primary/5 shrink-0 self-start h-9 rounded-xl border border-transparent hover:border-primary/20 transition-all"
                        onClick={() => handleClarify(log.id, `${log.event}: ${log.detail}`)}
                        disabled={loadingAI === log.id}
                      >
                        <Sparkles className={`w-4 h-4 ${loadingAI === log.id ? 'animate-spin' : ''}`} />
                        {isClarified ? 'Analysis Complete' : 'AI Analysis'}
                      </Button>
                    </div>

                    {isClarified && (
                      <div className="mt-6 ml-0 md:ml-12 p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-2 text-primary">
                          <Sparkles className="w-5 h-5" />
                          <h4 className="font-bold tracking-tight">AI Insights</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Plain Language Explanation</p>
                            <p className="text-sm leading-relaxed text-foreground/80">{isClarified.explanation}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Potential Security Risks</p>
                            <p className="text-sm leading-relaxed text-foreground/80">{isClarified.implications}</p>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-primary/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Next Steps</p>
                            <p className="text-sm font-semibold text-primary">{isClarified.advice}</p>
                          </div>
                          <Button size="sm" variant="outline" className="rounded-xl border-primary/20 text-primary hover:bg-primary hover:text-white">
                            Take Action
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
          <div className="p-6 bg-secondary/10 text-center border-t">
             <p className="text-xs text-muted-foreground">All activity is end-to-end encrypted and visible only to you.</p>
          </div>
        </Card>
      </main>
    </div>
  )
}
