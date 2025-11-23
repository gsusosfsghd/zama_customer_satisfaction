"use client";

import dynamic from "next/dynamic";

// Dynamically import Navigation to avoid SSR issues with hooks
const Navigation = dynamic(() => import("@/components/Navigation").then(mod => ({ default: mod.Navigation })), {
  ssr: false,
});

export function ClientNavigation() {
  return <Navigation />;
}

