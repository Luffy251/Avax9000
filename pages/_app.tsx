import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig, Chain } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

const etnaChain: Chain = {
  id: 43117,
  name: 'Etna C-Chain',
  network: 'etna',
  nativeCurrency: {
    decimals: 18,
    name: 'Avalanche',
    symbol: 'AVAX',
  },
  rpcUrls: {
    default: { http: ['https://etna.avax-dev.network/ext/bc/C/rpc'] },
    public: { http: ['https://etna.avax-dev.network/ext/bc/C/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Etna Explorer', url: 'https://etna.avax-dev.network' },
  },
  testnet: true,
};

const { chains, publicClient } = configureChains(
  [etnaChain],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Betting DApp',
  projectId: 'cfcfff3713397dd7fc0883ae81502256',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;