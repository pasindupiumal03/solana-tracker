import { useState, useEffect } from 'react'

interface TokenInfo {
  name: string
  symbol: string
  mint: string
  image?: string
  decimals: number
  price?: {
    usd: number
  }
  pools?: Array<{
    price: {
      usd: number
    }
    liquidity?: {
      usd: number
    }
    marketCap?: {
      usd: number
    }
  }>
  events?: {
    [key: string]: {
      priceChangePercentage: number
    }
  }
  risk?: {
    score: number
    risks: Array<{
      name: string
      description: string
      level: string
      score: number
    }>
  }
}

interface UseTokenInfoReturn {
  tokenInfo: TokenInfo | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useTokenInfo(tokenAddress?: string): UseTokenInfoReturn {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTokenInfo = async (address: string) => {
    if (!address) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/token/${address}`, {
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

      const data: TokenInfo = await response.json()
      setTokenInfo(data)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching token info:', err)
      setTokenInfo(null)
    } finally {
      setIsLoading(false)
    }
  }

  const refetch = () => {
    if (tokenAddress) {
      fetchTokenInfo(tokenAddress)
    }
  }

  useEffect(() => {
    if (tokenAddress) {
      fetchTokenInfo(tokenAddress)
    } else {
      setTokenInfo(null)
      setError(null)
    }
  }, [tokenAddress])

  return {
    tokenInfo,
    isLoading,
    error,
    refetch
  }
}
