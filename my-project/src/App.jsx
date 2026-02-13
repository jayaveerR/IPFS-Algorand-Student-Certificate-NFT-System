import { useEffect, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { PeraWalletConnect } from '@perawallet/connect';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Home from './pages/Home';
import MintCertificate from './pages/MintCertificate';
import { mintNFT, sendSignedTransaction } from './utils/algorand';
import './App.css';

// Create the PeraWalletConnect instance outside of the component lifecycle
const peraWallet = new PeraWalletConnect();

function AppContent() {
  const [accountAddress, setAccountAddress] = useState(null);
  const [isloaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  const handleDisconnectWallet = useCallback(() => {
    peraWallet.disconnect();
    setAccountAddress(null);
    navigate('/');
  }, [navigate]);

  const handleConnectWallet = useCallback(() => {
    peraWallet
      .connect()
      .then((newAccounts) => {
        peraWallet.connector?.on("disconnect", handleDisconnectWallet);
        setAccountAddress(newAccounts[0]);
        navigate('/Home');
      })
      .catch((error) => {
        // Ignore modal closed error
        if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
          console.error(error);
        }
      });
  }, [navigate, handleDisconnectWallet]);

  useEffect(() => {
    // Reconnect to the session when the component mounts
    peraWallet.reconnectSession().then((accounts) => {
      peraWallet.connector?.on("disconnect", handleDisconnectWallet);

      if (accounts.length) {
        setAccountAddress(accounts[0]);
        // If we are at root and connected, go to Home
        if (window.location.pathname === '/') {
          navigate('/Home');
        }
      }
      setIsLoaded(true);
    }).catch((e) => {
      console.error(e);
      setIsLoaded(true);
    });

    // Cleanup listeners
    return () => {
      if (peraWallet.connector) {
        peraWallet.connector.off("disconnect");
      }
    }
  }, [navigate, handleDisconnectWallet]);

  useEffect(() => {
    const handleMintRequest = async (event) => {
      const { metadataCID } = event.detail;
      if (!accountAddress) return;

      try {
        // 1. Create Transaction
        const txn = await mintNFT(accountAddress, metadataCID);

        // 2. Group & Sign
        const singleTxnGroups = [{ txn: txn, signers: [accountAddress] }];
        const signedTxns = await peraWallet.signTransaction([singleTxnGroups]);

        // 3. Send
        const { assetIndex } = await sendSignedTransaction(signedTxns);

        alert(`Minted Successfully! Asset ID: ${assetIndex}`);
        navigate('/Home');
      } catch (error) {
        console.error("Minting failed", error);
        alert("Minting failed. See console.");
      }
    };

    window.addEventListener('mint-request', handleMintRequest);
    return () => {
      window.removeEventListener('mint-request', handleMintRequest);
    }
  }, [accountAddress, navigate]);

  if (!isloaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <>
      <Navbar
        accountAddress={accountAddress}
        handleConnectWallet={handleConnectWallet}
        handleDisconnectWallet={handleDisconnectWallet}
      />
      <Routes>
        <Route path="/" element={
          accountAddress ? <Navigate to="/Home" replace /> : <Login handleConnectWallet={handleConnectWallet} />
        } />
        <Route path="/Home" element={
          accountAddress ? <Home accountAddress={accountAddress} /> : <Navigate to="/" replace />
        } />
        <Route path="/mint" element={
          accountAddress ? <MintCertificate accountAddress={accountAddress} /> : <Navigate to="/" replace />
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
