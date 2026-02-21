'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WalletState, WalletContextType } from '@/types/wallet';
import * as freighter from '@stellar/freighter-api';
import { Horizon } from '@stellar/stellar-sdk';

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const horizonUrl = process.env.NEXT_PUBLIC_HORIZON_URL || 'https://horizon-testnet.stellar.org';
const server = new Horizon.Server(horizonUrl);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    publicKey: null,
    balance: null,
    isLoading: false,
    error: null,
  });

  const connectWallet = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const isAllowed = await freighter.isConnected();
      if (!isAllowed) {
        throw new Error('Freighter wallet is not installed or not connected');
      }

      const publicKey = await freighter.getPublicKey();
      
      if (!publicKey) {
        throw new Error('Failed to get public key from wallet');
      }

      setState(prev => ({
        ...prev,
        isConnected: true,
        publicKey,
        isLoading: false,
      }));

      await getBalanceForPublicKey(publicKey);
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to connect wallet',
      }));
    }
  };

  const disconnectWallet = () => {
    setState({
      isConnected: false,
      publicKey: null,
      balance: null,
      isLoading: false,
      error: null,
    });
  };

  const getBalanceForPublicKey = async (publicKey: string) => {
    try {
      const account = await server.loadAccount(publicKey);
      const balance = account.balances
        .filter((balance: any) => balance.asset_type === 'native')
        .map((balance: any) => balance.balance)
        .join('');

      setState(prev => ({
        ...prev,
        balance: balance || '0',
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch balance',
      }));
    }
  };

  const getBalance = async () => {
    if (state.publicKey) {
      await getBalanceForPublicKey(state.publicKey);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isAllowed = await freighter.isConnected();
        if (isAllowed) {
          const publicKey = await freighter.getPublicKey();
          if (publicKey) {
            setState(prev => ({
              ...prev,
              isConnected: true,
              publicKey,
            }));
            await getBalanceForPublicKey(publicKey);
          }
        }
      } catch (error) {
        console.log('No existing wallet connection found');
      }
    };

    checkConnection();
  }, []);

  const value: WalletContextType = {
    ...state,
    connectWallet,
    disconnectWallet,
    getBalance,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
