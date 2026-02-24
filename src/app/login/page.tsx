
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Shield, Sparkles, LogIn, Mail, Lock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAuth, useUser } from "@/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const auth = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in."
      })
      router.push("/")
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: err.message || "Please check your credentials and try again."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-3 rounded-2xl shadow-xl shadow-primary/20">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-headline font-bold tracking-tight">Trust ID</h1>
          </div>
        </div>

        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-card/80 backdrop-blur-xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your secure identity.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-11 text-base font-bold gap-2" disabled={loading}>
                {loading ? "Signing in..." : (
                  <>
                    Sign In <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t pt-6">
            <div className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary font-bold hover:underline">
                Register now
              </Link>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              <Sparkles className="w-3 h-3 text-primary" />
              Secure Biometric Encryption Enabled
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
