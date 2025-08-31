"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Shield, 
  AlertTriangle,
  ExternalLink,
  Droplets,
  DollarSign,
  BarChart3,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Star
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface DetailedTokenData {
  mint: string
  name: string
  symbol: string
  image?: string
  price: number
  priceChange1h: number
  priceChange24h: number
  marketCap: number
  volume24h: number
  holders: number
  liquidity: number
  isVerified?: boolean
  riskLevel?: string
  security?: any
  pools?: any[]
  events?: any
  isDetailedView?: boolean
  buys?: number
  sells?: number
  totalTxns?: number
  riskScore?: number
  risks?: any[]
  top10Percentage?: number
  lpBurn?: number
  tokenSupply?: number
}

interface DetailedTokenCardProps {
  token: DetailedTokenData
  onClose?: () => void
}

export function DetailedTokenCard({ token, onClose }: DetailedTokenCardProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1e9) {
      return `$${(amount / 1e9).toFixed(2)}B`
    } else if (amount >= 1e6) {
      return `$${(amount / 1e6).toFixed(2)}M`
    } else if (amount >= 1e3) {
      return `$${(amount / 1e3).toFixed(2)}K`
    }
    return `$${amount.toFixed(2)}`
  }

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return `$${price.toFixed(2)}`
    } else if (price >= 0.01) {
      return `$${price.toFixed(4)}`
    } else {
      return `$${price.toFixed(8)}`
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1e6) {
      return `${(num / 1e6).toFixed(1)}M`
    } else if (num >= 1e3) {
      return `${(num / 1e3).toFixed(1)}K`
    }
    return num.toString()
  }

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'low':
        return 'text-green-400 bg-green-500/10 border-green-500/30'
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
      case 'high':
        return 'text-red-400 bg-red-500/10 border-red-500/30'
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30'
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'low':
        return ShieldCheck
      case 'medium':
        return Shield
      case 'high':
        return ShieldAlert
      default:
        return AlertTriangle
    }
  }

  const is1hPositive = token.priceChange1h >= 0
  const is24hPositive = token.priceChange24h >= 0
  const TrendIcon1h = is1hPositive ? TrendingUp : TrendingDown
  const TrendIcon24h = is24hPositive ? TrendingUp : TrendingDown
  const RiskIcon = getRiskIcon(token.riskLevel || 'unknown')

  return (
    <Card className="glass-card border-primary/30 glow-primary">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-sm"></div>
              {token.image ? (
                <Image
                  src={token.image}
                  alt={token.name}
                  width={48}
                  height={48}
                  className="rounded-full relative z-10 border-2 border-primary/30"
                />
              ) : (
                <div className="w-12 h-12 rounded-full relative z-10 border-2 border-primary/30 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {token.symbol?.slice(0, 2) || "??"}
                  </span>
                </div>
              )}
              {token.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center glow-primary">
                  <Star className="h-3 w-3 text-white fill-current" />
                </div>
              )}
            </div>
            <div>
              <h3 className="gradient-text text-xl font-bold">{token.name}</h3>
              <p className="text-sm text-muted-foreground">{token.symbol}</p>
            </div>
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="glass-button">
              ×
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Price and Changes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-card border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Current Price</span>
              </div>
              <p className="text-2xl font-bold gradient-text">{formatPrice(token.price)}</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-accent" />
                <span className="text-sm text-muted-foreground">1h Change</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendIcon1h className={cn("h-4 w-4", is1hPositive ? "text-green-400" : "text-red-400")} />
                <p className={cn("text-lg font-semibold", is1hPositive ? "text-green-400" : "text-red-400")}>
                  {is1hPositive ? "+" : ""}{token.priceChange1h.toFixed(2)}%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-accent" />
                <span className="text-sm text-muted-foreground">24h Change</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendIcon24h className={cn("h-4 w-4", is24hPositive ? "text-green-400" : "text-red-400")} />
                <p className={cn("text-lg font-semibold", is24hPositive ? "text-green-400" : "text-red-400")}>
                  {is24hPositive ? "+" : ""}{token.priceChange24h.toFixed(2)}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="glass-card border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Market Cap</span>
              </div>
              <p className="text-xl font-bold text-foreground">{formatCurrency(token.marketCap)}</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-accent" />
                <span className="text-sm text-muted-foreground">24h Volume</span>
              </div>
              <p className="text-xl font-bold text-foreground">{formatCurrency(token.volume24h)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Holder Statistics */}
        <Card className="glass-card border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Holder Statistics</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Total Holders</p>
                <p className="text-lg font-semibold text-foreground">{formatNumber(token.holders)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Top 10 Holdings</p>
                <p className="text-lg font-semibold text-foreground">{token.top10Percentage?.toFixed(1) || 'N/A'}%</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <p className="text-xs text-muted-foreground">Liquidity</p>
                <p className="text-lg font-semibold text-foreground">{formatCurrency(token.liquidity)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">24h Transactions</p>
                <p className="text-lg font-semibold text-foreground">
                  <span className="text-green-400">{token.buys || 0}B</span> / <span className="text-red-400">{token.sells || 0}S</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <Card className="glass-card border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <RiskIcon className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Risk Assessment</span>
              </div>
              <Badge className={cn("text-xs", getRiskColor(token.riskLevel || 'unknown'))}>
                {token.riskLevel?.toUpperCase() || 'UNKNOWN'}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Risk Score</span>
                <span className="text-foreground">
                  {typeof token.riskScore === 'number' ? `${token.riskScore}/10` : 'N/A'}
                </span>
              </div>
              <Progress 
                value={typeof token.riskScore === 'number' ? (10 - token.riskScore) * 10 : 0} 
                className="h-2" 
              />
              {token.risks && token.risks.length > 0 && (
                <div className="mt-3 space-y-1">
                  <p className="text-xs text-muted-foreground">Risk Factors:</p>
                  {token.risks.slice(0, 2).map((risk: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <AlertTriangle className="h-3 w-3 text-yellow-400" />
                      <span className="text-muted-foreground">{risk.name || risk.description}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Information */}
        <Card className="glass-card border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Security Information</span>
              </div>
              {token.isVerified && (
                <Badge className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  VERIFIED
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Freeze Authority</p>
                <div className="flex items-center gap-1">
                  {token.security?.freezeAuthority ? (
                    <>
                      <ShieldAlert className="h-3 w-3 text-yellow-400" />
                      <p className="text-xs text-yellow-400">Present</p>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-3 w-3 text-green-400" />
                      <p className="text-xs text-green-400">Revoked</p>
                    </>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Mint Authority</p>
                <div className="flex items-center gap-1">
                  {token.security?.mintAuthority ? (
                    <>
                      <ShieldAlert className="h-3 w-3 text-yellow-400" />
                      <p className="text-xs text-yellow-400">Present</p>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-3 w-3 text-green-400" />
                      <p className="text-xs text-green-400">Revoked</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            {typeof token.lpBurn === 'number' && (
              <div className="mt-3">
                <p className="text-xs text-muted-foreground">LP Burn</p>
                <p className="text-sm font-semibold text-foreground">{token.lpBurn}%</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="default"
            onClick={() => window.open(`https://dexscreener.com/solana/${token.mint}`, '_blank')}
            className="glass-button hover:glow-primary bg-gradient-to-r from-primary/20 to-accent/20 flex-1"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View on DexScreener
          </Button>
          <Button
            variant="outline"
            onClick={() => navigator.clipboard.writeText(token.mint)}
            className="glass-button hover:glow-accent"
          >
            Copy Address
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
