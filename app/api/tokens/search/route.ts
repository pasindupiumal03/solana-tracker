
import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = "https://data.solanatracker.io"
const API_KEY = process.env.SOLANA_TRACKER_API_KEY

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      { error: 'Search query is required' },
      { status: 400 }
    )
  }

  if (query.trim().length < 2) {
    return NextResponse.json(
      { error: 'Search query must be at least 2 characters long' },
      { status: 400 }
    )
  }

  if (!API_KEY) {
    console.error('SOLANA_TRACKER_API_KEY is not configured')
    return NextResponse.json(
      { error: 'API configuration error' },
      { status: 500 }
    )
  }

  try {
    const isTokenAddress = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(query.trim())
    
    if (isTokenAddress) {
      try {
        const response = await fetch(`${BASE_URL}/tokens/${query.trim()}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'SolanaTracker-NextJS-App',
            'x-api-key': API_KEY,
          },
        })

        if (response.ok) {
          const tokenData = await response.json()
          console.log('Token address API response:', JSON.stringify(tokenData, null, 2))
          
          const token = tokenData.token || {}
          const pools = tokenData.pools || []
          const events = tokenData.events || {}
          const risk = tokenData.risk || {}
          
          const primaryPool = pools[0] || {}
          const poolPrice = primaryPool.price || {}
          const poolLiquidity = primaryPool.liquidity || {}
          const poolMarketCap = primaryPool.marketCap || {}
          const poolTxns = primaryPool.txns || {}
          
          const detailedToken = {
            mint: token.mint || query.trim(),
            name: token.name || 'Unknown Token',
            symbol: token.symbol || 'UNKNOWN',
            image: token.image || null,
            price: poolPrice.usd || 0,
            priceChange1h: events['1h']?.priceChangePercentage || 0,
            priceChange24h: events['24h']?.priceChangePercentage || 0,
            marketCap: poolMarketCap.usd || 0,
            volume24h: poolTxns.volume24h || 0,
            holders: tokenData.holders || 0,
            liquidity: poolLiquidity.usd || 0,
            isVerified: risk.jupiterVerified || false,
            riskLevel: risk.score <= 2 ? 'low' : risk.score <= 5 ? 'medium' : 'high',
            security: primaryPool.security || {},
            buys: tokenData.buys || 0,
            sells: tokenData.sells || 0,
            totalTxns: tokenData.txns || 0,
            riskScore: risk.score || 0,
            risks: risk.risks || [],
            top10Percentage: risk.top10 || 0,
            lpBurn: primaryPool.lpBurn || 0,
            tokenSupply: primaryPool.tokenSupply || 0,
            isDetailedView: true
          }

          return NextResponse.json([detailedToken], {
            headers: {
              'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET',
              'Access-Control-Allow-Headers': 'Content-Type',
            },
          })
        } else if (response.status === 404) {
          return NextResponse.json(
            { error: 'Token not found or not supported' },
            { status: 404 }
          )
        } else {
          console.error(`Token API returned ${response.status}: ${response.statusText}`)
        }
      } catch (error) {
        console.error('Direct token address search failed:', error)
        return NextResponse.json(
          { error: 'Failed to fetch token data' },
          { status: 500 }
        )
      }
    }
    const response = await fetch(`${BASE_URL}/tokens/trending`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'SolanaTracker-NextJS-App',
        'x-api-key': API_KEY,
      },
    })

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'API authentication required. Please check your API key configuration.' },
          { status: 401 }
        )
      } else if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        )
      } else if (response.status >= 500) {
        return NextResponse.json(
          { error: 'External API server error. Please try again later.' },
          { status: 502 }
        )
      } else {
        return NextResponse.json(
          { error: errorMessage },
          { status: response.status }
        )
      }
    }

    const data = await response.json()
    
    const searchTerm = query.toLowerCase().trim()
    const filteredTokens = data.filter((token: any) => {
      return (
        token.name?.toLowerCase().includes(searchTerm) ||
        token.symbol?.toLowerCase().includes(searchTerm) ||
        token.mint?.toLowerCase().includes(searchTerm)
      )
    })


    const limitedResults = filteredTokens.slice(0, 20)

    return NextResponse.json(limitedResults, {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })

  } catch (error) {
    console.error('Token search API error:', error)
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Network error. Please check your internet connection.' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}


export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
