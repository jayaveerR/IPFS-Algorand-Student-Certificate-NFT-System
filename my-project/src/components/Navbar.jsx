import React, { useState } from 'react';
import { LogOut, Check, Wallet, Copy, ChevronDown } from 'lucide-react';

const Navbar = ({ accountAddress, handleConnectWallet, handleDisconnectWallet }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

    const formatAddress = (addr) => {
        if (!addr) return '';
        return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
    };

    const copyAddress = async () => {
        if (accountAddress) {
            try {
                await navigator.clipboard.writeText(accountAddress);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy!', err);
            }
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="flex items-center gap-3">
                <div className="bg-linear-to-br from-indigo-600 to-purple-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                    <span className="text-white font-bold text-xl">C</span>
                </div>
                <span className="text-xl font-bold text-slate-800 tracking-tight">CertifyChain</span>
            </div>

            <div className="relative">
                {accountAddress ? (
                    <div className="relative">
                        <button
                            className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all text-gray-700 font-medium active:scale-95"
                            onClick={toggleDropdown}
                        >
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="font-mono text-sm">{formatAddress(accountAddress)}</span>
                            <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 context-menu origin-top-right z-50">
                                <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Connected Wallet</p>
                                    <p className="text-sm font-medium text-gray-900 truncate">{formatAddress(accountAddress)}</p>
                                </div>
                                <button
                                    onClick={copyAddress}
                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-indigo-600 flex items-center gap-3 transition-colors"
                                >
                                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                    {copied ? 'Copied!' : 'Copy Address'}
                                </button>
                                <button
                                    onClick={() => {
                                        handleDisconnectWallet();
                                        setIsDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors mt-1"
                                >
                                    <LogOut size={16} /> Disconnect Wallet
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={handleConnectWallet}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-200 active:scale-95"
                    >
                        <Wallet size={18} />
                        Connect Wallet
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
