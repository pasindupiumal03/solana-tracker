"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useTrendingTokens, useTokenSearch } from "@/hooks/use-trending-tokens"
import { TrendingUp, Search, RefreshCw, ArrowUpRight, ArrowDownRight, Star, ExternalLink, Filter } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { DetailedTokenCard } from "./detailed-token-card"

type SortOption = "trending" | "latest" | "volume" | "graduated"

export function TrendingTokensContent() {
  const [sortBy, setSortBy] = useState<SortOption>("trending")
  const [searchQuery, setSearchQuery] = useState("")
  
  const { tokens, lastUpdated, isLoading, error, refetch } = useTrendingTokens(sortBy)
  const { searchResults, isSearching, search, clearResults } = useTokenSearch()

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

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      search(query)
    } else {
      clearResults()
    }
  }

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort)
    // Clear search when changing sort
    if (searchQuery) {
      setSearchQuery("")
      clearResults()
    }
  }

  const displayTokens = searchQuery ? searchResults : tokens
  
  // Check if we have a detailed token view (single token from address search)
  const isDetailedView = searchResults.length === 1 && searchResults[0]?.isDetailedView

  const getSortLabel = (sort: SortOption): string => {
    switch (sort) {
      case "trending":
        return "Trending"
      case "latest":
        return "Latest"
      case "volume":
        return "By Volume"
      case "graduated":
        return "Graduated"
      default:
        return "Trending"
    }
  }

  const getSortDescription = (sort: SortOption): string => {
    switch (sort) {
      case "trending":
        return "Most popular tokens right now"
      case "latest":
        return "Recently launched tokens"
      case "volume":
        return "Highest trading volume"
      case "graduated":
        return "Tokens that have graduated from bonding curves"
      default:
        return "Most popular tokens"
    }
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between animate-fade-in-up">
          <h1 className="text-3xl font-bold gradient-text">Trending Tokens</h1>
          <Button onClick={refetch} variant="outline" className="glass-button hover:glow-red bg-transparent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
        <Card className="glass-card border-red-500/20 bg-red-500/5">
          <CardContent className="p-6">
            <div className="text-center text-red-400">
              <p>Error loading tokens: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-4xl font-bold gradient-text">
            {getSortLabel(sortBy)} Tokens
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {getSortDescription(sortBy)}
          </p>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <Button
          onClick={refetch}
          variant="outline"
          disabled={isLoading}
          className="glass-button hover:glow-primary bg-transparent"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="glass-card animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by token name, symbol, or paste token address..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 glass-input border-primary/20 focus:glow-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-accent/20 to-primary/20 glow-accent">
                <Filter className="h-4 w-4 text-accent" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="px-4 py-2 glass-card border-primary/20 rounded-lg bg-background/50 text-foreground focus:glow-primary transition-all duration-300"
              >
                <option value="trending">Trending</option>
                <option value="latest">Latest</option>
                <option value="volume">Volume</option>
                <option value="graduated">Graduated</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sort Tabs Alternative (Optional - you can remove the select above and use this instead) */}
      <div className="flex flex-wrap gap-2 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
        {(["trending", "latest", "volume", "graduated"] as SortOption[]).map((sort) => (
          <Button
            key={sort}
            variant={sortBy === sort ? "default" : "outline"}
            onClick={() => handleSortChange(sort)}
            className={cn(
              "glass-button transition-all duration-300",
              sortBy === sort 
                ? "glow-primary bg-gradient-to-r from-primary/20 to-accent/20" 
                : "hover:glow-primary bg-transparent"
            )}
          >
            {getSortLabel(sort)}
          </Button>
        ))}
      </div>

      {/* Tokens List */}
      {isDetailedView ? (
        // Detailed token view for address search
        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <DetailedTokenCard 
            token={{
              mint: searchResults[0].mint,
              name: searchResults[0].name,
              symbol: searchResults[0].symbol,
              image: searchResults[0].logoURI,
              price: searchResults[0].price,
              priceChange1h: searchResults[0].priceChange1h || 0,
              priceChange24h: searchResults[0].priceChangePercent24h,
              marketCap: searchResults[0].marketCap,
              volume24h: searchResults[0].volume24h,
              holders: searchResults[0].holders || 0,
              liquidity: searchResults[0].liquidity || 0,
              isVerified: searchResults[0].isVerified,
              riskLevel: searchResults[0].riskLevel || 'unknown',
              security: searchResults[0].security,
              pools: searchResults[0].pools,
              events: searchResults[0].events
            }}
            onClose={() => {
              setSearchQuery("")
              clearResults()
            }}
          />
        </div>
      ) : (
        // Regular token list view
        <Card className="glass-card animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 glow-primary">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <span className="gradient-text">
              {searchQuery ? `Search Results (${displayTokens.length})` : `${getSortLabel(sortBy)} (${displayTokens.length})`}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading || isSearching ? (
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 glass-card rounded-lg animate-pulse">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-8 glass-skeleton" />
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
            <div className="space-y-3">
              {displayTokens.map((token, index) => {
                const isPositive = token.priceChangePercent24h >= 0
                const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight

                return (
                  <div
                    key={token.mint}
                    className="flex items-center justify-between p-4 glass-card rounded-lg hover:glow-primary transition-all duration-300 group animate-fade-in-up hover:scale-[1.02]"
                    style={{ animationDelay: `${0.05 * index}s` }}
                  >
                    {/* Left section: Rank, Logo, Name & Symbol */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-sm font-mono text-muted-foreground w-8 glass-card px-2 py-1 rounded text-center">
                        #{searchQuery ? index + 1 : token.rank}
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-sm"></div>
                        {token.logoURI ? (
                          <Image
                            src={token.logoURI}
                            alt={token.name}
                            width={40}
                            height={40}
                            className="rounded-full relative z-10 border border-primary/20"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder.svg?height=40&width=40&text=" + encodeURIComponent(token.symbol);
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full relative z-10 border border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">
                              {token.symbol?.slice(0, 2) || "??"}
                            </span>
                          </div>
                        )}
                        {token.isVerified && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center glow-primary">
                            <Star className="h-2.5 w-2.5 text-white fill-current" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium gradient-text truncate">{token.name}</div>
                        <Badge variant="outline" className="text-xs glass-card border-primary/30 hover:glow-primary mt-1">
                          {token.symbol}
                        </Badge>
                      </div>
                    </div>

                    {/* Right section: Price, Change, Market Cap */}
                    <div className="flex items-center gap-6">
                      {/* 24h Change */}
                      <div className="text-right min-w-[80px]">
                        <div className="flex items-center gap-1 justify-end">
                          <div
                            className={cn(
                              "p-1 rounded-full",
                              isPositive ? "bg-green-500/20 glow-green" : "bg-red-500/20 glow-red",
                            )}
                          >
                            <TrendIcon className={cn("h-3 w-3", isPositive ? "text-green-400" : "text-red-400")} />
                          </div>
                          <span className={cn("text-sm font-medium", isPositive ? "text-green-400" : "text-red-400")}>
                            {isPositive ? "+" : ""}
                            {token.priceChangePercent24h.toFixed(2)}%
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">24h Change</div>
                      </div>

                      {/* Market Cap */}
                      <div className="text-right min-w-[100px]">
                        <div className="text-sm font-medium text-foreground">{formatCurrency(token.marketCap)}</div>
                        <div className="text-xs text-muted-foreground">Market Cap</div>
                      </div>

                      {/* Price */}
                      <div className="text-right min-w-[100px]">
                        <div className="font-medium text-lg gradient-text">{formatPrice(token.price)}</div>
                        <div className="text-xs text-muted-foreground">Price</div>
                      </div>

                      {/* External Link Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(`https://dexscreener.com/solana/${token.mint}`, '_blank')}
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 glass-button hover:glow-accent ml-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
              {displayTokens.length === 0 && !isLoading && !isSearching && (
                <div className="text-center py-12 glass-card rounded-lg">
                  <div className="p-4 rounded-full bg-gradient-to-r from-muted/20 to-muted/10 w-fit mx-auto mb-6">
                    <TrendingUp className="h-12 w-12 opacity-50" />
                  </div>
                  <p className="text-muted-foreground text-lg">
                    {searchQuery ? "No tokens found matching your search" : `No ${getSortLabel(sortBy).toLowerCase()} tokens available`}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      )}
    </div>
  )
}

