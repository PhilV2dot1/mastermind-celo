"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { motion } from "framer-motion";
import { useFarcaster } from "./providers";

const CONNECTOR_ICONS: Record<string, string> = {
  "Farcaster Wallet": "🔵",
  "WalletConnect": "🔗",
  "MetaMask": "🦊",
  "Browser Wallet": "💼",
};

const CONNECTOR_DESCRIPTIONS: Record<string, string> = {
  "Farcaster Wallet": "Connect with your Farcaster wallet",
  "WalletConnect": "Connect with any mobile wallet",
  "MetaMask": "Connect with MetaMask",
  "Browser Wallet": "Connect with your browser wallet",
};

export function WalletConnect() {
  const { address, isConnected, connector: activeConnector } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { isInFarcaster, isSDKReady } = useFarcaster();

  // Filter connectors based on context
  const availableConnectors = connectors.filter((connector) => {
    // If not in Farcaster, hide Farcaster connector
    if (connector.name === "Farcaster Wallet" && !isInFarcaster) {
      return false;
    }
    return true;
  });

  if (isConnected && address) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-sm border border-celo-yellow rounded-lg p-3 flex items-center justify-between shadow-sm"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <div className="flex flex-col">
            <span className="font-mono text-xs sm:text-sm font-semibold text-gray-800">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
            {activeConnector && (
              <span className="text-xs text-gray-600">
                via {activeConnector.name}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => disconnect()}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors text-xs sm:text-sm font-semibold touch-target"
          aria-label="Disconnect wallet"
        >
          Disconnect
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-celo-yellow rounded-lg p-3 sm:p-4 shadow-sm">
      <p className="text-xs sm:text-sm mb-3 text-center text-gray-900 font-semibold">
        Connect your wallet to play on-chain
      </p>

      {error && (
        <div className="mb-2 p-2 bg-red-50 border border-red-300 rounded-lg text-xs text-red-700">
          {error.message}
        </div>
      )}

      {isInFarcaster && !isSDKReady && (
        <div className="mb-2 p-2 bg-yellow-50 border border-yellow-300 rounded-lg text-xs text-yellow-700">
          Farcaster SDK not ready. Some features may not work.
        </div>
      )}

      <div className="flex flex-col gap-2">
        {availableConnectors.map((connector) => {
          const icon = CONNECTOR_ICONS[connector.name] || "🔗";
          const description = CONNECTOR_DESCRIPTIONS[connector.name] || `Connect with ${connector.name}`;

          return (
            <motion.button
              key={connector.uid}
              whileTap={{ scale: 0.98 }}
              onClick={() => connect({ connector })}
              disabled={isPending}
              className="flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-lg font-semibold transition-all bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:opacity-50 disabled:cursor-not-allowed touch-target shadow-sm"
              aria-label={description}
            >
              {isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs sm:text-sm">Connecting...</span>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{icon}</span>
                    <span className="text-sm">{connector.name}</span>
                  </div>
                  <span className="text-xs text-purple-100">{description}</span>
                </>
              )}
            </motion.button>
          );
        })}
      </div>

      {availableConnectors.length === 0 && (
        <div className="text-center text-xs sm:text-sm text-gray-600 py-4">
          No wallet connectors available
        </div>
      )}
    </div>
  );
}
