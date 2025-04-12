import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// JWT secret key (in a real app, this would be an environment variable)
const JWT_SECRET = "laundry-van-secret-key"

// In a real application, you would store this in a database
const admins = [{ email: "paliwalmitesh2110@gmail.com", password: "Mi12te34@" }]

export async function POST(request: Request) {
  try {
    // Get authorization header
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ Message: "Unauthorized" }, { status: 401 })
    }

    // Extract token
    const token = authHeader.split(" ")[1]

    // Verify token
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { email: string; role: string }

      // Check if user is admin
      if (decoded.role !== "admin") {
        return NextResponse.json({ Message: "Unauthorized" }, { status: 401 })
      }

      // Get request body
      const body = await request.json()
      const { email, password } = body

      // Check if admin already exists
      if (admins.some((admin) => admin.email === email)) {
        return NextResponse.json({ Message: "Admin already exists" }, { status: 400 })
      }

      // Add new admin
      admins.push({ email, password })

      return NextResponse.json({ Message: "New Admin Created" })
    } catch (error) {
      return NextResponse.json({ Message: "Unauthorized" }, { status: 401 })
    }
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ Message: "An error occurred during signup" }, { status: 500 })
  }
}
