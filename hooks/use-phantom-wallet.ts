"use client"

import { useState, useEffect, useCallback } from "react"
import {
  connectWallet,
  disconnectWallet,
  isWalletConnected,
  getWalletAddress,
  getPhantomWallet,
} from "@/lib/phantom-wallet"

export const usePhantomWallet = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkWalletConnection = useCallback(() => {
    const connected = isWalletConnected()
    const address = getWalletAddress()
    setIsConnected(connected)
    setWalletAddress(address)
  }, [])

  useEffect(() => {
    checkWalletConnection()

    const wallet = getPhantomWallet()
    if (wallet) {
      const handleConnect = () => checkWalletConnection()
      const handleDisconnect = () => {
        setIsConnected(false)
        setWalletAddress(null)
      }

      wallet.on("connect", handleConnect)
      wallet.on("disconnect", handleDisconnect)

      return () => {
        wallet.off("connect", handleConnect)
        wallet.off("disconnect", handleDisconnect)
      }
    }
  }, [checkWalletConnection])

  const connect = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const address = await connectWallet()
      setWalletAddress(address)
      setIsConnected(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet")
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await disconnectWallet()
      setIsConnected(false)
      setWalletAddress(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to disconnect wallet")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isConnected,
    walletAddress,
    isLoading,
    error,
    connect,
    disconnect,
  }
}
