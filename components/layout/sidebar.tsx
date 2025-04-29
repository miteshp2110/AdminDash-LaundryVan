"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Home, Package, Settings, ShoppingCart, Tag, Truck, Users, Menu, X, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Orders",
      icon: ShoppingCart,
      href: "/orders",
      active: pathname.startsWith("/orders"),
    },
    {
      label: "Users",
      icon: Users,
      href: "/users",
      active: pathname.startsWith("/users"),
    },
    {
      label: "Vans",
      icon: Truck,
      href: "/vans",
      active: pathname.startsWith("/vans"),
    },
    {
      label: "Regions",
      icon: MapPin,
      href: "/regions",
      active: pathname.startsWith("/regions"),
    },
    {
      label: "Services",
      icon: Package,
      href: "/services",
      active: pathname.startsWith("/services"),
    },
    {
      label: "Promotions",
      icon: Tag,
      href: "/promotions",
      active: pathname.startsWith("/promotions"),
    },
    {
      label: "Reports",
      icon: BarChart3,
      href: "/reports",
      active: pathname.startsWith("/reports"),
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      active: pathname.startsWith("/settings"),
    },
  ]

  return (
    <>
      <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50 md:hidden" onClick={toggleSidebar}>
        <Menu className="h-5 w-5" />
      </Button>

      <div
        className={cn("fixed inset-0 z-40 bg-black/50 md:hidden", isOpen ? "block" : "hidden")}
        onClick={toggleSidebar}
      />

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-line-light transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          className,
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-line-light">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center">
              <span className="text-white text-sm font-bold">LV</span>
            </div>
            <span className="ml-2 font-semibold text-text-dark">Laundry-Van</span>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="py-4 px-2">
          <nav className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center px-4 py-2.5 text-sm font-medium rounded-md",
                  route.active
                    ? "bg-bg-accent-light text-brand-primary"
                    : "text-text-muted hover:bg-bg-light hover:text-text-dark",
                )}
              >
                <route.icon className={cn("h-5 w-5 mr-3")} />
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  )
}
