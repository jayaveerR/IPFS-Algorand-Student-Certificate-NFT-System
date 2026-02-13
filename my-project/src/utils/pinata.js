import axios from 'axios';

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_API_SECRET = import.meta.env.VITE_PINATA_API_SECRET;
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

export const uploadToPinata = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);

    const metadata = JSON.stringify({
        name: file.name,
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
        cidVersion: 0,
    });
    formData.append('pinataOptions', options);

    try {
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            maxBodyLength: "Infinity",
            headers: {
                Authorization: `Bearer ${PINATA_JWT}`
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error uploading file to Pinata:", error);
        throw error;
    }
};

export const uploadMetadataToPinata = async (metadata) => {
    try {
        const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", metadata, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${PINATA_JWT}`
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error uploading metadata to Pinata:", error);
        throw error;
    }
};
