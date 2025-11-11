"use client";

import { useState } from "react";
import { useMetaMask } from "@/hooks/metamask/useMetaMaskProvider";
import { useMetaMaskEthersSigner } from "@/hooks/metamask/useMetaMaskEthersSigner";
import { useFhevm } from "@/fhevm/useFhevm";
import { useMetaMask as useMetaMaskForFhevm } from "@/hooks/metamask/useMetaMaskProvider";
import { ethers } from "ethers";
import { CipherSatisfactionABI } from "@/abi/CipherSatisfactionABI";
import { CipherSatisfactionAddresses } from "@/abi/CipherSatisfactionAddresses";

export default function SubmitPage() {
  const { isConnected, accounts } = useMetaMask();
  const { ethersSigner, chainId } = useMetaMaskEthersSigner();
  const metaMaskForFhevm = useMetaMaskForFhevm();
  const { instance } = useFhevm({
    provider: metaMaskForFhevm.provider,
    chainId,
    enabled: isConnected,
    initialMockChains: { 31337: "http://localhost:8545" },
  });
  // Storage is not used in submit page, removed to avoid SSR issues

  const [serviceAgentId, setServiceAgentId] = useState("");
  const [attitude, setAttitude] = useState(3);
  const [speed, setSpeed] = useState(3);
  const [professionalism, setProfessionalism] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!isConnected || !ethersSigner || !instance || !chainId) {
      setMessage("Please connect your wallet first");
      return;
    }

    if (!serviceAgentId.trim()) {
      setMessage("Please enter a service agent ID");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const contractAddress =
        CipherSatisfactionAddresses[chainId.toString() as keyof typeof CipherSatisfactionAddresses]
          ?.address;

      if (!contractAddress || contractAddress === ethers.ZeroAddress) {
        setMessage("Contract not deployed on this network");
        setIsSubmitting(false);
        return;
      }

      // Encrypt ratings
      const input = instance.createEncryptedInput(
        contractAddress,
        accounts![0]
      );
      input.add32(attitude);
      input.add32(speed);
      input.add32(professionalism);
      const encrypted = await input.encrypt();

      // Submit to contract
      const contract = new ethers.Contract(
        contractAddress,
        CipherSatisfactionABI.abi,
        ethersSigner
      );

      const serviceAgentIdBytes = ethers.id(serviceAgentId);
      const tx = await contract.submitRating(
        serviceAgentIdBytes,
        encrypted.handles[0],
        encrypted.inputProof,
        encrypted.handles[1],
        encrypted.inputProof,
        encrypted.handles[2],
        encrypted.inputProof
      );

      setMessage(`Transaction submitted: ${tx.hash}`);
      await tx.wait();
      setMessage(`Rating submitted successfully! Transaction: ${tx.hash}`);
    } catch (error: any) {
      setMessage(`Error: ${error.message || "Failed to submit rating"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-xl text-muted-foreground">
          Please connect your wallet to submit a rating
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Submit Rating
            </h1>
            <p className="text-lg text-muted-foreground">
              Your feedback is encrypted and completely anonymous
            </p>
          </div>

          <div className="bg-card rounded-2xl border shadow-lg p-8 md:p-10">
            <div className="space-y-8">
              {/* Service Agent ID */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-foreground">
                  Service Agent ID
                </label>
                <input
                  type="text"
                  value={serviceAgentId}
                  onChange={(e) => setServiceAgentId(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background"
                  placeholder="e.g., AGENT001, CS-2024-001, or agent name"
                />
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Enter the unique identifier for the service agent you interacted with. 
                  This can be their employee ID, agent code, or any identifier provided by the company.
                  <br />
                  <span className="text-xs italic mt-1 block">
                    Example: If you received service from agent "John Doe" with ID "JD-2024", enter "JD-2024"
                  </span>
                </p>
              </div>

              {/* Rating Sliders */}
              <div className="space-y-8">
                {/* Attitude */}
                <div className="p-6 bg-accent/30 rounded-xl border">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-base font-semibold text-foreground flex items-center gap-2">
                      <span className="text-2xl">😊</span>
                      Attitude
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-primary">{attitude}</span>
                      <span className="text-muted-foreground">/ 5</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={attitude}
                    onChange={(e) => setAttitude(Number(e.target.value))}
                    className="w-full h-3 bg-accent rounded-lg appearance-none cursor-pointer accent-primary"
                    style={{
                      background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${((attitude - 1) / 4) * 100}%, hsl(var(--accent)) ${((attitude - 1) / 4) * 100}%, hsl(var(--accent)) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>

                {/* Speed */}
                <div className="p-6 bg-accent/30 rounded-xl border">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-base font-semibold text-foreground flex items-center gap-2">
                      <span className="text-2xl">⚡</span>
                      Speed
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-primary">{speed}</span>
                      <span className="text-muted-foreground">/ 5</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full h-3 bg-accent rounded-lg appearance-none cursor-pointer accent-primary"
                    style={{
                      background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${((speed - 1) / 4) * 100}%, hsl(var(--accent)) ${((speed - 1) / 4) * 100}%, hsl(var(--accent)) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Slow</span>
                    <span>Fast</span>
                  </div>
                </div>

                {/* Professionalism */}
                <div className="p-6 bg-accent/30 rounded-xl border">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-base font-semibold text-foreground flex items-center gap-2">
                      <span className="text-2xl">💼</span>
                      Professionalism
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-primary">{professionalism}</span>
                      <span className="text-muted-foreground">/ 5</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={professionalism}
                    onChange={(e) => setProfessionalism(Number(e.target.value))}
                    className="w-full h-3 bg-accent rounded-lg appearance-none cursor-pointer accent-primary"
                    style={{
                      background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${((professionalism - 1) / 4) * 100}%, hsl(var(--accent)) ${((professionalism - 1) / 4) * 100}%, hsl(var(--accent)) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Unprofessional</span>
                    <span>Professional</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !serviceAgentId.trim()}
                className="w-full px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Encrypting & Submitting...
                  </span>
                ) : (
                  "🔒 Encrypt & Submit"
                )}
              </button>

              {/* Message */}
              {message && (
                <div
                  className={`p-4 rounded-xl border-2 ${
                    message.includes("Error")
                      ? "bg-destructive/10 text-destructive border-destructive/20"
                      : "bg-primary/10 text-primary border-primary/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {message.includes("Error") ? (
                      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    <p className="font-medium">{message}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

