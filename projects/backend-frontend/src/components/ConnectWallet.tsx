import { useWallet, Wallet, WalletId } from '@txnlab/use-wallet-react'
import { X, Wallet as WalletIcon, Check, ArrowRight } from 'lucide-react'

interface ConnectWalletInterface {
  openModal: boolean
  closeModal: () => void
}

const ConnectWallet = ({ openModal, closeModal }: ConnectWalletInterface) => {
  const { wallets, activeAddress } = useWallet()

  const isKmd = (wallet: Wallet) => wallet.id === WalletId.KMD

  if (!openModal) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-white/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={closeModal}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-lg p-10 rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.1)] border border-zinc-100 animate-in zoom-in-95 slide-in-from-bottom-5 duration-300">
        <button
          onClick={closeModal}
          aria-label="Close"
          className="absolute top-6 right-6 p-2 text-zinc-300 hover:text-black hover:bg-zinc-50 rounded-full transition-all"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#FFD23F] text-black rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-100">
            <WalletIcon size={28} />
          </div>
          <h2 className="text-2xl font-bold text-black mb-3">Connect Wallet</h2>
          <p className="text-zinc-400 text-sm max-w-xs mx-auto font-medium">
            Select a provider to access your academic credentials.
          </p>
        </div>

        <div className="space-y-3">
          {wallets?.map((wallet) => (
            <button
              key={`provider-${wallet.id}`}
              onClick={async () => {
                try {
                  await wallet.connect();
                  closeModal();
                } catch (e) {
                  console.error(e);
                }
              }}
              className={`w-full group px-6 py-4 rounded-2xl border transition-all duration-300 flex items-center justify-between ${wallet.isActive
                ? 'border-black bg-zinc-50 shadow-inner'
                : 'border-zinc-100 hover:border-black hover:bg-zinc-50 hover:shadow-xl hover:-translate-y-0.5'
                }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-zinc-50 flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
                  {!isKmd(wallet) ? (
                    <img
                      alt={wallet.metadata.name}
                      src={wallet.metadata.icon}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-black font-black text-xs">L</div>
                  )}
                </div>
                <div className="text-left">
                  <span className="block font-bold text-sm text-black uppercase tracking-wider">
                    {isKmd(wallet) ? 'LocalNet' : wallet.metadata.name}
                  </span>
                </div>
              </div>

              {wallet.isActive ? (
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white shadow-lg animate-in zoom-in">
                  <Check size={14} strokeWidth={4} />
                </div>
              ) : (
                <ArrowRight size={16} className="text-zinc-200 group-hover:text-black group-hover:translate-x-1 transition-all" />
              )}
            </button>
          ))}
        </div>

        {activeAddress && (
          <button
            onClick={async () => {
              const activeWallet = wallets.find((w) => w.isActive)
              if (activeWallet) {
                await activeWallet.disconnect()
                closeModal()
              }
            }}
            className="w-full mt-8 py-4 text-zinc-300 font-bold hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all uppercase tracking-widest text-[10px]"
          >
            Disconnect Account
          </button>
        )}

        <div className="mt-8 text-center">
          <p className="text-zinc-300 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
            New to Algorand? <br />
            <a href="https://perawallet.app/" target="_blank" rel="noopener noreferrer" className="text-black border-b border-black/10 hover:border-black transition-all pb-0.5 inline-block mt-1">Visit Pera Wallet</a>
          </p>
        </div>
      </div>
    </div>
  )
}
export default ConnectWallet
