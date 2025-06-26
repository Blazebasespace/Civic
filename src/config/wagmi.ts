import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { baseSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'CivicKernel',
  projectId: 'b9b475504bcac1ad8a9ad04968843361',
  chains: [baseSepolia],
  ssr: false,
});