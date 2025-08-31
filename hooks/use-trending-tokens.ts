"use client"

import { useState, useEffect } from "react"

interface TokenData {
  mint: string
  name: string
  symbol: string
  logoURI?: string
  price: number
  priceChangePercent24h: number
  volume24h: number
  marketCap: number
  rank: number
  isVerified?: boolean
  // Additional fields for detailed view
  priceChange1h?: number
  holders?: number
  liquidity?: number
  riskLevel?: string
  security?: any
  pools?: any[]
  events?: any
  isDetailedView?: boolean
}

interface UseTrendingTokensReturn {
  tokens: TokenData[]
  lastUpdated: Date | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

interface UseTokenSearchReturn {
  searchResults: TokenData[]
  isSearching: boolean
  search: (query: string) => Promise<void>
  clearResults: () => void
}

type SortOption = "trending" | "latest" | "volume" | "graduated"

const BASE_URL = "https://data.solanatracker.io"

// API Response interfaces
interface ApiTokenResponse {
  token: {
    mint: string
    name: string
    symbol: string
    image?: string
  }
  pools: Array<{
    price: {
      usd: number
    }
    marketCap: {
      usd: number
    }
  }>
  events: {
    "24h": {
      priceChangePercentage: number
      volumeUsd: number
    }
  }
  rank?: number
}

interface ApiResponse {
  tokens: ApiTokenResponse[]
}

// Transform API response to our format
const transformTokenData = (apiTokens: any[]): TokenData[] => {
  if (!Array.isArray(apiTokens)) {
    console.warn('transformTokenData: Expected array, got:', typeof apiTokens)
    return []
  }
  
  return apiTokens.map((item, index) => {
    // Handle detailed view tokens (from address search)
    if (item.isDetailedView) {
      return {
        mint: item.mint,
        name: item.name,
        symbol: item.symbol,
        logoURI: item.image,
        price: Number(item.price) || 0,
        priceChangePercent24h: Number(item.priceChange24h) || 0,
        priceChange1h: Number(item.priceChange1h) || 0,
        volume24h: Number(item.volume24h) || 0,
        marketCap: Number(item.marketCap) || 0,
        holders: Number(item.holders) || 0,
        liquidity: Number(item.liquidity) || 0,
        rank: item.rank || 1,
        isVerified: item.isVerified || false,
        riskLevel: item.riskLevel,
        security: item.security,
        pools: item.pools,
        events: item.events,
        isDetailedView: true
      }
    }

    // Handle various possible API response structures for regular tokens
    const tokenData = item.token || item
    const mint = tokenData.mint || tokenData.tokenAddress || tokenData.address || item.mint || ''
    const name = tokenData.name || tokenData.symbol || item.name || 'Unknown Token'
    const symbol = tokenData.symbol || item.symbol || 'UNKNOWN'
    const logoURI = tokenData.image || tokenData.logoURI || item.logoURI || item.image
    
    // Price data can be in various locations
    let price = 0
    if (item.pools && item.pools[0] && item.pools[0].price) {
      price = item.pools[0].price.usd || 0
    } else if (item.price) {
      price = typeof item.price === 'object' ? item.price.usd : item.price
    }
    
    // Market cap data
    let marketCap = 0
    if (item.pools && item.pools[0] && item.pools[0].marketCap) {
      marketCap = item.pools[0].marketCap.usd || 0
    } else if (item.marketCap) {
      marketCap = typeof item.marketCap === 'object' ? item.marketCap.usd : item.marketCap
    }
    
    // 24h change and volume
    let priceChangePercent24h = 0
    let volume24h = 0
    if (item.events && item.events['24h']) {
      priceChangePercent24h = item.events['24h'].priceChangePercentage || 0
      volume24h = item.events['24h'].volumeUsd || 0
    } else {
      priceChangePercent24h = item.priceChange24h || item.change24h || 0
      volume24h = item.volume24h || item.volume || 0
    }
    
    return {
      mint,
      name,
      symbol,
      logoURI,
      price: Number(price) || 0,
      priceChangePercent24h: Number(priceChangePercent24h) || 0,
      volume24h: Number(volume24h) || 0,
      marketCap: Number(marketCap) || 0,
      rank: item.rank || index + 1,
      isVerified: item.isVerified || false
    }
  }).filter(token => token.mint && token.symbol) // Filter out invalid tokens
}

// Main hook for fetching tokens with different sort options
export function useTrendingTokens(sortBy: SortOption = "trending"): UseTrendingTokensReturn {
  const [tokens, setTokens] = useState<TokenData[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getEndpointUrl = (sort: SortOption): string => {
    switch (sort) {
      case "trending":
        return `${BASE_URL}/tokens/trending`
      case "latest":
        return `${BASE_URL}/tokens/latest`
      case "volume":
        return `${BASE_URL}/tokens/volume`
      case "graduated":
        return `${BASE_URL}/tokens/multi/graduated`
      default:
        return `${BASE_URL}/tokens/trending`
    }
  }

  const fetchTokens = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Try API route first, then direct API if available
      let response: Response
      let data: ApiResponse

      try {
        // Try via Next.js API route (if implemented)
        response = await fetch(`/api/tokens/${sortBy}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          data = await response.json()
        } else {
          throw new Error('API route not available')
        }
      } catch (apiRouteError) {
        // Fallback to direct API call
        const endpoint = getEndpointUrl(sortBy)
        response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-api-key': process.env.NEXT_PUBLIC_SOLANATRACKER_API_KEY || '',
          },
        })

        if (!response.ok) {
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`
          
          if (response.status === 401) {
            errorMessage = 'API authentication required. Please check your API key.'
          } else if (response.status === 429) {
            errorMessage = 'Rate limit exceeded. Please try again later.'
          } else if (response.status >= 500) {
            errorMessage = 'Server error. Please try again later.'
          }
          
          throw new Error(errorMessage)
        }

        data = await response.json()
      }

      const transformedTokens = transformTokenData(data.tokens || data || [])
      setTokens(transformedTokens)
      setLastUpdated(new Date())

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching tokens:', err)
      setTokens([])
    } finally {
      setIsLoading(false)
    }
  }

  const refetch = () => {
    fetchTokens()
  }

  useEffect(() => {
    fetchTokens()
  }, [sortBy])

  return {
    tokens,
    lastUpdated,
    isLoading,
    error,
    refetch
  }
}

// Hook for token search functionality
export function useTokenSearch(): UseTokenSearchReturn {
  const [searchResults, setSearchResults] = useState<TokenData[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const search = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)

    try {
      // Use the search API endpoint
      const response = await fetch(`/api/tokens/search?q=${encodeURIComponent(query.trim())}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`
        throw new Error(errorMessage)
      }

      const data = await response.json()
      
      // The search API returns an array of tokens directly
      const transformedResults = transformTokenData(Array.isArray(data) ? data : [])
      setSearchResults(transformedResults)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed'
      console.error('Search error:', errorMessage)
      
      // Show error to user but don't break the UI
      setSearchResults([])
      
    } finally {
      setIsSearching(false)
    }
  }

  const clearResults = () => {
    setSearchResults([])
  }

  return {
    searchResults,
    isSearching,
    search,
    clearResults
  }
}