import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: "Mastermind on Celo",
  description: "Crack the secret code! Play Mastermind on-chain with Celo blockchain.",
  manifest: "/manifest.json",
  openGraph: {
    title: "Mastermind on Celo",
    description: "Crack the 4-color code in 10 attempts. Play free or compete on-chain!",
    url: baseUrl,
    siteName: "Mastermind on Celo",
    type: "website",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Mastermind on Celo - Crack the Code",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mastermind on Celo",
    description: "Crack the code on-chain with Farcaster!",
    images: [`${baseUrl}/og-image.png`],
  },
  other: {
    // Farcaster Frame tags
    "fc:frame": "vNext",
    "fc:frame:image": `${baseUrl}/og-image.png`,
    "fc:frame:image:aspect_ratio": "1.91:1",
    "fc:frame:button:1": "Play Mastermind",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": baseUrl,
    // Farcaster Mini-app
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
