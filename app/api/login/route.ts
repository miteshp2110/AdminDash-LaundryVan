import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// In a real application, you would validate against a database
// For demo purposes, we're using a hardcoded admin
const ADMIN_EMAIL = "admin@aximos.com"
const ADMIN_PASSWORD = "aximos"

// JWT secret key (in a real app, this would be an environment variable)
const JWT_SECRET = "laundry-van-secret-key"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ Message: "Invalid credentials" }, { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign({ email, role: "admin" }, JWT_SECRET, { expiresIn: "24h" })

    return NextResponse.json({ Message: "Success", token })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ Message: "An error occurred during login" }, { status: 500 })
  }
}
