"use client";

import dynamic from "next/dynamic";
import { Providers } from "./providers";

// Dynamically import Navigation to avoid SSR issues with hooks
const Navigation = dynamic(() => import("@/components/Navigation").then(mod => ({ default: mod.Navigation })), {
  ssr: false,
});

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Navigation />
      <main className="min-h-screen">{children}</main>
    </Providers>
  );
}

