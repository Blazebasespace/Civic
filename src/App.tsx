import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { config } from './config/wagmi';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Governance from './pages/Governance';
import Identity from './pages/Identity';
import Participation from './pages/Participation';
import Economy from './pages/Economy';
import Analytics from './pages/Analytics';
import AIGovernor from './pages/AIGovernor';
import CitizenForum from './pages/CitizenForum';
import GlobalNetwork from './pages/GlobalNetwork';

import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/app" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="governance" element={<Governance />} />
                <Route path="identity" element={<Identity />} />
                <Route path="participation" element={<Participation />} />
                <Route path="economy" element={<Economy />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="ai-governor" element={<AIGovernor />} />
                <Route path="citizen-forum" element={<CitizenForum />} />
                <Route path="global-network" element={<GlobalNetwork />} />
              </Route>
            </Routes>
          </Router>
          <Toaster position="top-right" />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;