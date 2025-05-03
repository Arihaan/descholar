'use client';

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { WagmiConfig, createConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

// EDU Chain configuration
const eduChain = {
  id: 41923,
  name: 'EDU Chain',
  network: 'educhain',
  nativeCurrency: {
    decimals: 18,
    name: 'EDU',
    symbol: 'EDU',
  },
  rpcUrls: {
    default: { http: ['https://rpc.edu-chain.raas.gelato.cloud	'] },
    public: { http: ['https://rpc.edu-chain.raas.gelato.cloud	'] },
  },
} as const;

const config = createConfig(
  getDefaultConfig({
    chains: [eduChain],
    walletConnectProjectId: 'a4082ed5304c53cabddf695bb3c8c7ec',
    appName: "Descholar",
  })
);

const queryClient = new QueryClient();

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <Navbar />
          {children}
          <Footer />
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
} 