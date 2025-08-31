"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { usePhantomWallet } from "@/hooks/use-phantom-wallet"
import { DashboardLayout } from "@/components/dashboard-layout"
import { WalletInfoContent } from "@/components/wallet-info-content"

export default function DashboardPage() {
  const { isConnected } = usePhantomWallet()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isConnected) {
      router.push("/")
    }
  }, [isConnected, mounted, router])

  if (!mounted) {
    return null
  }

  if (!isConnected) {
    return null
  }

  return (
    <DashboardLayout>
      <WalletInfoContent />
    </DashboardLayout>
  )
}
