import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = "https://data.solanatracker.io"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params

  if (!address) {
    return NextResponse.json(
      { error: 'Wallet address is required' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(`${BASE_URL}/wallet/${address}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'SolanaTracker-NextJS-App',
        'x-api-key': process.env.SOLANA_TRACKER_API_KEY || '',
      },
    })

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      
      // Try to get more detailed error from response body
      try {
        const errorData = await response.text()
        if (errorData) {
          errorMessage += ` - ${errorData}`
        }
      } catch (e) {
        // Ignore if we can't parse error response
      }
      
      // Handle specific error codes
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'API authentication required. The SolanaTracker API may require an API key or have authentication restrictions.' },
          { status: 401 }
        )
      } else if (response.status === 404) {
        return NextResponse.json(
          { error: 'Wallet not found or has no token activity' },
          { status: 404 }
        )
      } else if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later' },
          { status: 429 }
        )
      } else if (response.status >= 500) {
        return NextResponse.json(
          { error: 'Server error. Please try again later' },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('API Route Error:', error)
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