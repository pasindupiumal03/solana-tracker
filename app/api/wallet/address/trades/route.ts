import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = "https://data.solanatracker.io"
const API_KEY = process.env.SOLANA_TRACKER_API_KEY

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params
  const { searchParams } = new URL(request.url)
  const cursor = searchParams.get('cursor')

  if (!address) {
    return NextResponse.json(
      { error: 'Wallet address is required' },
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
    const url = new URL(`${BASE_URL}/wallet/${address}/trades`)
    if (cursor) {
      url.searchParams.append('cursor', cursor)
    }

    console.log('Fetching wallet trades from:', url.toString())

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'SolanaTracker-NextJS-App',
        'x-api-key': API_KEY,
      },
    })

    if (!response.ok) {
      console.error(`Solana Tracker API error for wallet trades: ${response.status} ${response.statusText}`)
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'API authentication required. Please check your API key configuration.' },
          { status: 401 }
        )
      } else if (response.status === 404) {
        return NextResponse.json(
          { error: 'Wallet not found or no trades available.' },
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
      }

      const errorText = await response.text()
      console.error('API Error Response:', errorText)
      
      return NextResponse.json(
        { error: `API Error: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    console.log('Successfully fetched wallet trades:', {
      tradesCount: data.trades?.length || 0,
      hasNextPage: data.hasNextPage,
      nextCursor: data.nextCursor
    })


    if (data.trades && data.trades.length > 0) {
      console.log('Sample trade structure:')
      console.log('Keys:', Object.keys(data.trades[0]))
      console.log('Sample data:', JSON.stringify(data.trades[0], null, 2))
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=120',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })

  } catch (error) {
    console.error('Wallet trades API error:', error)
    
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
