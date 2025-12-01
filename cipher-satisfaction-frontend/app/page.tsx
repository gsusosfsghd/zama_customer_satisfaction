"use client";

import Link from "next/link";
import { useMetaMask } from "@/hooks/metamask/useMetaMaskProvider";

export default function HomePage() {
  const { isConnected, connect } = useMetaMask();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent animate-fade-in">
                CipherSatisfaction
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-primary to-primary/30 mx-auto rounded-full"></div>
            </div>
            <p className="text-2xl md:text-3xl font-medium text-foreground mb-4">
              Anonymous Customer Satisfaction Rating System
            </p>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Submit your feedback with complete anonymity using FHE encryption. 
              Your privacy is protected while companies gain valuable insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              {!isConnected ? (
                <button
                  onClick={connect}
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Connect Wallet to Start
                </button>
              ) : (
                <>
                  <Link
                    href="/submit"
                    className="px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Start Rating
                  </Link>
                  <Link
                    href="/dashboard"
                    className="px-8 py-4 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/90 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-border"
                  >
                    View Dashboard
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            <div className="group p-8 bg-card rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Complete Anonymity</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your ratings are encrypted and cannot be traced back to you
              </p>
            </div>
            <div className="group p-8 bg-card rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Encrypted Computation</h3>
              <p className="text-muted-foreground leading-relaxed">
                Scores are calculated on encrypted data without decryption
              </p>
            </div>
            <div className="group p-8 bg-card rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Data Privacy</h3>
              <p className="text-muted-foreground leading-relaxed">
                Only aggregated statistics can be decrypted, never individual ratings
              </p>
            </div>
            <div className="group p-8 bg-card rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Transparent Statistics</h3>
              <p className="text-muted-foreground leading-relaxed">
                Companies can view aggregated insights while preserving privacy
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="p-10 bg-card rounded-2xl border shadow-lg">
            <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              How It Works
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Submit Rating</h3>
                  <p className="text-muted-foreground">
                    Rate service quality across three dimensions (Attitude, Speed, Professionalism) using your wallet.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Encryption</h3>
                  <p className="text-muted-foreground">
                    Your ratings are encrypted using FHEVM before being stored on-chain.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Computation</h3>
                  <p className="text-muted-foreground">
                    Weighted scores and threshold checks are performed on encrypted data.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Statistics</h3>
                  <p className="text-muted-foreground">
                    Companies can decrypt only aggregated statistics, never individual ratings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

