import { NextResponse } from "next/server"

// In a real application, you would store this in a database
// For demo purposes, we're using an in-memory store
const otpStore: Record<string, { otp: number; expiry: number }> = {}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    // Check if email exists (in a real app, you would check against a database)
    // For demo purposes, we'll accept any email

    // Generate a random 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000)

    // Set expiry to 1 minute from now
    const expiry = Date.now() + 60000 // 60 seconds

    // Store OTP with expiry
    otpStore[email] = { otp, expiry }

    // In a real application, you would send an email with the OTP
    console.log(`OTP for ${email}: ${otp}`)

    return NextResponse.json({
      Message: `OTP sent to ${email} valid for 1 minute`,
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ Message: "An error occurred" }, { status: 500 })
  }
}
