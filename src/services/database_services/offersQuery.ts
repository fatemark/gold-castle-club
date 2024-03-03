import { NodeProvider, web3 } from '@alephium/web3';

interface FealtyContract {
    allegiance: string;
    bribe: number;
    campaign: string;
    collection: string;
    contractaddress: string;
    lordaddress: string;
    lordnftclass: number;
    lordsubjectindex: number;
    maxdefensivepower: number;
    maxpowerpotential: number;
    minimumnftclass: number;
    name: string;
    nftindex: number;
    overlord: string;
    rarity: number;
    time: number;
    votingpower: number;
}

async function getFealtyOffers(page: number): Promise<FealtyContract[]> {
    //const nodeProvider = new NodeProvider('http://localhost:22973');

    web3.setCurrentNodeProvider("https://wallet.mainnet.alephium.org")
    const nodeProvider = web3.getCurrentNodeProvider()

    const response = await fetch(`http://localhost:4000/fealtycontracts/${page}`);

    if (!response.ok) {
        throw new Error('Failed to fetch data from server');
    }

    const data = await response.json();

    return data as FealtyContract[];
}

async function getMarketplaceListings(page: number): Promise<FealtyContract[]> {
   // const nodeProvider = new NodeProvider('http://localhost:22973');

   web3.setCurrentNodeProvider("https://wallet.mainnet.alephium.org")
   const nodeProvider = web3.getCurrentNodeProvider()

    const response = await fetch(`http://localhost:4000/marketplacelistings/${page}`);

    if (!response.ok) {
        throw new Error('Failed to fetch data from server');
    }

    const data = await response.json();

    return data as FealtyContract[];
}

export { getFealtyOffers, getMarketplaceListings };
