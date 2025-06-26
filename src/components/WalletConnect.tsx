import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Wallet } from 'lucide-react';

const WalletConnect: React.FC = () => {
  const { isConnected } = useAccount();

  if (isConnected) {
    return <ConnectButton />;
  }

  return (
    <ConnectButton.Custom>
      {({ openConnectModal }) => (
        <button
          onClick={openConnectModal}
          className="flex items-center space-x-2 px-4 py-2 bg-civic-500 text-white rounded-lg hover:bg-civic-600 transition-colors font-medium"
        >
          <Wallet className="w-4 h-4" />
          <span>Connect Wallet</span>
        </button>
      )}
    </ConnectButton.Custom>
  );
};

export default WalletConnect;