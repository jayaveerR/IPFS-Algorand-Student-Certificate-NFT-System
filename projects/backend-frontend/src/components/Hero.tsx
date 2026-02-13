import React from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import { ArrowRight, History, Shield, Library } from 'lucide-react';

const Hero: React.FC = () => {
    const { activeAddress } = useWallet();

    return (
        <section className="relative px-6 pt-32 pb-48 overflow-hidden bg-white">
            <div className="relative max-w-6xl mx-auto text-center z-10">
                <div className="inline-flex items-center gap-2 px-5 py-2 bg-zinc-50 text-zinc-400 rounded-full text-[10px] font-bold uppercase tracking-[0.25em] mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <Shield size={12} className="text-black" />
                    Verified Academic Excellence
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black tracking-tight mb-8 leading-[1.1]">
                    Building Your <br />
                    <span className="text-[#FFD23F]">Academic Legacy</span> <br />
                    On Blockchain
                </h1>

                <p className="text-base md:text-lg text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                    Effortlessly create, manage, and verify your student achievements.
                    A secure certification system powered by <span className="text-black font-semibold underline decoration-[#FFD23F] decoration-2 underline-offset-4">Algorand</span> for the future of education.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24">
                    <button className="bg-black text-white h-14 px-8 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-black/10 flex items-center gap-3 group">
                        Get Started
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="border-2 border-zinc-100 text-black h-14 px-8 rounded-xl text-sm font-bold uppercase tracking-widest hover:border-black transition-all flex items-center gap-3">
                        Sample Certificate
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-zinc-300 font-bold text-[10px] uppercase tracking-[0.3em]">
                    <div className="flex flex-col items-center gap-4 group cursor-default">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-[#FFD23F] group-hover:text-black transition-all duration-500">
                            <Shield size={20} />
                        </div>
                        <span>SECURE</span>
                    </div>
                    <div className="flex flex-col items-center gap-4 group cursor-default">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-[#FFD23F] group-hover:text-black transition-all duration-500">
                            <History size={20} />
                        </div>
                        <span>IMMUTABLE</span>
                    </div>
                    <div className="flex flex-col items-center gap-4 group cursor-default">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-[#FFD23F] group-hover:text-black transition-all duration-500">
                            <Library size={20} />
                        </div>
                        <span>OPEN</span>
                    </div>
                </div>
            </div>

            {/* Subtle Background Decoration */}
            <div className="absolute top-0 right-0 w-1/4 h-full bg-zinc-50/50 -skew-x-12 translate-x-1/2 -z-10" />
            <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-[#FFD23F]/5 skew-x-12 -translate-x-1/2 -z-10 rounded-full blur-3xl" />
        </section>
    );
};

export default Hero;
