import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import ClientOnly from "@/components/ClientOnly"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Laundry-Van Admin",
  description: "Admin panel for Laundry-Van application",
  generator: "miteshp2110",
}

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <html lang="en">
      <body className={inter.className}>
      <ClientOnly>
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </ClientOnly>
      </body>
      </html>
  )
}
