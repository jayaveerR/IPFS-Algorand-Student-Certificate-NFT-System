import React from 'react';
import { Award, Layers, PlusCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = ({ accountAddress }) => {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 px-4 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100 rounded-full blur-[128px] -z-10 animate-pulse"></div>

            <div className="max-w-6xl mx-auto space-y-12">
                <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 shadow-sm text-sm font-medium text-indigo-900 mx-auto">
                        <span>👋 Welcome Back, {accountAddress ? `${accountAddress.slice(0, 6)}...${accountAddress.slice(-4)}` : 'Guest'}</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
                        Your Certificate <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">Dashboard</span>
                    </h1>

                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Manage and verify your blockchain certificates with confidence. Create, view, and share your academic achievements securely on the Algorand network.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
                        <Link to="/mint" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-semibold shadow-xl shadow-indigo-200 transition-all hover:-translate-y-1 active:scale-95">
                            <PlusCircle size={20} />
                            Issue New Certificate
                        </Link>
                        <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-indigo-600 border border-indigo-100 px-8 py-3.5 rounded-xl font-medium transition-all hover:border-indigo-200">
                            <Layers size={20} />
                            NFT Mint
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Award size={24} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Completion Certificate</h3>
                            <p className="text-slate-500 text-sm mb-4">Verification ID: #ABCD-{item}XYZ</p>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <span className="text-xs font-mono text-slate-400">Verified on Chain</span>
                                <CheckCircle size={16} className="text-green-500" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
