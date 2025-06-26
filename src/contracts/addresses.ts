// Base Sepolia testnet contract addresses
export const CONTRACT_ADDRESSES = {
  CIVIC_ID: '0x1234567890123456789012345678901234567890', // Replace with actual deployed address
  GOVERNANCE: '0x2345678901234567890123456789012345678901', // Replace with actual deployed address
  CIVIC_TOKEN: '0x3456789012345678901234567890123456789012', // Replace with actual deployed address
  PARTICIPATION_TRACKER: '0x4567890123456789012345678901234567890123', // Replace with actual deployed address
} as const;

export const CHAIN_CONFIG = {
  id: 84532, // Base Sepolia
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://sepolia.base.org'] },
    default: { http: ['https://sepolia.base.org'] },
  },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://sepolia.basescan.org' },
  },
  testnet: true,
} as const;