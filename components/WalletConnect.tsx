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

interface WalletConnectProps {
  mode?: 'free' | 'onchain';
  hasActiveOnChainGame?: boolean;
  onPlayOnChain?: () => void;
  onAbandonGame?: () => void;
  gameIsPending?: boolean;
  abandonPending?: boolean;
}

export function WalletConnect({ mode, hasActiveOnChainGame, onPlayOnChain, onAbandonGame, gameIsPending, abandonPending }: WalletConnectProps = {}) {
  const { address, isConnected, connector: activeConnector } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { isInFarcaster, isSDKReady } = useFarcaster();

  // Filter and prioritize connectors based on context
  const availableConnectors = connectors
    .filter((connector) => {
      // If not in Farcaster, hide Farcaster connector
      if (connector.name === "Farcaster Wallet" && !isInFarcaster) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      // Prioritize Farcaster Wallet when in mini-app
      if (isInFarcaster) {
        if (a.name === "Farcaster Wallet") return -1;
        if (b.name === "Farcaster Wallet") return 1;
      }
      return 0;
    });

  if (isConnected && address) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-celo-yellow/30 to-gray-100 border-2 border-celo-yellow rounded-xl p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <div className="flex flex-col">
              <span className="font-mono text-sm font-semibold text-gray-800">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              {activeConnector && (
                <span className="text-xs text-gray-600">
                  via {activeConnector.name}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => disconnect()}
            className="flex-1 px-3 py-2 min-h-[44px] bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-xs font-semibold touch-manipulation"
            aria-label="Change wallet"
          >
            🔄 Change
          </button>
          <button
            onClick={() => disconnect()}
            className="flex-1 px-3 py-2 min-h-[44px] bg-gray-700 hover:bg-gray-800 active:bg-gray-900 text-white rounded-lg transition-colors text-xs font-semibold touch-manipulation"
            aria-label="Disconnect wallet"
          >
            Disconnect
          </button>
        </div>

        {/* Abandon Game UI - shown when active game exists */}
        {mode === 'onchain' && hasActiveOnChainGame && onAbandonGame && (
          <div className="bg-orange-50 border-2 border-orange-400 rounded-lg p-3 mb-3">
            <p className="text-orange-800 text-xs font-semibold mb-1">
              ⚠️ Active on-chain game detected
            </p>
            <p className="text-orange-700 text-xs mb-2">
              Abandon incomplete game to start fresh.
            </p>
            <button
              onClick={onAbandonGame}
              disabled={abandonPending}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transform hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {abandonPending ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Abandoning...</span>
                </div>
              ) : (
                'ABANDON GAME'
              )}
            </button>
          </div>
        )}

        {/* START GAME button for on-chain mode when no active game */}
        {mode === 'onchain' && !hasActiveOnChainGame && onPlayOnChain && (
          <button
            onClick={onPlayOnChain}
            disabled={gameIsPending}
            className="w-full bg-gradient-to-r from-celo-yellow to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{ boxShadow: "0 0 0 2px #FCFF52, 0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
          >
            {gameIsPending ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                <span>Starting...</span>
              </div>
            ) : (
              <>🎲 START GAME (0.01 CELO)</>
            )}
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-celo-yellow rounded-xl p-4">
      <p className="text-sm sm:text-base mb-3 text-center text-white font-semibold">
        Connect your wallet to play on-chain
      </p>

      {error && (
        <div className="mb-3 p-2 bg-red-100 border border-red-300 rounded-lg text-xs text-red-700">
          {error.message}
        </div>
      )}

      {isInFarcaster && !isSDKReady && (
        <div className="mb-3 p-2 bg-yellow-100 border border-yellow-300 rounded-lg text-xs text-yellow-700">
          Farcaster SDK not ready. Some features may not work.
        </div>
      )}

      <div className="flex flex-col gap-3">
        {availableConnectors.map((connector) => {
          const icon = CONNECTOR_ICONS[connector.name] || "🔗";
          const description = CONNECTOR_DESCRIPTIONS[connector.name] || `Connect with ${connector.name}`;

          return (
            <motion.button
              key={connector.uid}
              whileTap={{ scale: 0.98 }}
              onClick={() => connect({ connector })}
              disabled={isPending}
              className="flex flex-col items-center justify-center gap-1 px-6 py-4 min-h-[56px] rounded-xl font-semibold transition-all bg-gradient-to-r from-celo-yellow to-yellow-300 hover:from-yellow-300 hover:to-celo-yellow active:scale-95 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              aria-label={description}
            >
              {isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Connecting...</span>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{icon}</span>
                    <span>{connector.name}</span>
                  </div>
                  <span className="text-xs text-gray-700">{description}</span>
                </>
              )}
            </motion.button>
          );
        })}
      </div>

      {availableConnectors.length === 0 && (
        <div className="text-center text-sm text-gray-300 py-4">
          No wallet connectors available
        </div>
      )}
    </div>
  );
}
