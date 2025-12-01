import type { Metadata } from "next";
import "./globals.css";
import { ClientWrapper } from "./ClientWrapper";

export const metadata: Metadata = {
  title: "CipherSatisfaction - Anonymous Customer Satisfaction Rating",
  description: "Submit your feedback with complete anonymity using FHE encryption",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}

