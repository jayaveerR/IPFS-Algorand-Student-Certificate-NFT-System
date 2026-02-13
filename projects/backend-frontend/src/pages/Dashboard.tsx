import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useWallet } from '@txnlab/use-wallet-react';
import { Award, Plus, LayoutGrid, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import CertificateForm from '../components/CertificateForm';

const Dashboard: React.FC = () => {
    const { activeAddress } = useWallet();
    const [showMintForm, setShowMintForm] = useState(false);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
                <header className="mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-50 text-black rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-zinc-100">
                        <ShieldCheck size={14} />
                        Authenticated: {activeAddress?.slice(0, 6)}...{activeAddress?.slice(-4)}
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black text-black tracking-tighter mb-8 leading-[1]">
                        Academic <span className="text-[#FFD23F]">Vault</span>
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed font-medium">
                        Securely manage your immutable academic credentials. Issue, verify, and showcase your achievements with absolute cryptographic certainty.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-20">
                    <div className="lg:col-span-1 space-y-4">
                        <button
                            onClick={() => setShowMintForm(true)}
                            className="w-full bg-black text-white px-8 py-5 rounded-3xl text-sm font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-2xl shadow-black/10 flex items-center justify-between group"
                        >
                            Issue New
                            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                        </button>
                        <button className="w-full bg-zinc-50 text-black px-8 py-5 rounded-3xl text-sm font-black uppercase tracking-widest hover:bg-zinc-100 transition-all flex items-center justify-between group">
                            Collection
                            <LayoutGrid size={20} className="group-hover:scale-110 transition-transform text-zinc-400" />
                        </button>
                    </div>

                    <div className="lg:col-span-3">
                        {showMintForm ? (
                            <CertificateForm onClose={() => setShowMintForm(false)} />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-white border border-zinc-100 rounded-[2rem] p-8 hover:shadow-2xl hover:shadow-black/5 transition-all group flex flex-col h-full cursor-pointer">
                                        <div className="w-12 h-12 bg-zinc-50 text-black rounded-2xl flex items-center justify-center mb-10 group-hover:bg-[#FFD23F] transition-colors">
                                            <Award size={24} />
                                        </div>
                                        <h3 className="text-lg font-black text-black uppercase tracking-widest mb-2">CS Degree</h3>
                                        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-6 border-b border-zinc-50 pb-4">ID: #CERT-82{i}9</p>
                                        <div className="mt-auto flex items-center gap-2 text-black text-[10px] font-black uppercase tracking-widest">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                            Algorand Verified
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <footer className="pt-20 border-t border-zinc-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="flex gap-5">
                            <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center flex-shrink-0">
                                <Zap size={20} />
                            </div>
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest mb-2">High Performance</h4>
                                <p className="text-xs text-zinc-400 font-bold leading-relaxed">Instant confirmation and finality on the blockchain.</p>
                            </div>
                        </div>
                        <div className="flex gap-5">
                            <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 size={20} />
                            </div>
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest mb-2">Zero Trust</h4>
                                <p className="text-xs text-zinc-400 font-bold leading-relaxed">Mathematical proofs ensure every certificate is authentic.</p>
                            </div>
                        </div>
                        <div className="flex gap-5">
                            <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center flex-shrink-0">
                                <Award size={20} />
                            </div>
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest mb-2">Global NFT standard</h4>
                                <p className="text-xs text-zinc-400 font-bold leading-relaxed">ARC-3 compliant tokens compatible with all marketplaces.</p>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Dashboard;
