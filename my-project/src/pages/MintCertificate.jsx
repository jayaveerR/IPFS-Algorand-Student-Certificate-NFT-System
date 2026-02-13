import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { uploadToPinata, uploadMetadataToPinata } from '../utils/pinata';

const MintCertificate = () => {
    const [formData, setFormData] = useState({
        studentName: '',
        rollNumber: '',
        courseName: '',
        grade: '',
        issueDate: '',
    });
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, uploading, uploaded, minting, success, error
    const [ipfsUrl, setIpfsUrl] = useState('');
    const [metadataCID, setMetadataCID] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('');

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !formData.studentName) {
            alert("Please fill in all fields and select an image.");
            return;
        }

        setStatus('uploading');
        setLoadingMessage('Uploading Certificate Image to IPFS...');

        try {
            // 1. Upload Image
            const imageRes = await uploadToPinata(file);
            const imageCID = imageRes.IpfsHash;

            setLoadingMessage('Uploading Metadata to IPFS...');

            // 2. Upload Metadata
            const metadata = {
                name: `Certificate - ${formData.studentName}`,
                description: `Certificate for ${formData.courseName}`,
                image: `ipfs://${imageCID}`,
                properties: {
                    studentName: formData.studentName,
                    rollNumber: formData.rollNumber,
                    courseName: formData.courseName,
                    grade: formData.grade,
                    issueDate: formData.issueDate,
                }
            };

            const metadataRes = await uploadMetadataToPinata(metadata);
            const metaCID = metadataRes.IpfsHash;

            setMetadataCID(metaCID);
            setIpfsUrl(`https://gateway.pinata.cloud/ipfs/${metaCID}`);
            setStatus('uploaded');
        } catch (error) {
            console.error(error);
            setStatus('error');
            alert("Upload failed. Check console for details.");
        }
    };



    // Revised handleMint to bubble up or waiting for prop update.
    // I'll leave the signing logic placeholder here and update App.jsx to pass the `peraWallet` object.

    return (
        <div className="min-h-screen bg-slate-50 pt-24 px-4 pb-12">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-50 bg-slate-50/50">
                    <h2 className="text-2xl font-bold text-slate-800">Issue New Certificate</h2>
                    <p className="text-slate-500 text-sm mt-1">Fill in the details below to mint a verifiable academic certificate on the Algorand blockchain.</p>
                </div>

                <div className="p-8">
                    {status === 'success' ? (
                        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <ShieldCheck size={40} className="text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">Minting Request Sent!</h3>
                            <p className="text-slate-600">Please check your Pera Wallet to sign the transaction.</p>
                            <div className="bg-slate-50 p-6 rounded-xl text-left space-y-3 border border-slate-100">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Metadata IPFS:</span>
                                    <a href={ipfsUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                                        View Metadata <ExternalLink size={12} />
                                    </a>
                                </div>
                            </div>
                            <button onClick={() => window.location.reload()} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
                                Issue Another
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleUpload} className="space-y-6">
                            {/* ... Form Fields ... */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Student Name</label>
                                    <input name="studentName" required onChange={handleInputChange} disabled={status !== 'idle'} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-black" placeholder="e.g. Jane Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Roll Number</label>
                                    <input name="rollNumber" required onChange={handleInputChange} disabled={status !== 'idle'} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-black" placeholder="e.g. 2023-CS-001" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Course Name</label>
                                    <input name="courseName" required onChange={handleInputChange} disabled={status !== 'idle'} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-black" placeholder="e.g. Advanced Blockchain" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Grade / Score</label>
                                    <input name="grade" required onChange={handleInputChange} disabled={status !== 'idle'} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-black" placeholder="e.g. A+ / 95%" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Issue Date</label>
                                <input type="date" name="issueDate" required onChange={handleInputChange} disabled={status !== 'idle'} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-black" placeholder="e.g. 2023-01-01" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Certificate Image</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors relative cursor-pointer group">
                                    <input type="file" required onChange={handleFileChange} disabled={status !== 'idle'} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                                    <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-indigo-500 transition-colors">
                                        {file ? (
                                            <>
                                                <CheckCircle size={32} className="text-green-500 mb-2" />
                                                <span className="text-slate-900 font-medium">{file.name}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={32} className="mb-2" />
                                                <span className="font-medium">Click to upload or drag and drop</span>
                                                <span className="text-xs">SVG, PNG, JPG or GIF (max. 5MB)</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {status === 'idle' && (
                                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-200 active:scale-95 flex items-center justify-center gap-2">
                                    <Upload size={20} /> Upload to IPFS
                                </button>
                            )}
                        </form>
                    )}

                    {status === 'uploading' || status === 'minting' ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                            <p className="text-slate-600 font-medium">{loadingMessage}</p>
                        </div>
                    ) : null}

                    {status === 'uploaded' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
                                <FileText className="text-indigo-600 mt-1 shrink-0" size={20} />
                                <div className="overflow-hidden">
                                    <h4 className="font-semibold text-indigo-900 text-sm">Metadata Uploaded Successfully</h4>
                                    <a href={ipfsUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 underline truncate block mt-1 hover:text-indigo-800">
                                        {ipfsUrl}
                                    </a>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setStatus('minting');
                                    setLoadingMessage('Requesting Wallet Signature...');
                                    window.dispatchEvent(new CustomEvent('mint-request', { detail: { metadataCID } }));
                                }}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-200 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <ShieldCheck size={20} /> Mint NFT
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MintCertificate;
