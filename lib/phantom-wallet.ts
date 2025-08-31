export interface PhantomWallet {
  isPhantom: boolean
  publicKey: { toString(): string } | null
  isConnected: boolean
  connect(): Promise<{ publicKey: { toString(): string } }>
  disconnect(): Promise<void>
  on(event: string, callback: () => void): void
  off(event: string, callback: () => void): void
}

declare global {
  interface Window {
    solana?: PhantomWallet
  }
}

export const getPhantomWallet = (): PhantomWallet | null => {
  if (typeof window !== "undefined" && window.solana?.isPhantom) {
    return window.solana
  }
  return null
}

export const connectWallet = async (): Promise<string | null> => {
  const wallet = getPhantomWallet()
  if (!wallet) {
    throw new Error("Phantom wallet not found. Please install Phantom wallet extension.")
  }

  try {
    const response = await wallet.connect()
    return response.publicKey.toString()
  } catch (error) {
    console.error("Failed to connect wallet:", error)
    throw error
  }
}

export const disconnectWallet = async (): Promise<void> => {
  const wallet = getPhantomWallet()
  if (wallet) {
    await wallet.disconnect()
  }
}

export const isWalletConnected = (): boolean => {
  const wallet = getPhantomWallet()
  return wallet?.isConnected || false
}

export const getWalletAddress = (): string | null => {
  const wallet = getPhantomWallet()
  return wallet?.publicKey?.toString() || null
}
