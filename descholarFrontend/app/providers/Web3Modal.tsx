'use client';

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { WagmiConfig } from 'wagmi';

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
    default: { http: ['https://rpc.edu-chain.raas.gelato.cloud'] },
    public: { http: ['https://rpc.edu-chain.raas.gelato.cloud'] },
  },
} as const;

const projectId = 'a4082ed5304c53cabddf695bb3c8c7ec';

const metadata = {
  name: 'Descholar',
  description: 'Decentralized Education Funding',
  url: 'https://descholar.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const wagmiConfig = defaultWagmiConfig({ 
  chains: [eduChain], 
  projectId, 
  metadata,
});

createWeb3Modal({
  wagmiConfig,
  projectId,
  defaultChain: eduChain,
  themeMode: 'dark',
});

export function Web3Modal({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>; 
} 