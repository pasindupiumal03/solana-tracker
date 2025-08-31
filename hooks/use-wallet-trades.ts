"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

export interface WalletTrade {
  tx: string
  from: {
    address: string
    amount: number
    token: {
      name: string
      symbol: string
      image: string
      decimals: number
    }
  }
  to: {
    address: string
    amount: number
    token: {
      name: string
      symbol: string
      image: string
      decimals: number
    }
  }
  price: {
    usd: number
    sol: string
  }
  volume: {
    usd: number
    sol: number
  }
  wallet: string
  program: string
  time: number
}

export interface WalletTradesResponse {
  trades: WalletTrade[]
  nextCursor: number
  hasNextPage: boolean
}

export interface WalletStats {
  received: number
  sent: number
  swapped: number
  totalVolume: number
}

export function useWalletTrades(walletAddress?: string) {
  const [trades, setTrades] = useState<WalletTrade[]>([])
  const [stats, setStats] = useState<WalletStats>({
    received: 0,
    sent: 0,
    swapped: 0,
    totalVolume: 0
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [nextCursor, setNextCursor] = useState<number | null>(null)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const { toast } = useToast()

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const fetchTrades = useCallback(async (reset: boolean = false, retryCount: number = 0) => {
    if (!walletAddress) {
      setTrades([])
      setStats({ received: 0, sent: 0, swapped: 0, totalVolume: 0 })
      setIsRateLimited(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (!reset && nextCursor) {
        params.append('cursor', nextCursor.toString())
      }
      
      const url = `/api/wallet/${walletAddress}/trades${params.toString() ? `?${params.toString()}` : ''}`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        // Handle rate limiting with retry logic
        if (response.status === 429) {
          setIsRateLimited(true)
          
          const maxRetries = 3
          if (retryCount < maxRetries) {
            // Exponential backoff: wait 2^retryCount seconds
            const delayMs = Math.pow(2, retryCount) * 1000
            console.log(`Rate limited, retrying in ${delayMs}ms (attempt ${retryCount + 1}/${maxRetries})`)
            
            // Show toast notification for rate limiting with retry info
            toast({
              title: "Rate limit reached",
              description: `Retrying in ${delayMs / 1000}s... (${retryCount + 1}/${maxRetries})`,
              variant: "destructive",
            })
            
            await sleep(delayMs)
            return fetchTrades(reset, retryCount + 1)
          } else {
            // Max retries exceeded
            toast({
              title: "Rate limit exceeded",
              description: "Please wait a moment before trying again.",
              variant: "destructive",
            })
            setError('Rate limit exceeded. Please wait a moment before trying again.')
            setIsRateLimited(true)
            return
          }
        }
        
        // Handle 404 specifically - wallet may have no trades or not exist
        if (response.status === 404) {
          console.log('No trades found for wallet:', walletAddress)
          setTrades([])
          setStats({ received: 0, sent: 0, swapped: 0, totalVolume: 0 })
          setHasNextPage(false)
          setNextCursor(null)
          setIsRateLimited(false)
          return
        }
        
        // For other errors, try to get the error message from the response
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        try {
          const errorData = await response.json()
          if (errorData.error) {
            errorMessage = errorData.error
          }
        } catch {
          // If we can't parse the error response, use the default message
        }
        
        throw new Error(errorMessage)
      }

      // Success - clear rate limit flag
      setIsRateLimited(false)
      
      // Show success toast if we just recovered from rate limiting
      if (retryCount > 0) {
        toast({
          title: "Connection restored",
          description: "Successfully loaded wallet trades.",
          variant: "default",
        })
      }
      
      const data: WalletTradesResponse = await response.json()

      // Safely handle potentially malformed data
      try {
        const safeTrades = (data?.trades || []).filter(trade => trade && trade.tx)
        
        if (reset) {
          setTrades(safeTrades)
        } else {
          setTrades(prev => [...prev, ...safeTrades])
        }

        setHasNextPage(data?.hasNextPage || false)
        setNextCursor(data?.nextCursor || null)

        // Calculate stats from all trades with error handling
        const allTrades = reset ? safeTrades : [...trades, ...safeTrades]
        const newStats = calculateStats(allTrades, walletAddress)
        setStats(newStats)
      } catch (dataError) {
        console.error('Error processing trade data:', dataError)
        // Still clear loading state but show error
        throw new Error('Failed to process trade data')
      }

    } catch (err) {
      console.error('Failed to fetch wallet trades:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch trades')
      setIsRateLimited(false)
    } finally {
      setIsLoading(false)
    }
  }, [walletAddress, nextCursor, trades])

  const calculateStats = (allTrades: WalletTrade[], wallet: string): WalletStats => {
    let received = 0
    let sent = 0
    let swapped = 0
    let totalVolume = 0

    allTrades.forEach(trade => {
      // Safely access volume with fallback
      const volume = trade?.volume?.usd || 0
      totalVolume += volume

      // Safely access trade addresses with fallbacks
      const toAddress = trade?.to?.address || ''
      const fromAddress = trade?.from?.address || ''
      const tradeWallet = trade?.wallet || wallet

      // Determine if this is a receive, send, or swap based on the trade structure
      // In Solana DEX trades, both tokens are usually involved in a swap
      // But we can infer the intent based on which token the user "gained" vs "lost"
      
      const isReceiving = toAddress !== tradeWallet
      const isSending = fromAddress === tradeWallet

      if (isSending && isReceiving) {
        // This is a swap - user sent one token and received another
        swapped++
      } else if (isReceiving) {
        // User received tokens
        received++
      } else if (isSending) {
        // User sent tokens  
        sent++
      } else {
        // Default to swap for DEX trades
        swapped++
      }
    })

    return { received, sent, swapped, totalVolume }
  }

  const refreshTrades = useCallback(() => {
    setNextCursor(null)
    setIsRateLimited(false)
    fetchTrades(true)
  }, [fetchTrades])

  const loadMoreTrades = useCallback(() => {
    if (hasNextPage && !isLoading && !isRateLimited) {
      fetchTrades(false)
    }
  }, [fetchTrades, hasNextPage, isLoading, isRateLimited])

  const retryAfterRateLimit = useCallback(() => {
    setIsRateLimited(false)
    setError(null)
    fetchTrades(true)
  }, [fetchTrades])

  const loadTrades = useCallback(() => {
    if (walletAddress) {
      setNextCursor(null)
      setIsRateLimited(false)
      fetchTrades(true)
    }
  }, [walletAddress, fetchTrades])

  // Clear data when wallet address changes but don't auto-fetch
  useEffect(() => {
    if (walletAddress) {
      setTrades([])
      setStats({ received: 0, sent: 0, swapped: 0, totalVolume: 0 })
      setError(null)
      setIsRateLimited(false)
      setHasNextPage(false)
      setNextCursor(null)
    }
  }, [walletAddress])

  return {
    trades,
    stats,
    isLoading,
    error,
    hasNextPage,
    isRateLimited,
    refreshTrades,
    loadMoreTrades,
    retryAfterRateLimit,
    loadTrades
  }
}
