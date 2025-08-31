"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, ArrowUpRight, ArrowDownLeft, RefreshCw, ExternalLink, Loader2, AlertCircle, RotateCcw, PlayCircle } from "lucide-react"
import { usePhantomWallet } from "@/hooks/use-phantom-wallet"
import { useWalletTrades } from "@/hooks/use-wallet-trades"
import { sampleTrades, sampleStats } from "@/lib/sample-trades"
import { useState, useEffect } from "react"
import Image from "next/image"

export function ActivityContent() {
  const { walletAddress } = usePhantomWallet()
  const { trades, stats, isLoading, error, hasNextPage, isRateLimited, refreshTrades, loadMoreTrades, retryAfterRateLimit, loadTrades } = useWalletTrades(walletAddress || undefined)
  const [showDemo, setShowDemo] = useState(false)
  const [tradesLoaded, setTradesLoaded] = useState(false)

  // Use demo data if enabled or real data if available
  const displayTrades = showDemo ? sampleTrades : trades
  const displayStats = showDemo ? sampleStats : stats

  const handleLoadTrades = () => {
    setTradesLoaded(true)
    loadTrades()
  }

  const handleRefreshTrades = () => {
    setTradesLoaded(true)
    refreshTrades()
  }

  // Reset tradesLoaded when wallet address changes
  useEffect(() => {
    setTradesLoaded(false)
  }, [walletAddress])

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

  const formatTokenAmount = (amount: number, decimals: number = 6) => {
    if (amount >= 1e6) {
      return `${(amount / 1e6).toFixed(2)}M`
    } else if (amount >= 1e3) {
      return `${(amount / 1e3).toFixed(2)}K`
    }
    return amount.toFixed(Math.min(decimals, 6))
  }

  const determineTradeType = (trade: any, walletAddr: string) => {
    // For DEX trades, most are swaps
    return "swap"
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  const formatTime = (timestamp: string | number) => {
    const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp)
    return date.toLocaleString()
  }

  // Helper function to safely access trade properties
  const safeTradeAccess = (trade: any) => {
    return {
      fromToken: {
        symbol: trade?.from?.token?.symbol || 'Unknown',
        image: trade?.from?.token?.image || null,
        decimals: trade?.from?.token?.decimals || 9,
        amount: trade?.from?.amount || 0
      },
      toToken: {
        symbol: trade?.to?.token?.symbol || 'Unknown', 
        image: trade?.to?.token?.image || null,
        decimals: trade?.to?.token?.decimals || 9,
        amount: trade?.to?.amount || 0
      },
      volume: {
        usd: trade?.volume?.usd || 0
      },
      tx: trade?.tx || 'unknown',
      program: trade?.program || 'Unknown',
      time: trade?.time || Date.now()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Activity</h1>
          <p className="text-muted-foreground mt-2">
            Transaction history for {walletAddress ? formatAddress(walletAddress) : "your wallet"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="glass-button hover:glow-primary bg-transparent"
            onClick={handleRefreshTrades}
            disabled={isLoading || showDemo || isRateLimited}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {isRateLimited ? "Rate Limited" : "Refresh"}
          </Button>
          <Button 
            variant={showDemo ? "default" : "outline"}
            className={showDemo ? "glass-button bg-primary text-primary-foreground" : "glass-button hover:glow-accent bg-transparent"}
            onClick={() => setShowDemo(!showDemo)}
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            {showDemo ? "Exit Demo" : "Demo Mode"}
          </Button>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          className="glass-card hover:glow-green transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <CardContent className="p-6">
            <div className="text-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-green-500/20 to-green-400/10 w-fit mx-auto mb-3 glow-green">
                <ArrowDownLeft className="h-6 w-6 text-green-400" />
              </div>
              <div className="text-2xl font-bold gradient-text">
                {isLoading && !showDemo ? (
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                ) : showDemo || tradesLoaded ? (
                  displayStats.received
                ) : (
                  <span className="text-muted-foreground">--</span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">Received</div>
            </div>
          </CardContent>
        </Card>
        <Card
          className="glass-card hover:glow-red transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <CardContent className="p-6">
            <div className="text-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-red-500/20 to-red-400/10 w-fit mx-auto mb-3 glow-red">
                <ArrowUpRight className="h-6 w-6 text-red-400" />
              </div>
              <div className="text-2xl font-bold gradient-text">
                {isLoading && !showDemo ? (
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                ) : showDemo || tradesLoaded ? (
                  displayStats.sent
                ) : (
                  <span className="text-muted-foreground">--</span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">Sent</div>
            </div>
          </CardContent>
        </Card>
        <Card
          className="glass-card hover:glow-blue transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <CardContent className="p-6">
            <div className="text-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-400/10 w-fit mx-auto mb-3 glow-blue">
                <Activity className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold gradient-text">
                {isLoading && !showDemo ? (
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                ) : showDemo || tradesLoaded ? (
                  displayStats.swapped
                ) : (
                  <span className="text-muted-foreground">--</span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">Swapped</div>
            </div>
          </CardContent>
        </Card>
        <Card
          className="glass-card hover:glow-primary transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <CardContent className="p-6">
            <div className="text-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-primary/20 to-accent/10 w-fit mx-auto mb-3 glow-primary">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold gradient-text">
                {isLoading && !showDemo ? (
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                ) : showDemo || tradesLoaded ? (
                  formatCurrency(displayStats.totalVolume)
                ) : (
                  <span className="text-muted-foreground">--</span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">Total Volume</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="glass-card animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 glow-primary">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <span className="gradient-text">Recent Transactions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="flex items-center justify-center p-8 text-center">
              <div className="space-y-3">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
                <p className="text-red-400 font-medium">
                  {isRateLimited ? "Rate Limit Exceeded" : "Failed to load trades"}
                </p>
                <p className="text-sm text-muted-foreground">{error}</p>
                {isRateLimited ? (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      The API is currently rate limited. Please wait a moment before trying again.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={retryAfterRateLimit}
                      className="glass-button hover:glow-primary"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Retry Now
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefreshTrades}
                    className="glass-button hover:glow-primary"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                )}
              </div>
            </div>
          )}

          {!error && !walletAddress && !showDemo && (
            <div className="flex items-center justify-center p-8 text-center">
              <div className="space-y-3">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground font-medium">Connect your wallet</p>
                <p className="text-sm text-muted-foreground">Connect your wallet to view trading activity</p>
              </div>
            </div>
          )}

          {!error && walletAddress && !tradesLoaded && !isLoading && !showDemo && (
            <div className="flex items-center justify-center p-8 text-center">
              <div className="space-y-3">
                <Activity className="h-12 w-12 text-primary mx-auto" />
                <p className="text-primary font-medium">Ready to load trading activity</p>
                <p className="text-sm text-muted-foreground">
                  Click below to fetch your trading history from the blockchain
                </p>
                <div className="text-xs text-muted-foreground mt-2">
                  Wallet: {formatAddress(walletAddress)}
                </div>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleLoadTrades}
                  className="glass-button bg-primary text-primary-foreground hover:glow-primary mt-3"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Load Trading Activity
                </Button>
              </div>
            </div>
          )}

          {!error && walletAddress && tradesLoaded && trades.length === 0 && !isLoading && !showDemo && (
            <div className="flex items-center justify-center p-8 text-center">
              <div className="space-y-3">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground font-medium">No recent trading activity</p>
                <p className="text-sm text-muted-foreground">
                  This wallet doesn't have recent trades available in the Solana Tracker database,<br/>
                  or the wallet may not have performed any DEX trades yet.
                </p>
                <div className="text-xs text-muted-foreground mt-2">
                  Wallet: {formatAddress(walletAddress)}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    // For demo purposes, you can create mock data here if needed
                    console.log('Try connecting a different wallet with trading activity')
                  }}
                  className="glass-button hover:glow-primary mt-3"
                >
                  Try Different Wallet
                </Button>
              </div>
            </div>
          )}

          {!error && walletAddress && (isLoading && trades.length === 0) && !showDemo && (
            <div className="flex items-center justify-center p-8">
              <div className="text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground">Loading trades...</p>
              </div>
            </div>
          )}

          {((!error && trades.length > 0) || showDemo) && (
            <div className="space-y-3">
              {displayTrades.map((trade, index) => {
                const safeTrade = safeTradeAccess(trade)
                
                return (
                  <div
                    key={safeTrade.tx}
                    className="flex items-center justify-between p-4 glass-card rounded-lg hover:glow-blue transition-all duration-300 group animate-fade-in-up hover:scale-[1.02]"
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 glass-card rounded-full flex items-center justify-center glow-blue">
                        <Activity className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {safeTrade.fromToken.image && (
                            <Image
                              src={safeTrade.fromToken.image}
                              alt={safeTrade.fromToken.symbol}
                              width={20}
                              height={20}
                              className="rounded-full"
                            />
                          )}
                          <span className="font-medium gradient-text">
                            Swap {safeTrade.fromToken.symbol} → {safeTrade.toToken.symbol}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Via {safeTrade.program} • {formatAddress(safeTrade.tx)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-red-400 text-sm">
                          -{formatTokenAmount(safeTrade.fromToken.amount, safeTrade.fromToken.decimals)} {safeTrade.fromToken.symbol}
                        </span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-green-400 text-sm">
                          +{formatTokenAmount(safeTrade.toToken.amount, safeTrade.toToken.decimals)} {safeTrade.toToken.symbol}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
                        {formatCurrency(safeTrade.volume.usd)}
                      </div>
                      <Badge variant="outline" className="text-xs glass-card border-primary/30 hover:glow-primary">
                        confirmed
                      </Badge>
                    </div>

                    <div className="text-right text-xs text-muted-foreground space-y-1">
                      <div>{formatTime(safeTrade.time)}</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-all duration-300 glass-button hover:glow-accent"
                        onClick={() => window.open(`https://solscan.io/tx/${safeTrade.tx}`, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )
              })}}

              {hasNextPage && !showDemo && (
                <div className="flex justify-center mt-6">
                  <Button 
                    variant="outline" 
                    onClick={loadMoreTrades}
                    disabled={isLoading || isRateLimited}
                    className="glass-button hover:glow-primary"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    {isRateLimited ? "Rate Limited" : "Load More Trades"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
