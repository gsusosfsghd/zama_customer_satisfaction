"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMetaMask } from "@/hooks/metamask/useMetaMaskProvider";

export function Navigation() {
  const pathname = usePathname();
  const { isConnected, accounts, connect } = useMetaMask();

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const navLinkClass = (path: string) => {
    const baseClass = "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200";
    const activeClass = "text-primary bg-primary/10 font-semibold";
    const inactiveClass = "text-muted-foreground hover:text-foreground hover:bg-accent";
    return `${baseClass} ${pathname === path ? activeClass : inactiveClass}`;
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            CipherSatisfaction
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/" className={navLinkClass("/")}>
              Home
            </Link>
            <Link href="/submit" className={navLinkClass("/submit")}>
              Submit Rating
            </Link>
            <Link href="/dashboard" className={navLinkClass("/dashboard")}>
              Dashboard
            </Link>
            <Link href="/about" className={navLinkClass("/about")}>
              About
            </Link>
            {isConnected && accounts && accounts.length > 0 ? (
              <div className="ml-4 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-sm font-medium text-primary">
                <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
                {shortenAddress(accounts[0])}
              </div>
            ) : (
              <button
                onClick={connect}
                className="ml-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

