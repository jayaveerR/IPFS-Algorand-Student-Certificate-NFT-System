import React, { useState, useEffect } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Copy, ChevronDown, Check, Layout, Search, Bell } from 'lucide-react';
import ConnectWallet from './ConnectWallet';

const Navbar: React.FC = () => {
    const { activeAddress, wallets } = useWallet();
    const navigate = useNavigate();
    const location = useLocation();
    const [showWalletModal, setShowWalletModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (activeAddress && location.pathname === '/') {
            navigate('/Home');
        } else if (!activeAddress && location.pathname === '/Home') {
            navigate('/');
        }
    }, [activeAddress, location.pathname, navigate]);

    const copyAddress = () => {
        if (activeAddress) {
            navigator.clipboard.writeText(activeAddress);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-md border-b border-zinc-100 h-20">
                <div className="max-w-7xl mx-auto px-6 md:px-12 h-full flex items-center justify-between">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                        <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center text-white transition-all group-hover:rotate-3 shadow-lg shadow-black/5">
                            <Layout size={18} strokeWidth={2.5} />
                        </div>
                        <span className="text-lg font-black tracking-tighter text-black uppercase">CertifyChain</span>
                    </div>

                    {/* Center: Navigation Links */}
                    <div className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
                        <button
                            onClick={() => navigate('/')}
                            className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${location.pathname === '/' ? 'text-black' : 'text-zinc-400 hover:text-black'}`}
                        >
                            Home
                        </button>
                        <button className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] hover:text-black transition-all">
                            Docs
                        </button>
                        <button className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] hover:text-black transition-all">
                            Verify
                        </button>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-1 mr-2 border-r border-zinc-100 pr-4">
                            <button aria-label="Search" className="p-2 text-zinc-400 hover:text-black transition-all">
                                <Search size={16} />
                            </button>
                            <button aria-label="Notifications" className="p-2 text-zinc-400 hover:text-black transition-all relative">
                                <Bell size={16} />
                                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#FFD23F] rounded-full ring-2 ring-white" />
                            </button>
                        </div>

                        {!activeAddress ? (
                            <button
                                onClick={() => setShowWalletModal(true)}
                                className="bg-black text-white px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-zinc-800 transition-all shadow-lg shadow-black/5 active:scale-95 whitespace-nowrap"
                            >
                                Connect
                            </button>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center gap-3 pl-3 pr-2 py-1.5 bg-zinc-50 border border-zinc-100 rounded-full hover:border-black transition-all group"
                                >
                                    <span className="text-[10px] font-bold text-black hidden sm:inline ml-2 uppercase tracking-tighter">
                                        {activeAddress.slice(0, 4)}...{activeAddress.slice(-4)}
                                    </span>
                                    <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center text-white text-[9px] font-black uppercase">
                                        {activeAddress.slice(0, 2).toUpperCase()}
                                    </div>
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 mt-4 w-60 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-zinc-100 p-3 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="px-4 py-3 mb-2 bg-zinc-50 rounded-xl">
                                            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Account</p>
                                            <p className="text-[11px] font-bold text-black truncate">{activeAddress}</p>
                                        </div>
                                        <button
                                            onClick={copyAddress}
                                            className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 rounded-xl flex items-center justify-between text-black transition-all"
                                        >
                                            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
                                                <Copy size={14} className="text-zinc-400" />
                                                <span>Copy</span>
                                            </div>
                                            {copied && <Check size={14} className="text-emerald-500" />}
                                        </button>
                                        <div className="h-[1px] bg-zinc-100 my-2" />
                                        <button
                                            onClick={async () => {
                                                if (wallets) {
                                                    const activeWallet = wallets.find((w) => w.isActive)
                                                    if (activeWallet) {
                                                        await activeWallet.disconnect();
                                                        setShowDropdown(false);
                                                    }
                                                }
                                            }}
                                            className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest"
                                        >
                                            <LogOut size={14} />
                                            <span>Disconnect</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            {/* Modal should be rendered outside the fixed nav flow but handled here */}
            <ConnectWallet
                openModal={showWalletModal}
                closeModal={() => setShowWalletModal(false)}
            />
        </>
    );
};

export default Navbar;
