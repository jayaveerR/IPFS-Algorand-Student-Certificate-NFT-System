import React from 'react';
import { ShieldCheck, GraduationCap, CheckCircle } from 'lucide-react';

const Login = ({ handleConnectWallet }) => {
    return (
        <div className="relative min-h-screen bg-slate-50 flex items-center justify-center overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full bg-grid-indigo-50 bg-size-[4rem_4rem] mask-[radial-gradient(transparent,white)] pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-200 rounded-full blur-[128px] opacity-20 animate-pulse"></div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8">
                <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 shadow-sm mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <ShieldCheck size={16} className="text-indigo-600" />
                    <span className="text-sm font-medium text-indigo-900">Secure & Verified Certificates</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                    Student Certification <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">Reimagined on Blockchain</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    Connect your <span className="font-semibold text-slate-900">Pera Wallet</span> to access our decentralized certificate verification system powered by Algorand blockchain. Secure, transparent, and tamper-proof academic credentials.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                    <button
                        onClick={handleConnectWallet}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl text-lg font-semibold shadow-xl shadow-indigo-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2 w-full sm:w-auto justify-center"
                    >
                        Connect Pera Wallet
                    </button>
                    <button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-3.5 rounded-xl text-lg font-medium transition-all hover:border-slate-300 w-full sm:w-auto">
                        Learn More →
                    </button>
                </div>

                <div className="flex justify-center gap-8 pt-12 text-slate-400 text-sm">
                    <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        <span>Instant Verification</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        <span>Tamper Proof</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        <span>Decentralized</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
