"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem("token", data.token)

        toast({
          title: "Login successful",
          description: "Welcome to Laundry-Van Admin Panel",
          variant: "default",
        })

        router.push("/dashboard")
      } else {
        toast({
          title: "Login failed",
          description: data.Message || "Invalid credentials",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center">
                <span className="text-white text-2xl font-bold">LV</span>
              </div>
            </div>
            <CardTitle className="text-2xl text-center font-bold">Admin Login</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@laundryvan.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-brand-secondary hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
              </div>
              <Button type="submit" className="w-full bg-brand-primary hover:bg-brand-secondary" disabled={isLoading}>
                {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                ) : (
                    "Login"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-text-muted">© {new Date().getFullYear()} Laundry-Van. All rights reserved.</p>
          </CardFooter>
        </Card>
      </div>
  )
}
