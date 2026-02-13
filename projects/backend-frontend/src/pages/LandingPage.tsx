import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main>
                <Hero />
            </main>
            <footer className="py-12 text-center text-slate-500 text-sm">
                <p>© 2026 CertifyChain. All rights reserved.</p>
                <div className="flex justify-center gap-6 mt-4">
                    <span>Instant Verification</span>
                    <span>Tamper Proof</span>
                    <span>Decentralized</span>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
