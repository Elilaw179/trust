
"use client"

import { useState, useEffect } from "react"
import { NavSidebar } from "@/components/layout/nav-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Sparkles, XCircle, CheckCircle, Clock, Info, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { useUser, useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking } from "@/firebase"
import { useRouter } from "next/navigation"
import { collection, doc, serverTimestamp } from "firebase/firestore"
import { summarizeDataRequest } from "@/ai/flows/summarize-data-request-flow"

const PLATFORMS = [
  { id: "neon-analytics", name: "Neon Analytics", logoId: "platform-logo-1", requestedData: "Email, Full Name, Device ID" },
  { id: "vercel-connect", name: "Vercel Connect", logoId: "platform-logo-2", requestedData: "Github Profile, Bio, Profile Image" },
  { id: "swift-banking", name: "Swift Banking", logoId: "platform-logo-1", requestedData: "Verified Address, ID Document, Social Security" },
]

export default function PermissionsPage() {
  const { user, isUserLoading } = useUser()
  const router = useRouter()
  const firestore = useFirestore()
  const { toast } = useToast()
  
  const [loadingAI, setLoadingAI] = useState<string | null>(null)
  const [aiSummary, setAiSummary] = useState<{ [key: string]: string }>({})
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const grantsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null
    return collection(firestore, "users", user.uid, "permissionGrants")
  }, [firestore, user])

  const { data: firestoreGrants, isLoading: isGrantsLoading } = useCollection(grantsQuery)

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login")
    }
  }, [user, isUserLoading, router])

  if (isUserLoading || isGrantsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  const requests = PLATFORMS.map(platform => {
    const grant = firestoreGrants?.find(g => g.id === platform.id)
    return {
      ...platform,
      status: grant?.status || "Pending",
      lastUpdated: grant?.updatedAt ? new Date(grant.updatedAt.seconds * 1000).toLocaleDateString() : "New Request"
    }
  })

  const handleAction = async (platformId: string, status: string) => {
    if (!firestore || !user) return
    setUpdatingId(platformId)

    const grantRef = doc(firestore, "users", user.uid, "permissionGrants", platformId)
    
    setDocumentNonBlocking(grantRef, {
      userId: user.uid,
      platformId: platformId,
      status: status,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    }, { merge: true })

    toast({
      title: `Permission ${status}`,
      description: `You have ${status.toLowerCase()} access for ${PLATFORMS.find(p => p.id === platformId)?.name}.`
    })

    setTimeout(() => setUpdatingId(null), 500)
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
    <div className="flex min-h-screen bg-background">
      <NavSidebar />
      <main className="flex-1 p-4 md:p-8 lg:p-12 space-y-8 max-w-7xl mx-auto w-full">
        <header className="animate-in fade-in slide-in-from-top-4 duration-500">
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
            {requests.map((request, idx) => {
              const platformLogo = PlaceHolderImages.find(img => img.id === request.logoId)?.imageUrl
              const isUpdating = updatingId === request.id

              return (
                <Card key={request.id} className="border-none shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 100}ms` }}>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center overflow-hidden shrink-0 border">
                          <Image src={platformLogo || ""} alt={request.name} width={48} height={48} className="object-cover" />
                        </div>
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-lg">{request.name}</h3>
                            <Badge variant={
                              request.status === "Approved" ? "default" : 
                              request.status === "Denied" ? "destructive" : "secondary"
                            } className="text-[10px] px-1.5 h-5">
                              {request.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Requested: <span className="font-medium text-foreground">{request.requestedData}</span></p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Updated: {request.lastUpdated}
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
                          className="gap-2 flex-1 sm:flex-none h-10"
                          onClick={() => handleAIExplain(request.id, request.requestedData)}
                          disabled={loadingAI === request.id}
                        >
                          {loadingAI === request.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                          {loadingAI === request.id ? 'Analyzing...' : 'AI Explain'}
                        </Button>
                        
                        {request.status === "Pending" && (
                          <div className="flex gap-2 flex-1 sm:flex-nowrap">
                            <Button 
                              size="sm" 
                              className="gap-2 bg-green-600 hover:bg-green-700 flex-1 h-10" 
                              onClick={() => handleAction(request.id, "Approved")}
                              disabled={isUpdating}
                            >
                              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              className="gap-2 flex-1 h-10" 
                              onClick={() => handleAction(request.id, "Denied")}
                              disabled={isUpdating}
                            >
                              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />} Deny
                            </Button>
                          </div>
                        )}
                        
                        {request.status === "Approved" && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-destructive border-destructive hover:bg-destructive/5 flex-1 sm:flex-none h-10" 
                            onClick={() => handleAction(request.id, "Denied")}
                            disabled={isUpdating}
                          >
                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />} Revoke Access
                          </Button>
                        )}

                        {request.status === "Denied" && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 sm:flex-none h-10" 
                            onClick={() => handleAction(request.id, "Approved")}
                            disabled={isUpdating}
                          >
                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Re-approve
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
