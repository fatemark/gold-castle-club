import axios from 'axios';
import { getApi } from '../utils';



export interface GoldTokenContract {
    address: string;
    datetime: number;
    wonamount: number;
}

async function getGoldTokenWinners(): Promise<GoldTokenContract[]> {

    const response = await fetch(`${getApi}top3wonamount`);

    if (!response.ok) {
        throw new Error('Failed to fetch data from server');
    }

    const data = await response.json();

    return data as GoldTokenContract[];
}


export interface GoldStateData {
    address: string;
    wonamount: string;
    datetime: number;
    txid: string;
    jackpot: number;
  }
  
   async function fetchGoldTokenState(): Promise<GoldStateData> {
    const url = `${getApi}goldtokenstate`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch data from the server');
      }
  
      const data: GoldStateData = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }




  interface TokenOutput {
    id: string;
    amount: string;
}

interface GeneratedOutput {
    tokens: TokenOutput[];
}

interface TransactionResponse {
    unsigned: {
        txId: string;
    };
    generatedOutputs: GeneratedOutput[];
}


export { fetchGoldTokenState, getGoldTokenWinners };

