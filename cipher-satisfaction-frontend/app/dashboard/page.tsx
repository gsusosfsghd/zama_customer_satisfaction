"use client";

import { useState, useEffect } from "react";
import { useMetaMask } from "@/hooks/metamask/useMetaMaskProvider";
import { useMetaMaskEthersSigner } from "@/hooks/metamask/useMetaMaskEthersSigner";
import { useFhevm } from "@/fhevm/useFhevm";
import { useMetaMask as useMetaMaskForFhevm } from "@/hooks/metamask/useMetaMaskProvider";
import { useInMemoryStorage } from "@/hooks/useInMemoryStorage";
import { FhevmDecryptionSignature } from "@/fhevm/FhevmDecryptionSignature";
import { ethers } from "ethers";
import { CipherSatisfactionABI } from "@/abi/CipherSatisfactionABI";
import { CipherSatisfactionAddresses } from "@/abi/CipherSatisfactionAddresses";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function DashboardPage() {
  const { isConnected } = useMetaMask();
  const { ethersReadonlyProvider, ethersSigner, chainId } =
    useMetaMaskEthersSigner();
  const metaMaskForFhevm = useMetaMaskForFhevm();
  const { instance } = useFhevm({
    provider: metaMaskForFhevm.provider,
    chainId,
    enabled: isConnected,
    initialMockChains: { 31337: "http://localhost:8545" },
  });
  
  const { storage } = useInMemoryStorage();

  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedStats, setDecryptedStats] = useState<any>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isConnected && ethersReadonlyProvider && chainId) {
      loadStatistics();
    }
  }, [isConnected, ethersReadonlyProvider, chainId]);

  const loadStatistics = async () => {
    if (!ethersReadonlyProvider || !chainId) return;

    try {
      const contractAddress =
        CipherSatisfactionAddresses[
          chainId.toString() as keyof typeof CipherSatisfactionAddresses
        ]?.address;

      if (!contractAddress || contractAddress === ethers.ZeroAddress) {
        setMessage("Contract not deployed on this network");
        return;
      }

      const contract = new ethers.Contract(
        contractAddress,
        CipherSatisfactionABI.abi,
        ethersReadonlyProvider
      );

      const total = await contract.getTotalRatings();
      setTotalRatings(Number(total));
    } catch (error: any) {
      setMessage(`Error loading statistics: ${error.message}`);
    }
  };

  const handleDecrypt = async () => {
    if (!isConnected || !ethersSigner || !instance || !chainId) {
      setMessage("Please connect your wallet first");
      return;
    }

    setIsDecrypting(true);
    setMessage("");

    try {
      const contractAddress =
        CipherSatisfactionAddresses[
          chainId.toString() as keyof typeof CipherSatisfactionAddresses
        ]?.address;

      if (!contractAddress || contractAddress === ethers.ZeroAddress) {
        setMessage("Contract not deployed on this network");
        setIsDecrypting(false);
        return;
      }

      // Authorize admin to decrypt
      const contract = new ethers.Contract(
        contractAddress,
        CipherSatisfactionABI.abi,
        ethersSigner
      );

      await contract.authorizeStatisticsDecryption();

      // Get statistics
      const stats = await contract.getStatistics();

      // Decrypt encrypted statistics using FHEVM
      if (!instance) {
        throw new Error("FHEVM instance not available");
      }

      // Load or create decryption signature
      const sig = await FhevmDecryptionSignature.loadOrSign(
        instance,
        [contractAddress],
        ethersSigner,
        storage
      );

      if (!sig) {
        throw new Error("Unable to build FHEVM decryption signature");
      }

      // Decrypt each encrypted statistic
      const decryptedSumAttitude = await instance.userDecrypt(
        [{ handle: stats.sumAttitude, contractAddress }],
        sig.privateKey,
        sig.publicKey,
        sig.signature,
        sig.contractAddresses,
        sig.userAddress,
        sig.startTimestamp,
        sig.durationDays
      );

      const decryptedSumSpeed = await instance.userDecrypt(
        [{ handle: stats.sumSpeed, contractAddress }],
        sig.privateKey,
        sig.publicKey,
        sig.signature,
        sig.contractAddresses,
        sig.userAddress,
        sig.startTimestamp,
        sig.durationDays
      );

      const decryptedSumProfessionalism = await instance.userDecrypt(
        [{ handle: stats.sumProfessionalism, contractAddress }],
        sig.privateKey,
        sig.publicKey,
        sig.signature,
        sig.contractAddresses,
        sig.userAddress,
        sig.startTimestamp,
        sig.durationDays
      );

      const decryptedSumWeighted = await instance.userDecrypt(
        [{ handle: stats.sumWeightedScore, contractAddress }],
        sig.privateKey,
        sig.publicKey,
        sig.signature,
        sig.contractAddresses,
        sig.userAddress,
        sig.startTimestamp,
        sig.durationDays
      );

      const decryptedThresholdCount = await instance.userDecrypt(
        [{ handle: stats.countMeetsThreshold, contractAddress }],
        sig.privateKey,
        sig.publicKey,
        sig.signature,
        sig.contractAddresses,
        sig.userAddress,
        sig.startTimestamp,
        sig.durationDays
      );

      const total = Number(stats.totalRatings);
      const avgAttitude = total > 0 ? Number(decryptedSumAttitude[stats.sumAttitude]) / total : 0;
      const avgSpeed = total > 0 ? Number(decryptedSumSpeed[stats.sumSpeed]) / total : 0;
      const avgProfessionalism = total > 0 ? Number(decryptedSumProfessionalism[stats.sumProfessionalism]) / total : 0;
      const avgWeighted = total > 0 ? Number(decryptedSumWeighted[stats.sumWeightedScore]) / total / 100 : 0; // Divide by 100 because weighted score is multiplied by 100
      const thresholdPassRate = total > 0 ? Number(decryptedThresholdCount[stats.countMeetsThreshold]) / total * 100 : 0;

      setMessage("Decryption completed successfully");
      setDecryptedStats({
        totalRatings: total,
        averageAttitude: avgAttitude.toFixed(2),
        averageSpeed: avgSpeed.toFixed(2),
        averageProfessionalism: avgProfessionalism.toFixed(2),
        averageWeightedScore: avgWeighted.toFixed(2),
        thresholdPassRate: thresholdPassRate.toFixed(2) + "%",
      });
    } catch (error: any) {
      setMessage(`Error: ${error.message || "Failed to decrypt statistics"}`);
    } finally {
      setIsDecrypting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center p-8 bg-card rounded-2xl border shadow-lg max-w-md">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Wallet Required</h2>
          <p className="text-muted-foreground">
            Please connect your wallet to view the dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              View and decrypt aggregated statistics
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-8 bg-card rounded-2xl border shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-muted-foreground">Total Ratings</h3>
              </div>
              <p className="text-5xl font-bold text-primary">{totalRatings}</p>
            </div>
            {decryptedStats && (
              <div className="p-8 bg-card rounded-2xl border shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-muted-foreground">Threshold Pass Rate</h3>
                </div>
                <p className="text-5xl font-bold text-primary">{decryptedStats.thresholdPassRate}</p>
              </div>
            )}
          </div>

          <div className="text-center mb-8">
            <button
              onClick={handleDecrypt}
              disabled={isDecrypting || totalRatings === 0}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
            >
              {isDecrypting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Decrypting Statistics...
                </span>
              ) : (
                "🔓 Decrypt Statistics"
              )}
            </button>
          </div>

        {decryptedStats && (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-8 bg-card rounded-2xl border shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">😊</span>
                  <h3 className="text-sm font-semibold text-muted-foreground">Average Attitude</h3>
                </div>
                <p className="text-4xl font-bold text-primary mb-1">{decryptedStats.averageAttitude}</p>
                <p className="text-xs text-muted-foreground">out of 5.0</p>
              </div>
              <div className="p-8 bg-card rounded-2xl border shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">⚡</span>
                  <h3 className="text-sm font-semibold text-muted-foreground">Average Speed</h3>
                </div>
                <p className="text-4xl font-bold text-primary mb-1">{decryptedStats.averageSpeed}</p>
                <p className="text-xs text-muted-foreground">out of 5.0</p>
              </div>
              <div className="p-8 bg-card rounded-2xl border shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">💼</span>
                  <h3 className="text-sm font-semibold text-muted-foreground">Average Professionalism</h3>
                </div>
                <p className="text-4xl font-bold text-primary mb-1">{decryptedStats.averageProfessionalism}</p>
                <p className="text-xs text-muted-foreground">out of 5.0</p>
              </div>
            </div>

            {/* Weighted Score Card */}
            <div className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border-2 border-primary/20 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground">Weighted Composite Score</h3>
              </div>
              <div className="flex items-baseline gap-3">
                <p className="text-5xl font-bold text-primary">{decryptedStats.averageWeightedScore}</p>
                <p className="text-lg text-muted-foreground">out of 5.0</p>
              </div>
              <p className="text-sm text-muted-foreground mt-3 bg-background/50 p-3 rounded-lg">
                <strong>Formula:</strong> Attitude (30%) + Speed (30%) + Professionalism (40%)
              </p>
            </div>

            {/* Bar Chart for Dimension Comparison */}
            <div className="p-8 bg-card rounded-2xl border shadow-lg">
              <h3 className="text-xl font-semibold mb-6 text-foreground">Average Scores by Dimension</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={[
                    {
                      name: "Attitude",
                      score: parseFloat(decryptedStats.averageAttitude),
                      fullMark: 5,
                    },
                    {
                      name: "Speed",
                      score: parseFloat(decryptedStats.averageSpeed),
                      fullMark: 5,
                    },
                    {
                      name: "Professionalism",
                      score: parseFloat(decryptedStats.averageProfessionalism),
                      fullMark: 5,
                    },
                    {
                      name: "Weighted Score",
                      score: parseFloat(decryptedStats.averageWeightedScore),
                      fullMark: 5,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip
                    formatter={(value: number) => [`${value.toFixed(2)} / 5.0`, "Score"]}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Bar dataKey="score" fill="#8884d8">
                    {[
                      { name: "Attitude", score: parseFloat(decryptedStats.averageAttitude) },
                      { name: "Speed", score: parseFloat(decryptedStats.averageSpeed) },
                      { name: "Professionalism", score: parseFloat(decryptedStats.averageProfessionalism) },
                      { name: "Weighted Score", score: parseFloat(decryptedStats.averageWeightedScore) },
                    ].map((entry, index) => {
                      const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];
                      return <Cell key={`cell-${index}`} fill={colors[index]} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

          {message && (
            <div
              className={`p-4 rounded-xl border-2 mt-8 ${
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
  );
}

