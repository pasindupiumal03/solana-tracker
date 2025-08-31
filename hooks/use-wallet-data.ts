"use client"

import { useState, useEffect } from "react"

interface TokenData {
  mint: string
  name: string
  symbol: string
  logoURI?: string
  decimals: number
  uiAmount: number
  price: number
  valueUSD: number
}

interface WalletInfo {
  balance: number // SOL balance
}

interface WalletDataResponse {
  tokens: Array<{
    token: {
      name: string
      symbol: string
      mint: string
      image?: string
      decimals: number
    }
    pools: Array<{
      price: {
        usd: number
      }
    }>
    balance: number
    value: number
  }>
  total: number // Total USD value
  totalSol: number // Total SOL balance
}

interface UseWalletDataReturn {
  walletInfo: WalletInfo | null
  tokensWithPrices: TokenData[]
  totalValueUSD: number
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useWalletData(walletAddress?: string): UseWalletDataReturn {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null)
  const [tokensWithPrices, setTokensWithPrices] = useState<TokenData[]>([])
  const [totalValueUSD, setTotalValueUSD] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWalletData = async (address: string) => {
    if (!address) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/wallet/${address}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `Request failed: ${response.status}`)
      }

      const data: WalletDataResponse = await response.json()

      // Set wallet info (SOL balance)
      setWalletInfo({
        balance: data.totalSol || 0
      })

      // Transform tokens data
      const transformedTokens: TokenData[] = data.tokens?.map(tokenData => {
        const token = tokenData.token
        // Get price from the first active pool
        const price = tokenData.pools?.find(pool => pool.price?.usd > 0)?.price?.usd || 0
        
        return {
          mint: token.mint,
          name: token.name || token.symbol,
          symbol: token.symbol,
          logoURI: token.image,
          decimals: token.decimals,
          uiAmount: tokenData.balance / Math.pow(10, token.decimals),
          price: price,
          valueUSD: tokenData.value || 0
        }
      }) || []

      setTokensWithPrices(transformedTokens)
      setTotalValueUSD(data.total || 0)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching wallet data:', err)
      
      // Reset data on error
      setWalletInfo(null)
      setTokensWithPrices([])
      setTotalValueUSD(0)
    } finally {
      setIsLoading(false)
    }
  }

  const refetch = () => {
    if (walletAddress) {
      fetchWalletData(walletAddress)
    }
  }

  useEffect(() => {
    if (walletAddress) {
      fetchWalletData(walletAddress)
    } else {
      // Reset data when no wallet address
      setWalletInfo(null)
      setTokensWithPrices([])
      setTotalValueUSD(0)
      setError(null)
    }
  }, [walletAddress])

  return {
    walletInfo,
    tokensWithPrices,
    totalValueUSD,
    isLoading,
    error,
    refetch
  }
}