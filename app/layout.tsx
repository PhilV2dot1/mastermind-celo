import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

// Auto-detect production URL or use environment variable
const baseUrl = process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export const metadata: Metadata = {
  title: "Mastermind on Celo",
  description: "Crack the secret code! Play Mastermind on-chain with Celo blockchain.",
  manifest: "/manifest.json",
  openGraph: {
    title: "Mastermind on Celo",
    description: "Crack the 4-color code in 10 attempts. Play free or compete on-chain!",
    images: [{ url: `${baseUrl}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mastermind on Celo",
    description: "Crack the code on-chain with Farcaster!",
    images: [`${baseUrl}/og-image.png`],
  },
  other: {
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: `${baseUrl}/og-image.png`,
      button: {
        title: "Play Mastermind",
        action: {
          type: "launch_miniapp",
          name: "Mastermind on Celo",
          url: baseUrl,
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gradient-to-br from-gray-100 via-gray-50 to-yellow-50/20 min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
