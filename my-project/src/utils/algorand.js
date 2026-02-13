import algosdk from 'algosdk';

const algodToken = ''; // Use empty string for public nodes if no token is required
const algodServer = 'https://testnet-api.algonode.cloud'; // Testnet Node
const algodPort = 443;

const client = new algosdk.Algodv2(algodToken, algodServer, algodPort);

export const mintNFT = async (senderAddress, metadataCID) => {
    try {
        const params = await client.getTransactionParams().do();

        const note = new TextEncoder().encode("CertifyChain NFT Mint");

        // Create an ASA
        const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
            from: senderAddress,
            suggestedParams: params,
            defaultFrozen: false,
            unitName: "CERT",
            assetName: "Student Certificate",
            manager: senderAddress,
            reserve: senderAddress,
            freeze: senderAddress,
            clawback: senderAddress,
            assetURL: `ipfs://${metadataCID}`,
            total: 1,
            decimals: 0,
            note: note,
        });

        return txn;
    } catch (error) {
        console.error("Error creating mint transaction:", error);
        throw error;
    }
};

export const sendSignedTransaction = async (signedTxn) => {
    try {
        const { txId } = await client.sendRawTransaction(signedTxn).do();
        console.log("Transaction sent with ID: " + txId);

        // Wait for confirmation
        const result = await algosdk.waitForConfirmation(client, txId, 4);

        return { txId, assetIndex: result['asset-index'] };
    } catch (error) {
        console.error("Error sending transaction:", error);
        throw error;
    }
}
