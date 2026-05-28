import { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  connectWallet,
  getBalance,
} from "../utils/contract.js";

const Web3Context = createContext(null);

export function Web3Provider({ children }) {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshBalance = useCallback(async () => {
    if (!address) {
      setBalance("");
      return;
    }
    try {
      const b = await getBalance(address);
      setBalance(b);
    } catch (e) {
      setBalance("—");
    }
  }, [address]);

  const connect = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const { address: addr } = await connectWallet();
      setAddress(addr);
      const b = await getBalance(addr);
      setBalance(b);
    } catch (e) {
      setError(e?.message || "Failed to connect");
      setAddress("");
      setBalance("");
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress("");
    setBalance("");
    setError("");
  }, []);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  // F2: Listen for MetaMask account and chain changes
  useEffect(() => {
    const eth = window?.ethereum;
    if (!eth) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        // User disconnected from MetaMask
        setAddress("");
        setBalance("");
      } else {
        const newAddr = accounts[0];
        setAddress(newAddr);
        getBalance(newAddr).then(setBalance).catch(() => setBalance("—"));
      }
    };

    const handleChainChanged = () => {
      // Reload balance on chain switch
      if (address) {
        getBalance(address).then(setBalance).catch(() => setBalance("—"));
      }
    };

    eth.on("accountsChanged", handleAccountsChanged);
    eth.on("chainChanged", handleChainChanged);

    // Auto-reconnect if MetaMask was previously connected
    eth.request({ method: "eth_accounts" }).then((accounts) => {
      if (accounts.length > 0 && !address) {
        setAddress(accounts[0]);
        getBalance(accounts[0]).then(setBalance).catch(() => setBalance("—"));
      }
    }).catch(() => {});

    return () => {
      eth.removeListener("accountsChanged", handleAccountsChanged);
      eth.removeListener("chainChanged", handleChainChanged);
    };
  }, [address]);

  const value = {
    address,
    balance,
    loading,
    error,
    connect,
    disconnect,
    refreshBalance,
    isConnected: !!address,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const ctx = useContext(Web3Context);
  if (!ctx) throw new Error("useWeb3 must be used within Web3Provider");
  return ctx;
}
