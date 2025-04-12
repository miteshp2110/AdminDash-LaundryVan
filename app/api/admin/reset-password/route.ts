import { NextResponse } from "next/server"

// In a real application, you would store this in a database
// For demo purposes, we're using an in-memory store
const otpStore: Record<string, { otp: number; expiry: number }> = {}

// In a real application, you would update the password in a database
const admins = [{ email: "paliwalmitesh2110@gmail.com", password: "Mi12te34@" }]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, otp, newPassword } = body

    // Check if OTP exists for the email
    if (!otpStore[email]) {
      return NextResponse.json({ Message: "Wrong OTP" }, { status: 400 })
    }

    // Check if OTP is valid and not expired
    const storedOTP = otpStore[email]
    if (storedOTP.otp !== otp || storedOTP.expiry < Date.now()) {
      return NextResponse.json({ Message: "Wrong OTP" }, { status: 400 })
    }

    // Update password (in a real app, you would hash the password)
    const adminIndex = admins.findIndex((admin) => admin.email === email)
    if (adminIndex !== -1) {
      admins[adminIndex].password = newPassword
    } else {
      // For demo purposes, we'll add the user if they don't exist
      admins.push({ email, password: newPassword })
    }

    // Remove OTP from store
    delete otpStore[email]

    return NextResponse.json({
      Message: "Password changed successfully",
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ Message: "An error occurred" }, { status: 500 })
  }
}
