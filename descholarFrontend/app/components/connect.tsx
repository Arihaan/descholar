"use client";
import React, { useState, useEffect } from "react";
import { kit } from "../stellar-wallets-kit";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectKitButton } from "connectkit";
import { useAccount } from 'wagmi';

interface WalletState {
  stellar: boolean;
  stellarAddress?: string;
  eduChain: boolean;
  eduAddress?: string;
}

function EduChainButton() {
  const { address, isConnected } = useAccount();
  
  return (
    <ConnectKitButton.Custom>
      {({ show }) => (
        <button 
          onClick={show}
          className="w-full h-12 rounded-xl transition-colors flex items-center justify-between group relative overflow-hidden"
          style={{
            background: `linear-gradient(rgba(31, 41, 55, 0.9), rgba(31, 41, 55, 0.9)), url('/resources/EDUChainLogo.png')`,
            backgroundSize: 'auto 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: '0.75rem 1rem',
          }}
        >
          <div className="flex items-center gap-3 z-10">
            <span className="text-gray-300 group-hover:text-white text-sm">
              {isConnected && address 
                ? `${address.slice(0, 4)}...${address.slice(-4)}`
                : 'EDU Chain Wallet'
              }
            </span>
          </div>
          {isConnected && (
            <span className="text-green-500 z-10">✓</span>
          )}
          <div className="absolute inset-0 bg-gray-700 opacity-0 group-hover:opacity-20 transition-opacity duration-200" />
        </button>
      )}
    </ConnectKitButton.Custom>
  );
}

export function ConnectButton({ label = "Connect Wallet" }) {
  const [walletState, setWalletState] = useState<WalletState>({
    stellar: false,
    eduChain: false,
  });
  const [isOpen, setIsOpen] = useState(false);
  const { address, isConnected } = useAccount();

  // Update EDU Chain state
  useEffect(() => {
    setWalletState(prev => ({
      ...prev,
      eduChain: isConnected,
      eduAddress: address,
    }));
  }, [isConnected, address]);

  const connectedCount = (walletState.stellar ? 1 : 0) + (walletState.eduChain ? 1 : 0);

  const connectStellar = async () => {
    try {
      // Check for saved address first
      const savedAddress = localStorage.getItem('stellarAddress');
      if (savedAddress) {
        try {
          const { address } = await kit.getAddress();
          if (address === savedAddress) {
            setWalletState(prev => ({
              ...prev,
              stellar: true,
              stellarAddress: address
            }));
            setIsOpen(false);
            return;
          }
        } catch (error) {
          console.error("Error reconnecting Stellar wallet:", error);
          localStorage.removeItem('stellarAddress');
        }
      }

      // If no saved address or reconnection failed, open modal
      const { kit: stellarKit } = await import("../stellar-wallets-kit");
      await stellarKit.openModal({
        onWalletSelected: async () => {
          try {
            const { address } = await stellarKit.getAddress();
            if (address) {
              localStorage.setItem('stellarAddress', address);
              setWalletState(prev => ({ 
                ...prev,
                stellar: true,
                stellarAddress: address
              }));
              setIsOpen(false);
            }
          } catch (error) {
            console.error("Error getting Stellar address:", error);
          }
        },
      });
    } catch (error) {
      console.error("Error connecting Stellar wallet:", error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold rounded-xl transition-all duration-200"
      >
        {connectedCount > 0 
          ? `${connectedCount} Wallet${connectedCount > 1 ? 's' : ''} Connected`
          : label}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 mt-4 p-4 w-80 rounded-2xl bg-gray-900 bg-opacity-90 backdrop-blur-sm shadow-xl border border-gray-700 z-50"
            >
              <h3 className="text-lg font-semibold text-white mb-4 text-center">
                Connect Wallet
              </h3>
              <div className="space-y-3">
                <button
                  onClick={connectStellar}
                  className="w-full h-12 rounded-xl transition-colors flex items-center justify-between group relative overflow-hidden"
                  style={{
                    background: `linear-gradient(rgba(31, 41, 55, 0.9), rgba(31, 41, 55, 0.9)), url('/resources/StellarChainLogo.png')`,
                    backgroundSize: 'auto 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    padding: '0.75rem 1rem',
                  }}
                >
                  <div className="flex items-center gap-3 z-10">
                    <span className="text-gray-300 group-hover:text-white text-sm">
                      {walletState.stellar 
                        ? `${walletState.stellarAddress?.slice(0, 4)}...${walletState.stellarAddress?.slice(-4)}`
                        : 'Stellar Wallet'
                      }
                    </span>
                  </div>
                  {walletState.stellar && (
                    <span className="text-green-500 z-10">✓</span>
                  )}
                  <div className="absolute inset-0 bg-gray-700 opacity-0 group-hover:opacity-20 transition-opacity duration-200" />
                </button>

                <EduChainButton />
              </div>

              <p className="text-xs text-gray-400 mt-4 text-center">
                Connect your wallet to interact with the platform
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}