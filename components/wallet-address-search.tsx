"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, AlertCircle, Copy, Zap } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

interface WalletAddressSearchProps {
  onSearch: (address: string) => void
  isLoading?: boolean
}

// Sample popular wallet addresses for demonstration
const SAMPLE_ADDRESSES = [
  {
    address: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    label: "Popular Trader",
    type: "high-value"
  },
  {
    address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    label: "DEX Trader",
    type: "active"
  },
  {
    address: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
    label: "Token Holder",
    type: "diversified"
  }
]

export function WalletAddressSearch({ onSearch, isLoading }: WalletAddressSearchProps) {
  const [address, setAddress] = useState("")
  const [error, setError] = useState("")
  const { toast } = useToast()

  const validateSolanaAddress = (addr: string): boolean => {
    // Basic Solana address validation (base58, 32-44 characters)
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
    return base58Regex.test(addr)
  }

  const handleSearch = () => {
    setError("")

    if (!address.trim()) {
      setError("Please enter a wallet address")
      return
    }

    if (!validateSolanaAddress(address.trim())) {
      setError("Invalid Solana wallet address format")
      return
    }

    onSearch(address.trim())
  }

  const handleSampleClick = (sampleAddress: string) => {
    setAddress(sampleAddress)
    setError("")
    onSearch(sampleAddress)
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    toast({
      title: "Address copied!",
      description: "Wallet address copied to clipboard",
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 8)}...${addr.slice(-8)}`
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "high-value":
        return "bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border-yellow-500/30 text-yellow-400"
      case "active":
        return "bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/30 text-green-400"
      case "diversified":
        return "bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-500/30 text-blue-400"
      default:
        return "bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 text-primary"
    }
  }

  return (
    <Card className="glass-card animate-fade-in-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-r from-accent/20 to-primary/20 glow-accent">
            <Search className="h-5 w-5 text-accent" />
          </div>
          <span className="gradient-text">Search Any Wallet</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter Solana wallet address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyPress={handleKeyPress}
              className="font-mono text-sm glass-card bg-background/5 border-primary/30 focus:border-accent focus:ring-accent/30"
            />
            <Button 
              onClick={handleSearch} 
              disabled={isLoading}
              className="glass-button bg-gradient-to-r from-accent to-primary hover:glow-accent"
            >
              <Search className="h-4 w-4 mr-2" />
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="glass-card border-red-500/30 bg-red-500/5">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-300">{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">Try these sample wallets:</span>
          </div>
          
          <div className="space-y-2">
            {SAMPLE_ADDRESSES.map((sample, index) => (
              <div
                key={sample.address}
                className="flex items-center justify-between p-3 glass-card rounded-lg hover:glow-primary transition-all duration-300 animate-fade-in-up group hover:scale-[1.02]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="outline" 
                    className={`text-xs glass-card ${getTypeColor(sample.type)}`}
                  >
                    {sample.label}
                  </Badge>
                  <code className="text-sm font-mono text-muted-foreground group-hover:text-foreground transition-colors">
                    {formatAddress(sample.address)}
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(sample.address)}
                    className="h-8 w-8 glass-button hover:glow-accent opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    onClick={() => handleSampleClick(sample.address)}
                    size="sm"
                    disabled={isLoading}
                    className="glass-button bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 hover:glow-primary"
                  >
                    <Search className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 p-4 glass-card rounded-lg bg-gradient-to-r from-muted/5 to-muted/10">
          <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            What you'll see:
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              Total Value (USD)
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent"></div>
              Token Holdings
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-chart-3"></div>
              SOL Balance
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-chart-4"></div>
              Real-time Prices
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
