
"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { NavSidebar } from "@/components/layout/nav-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Sparkles, XCircle, CheckCircle, Clock, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { useUser } from "@/firebase"
import { useRouter } from "next/navigation"

// Lazy load heavy flow
const summarizeDataRequest = async (input: { dataRequested: string }) => {
  const { summarizeDataRequest } = await import("@/ai/flows/summarize-data-request-flow")
  return summarizeDataRequest(input)
}

const INITIAL_REQUESTS = [
  { id: "1", platform: "Neon Analytics", logoId: "platform-logo-1", data: "Email, Full Name, Device ID", status: "Pending", time: "2 hours ago" },
  { id: "2", platform: "Vercel Connect", logoId: "platform-logo-2", data: "Github Profile, Bio, Profile Image", status: "Approved", time: "1 day ago" },
  { id: "3", platform: "Swift Banking", logoId: "platform-logo-1", data: "Verified Address, ID Document, Social Security", status: "Denied", time: "3 days ago" },
]

export default function PermissionsPage() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS)
  const [loadingAI, setLoadingAI] = useState<string | null>(null)
  const [aiSummary, setAiSummary] = useState<{ [key: string]: string }>({})
  const { toast } = useToast()
  const { user, isUserLoading } = useUser()
  const router = useRouter()

  if (!isUserLoading && !user) {
    router.push("/login")
    return null
  }

  const handleAction = (id: string, status: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    toast({
      title: `Permission ${status}`,
      description: `You have ${status.toLowerCase()} access for this platform.`
    })
  }

  const handleAIExplain = async (id: string, dataStr: string) => {
    setLoadingAI(id)
    try {
      const result = await summarizeDataRequest({ dataRequested: dataStr })
      setAiSummary(prev => ({ ...prev, [id]: result.summary }))
    } catch (err) {
      toast({
        variant: "destructive",
        title: "AI Analysis Failed",
        description: "Could not summarize the data request at this time."
      })
    } finally {
      setLoadingAI(null)
    }
  }

  return (
    <div className="flex min-h-screen">
      <NavSidebar />
      <main className="flex-1 p-4 md:p-8 lg:p-12 space-y-8">
        <header>
          <h1 className="text-3xl font-headline font-bold">Consent Control</h1>
          <p className="text-muted-foreground">Manage which platforms have access to your identity data.</p>
        </header>

        <div className="space-y-6">
          <div className="flex items-center gap-4 border-b pb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <Button variant="ghost" className="font-semibold text-primary border-b-2 border-primary rounded-none">All Requests</Button>
            <Button variant="ghost" className="text-muted-foreground">Approved</Button>
            <Button variant="ghost" className="text-muted-foreground">Denied</Button>
          </div>

          <div className="grid gap-4">
            {requests.map((request) => {
              const platformLogo = PlaceHolderImages.find(img => img.id === request.logoId)?.imageUrl
              return (
                <Card key={request.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                          <Image src={platformLogo || ""} alt={request.platform} width={48} height={48} className="object-cover" />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-lg">{request.platform}</h3>
                            <Badge variant={
                              request.status === "Approved" ? "default" : 
                              request.status === "Denied" ? "destructive" : "secondary"
                            } className="text-[10px] px-1.5 h-5">
                              {request.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Requested: <span className="font-medium text-foreground">{request.data}</span></p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {request.time}
                          </p>

                          {aiSummary[request.id] && (
                            <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10 animate-in fade-in slide-in-from-top-2">
                              <p className="text-xs font-bold text-primary flex items-center gap-1 mb-1">
                                <Sparkles className="w-3 h-3" /> AI Summary
                              </p>
                              <p className="text-sm text-foreground leading-relaxed italic">
                                "{aiSummary[request.id]}"
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2 flex-1 sm:flex-none"
                          onClick={() => handleAIExplain(request.id, request.data)}
                          disabled={loadingAI === request.id}
                        >
                          <Sparkles className={`w-4 h-4 ${loadingAI === request.id ? 'animate-pulse' : ''}`} />
                          {loadingAI === request.id ? 'Analyzing...' : 'AI Explain'}
                        </Button>
                        
                        {request.status === "Pending" && (
                          <div className="flex gap-2 flex-1 sm:flex-none">
                            <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700 flex-1" onClick={() => handleAction(request.id, "Approved")}>
                              <CheckCircle className="w-4 h-4" /> Approve
                            </Button>
                            <Button size="sm" variant="destructive" className="gap-2 flex-1" onClick={() => handleAction(request.id, "Denied")}>
                              <XCircle className="w-4 h-4" /> Deny
                            </Button>
                          </div>
                        )}
                        
                        {request.status === "Approved" && (
                          <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive/5 flex-1 sm:flex-none" onClick={() => handleAction(request.id, "Denied")}>
                            Revoke Access
                          </Button>
                        )}

                        {request.status === "Denied" && (
                          <Button size="sm" variant="outline" className="flex-1 sm:flex-none" onClick={() => handleAction(request.id, "Approved")}>
                            Re-approve
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
