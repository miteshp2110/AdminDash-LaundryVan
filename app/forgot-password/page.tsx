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
import { ArrowLeft, Loader2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "OTP Sent",
          description: `An OTP has been sent to ${email}`,
          variant: "default",
        })
        setOtpSent(true)
      } else {
        toast({
          title: "Error",
          description: data.Message || "Failed to send OTP",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: Number.parseInt(otp),
          newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Password has been reset successfully",
          variant: "default",
        })
        router.push("/login")
      } else {
        toast({
          title: "Error",
          description: data.Message || "Failed to reset password",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
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
            <Link href="/login" className="flex items-center text-brand-secondary hover:text-brand-primary mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
            <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
            <CardDescription>
              {otpSent
                  ? "Enter the OTP sent to your email and set a new password"
                  : "Enter your email to receive a one-time password"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="admin@laundryvan.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-brand-primary hover:bg-brand-secondary" disabled={isLoading}>
                    {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending OTP...
                        </>
                    ) : (
                        "Send OTP"
                    )}
                  </Button>
                </form>
            ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">OTP</Label>
                    <Input
                        id="otp"
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                        id="newPassword"
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-brand-primary hover:bg-brand-secondary" disabled={isLoading}>
                    {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Resetting Password...
                        </>
                    ) : (
                        "Reset Password"
                    )}
                  </Button>
                </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-text-muted">© {new Date().getFullYear()} Laundry-Van. All rights reserved.</p>
          </CardFooter>
        </Card>
      </div>
  )
}
