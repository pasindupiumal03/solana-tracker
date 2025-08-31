import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = "https://data.solanatracker.io"
const API_KEY = process.env.SOLANA_TRACKER_API_KEY

type TokenType = "trending" | "latest" | "volume" | "graduated"

const getEndpointUrl = (type: TokenType): string => {
  switch (type) {
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params

  const validTypes: TokenType[] = ["trending", "latest", "volume", "graduated"]
  if (!validTypes.includes(type as TokenType)) {
    return NextResponse.json(
      { error: 'Invalid token type. Must be one of: trending, latest, volume, graduated' },
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
    const endpoint = getEndpointUrl(type as TokenType)
    console.log(`Fetching ${type} tokens from: ${endpoint}`)
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY,
        'User-Agent': 'SolanaTracker-WebApp/1.0',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Solana Tracker API error for ${type}: ${response.status} ${response.statusText}`, errorText)
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'API authentication required. Please check your API key configuration.' },
          { status: 401 }
        )
      } else if (response.status === 404) {
        return NextResponse.json(
          { error: `${type} endpoint not found or not available` },
          { status: 404 }
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
          { error: `API request failed: ${response.status} ${response.statusText}` },
          { status: response.status }
        )
      }
    }

    const data = await response.json()
    console.log(`Successfully fetched ${type} tokens:`, data?.length || 'unknown count')
    

    if (data && data.length > 0) {
      console.log(`Sample ${type} token structure:`)
      console.log('Keys:', Object.keys(data[0]))
      console.log('Sample data:', JSON.stringify(data[0], null, 2))
    }

    return NextResponse.json({ tokens: data }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error(`API Route Error for ${type}:`, error)
    
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

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
