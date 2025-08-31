// Sample wallet trades data for demonstration purposes
export const sampleTrades = [
  {
    tx: "5zqmef7rgLMnY9iFpXVuEfwx5EhA9mBhUYTxd7HBV34X73drH5fYW98D52dtUff4mcZGc4tnDhVLPyPkv4c5eLYn",
    from: {
      address: "So11111111111111111111111111111111111111112",
      amount: 0.5,
      token: {
        name: "Wrapped SOL",
        symbol: "SOL",
        image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
        decimals: 9
      }
    },
    to: {
      address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      amount: 98.5,
      token: {
        name: "USD Coin",
        symbol: "USDC",
        image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
        decimals: 6
      }
    },
    price: {
      usd: 197.25,
      sol: ""
    },
    volume: {
      usd: 98.62,
      sol: 0.5
    },
    wallet: "WALLET_ADDRESS",
    program: "raydium",
    time: Date.now() - 3600000 // 1 hour ago
  },
  {
    tx: "2xKjBf8pqRsU7mVbCwY3z1eNpLmK5qH9vWcR4tE8nBkD6gF2aS9xJmP1oL3nCvB7",
    from: {
      address: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
      amount: 25.0,
      token: {
        name: "Raydium",
        symbol: "RAY",
        image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png",
        decimals: 6
      }
    },
    to: {
      address: "So11111111111111111111111111111111111111112",
      amount: 0.25,
      token: {
        name: "Wrapped SOL",
        symbol: "SOL", 
        image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
        decimals: 9
      }
    },
    price: {
      usd: 1.85,
      sol: ""
    },
    volume: {
      usd: 46.25,
      sol: 0.25
    },
    wallet: "WALLET_ADDRESS",
    program: "orca",
    time: Date.now() - 7200000 // 2 hours ago
  },
  {
    tx: "3mNjCdRgT7vZ8wA4qE6nPkL2hM9bX5cQ1fG8uY2iD3oS7jK9lB6tR4pE1wN5vC8",
    from: {
      address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      amount: 50.0,
      token: {
        name: "USD Coin",
        symbol: "USDC",
        image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
        decimals: 6
      }
    },
    to: {
      address: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
      amount: 45.2,
      token: {
        name: "Marinade staked SOL",
        symbol: "mSOL",
        image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png",
        decimals: 9
      }
    },
    price: {
      usd: 1.11,
      sol: ""
    },
    volume: {
      usd: 50.0,
      sol: 0.27
    },
    wallet: "WALLET_ADDRESS", 
    program: "jupiter",
    time: Date.now() - 14400000 // 4 hours ago
  }
]

export const sampleStats = {
  received: 2,
  sent: 1, 
  swapped: 3,
  totalVolume: 194.87
}
