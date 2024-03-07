import { NodeProvider, web3 } from '@alephium/web3';
import { getApi } from '../utils';

interface MarriageContract {
    allegiance: string;
    dowry: number;
    loveletter: string;
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
    magic: number;
    overlordallegiance: string;
    overlordcollection: string;
    overlordname: string;
}

async function getMarriageOffers(page: number): Promise<MarriageContract[]> {
    //const nodeProvider = new NodeProvider('http://backend:22973');

    web3.setCurrentNodeProvider("https://wallet.mainnet.alephium.org")
    const nodeProvider = web3.getCurrentNodeProvider()

    const response = await fetch(`${getApi}marriagecontracts/${page}`);

    if (!response.ok) {
        throw new Error('Failed to fetch data from server');
    }

    const data = await response.json();

    return data as MarriageContract[];
}

export default getMarriageOffers;
