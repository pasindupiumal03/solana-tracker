"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletAddressSearch } from "@/components/wallet-address-search"
import { useWalletData } from "@/hooks/use-wallet-data"
import { usePhantomWallet } from "@/hooks/use-phantom-wallet"
import { Wallet, Copy, RefreshCw, DollarSign, Coins, TrendingUp, ExternalLink, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export function WalletInfoContent() {
  const { walletAddress, isConnected } = usePhantomWallet()
  const [searchAddress, setSearchAddress] = useState<string>("")
  const [activeTab, setActiveTab] = useState("connected")

  const connectedWalletData = useWalletData(walletAddress || "")
  const searchedWalletData = useWalletData(searchAddress)

  const { toast } = useToast()

  const currentData = activeTab === "connected" ? connectedWalletData : searchedWalletData
  const currentAddress = activeTab === "connected" ? walletAddress : searchAddress

  const handleSearch = (address: string) => {
    setSearchAddress(address)
    setActiveTab("search")
  }

  const copyAddress = async () => {
    if (currentAddress) {
      await navigator.clipboard.writeText(currentAddress)
      toast({
        title: "Address copied!",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatTokenAmount = (amount: number) => {
    if (amount < 0.01) {
      return amount.toExponential(4)
    }
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    })
  }

  const openSolscan = () => {
    if (currentAddress) {
      window.open(`https://solscan.io/account/${currentAddress}`, '_blank')
    }
  }

  const renderWalletData = () => {
    const { walletInfo, tokensWithPrices, totalValueUSD, isLoading, error, refetch } = currentData

    if (!currentAddress && activeTab === "search") {
      return (
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <div className="p-4 rounded-full bg-gradient-to-r from-muted/20 to-muted/10 w-fit mx-auto mb-6">
              <Wallet className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg">
              Enter a Solana wallet address to search
            </p>
          </CardContent>
        </Card>
      )
    }

    if (error) {
      return (
        <Card className="glass-card border-red-500/20 bg-red-500/5">
          <CardContent className="p-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-400 mb-2">Error Loading Wallet Data</h3>
              <p className="text-red-300 mb-4">{error}</p>
              <Button 
                onClick={refetch} 
                variant="outline" 
                className="glass-button hover:glow-red bg-transparent border-red-500/30"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-6">
        {/* Wallet Overview */}
        <Card className="glass-card animate-fade-in-up">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 glow-primary">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <span className="gradient-text">Wallet Overview</span>
              </div>
              <Button
                onClick={refetch}
                variant="outline"
                disabled={isLoading}
                size="sm"
                className="glass-button hover:glow-primary bg-transparent"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Address:</span>
                  <Skeleton className="h-8 w-64 glass-skeleton" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="glass-card p-6 rounded-xl text-center">
                      <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4 glass-skeleton" />
                      <Skeleton className="h-8 w-24 mx-auto mb-2 glass-skeleton" />
                      <Skeleton className="h-4 w-16 mx-auto glass-skeleton" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">Address:</span>
                  <code className="glass-card px-3 py-2 rounded-lg text-sm font-mono border-primary/20">
                    {currentAddress ? formatAddress(currentAddress) : "No address"}
                  </code>
                  {currentAddress && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={copyAddress}
                        className="h-8 w-8 glass-button hover:glow-primary"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={openSolscan}
                        className="h-8 w-8 glass-button hover:glow-accent"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className="glass-card p-6 rounded-xl text-center hover:glow-primary transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: "0.1s" }}
                  >
                    <div className="p-3 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 w-fit mx-auto mb-4 glow-primary">
                      <DollarSign className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-2xl font-bold gradient-text">{formatCurrency(totalValueUSD)}</div>
                    <div className="text-sm text-muted-foreground">Total Value</div>
                  </div>
                  <div
                    className="glass-card p-6 rounded-xl text-center hover:glow-accent transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <div className="p-3 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 w-fit mx-auto mb-4 glow-accent">
                      <Coins className="h-8 w-8 text-accent" />
                    </div>
                    <div className="text-2xl font-bold gradient-text">{tokensWithPrices.length}</div>
                    <div className="text-sm text-muted-foreground">Token Types</div>
                  </div>
                  <div
                    className="glass-card p-6 rounded-xl text-center hover:glow-chart-3 transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: "0.3s" }}
                  >
                    <div className="p-3 rounded-full bg-gradient-to-r from-chart-3/20 to-chart-3/10 w-fit mx-auto mb-4 glow-chart-3">
                      <TrendingUp className="h-8 w-8 text-chart-3" />
                    </div>
                    <div className="text-2xl font-bold gradient-text">{walletInfo?.balance.toFixed(4) || "0.0000"}</div>
                    <div className="text-sm text-muted-foreground">SOL Balance</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Token Holdings */}
        <Card className="glass-card animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-accent/20 to-primary/20 glow-accent">
                <Coins className="h-5 w-5 text-accent" />
              </div>
              <span className="gradient-text">Token Holdings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 glass-card rounded-lg animate-pulse">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full glass-skeleton" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24 glass-skeleton" />
                        <Skeleton className="h-3 w-16 glass-skeleton" />
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Skeleton className="h-4 w-20 glass-skeleton" />
                      <Skeleton className="h-3 w-16 glass-skeleton" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {tokensWithPrices.map((token, index) => (
                  <div
                    key={token.mint}
                    className="flex items-center justify-between p-4 glass-card rounded-lg hover:glow-primary transition-all duration-300 animate-fade-in-up hover:scale-[1.02]"
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-sm"></div>
                        {token.logoURI ? (
                          <Image
                            src={token.logoURI}
                            alt={token.name || token.symbol || "Token"}
                            width={40}
                            height={40}
                            className="rounded-full relative z-10 border border-primary/20"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="w-10 h-10 rounded-full relative z-10 border border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10 flex items-center justify-center"
                          style={{ display: token.logoURI ? 'none' : 'flex' }}
                        >
                          <span className="text-xs font-bold text-primary">
                            {token.symbol?.slice(0, 2) || "??"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium gradient-text">{token.name || token.symbol}</div>
                        <div className="text-sm text-muted-foreground">{token.symbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium gradient-text">
                        {formatTokenAmount(token.uiAmount)} {token.symbol}
                      </div>
                      <div className="text-sm text-muted-foreground">{formatCurrency(token.valueUSD)}</div>
                      {token.price > 0 && (
                        <Badge variant="outline" className="text-xs mt-1 glass-card border-primary/30 hover:glow-primary">
                          {formatCurrency(token.price)} per token
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {tokensWithPrices.length === 0 && !isLoading && (
                  <div className="text-center py-12 glass-card rounded-lg">
                    <div className="p-4 rounded-full bg-gradient-to-r from-muted/20 to-muted/10 w-fit mx-auto mb-4">
                      <Coins className="h-12 w-12 opacity-50" />
                    </div>
                    <p className="text-muted-foreground">No tokens found in this wallet</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <h1 className="text-4xl font-bold gradient-text">Wallet Info</h1>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="animate-fade-in-up"
        style={{ animationDelay: "0.1s" }}
      >
        <TabsList className="glass-card grid w-full grid-cols-2 p-1">
          <TabsTrigger
            value="connected"
            disabled={!isConnected}
            className="glass-button data-[state=active]:glow-primary"
          >
            My Wallet {!isConnected && "(Not Connected)"}
          </TabsTrigger>
          <TabsTrigger value="search" className="glass-button data-[state=active]:glow-accent">
            Search Wallet
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connected" className="space-y-6">
          {isConnected ? (
            renderWalletData()
          ) : (
            <Card className="glass-card animate-fade-in-up">
              <CardContent className="p-8 text-center">
                <div className="p-4 rounded-full bg-gradient-to-r from-muted/20 to-muted/10 w-fit mx-auto mb-6">
                  <Wallet className="h-12 w-12 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-lg">
                  Connect your Phantom wallet to view your balance and tokens
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="search" className="space-y-6">
          <div className="animate-fade-in-up">
            <WalletAddressSearch onSearch={handleSearch} isLoading={searchedWalletData.isLoading} />
          </div>
          {renderWalletData()}
        </TabsContent>
      </Tabs>
    </div>
  )
}
