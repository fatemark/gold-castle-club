import axios from 'axios';



export interface GoldTokenContract {
    address: string;
    datetime: number;
    wonamount: number;
}

async function getGoldTokenWinners(): Promise<GoldTokenContract[]> {

    const response = await fetch(`http://localhost:4000/top3wonamount`);

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
    const url = 'http://localhost:4000/goldtokenstate';
  
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

async function getTokenIdWithAmountOne(txId: string, maxRetries = 3): Promise<string | null> {
  let retries = 0;

  while (retries < maxRetries) {
      try {
          const response = await axios.get<TransactionResponse>(`http://localhost:22973/transactions/details/${txId}`);
          const generatedOutputs = response.data.generatedOutputs;

          for (const output of generatedOutputs) {
              for (const token of output.tokens) {
                  if (token.amount === '1') {
                      return token.id;
                  }
              }
          }

          return null;
      } catch (error) {
          console.error(`Error fetching transaction details (attempt ${retries + 1}):`, error);
          retries++;
      }
  }

  console.error(`Max retries (${maxRetries}) reached, could not fetch transaction details for transaction ID ${txId}`);
  return null;
}


export { fetchGoldTokenState, getGoldTokenWinners, getTokenIdWithAmountOne };

