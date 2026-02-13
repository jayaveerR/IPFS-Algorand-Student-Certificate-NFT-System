import React, { useState } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { Upload, X, Check, Loader2, Award, FileJson, Link as LinkIcon, ShieldCheck, Rocket } from 'lucide-react';
import { AlgorandClient, microAlgos } from '@algorandfoundation/algokit-utils';
import * as algosdk from 'algosdk';
import { StudentClient, StudentFactory } from '../contracts/StudentClient';
import { getAlgodConfigFromViteEnvironment, getIndexerConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs';
import { Check as AlgoCheck } from 'lucide-react';

interface CertificateFormProps {
    onClose: () => void;
}

const AUTHORIZED_ISSUER_ADDRESS = 'BKGJIHPGGQ7MQS5IHBTATOXSRMUHY3DYUGJPOYQCPKOWI54TRNX7Z5O4TQ';

const CertificateForm: React.FC<CertificateFormProps> = ({ onClose }) => {
    const { activeAddress, transactionSigner } = useWallet();
    const { enqueueSnackbar } = useSnackbar();

    const [formData, setFormData] = useState({
        studentName: '',
        rollNumber: '',
        courseName: '',
        grade: '',
        issueDate: '',
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isMinting, setIsMinting] = useState(false);
    const [ipfsResult, setIpfsResult] = useState<{ imageCid: string; metadataCid: string } | null>(null);
    const [successData, setSuccessData] = useState<{ txId: string; assetId: bigint } | null>(null);

    // App ID state - defaults to env var or 0
    const [appId, setAppId] = useState<number>(Number(import.meta.env.VITE_STUDENT_APP_ID) || 0);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const getAlgorandClient = () => {
        const algodConfig = getAlgodConfigFromViteEnvironment();
        const indexerConfig = getIndexerConfigFromViteEnvironment();
        return AlgorandClient.fromConfig({ algodConfig, indexerConfig });
    };

    const uploadToIPFS = async () => {
        if (!imageFile) {
            enqueueSnackbar('Please select an image file', { variant: 'error' });
            return;
        }

        setIsUploading(true);
        try {
            const jwt = import.meta.env.VITE_PINATA_JWT;

            // 1. Upload Image
            const imageFormData = new FormData();
            imageFormData.append('file', imageFile);

            const imageRes = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', imageFormData, {
                headers: {
                    'Content-Type': `multipart/form-data`,
                    Authorization: `Bearer ${jwt}`,
                },
            });

            const imageCid = imageRes.data.IpfsHash;
            enqueueSnackbar('Image uploaded to IPFS!', { variant: 'success' });

            // 2. Create and Upload Metadata
            const metadata = {
                name: `CertifyChain: ${formData.studentName}`,
                description: `Academic Certificate for ${formData.courseName}`,
                image: `ipfs://${imageCid}`,
                properties: {
                    student_name: formData.studentName,
                    roll_number: formData.rollNumber,
                    course: formData.courseName,
                    grade: formData.grade,
                    issue_date: formData.issueDate,
                    issuer: 'CertifyChain Decentralized System',
                },
            };

            const metadataRes = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
            });

            const metadataCid = metadataRes.data.IpfsHash;
            setIpfsResult({ imageCid, metadataCid });
            enqueueSnackbar('Metadata uploaded to IPFS!', { variant: 'success' });

        } catch (error: any) {
            console.error('IPFS Upload Error:', error);
            enqueueSnackbar(`IPFS Upload Failed: ${error.message}`, { variant: 'error' });
        } finally {
            setIsUploading(false);
        }
    };

    const deployContract = async () => {
        if (!activeAddress || !transactionSigner) {
            enqueueSnackbar('Please connect your wallet first', { variant: 'warning' });
            return;
        }

        setIsMinting(true);
        try {
            const algorand = getAlgorandClient();
            algorand.setDefaultSigner(transactionSigner);

            const factory = new StudentFactory({
                algorand,
                defaultSender: activeAddress,
            });

            const { result } = await factory.deploy();

            if (result.appId) {
                const newAppId = Number(result.appId);
                setAppId(newAppId);
                enqueueSnackbar(`Smart Contract Deployed! App ID: ${newAppId}`, { variant: 'success' });
                console.log('Deployed App ID:', newAppId);
                // Ideally, update .env or backend here
            }
        } catch (error: any) {
            console.error('Deployment Error:', error);
            enqueueSnackbar(`Deployment Failed: ${error.message}`, { variant: 'error' });
        } finally {
            setIsMinting(false);
        }
    };

    const mintNFT = async () => {
        if (!activeAddress || !transactionSigner) {
            enqueueSnackbar('Please connect your wallet first', { variant: 'warning' });
            return;
        }

        if (!ipfsResult) {
            enqueueSnackbar('Please upload certificate to IPFS first', { variant: 'warning' });
            return;
        }

        if (appId === 0) {
            // Auto-deploy or prompt? Let's auto-deploy for smoother UX in demo
            enqueueSnackbar('Deploying Smart Contract instance first...', { variant: 'info' });
            await deployContract();
            // Re-check if deployed
            if (appId === 0) return; // Deployment failed
        }

        setIsMinting(true);
        try {
            const algorand = getAlgorandClient();
            algorand.setDefaultSigner(transactionSigner);

            const client = new StudentClient({
                algorand,
                appId: BigInt(appId),
                defaultSender: activeAddress,
            });

            // 1. Call Smart Contract to Mint (Creates Asset, assigns User as Manager)
            // We reduced the fee here since we removed the inner transfer
            const mintResult = await client.send.mint({
                args: {
                    assetName: `CERT-${formData.rollNumber.slice(-4)}`,
                    unitName: 'CERT',
                    url: `ipfs://${ipfsResult.metadataCid}`,
                },
                extraFee: microAlgos(1_000),
            });

            const assetId = mintResult.return!;
            const mintTxId = mintResult.transaction.txID();
            console.log(`Minted Asset ID: ${assetId} in Tx: ${mintTxId}`);

            enqueueSnackbar(`Asset Created! Claiming to wallet...`, { variant: 'info' });

            // 2. Claim the Asset (Opt-In + Transfer from Contract)
            // The contract assigned US (activeAddress) as the Clawback Manager.
            const contractAddress = client.appAddress;

            const composer = algorand.newGroup();

            // Transaction A: Opt-In to the new Asset
            await composer.addAssetOptIn({
                sender: activeAddress,
                assetId: BigInt(assetId),
            });

            // Transaction B: Clawback (Transfer) from Contract to User
            await composer.addAssetTransfer({
                sender: activeAddress,
                receiver: activeAddress,
                assetId: BigInt(assetId),
                amount: 1n,
                clawbackTarget: contractAddress, // "Pull" from contract
            });

            const groupResult = await composer.send();
            const transferTxId = groupResult.txIds[1]; // Get ID of the transfer transaction

            console.log(`Transfer Transaction ID: ${transferTxId}`);
            enqueueSnackbar(`Certificate Successfully Transferred to Wallet!`, { variant: 'success' });

            setSuccessData({ txId: transferTxId, assetId: assetId });

        } catch (error: any) {
            console.error('Minting Error:', error);
            enqueueSnackbar(`Minting Failed: ${error.message}`, { variant: 'error' });
        } finally {
            setIsMinting(false);
        }
    };

    if (successData) {
        return (
            <div className="bg-white rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.1)] border border-zinc-100 p-10 max-w-lg w-full mx-auto relative overflow-hidden animate-in zoom-in-95 duration-500 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100/50">
                    <Check size={40} className="text-green-600" strokeWidth={3} />
                </div>
                <h2 className="text-2xl font-black text-black mb-2">Certificate Minted!</h2>
                <p className="text-zinc-500 font-medium mb-8">The asset has been successfully created and transferred.</p>

                <div className="space-y-4 mb-8 text-left">
                    <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Asset ID</span>
                        <div className="font-mono font-bold text-lg text-black">{successData.assetId.toString()}</div>
                    </div>
                    <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Transaction ID</span>
                        <div className="font-mono font-bold text-sm text-black break-all">{successData.txId}</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <a
                        href={`https://lora.algokit.io/testnet/transaction/${successData.txId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-zinc-100 text-black rounded-xl font-bold text-sm hover:bg-zinc-200 transition-colors"
                    >
                        <LinkIcon size={16} /> View on Lora
                    </a>
                    <button
                        onClick={onClose}
                        className="py-3 px-4 bg-black text-white rounded-xl font-bold text-sm hover:bg-zinc-800 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.1)] border border-zinc-100 p-10 max-w-4xl w-full mx-auto relative overflow-hidden animate-in zoom-in-95 duration-500">
            <button onClick={onClose} aria-label="Close" className="absolute top-8 right-8 text-zinc-300 hover:text-black hover:bg-zinc-100 p-2 rounded-full transition-all">
                <X size={24} />
            </button>

            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-[#FFD23F] rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-200">
                    <ShieldCheck size={32} className="text-black" />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-black tracking-tight leading-none mb-2">Issue Certificate</h2>
                    <p className="text-zinc-400 font-medium">Mint a verifiable academic achievement on Algorand.</p>
                </div>
            </div>

            {/* Account Verification Warning */}
            {activeAddress && activeAddress !== AUTHORIZED_ISSUER_ADDRESS && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-8 flex items-start gap-3 animate-in slide-in-from-top-2">
                    <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                        <ShieldCheck size={16} />
                    </div>
                    <div>
                        <h4 className="text-xs font-black text-red-800 uppercase tracking-wide mb-1">Unauthorized Account detected</h4>
                        <p className="text-xs text-red-600 font-medium leading-relaxed">
                            You are connected with <span className="font-mono bg-red-100 px-1 rounded">{activeAddress.slice(0, 6)}...{activeAddress.slice(-4)}</span>.
                            The authorized issuer is <span className="font-mono font-bold">{AUTHORIZED_ISSUER_ADDRESS.slice(0, 6)}...</span>.
                            Minting will likely fail as only the creator can mint.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="studentName" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Student Full Name</label>
                        <input id="studentName" type="text" placeholder="e.g. Jane Doe" className="w-full bg-zinc-50 border-zinc-100 rounded-2xl px-5 py-4 font-bold text-black focus:border-[#FFD23F] focus:ring-4 focus:ring-yellow-50 outline-none transition-all placeholder:text-zinc-300" value={formData.studentName} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label htmlFor="rollNumber" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Student Roll Number</label>
                        <input id="rollNumber" type="text" placeholder="e.g. 2023-CS-001" className="w-full bg-zinc-50 border-zinc-100 rounded-2xl px-5 py-4 font-bold text-black focus:border-[#FFD23F] focus:ring-4 focus:ring-yellow-50 outline-none transition-all placeholder:text-zinc-300" value={formData.rollNumber} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label htmlFor="courseName" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Course / Degree Program</label>
                        <input id="courseName" type="text" placeholder="e.g. Advanced Blockchain" className="w-full bg-zinc-50 border-zinc-100 rounded-2xl px-5 py-4 font-bold text-black focus:border-[#FFD23F] focus:ring-4 focus:ring-yellow-50 outline-none transition-all placeholder:text-zinc-300" value={formData.courseName} onChange={handleInputChange} />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="grade" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Grade</label>
                            <input id="grade" type="text" placeholder="A+" className="w-full bg-zinc-50 border-zinc-100 rounded-2xl px-5 py-4 font-bold text-black focus:border-[#FFD23F] focus:ring-4 focus:ring-yellow-50 outline-none transition-all placeholder:text-zinc-300" value={formData.grade} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label htmlFor="issueDate" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Issue Date</label>
                            <input id="issueDate" type="date" className="w-full bg-zinc-50 border-zinc-100 rounded-2xl px-5 py-4 font-bold text-black focus:border-[#FFD23F] focus:ring-4 focus:ring-yellow-50 outline-none transition-all" value={formData.issueDate} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Certificate Artwork</label>
                        <div className={`border-2 border-dashed rounded-[2rem] p-10 text-center transition-all min-h-[160px] flex items-center justify-center ${imageFile ? 'border-yellow-400 bg-yellow-50/30' : 'border-zinc-200 hover:border-black active:bg-zinc-50'}`}>
                            <input type="file" id="imageUpload" className="hidden" accept="image/*" onChange={handleFileChange} />
                            <label htmlFor="imageUpload" className="cursor-pointer w-full h-full">
                                {!imageFile ? (
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-black/10">
                                            <Upload size={24} />
                                        </div>
                                        <p className="text-black font-black text-xs uppercase tracking-widest">Select Image</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center animate-in zoom-in-95">
                                        <div className="w-12 h-12 bg-black text-yellow-400 rounded-xl flex items-center justify-center mb-4">
                                            <AlgoCheck size={24} strokeWidth={4} />
                                        </div>
                                        <p className="text-black font-black text-xs uppercase truncate max-w-[150px]">{imageFile.name}</p>
                                        <button
                                            onClick={(e) => { e.preventDefault(); setImageFile(null); }}
                                            className="text-red-600 text-[10px] font-black uppercase tracking-widest mt-3 hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {ipfsResult && (
                <div className="bg-zinc-50 rounded-3xl p-8 mb-10 border border-zinc-100 animate-in slide-in-from-bottom-4 duration-500">
                    <h4 className="text-[11px] font-black text-zinc-400 mb-6 flex items-center gap-3 uppercase tracking-[0.2em]">
                        <FileJson size={14} className="text-black" /> Blockchain Manifest
                    </h4>
                    <div className="space-y-4">
                        <div className="p-4 bg-white rounded-2xl border border-zinc-100">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Metadata IPFS CID</span>
                            <div className="flex items-center justify-between gap-4">
                                <code className="text-[11px] font-bold text-black break-all leading-relaxed">
                                    {ipfsResult.metadataCid}
                                </code>
                                <a href={`https://gateway.pinata.cloud/ipfs/${ipfsResult.metadataCid}`} target="_blank" rel="noopener noreferrer" aria-label="View on IPFS" className="text-zinc-300 hover:text-black transition-colors flex-shrink-0">
                                    <LinkIcon size={18} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-4 pt-4 border-t border-zinc-50">
                {appId === 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between mb-4">
                        <div className="text-yellow-800 text-xs font-bold uppercase tracking-wide">
                            Contract not deployed
                        </div>
                        <button
                            onClick={deployContract}
                            disabled={isMinting}
                            className="text-xs bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-500 transition-colors uppercase tracking-widest"
                        >
                            {isMinting ? 'Deploying...' : 'Deploy Contract'}
                        </button>
                    </div>
                )}

                {!ipfsResult ? (
                    <button
                        onClick={uploadToIPFS}
                        disabled={isUploading || !imageFile}
                        className="w-full bg-black text-white h-16 rounded-2xl flex items-center justify-center gap-4 text-sm font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-black/10 disabled:opacity-20 active:scale-95"
                    >
                        {isUploading ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
                        {isUploading ? 'Pinning to IPFS...' : 'Prepare Certification'}
                    </button>
                ) : (
                    <button
                        onClick={mintNFT}
                        disabled={isMinting || appId === 0}
                        className="w-full bg-[#FFD23F] text-black h-16 rounded-2xl flex items-center justify-center gap-4 text-sm font-black uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-xl shadow-yellow-200/50 disabled:opacity-20 active:scale-95 animate-in slide-in-from-right-4"
                    >
                        {isMinting ? <Loader2 size={24} className="animate-spin" /> : <Award size={24} />}
                        {isMinting ? 'Finalizing Genesis...' : 'Mint Blockchain Certificate'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default CertificateForm;
