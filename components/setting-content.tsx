"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Palette, Bell, Shield, Info, ExternalLink } from "lucide-react"
import { usePhantomWallet } from "@/hooks/use-phantom-wallet"

export function SettingsContent() {
  const { walletAddress, disconnect } = usePhantomWallet()

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="text-4xl font-bold gradient-text">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account and application preferences</p>
      </div>

      <Card className="glass-card animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 glow-primary">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <span className="gradient-text">Wallet Connection</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 glass-card rounded-lg">
            <div>
              <div className="font-medium gradient-text">Connected Wallet</div>
              <div className="text-sm text-muted-foreground font-mono">
                {walletAddress ? formatAddress(walletAddress) : "Not connected"}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="glass-card border-green-400/30 text-green-400 glow-green">
                Connected
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={disconnect}
                className="glass-button hover:glow-red bg-transparent"
              >
                Disconnect
              </Button>
            </div>
          </div>
          <div className="text-sm text-muted-foreground p-3 glass-card rounded-lg border-primary/20">
            Your wallet is securely connected via Phantom. We never store your private keys.
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-accent/20 to-accent/10 glow-accent">
              <Palette className="h-5 w-5 text-accent" />
            </div>
            <span className="gradient-text">Appearance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 glass-card rounded-lg hover:glow-accent transition-all duration-300">
            <div>
              <div className="font-medium gradient-text">Theme</div>
              <div className="text-sm text-muted-foreground">Choose between light and dark mode</div>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-chart-3/20 to-chart-3/10 glow-chart-3">
              <Bell className="h-5 w-5 text-chart-3" />
            </div>
            <span className="gradient-text">Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 glass-card rounded-lg hover:glow-primary transition-all duration-300">
              <div>
                <div className="font-medium gradient-text">Price Alerts</div>
                <div className="text-sm text-muted-foreground">Get notified of significant price changes</div>
              </div>
              <Button variant="outline" size="sm" className="glass-button hover:glow-primary bg-transparent">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 glass-card rounded-lg hover:glow-primary transition-all duration-300">
              <div>
                <div className="font-medium gradient-text">Transaction Updates</div>
                <div className="text-sm text-muted-foreground">Receive updates on your transactions</div>
              </div>
              <Button variant="outline" size="sm" className="glass-button hover:glow-primary bg-transparent">
                Configure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-muted/20 to-muted/10">
              <Info className="h-5 w-5 text-muted-foreground" />
            </div>
            <span className="gradient-text">About</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 p-4 glass-card rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Version</span>
              <Badge variant="outline" className="glass-card border-primary/30 hover:glow-primary">
                1.0.0
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Network</span>
              <Badge variant="outline" className="glass-card border-accent/30 hover:glow-accent">
                Solana Mainnet
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Built with</span>
              <div className="flex items-center gap-1">
                <span className="text-sm gradient-text">Next.js & Phantom</span>
                <ExternalLink className="h-3 w-3 text-accent" />
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground p-4 glass-card rounded-lg border-primary/20">
            Solana Tracker is a modern portfolio management tool for the Solana ecosystem. Built with security and user
            experience in mind.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
