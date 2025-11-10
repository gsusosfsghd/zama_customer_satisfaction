"use client";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              About CipherSatisfaction
            </h1>
            <p className="text-lg text-muted-foreground">
              Privacy-first customer satisfaction rating system
            </p>
          </div>

          <div className="space-y-8">
            {/* Project Overview */}
            <section className="p-8 bg-card rounded-2xl border shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-foreground">Project Overview</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">
                CipherSatisfaction is a decentralized application built on FHEVM
                (Fully Homomorphic Encryption Virtual Machine) that enables truly
                anonymous customer satisfaction ratings. By leveraging homomorphic
                encryption, we ensure that individual ratings remain private while
                still allowing companies to compute aggregated statistics.
              </p>
            </section>

            {/* Technology Stack */}
            <section className="p-8 bg-card rounded-2xl border shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-foreground">Technology Stack</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-accent/30 rounded-xl border">
                  <strong className="text-foreground block mb-1">FHEVM</strong>
                  <span className="text-muted-foreground text-sm">Zama&apos;s Fully Homomorphic Encryption Virtual Machine</span>
                </div>
                <div className="p-4 bg-accent/30 rounded-xl border">
                  <strong className="text-foreground block mb-1">Solidity</strong>
                  <span className="text-muted-foreground text-sm">Smart contracts for on-chain encrypted computation</span>
                </div>
                <div className="p-4 bg-accent/30 rounded-xl border">
                  <strong className="text-foreground block mb-1">Next.js</strong>
                  <span className="text-muted-foreground text-sm">React framework with static export</span>
                </div>
                <div className="p-4 bg-accent/30 rounded-xl border">
                  <strong className="text-foreground block mb-1">Ethers.js</strong>
                  <span className="text-muted-foreground text-sm">Ethereum library for wallet integration</span>
                </div>
                <div className="p-4 bg-accent/30 rounded-xl border md:col-span-2">
                  <strong className="text-foreground block mb-1">TypeScript</strong>
                  <span className="text-muted-foreground text-sm">Type-safe development for better code quality</span>
                </div>
              </div>
            </section>

            {/* Privacy Protection */}
            <section className="p-8 bg-card rounded-2xl border shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-foreground">Privacy Protection</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Our system ensures complete anonymity through:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-accent/30 rounded-xl">
                  <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-foreground">Encrypted rating submission</span>
                </div>
                <div className="flex items-start gap-3 p-4 bg-accent/30 rounded-xl">
                  <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-foreground">On-chain computation on encrypted data</span>
                </div>
                <div className="flex items-start gap-3 p-4 bg-accent/30 rounded-xl">
                  <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-foreground">Selective decryption of aggregated statistics only</span>
                </div>
                <div className="flex items-start gap-3 p-4 bg-accent/30 rounded-xl">
                  <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-foreground">No traceability of individual ratings</span>
                </div>
              </div>
            </section>

            {/* How to Use */}
            <section className="p-8 bg-card rounded-2xl border shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-foreground">How to Use</h2>
              </div>
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <span className="text-2xl">🆔</span>
                    Service Agent ID
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    When submitting a rating, you&apos;ll need to provide a Service Agent ID. 
                    This identifier helps companies track which service agent received the feedback, 
                    while your actual rating remains completely anonymous and encrypted.
                  </p>
                  <div className="bg-background/50 p-4 rounded-lg">
                    <p className="font-semibold text-foreground mb-2">Where to find it:</p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Provided by the service agent during or after your interaction</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Displayed on service receipts or confirmation emails</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Available in your service history or account dashboard</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Shown in chat transcripts or support tickets</span>
                      </li>
                    </ul>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground italic bg-background/50 p-3 rounded-lg">
                    <strong>Note:</strong> The Service Agent ID is stored in plaintext on-chain for identification 
                    purposes, but your ratings are fully encrypted and cannot be traced back to you.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="p-8 bg-card rounded-2xl border shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-foreground">Contact & Feedback</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                For questions, feedback, or support, please refer to the project
                repository or contact the development team.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

