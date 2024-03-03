export class GetRealIndex {
  static async execute(): Promise<bigint> {
    try {
      // Make an HTTP GET request to the server endpoint
      const response = await fetch('http://localhost:4000/random');
      
      // Parse the JSON response
      const data = await response.json();
      
      // Extract the NFT index from the response
      const nftIndex = data[0]; // Assuming the NFT index is the first element in the response array
      
      return BigInt(nftIndex); // Convert to BigInt and return the NFT index
    } catch (error) {
      console.error('Error fetching NFT index:', error);
      throw error; // Throw the error for handling at a higher level
    }
  }
}
