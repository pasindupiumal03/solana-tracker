"use client"

import { useState, useEffect } from "react"
import { ArrowRight, TrendingUp, Shield, Zap, Sparkles, Coins, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { WalletButton } from "@/components/wallet-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { usePhantomWallet } from "@/hooks/use-phantom-wallet"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const { isConnected } = usePhantomWallet()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLaunchSOL = () => {
    router.push("/dashboard")
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute top-40 right-20 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-chart-3/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Floating crypto icons */}
        <div className="absolute top-1/4 left-1/4 animate-float opacity-20">
          <Coins className="w-8 h-8 text-primary" />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-float opacity-30" style={{ animationDelay: "0.5s" }}>
          <BarChart3 className="w-6 h-6 text-accent" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-float opacity-25" style={{ animationDelay: "1.5s" }}>
          <Sparkles className="w-10 h-10 text-chart-3" />
        </div>
        <div className="absolute top-1/2 right-1/4 animate-float opacity-20" style={{ animationDelay: "2.5s" }}>
          <TrendingUp className="w-7 h-7 text-primary" />
        </div>
      </div>

      <header className="glass-card sticky top-0 z-50 border-b-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 animate-slide-in-left">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center animate-glow">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Solana Tracker</span>
          </div>
          <div className="flex items-center gap-4 animate-slide-in-right">
            <ThemeToggle />
            <WalletButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <div className="animate-fade-in-up">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 text-balance leading-tight">
              Track Your <span className="gradient-text animate-crypto-pulse">Solana</span> Portfolio
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 text-pretty max-w-3xl mx-auto leading-relaxed">
              Connect your Phantom wallet and get real-time insights into your SOL tokens, trending cryptocurrencies,
              and portfolio performance with our modern, intuitive interface.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 animate-scale-in">
            {isConnected ? (
              <Button
                size="lg"
                onClick={handleLaunchSOL}
                className="glass-button text-xl px-12 py-8 rounded-2xl font-semibold group"
              >
                Launch SOL Dashboard
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <div className="text-center animate-crypto-pulse">
                <p className="text-muted-foreground mb-6 text-lg">Connect your wallet to get started</p>
                <div className="scale-110">
                  <WalletButton />
                </div>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <Card className="glass-card group hover:scale-105 transition-all duration-500 animate-slide-in-left border-0">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-glow transition-all">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-balance">Real-time Tracking</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Monitor your Solana tokens and portfolio performance with live updates and detailed analytics
                </p>
              </CardContent>
            </Card>

            <Card
              className="glass-card group hover:scale-105 transition-all duration-500 animate-fade-in-up border-0"
              style={{ animationDelay: "0.2s" }}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/60 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-glow transition-all">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-balance">Secure Connection</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Connect securely with your Phantom wallet using industry-standard encryption protocols
                </p>
              </CardContent>
            </Card>

            <Card
              className="glass-card group hover:scale-105 transition-all duration-500 animate-slide-in-right border-0"
              style={{ animationDelay: "0.4s" }}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-chart-3 to-chart-3/60 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-glow transition-all">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-balance">Lightning Fast</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Get instant updates on trending tokens and market movements with optimized performance
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="glass-card rounded-3xl p-8 mb-16 animate-scale-in" style={{ animationDelay: "0.6s" }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">10K+</div>
                <div className="text-muted-foreground text-lg">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">$2.5M+</div>
                <div className="text-muted-foreground text-lg">Assets Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">99.9%</div>
                <div className="text-muted-foreground text-lg">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
