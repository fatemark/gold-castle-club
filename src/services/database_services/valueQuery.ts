import { getApi } from '../utils';

export async function getValue(your_nft_self_contract_address: string, selectortype: string): Promise<any> {
    const url = `${getApi}${your_nft_self_contract_address}&selectortype=${selectortype}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
