import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { FcGoogle } from "react-icons/fc";
import { Loader2, Mail } from "lucide-react"
import { useNavigate } from 'react-router-dom'

export default function SignUp() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { createUserWithEmail, signInWithGoogle } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const displayName = `${firstName} ${lastName}`.trim()
    await createUserWithEmail(email, password, displayName)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen backdrop-blur-[1px] flex items-center justify-center bg-background p-4">
    <Card className="w-[350px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-2 mb-5">
            <div className='w-100'>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            </div>
            <div className='w-100'>
             <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            </div>
          </div>
          <div className="grid gap-2 mb-5 ">
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
            <Label htmlFor="password">Password  </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
           
          </div>
          <Button className="w-full mt-4" type="submit" disabled={isLoading}>
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign Up
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
      <CardFooter>
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <a
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </a>
          .
        </p>
      </CardFooter>
    </Card>
    </div>
  )
}