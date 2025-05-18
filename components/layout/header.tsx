"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [adminEmail, setAdminEmail] = useState<string | null>(null)

  useEffect(() => {
    // In a real app, you would decode the JWT to get the admin's email
    // For now, we'll just use a placeholder
    setAdminEmail("admin@aximos.com")
  }, [])

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem("token")

    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
      variant: "default",
    })

    // Redirect to login page
    router.push("/login")
  }

  return (
    <header className={`flex h-16 items-center justify-between border-b border-line-light px-6 ${className}`}>
      <div className="flex-1" />
      <div className="flex items-center space-x-4">
        {/*<Button variant="ghost" size="icon" className="relative">*/}
        {/*  <Bell className="h-5 w-5 text-text-muted" />*/}
        {/*  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-status-danger" />*/}
        {/*</Button>*/}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-white">
                <User className="h-5 w-5" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>{adminEmail}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-status-danger">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
