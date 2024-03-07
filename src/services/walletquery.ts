import { NodeProvider, web3 } from '@alephium/web3'
import { getApi } from '../services/utils'

//devnet:
// const nodeProvider = new NodeProvider('https://localhost:22973')

//mainet:
// web3.setCurrentNodeProvider("https://wallet.testnet.alephium.org")

//testnet:
//web3.setCurrentNodeProvider("https://wallet.testnet.alephium.org")
//const nodeProvider = web3.getCurrentNodeProvider()


// Make the API call to get the balance
async function getOwnedNfts(walletAddress: string): Promise<string[]> {
    //devnet:
   // const nodeProvider = new NodeProvider('https://localhost:22973');

    web3.setCurrentNodeProvider("https://wallet.mainnet.alephium.org")
    const nodeProvider = web3.getCurrentNodeProvider()

    // Make the API call to get the balance
    const balanceResult = await nodeProvider.addresses.getAddressesAddressBalance(walletAddress);

    
    const tokenBalances = balanceResult.tokenBalances;
    const idsWithAmountOne = tokenBalances?.filter(token => token.amount === '1').map(token => token.id);

    // Send POST request to server
    const response = await fetch(`${getApi}compare`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ array: idsWithAmountOne })
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data from server');
    }

    const data = await response.json();

    // Assuming the server returns an array of strings
    return data as string[];
}


export default getOwnedNfts;
