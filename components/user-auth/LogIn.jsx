import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { FcGoogle } from "react-icons/fc"
import { Loader2, Mail } from "lucide-react"
import { Link } from 'react-router-dom'

export default function LogIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signInWithEmail, signInWithGoogle } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    await signInWithEmail(email, password)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen  backdrop-blur-[1px] flex items-center justify-center bg-background p-4">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Log in to your account</CardTitle>
          <CardDescription>
            Enter your credentials to log in
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-2 mb-5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
            <Link 
              to="#" 
              className="text-primary hover:text-primary/90 underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
            <Button className="w-full mt-4" type="submit" disabled={isLoading}>
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
              Log In
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button variant="outline" onClick={signInWithGoogle} className="w-full">
            <FcGoogle className="mr-2 h-4 w-4" />
            Sign In With Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link 
              to="/signup" 
              className="text-primary hover:text-primary/90 underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}