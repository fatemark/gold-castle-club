import { getApi } from '../utils';


export class getAvailableIndex {
        static async execute(lordAddress: string): Promise<number> {
    try {
        const response = await fetch(`${getApi}get_lordsubjectindex?lordaddress=${lordAddress}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const lordSubjectIndexArray: number[] = data.lordsubjectindex;
        
        // Create a set to efficiently check for existing numbers
        const lordSubjectIndexSet = new Set(lordSubjectIndexArray);

        // Iterate from 0 to 6 and return the first available number
        for (let i = 0; i <= 6; i++) {
            if (!lordSubjectIndexSet.has(i)) {
                return i;
            }
        }

        // If all numbers from 0 to 6 are present, return -1
        return -1;
    } catch (error) {
        console.error('Error fetching data:', error);
        return -1;
    }
}
}



import axios from 'axios';

export async function checkMinting(): Promise<void> {
    try {
        await axios.get(`${getApi}checkminting`);
        console.log('Checkmingting started successfully');
    } catch (error) {
        console.error('Error starting checkMinting:', error);
    }
}

export async function checkMarketplace(): Promise<void> {
    try {
        await axios.get(`${getApi}checkmarketplace`);
        console.log('checkmarketplace started successfully');
    } catch (error) {
        console.error('Error starting checkmarketplace:', error);
    }
}

export async function checkGoldContract(): Promise<void> {
    try {
        await axios.get(`${getApi}checkgoldcontract`);
        console.log('checkgoldcontract started successfully');
    } catch (error) {
        console.error('Error starting checkgoldcontract:', error);
    }
}

export async function checkFealtycontract(): Promise<void> {
    try {
        await axios.get(`${getApi}checkfealtycontract`);
        console.log('checkfealtycontract started successfully');
    } catch (error) {
        console.error('Error starting checkfealtycontract:', error);
    }
}


export async function electionAndFealtyChecker(): Promise<void> {
    try {
        await axios.get(`${getApi}checkfealtycontractandelection`);
        console.log('checkfealtycontractandelection started successfully');
    } catch (error) {
        console.error('Error starting checkfealtycontractandelection:', error);
    }
}

export async function fetchNullOwnersCount(): Promise<number> {
    try {
        const response = await fetch(`${getApi}count_null_owners`);
        const data = await response.json();
        if (response.ok) {
            return data.count_null_owners;
        } else {
            throw new Error(data.error || 'Failed to fetch data');
        }
    } catch (error) {
        console.error('Error fetching null owners count:', error);
        throw error;
    }
}
