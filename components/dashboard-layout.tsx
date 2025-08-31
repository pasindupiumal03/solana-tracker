"use client"

import type React from "react"

import { useState } from "react"
import { BarChart3, Wallet, TrendingUp, Settings, Menu, X, Home, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WalletButton } from "@/components/wallet-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const sidebarItems = [
  {
    title: "Wallet Info",
    icon: Wallet,
    href: "/dashboard/wallet",
  },
  {
    title: "Trending Tokens",
    icon: TrendingUp,
    href: "/dashboard/trending",
  },
  {
    title: "Activity",
    icon: Activity,
    href: "/dashboard/activity",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-40 w-60 h-60 bg-accent/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/20 backdrop-blur-md lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 glass-card border-r border-white/10 transform transition-all duration-300 ease-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 glass-card rounded-xl flex items-center justify-center glow-primary">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Solana Tracker
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden glass-button"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 p-4 space-y-3">
            {sidebarItems.map((item, index) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-4 h-12 text-base font-medium transition-all duration-300 animate-slide-in",
                      isActive
                        ? "glass-card-active glow-primary text-primary border border-primary/20"
                        : "glass-button hover:glow-subtle",
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    {item.title}
                  </Button>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="glass-card p-3 rounded-lg text-center">
              <div className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Powered by Solana Network
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 glass-card border-b border-white/10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden glass-button"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <WalletButton />
            </div>
          </div>
        </header>

        <main className="p-6 relative z-10">{children}</main>
      </div>
    </div>
  )
}
