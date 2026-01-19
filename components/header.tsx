"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useRef } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const { publicKey, connected, connecting, disconnecting } = useWallet()
  const { toast } = useToast()
  const prevConnectedRef = useRef(connected)

  useEffect(() => {
    if (connected && !prevConnectedRef.current) {
      toast({
        title: "Wallet connected",
        description: `Connected to ${publicKey?.toBase58().slice(0, 4)}...${publicKey?.toBase58().slice(-4)}`,
      })
    } else if (!connected && prevConnectedRef.current) {
      toast({
        title: "Wallet disconnected",
        description: "Your wallet has been disconnected",
      })
    }
    prevConnectedRef.current = connected
  }, [connected, publicKey, toast])

  return (
    <header className="border-b border-border bg-card shadow-sm transition-colors duration-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/predicx.jpg" alt="PredictX" className="w-8 h-8" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-green-500 bg-clip-text text-transparent">
              PredictX
            </span>
          </div>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search markets..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="wallet-adapter-button-wrapper">
              <WalletMultiButton />
            </div>
          </div>
        </div>

        {connecting && <div className="mt-2 text-xs text-yellow-500">Connecting wallet...</div>}
        {disconnecting && <div className="mt-2 text-xs text-yellow-500">Disconnecting wallet...</div>}
        {connected && publicKey && (
          <div className="mt-2 text-xs text-muted-foreground">
            Connected: {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
          </div>
        )}
      </div>
    </header>
  )
}
