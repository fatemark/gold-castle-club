import { groupOfAddress, NodeProvider, web3, subContractId, addressFromContractId, binToHex, contractIdFromAddress, hexToString, stringToHex, encodeByteVec, toApiByteVec, encodeU256, hexToBinUnsafe, encodeHexSignature, buildContractByteCode, EventSubscription, node, encodeI256 } from '@alephium/web3'
import { AlephiumBalanceProvider } from '@alephium/web3-react';



web3.setCurrentNodeProvider("https://wallet.mainnet.alephium.org")
const nodeProvider = web3.getCurrentNodeProvider()

// Make the API call to get the balance
const balanceResult = await nodeProvider.addresses.getAddressesAddressBalance('18nnC2vtUCsKRPwGfr3DUidsGhUypjHtMCjprC9N8jseP');


const tokenBalances = balanceResult.tokenBalances;
const idsWithAmountOne = tokenBalances?.filter(token => token.amount === '1').map(token => token.id);
const addressesWithAmountOne = idsWithAmountOne.map(id => addressFromContractId(id));
console.log(addressesWithAmountOne)
//devnet:
//const nodeProvider = new NodeProvider('http://localhost:22973')

//mainet:
// web3.setCurrentNodeProvider("https://wallet.testnet.alephium.org")

//testnet:
//web3.setCurrentNodeProvider("https://wallet.testnet.alephium.org")
//const nodeProvider = web3.getCurrentNodeProvider()

const ader = '9f27ec8d662eb19674489c02c4124657c515180235ddb30ab0896c578571df00'
console.log(addressFromContractId(ader))

const collectionaddress = addressFromContractId('10292b7358c6a9823ddcd48292c56025b4005be4623a8d0cea439e16c769ad00');



const listingaddress = '22BioMMH6wSjrcjHCwJcF73AKFbjjDEGhauinqCbhZgXy'
const listingid = contractIdFromAddress(listingaddress)
console.log(binToHex(listingid))
console.log(collectionaddress)

// const result = await nodeProvider.events.getEventsContractContractaddress(
//   collectionaddress, { start: 0, limit: 9 }
// );

// const expandedresult = JSON.stringify(result, null, 2);
// console.log(expandedresult)

// events fealty
// event NewMarriage(proposer: Address, proposee: Address) event 0
// event NewMarriageContractOffer(proposer: Address, proposee: Address, dowry: U256, time: U256, loverletter: ByteVec, maxlovercount: U256) event 1
// event NewMarriageWithDowry(proposer: Address, proposee: Address) event 2
// event RescindMarriage(proposer: Address) event 3
// event Divorce(wifeHusband: Address, claimant: Address) event 4
// event NewFealtyContract(bribe: U256, time: U256, lordAddress: Address, minimumClass: U256, lordSubjectIndex: U256, campaign: ByteVec, subjecttarget: Address) event 5
// event NewSwearForGold(lordAddress: Address, subjectAddress: Address, lordSubjectIndex: U256) event 6
// event NewRescindGoldFealtyOffer(lordAddress: Address, lordSubjectIndex: U256) event 7
// event NewDeclareAnathemaByHigherLord(declarerLordAddress: Address, scroundrelAddress: Address, bribe: U256, reason: ByteVec) event 8
// event NewDeclareAnathemaByLord(declarerLordAddress: Address, scroundrelAddress: Address, bribe: U256, reason: ByteVec) event 9
// event NewRevokeAnathemaByDeclarer(revokerAddress: Address, scroundrelAddress: Address) event 10
// event NewRevokeAnathemaByHighLord(revokerAddress: Address, scroundrelAddress: Address) event 11
// event NewRevokeAnathemaByBribe(scroundrelAddress: Address) event 12
// event NewRevokeAnathemaByTime(scroundrelAddress: Address) event 13
// event WarDeclared(declarerAddress: Address, targetAddress: Address, timenow: U256) event 14
// event Voted(voterId: ByteVec, voteInput: U256, voteTime: U256) event 15
// event BecameOverlord(lordAddress: Address) event 16



 
// const printa = subContractId('eae80d51a003fafc2671687b8e4bdfb5990a63570a7ec25ca0b9bb0c46e20800', encodeU256(8), 0)
// const print = addressFromContractId(printa)
// console.log(print)

// for (let event of events) {
  // const eventIndex = event.eventIndex;
  // const byteVecFields = event.fields.filter(field => field.type === 'ByteVec');
  // const u256 = event.fields.find(field => field.type === 'U256');
  // const Address = event.fields.filter(field => field.type === 'Address');


//   if (eventIndex == 0) {
//   // Assuming there are always two ByteVec fields
//   // const listingId = byteVecFields[0].value;
//   // const nftId = byteVecFields[1].value;

//   const proposer = Address[0].value;
//   const proposee = Address[1].value;


//   console.log(proposer);
//   console.log(proposee);
//   }
// }



// const event = await nodeProvider.events.getEventsContractContractaddress(
//     contractAddress, {start: 0, limit: 100, group: 0}
//   )
  
//   // In the next query you can start with `result.nextStart`
//   console.log(JSON.stringify(event, null, 2))
  




  // const goldtokenAddress = '29HUL2W2CDgQAkvBWCi1yrEGsGbCaexnQdzcLoQqBJtX1'

  // const result = await nodeProvider.contracts.getContractsAddressState(goldtokenAddress, {
  //     group: groupOfAddress(goldtokenAddress),
  // });

  // console.log(result)



// // Encode U256 directly with the value 0
// const trypath = encodeU256(1);

// const group = 0;

// // Call the subContractId function




// // get listing:
// const fealtyid = 'f5a1480f1bd159be8d8560207b8670afbf4ff58c1c9ebf61e3834546aa87ef00'

// const pathof = encodeU256(5);

// const fealtycontractId = subContractId(fealtyid, pathof, 0)
// const subaddress = addressFromContractId(fealtycontractId)
// console.log(fealtycontractId)
// console.log(subaddress)


// const addressToQuery = addressFromContractId('d51d35cb0991f8dae82b2bd0cbd3058272f072cd18d01e5a8529d627c1e9d500');

//   const result = await nodeProvider.contracts.getContractsAddressState(addressToQuery, {
//     group: groupOfAddress(addressToQuery),
//   });

// console.log(result)
// Assuming encodeU256, hexToBinUnsafe, contractIdFromAddress, subContractId, and addressFromContractId are defined elsewhere

// const fealtyforgoldid = hexToBinUnsafe('4abb46b91d8126426a67fcc2039a9fdba7bc0db8a821f1cd2ba830c3c86a9500');
// const fealtyid = '182854884c33f8730f71dbbdaa44faf2b2b9a6468ee81b4f4458dfe54db6d100';
// const nftcontractid = '0c955961df7ec19b1ddda0b7fe87fc68031007408acd3c4b4f66adddf934c000'

//                     const lordNftId = hexToBinUnsafe(nftcontractid);
//                     const lordSubjectIndex = encodeU256(2);

//                     const totalLength = lordSubjectIndex.length + lordNftId.length + fealtyforgoldid.length;
//                     const pathof = new Uint8Array(totalLength);
//                     let offset = 0;
//                     pathof.set(lordSubjectIndex, offset);
//                     offset += lordSubjectIndex.length;
//                     pathof.set(lordNftId, offset);
//                     offset += lordNftId.length;
//                     pathof.set(fealtyforgoldid, offset);

//                     const subContractIdTarget = subContractId(fealtyid, pathof, 0);
//                     const subContractAddressTarget = addressFromContractId(subContractIdTarget);

//                     const result = await nodeProvider.contracts.getContractsAddressState(subContractAddressTarget, {
//                         group: groupOfAddress(subContractAddressTarget),
//                     });

// console.log(result)
// console.log(subContractAddressTarget)
// console.log(subContractIdTarget)


// const string = 'This is war'
// const hexstring = stringToHex(string)
// console.log(hexstring)

// console.log(hexToString('526172656c7920686173207468657265206265656e2061206d6f6d656e7420696e20686973746f727920746f2062652070617274206f6620736f6d657468696e67206772656174206c696b652074686973'))


// const tokenIdArray = balanceResult.tokenBalances.map((token) => token.id);

// // Print the array of 'id' strings to the console
// console.log(tokenIdArray);





// const tokenAdress = addressFromContractId('eda5f21d669ff96dfe6e5482b232a50d683dcabc19852d53888fd46385111400')
// console.log(tokenAdress)


// const subContractIdd = subContractId(contractId, '0', 0)

// const subcontractadress = addressFromContractId(subContractIdd)

// console.log(subcontractadress)

// const NftcollectionId = binToHex(contractIdFromAddress('wJwt67wjudjtJpKGzUAffcyetmgCdgVXZXtjchyagfcK'))
// console.log(NftcollectionId)

// // Assuming you have an instance of NodeProvider called 'nodeProvider'
// const addressToQuery = '2AgdVyPpcUGz6mBucbBm1hrTh6eYhARyL3nyf35ycKbAo'; // Replace with the actual address you want to query
// const contractIdOfNFTCollection = '26f005903d5351b938fe7d2fedbe4f44b9767380ceb0c6808833b88fd21e7b00'; // Replace with the actual contract ID of the NFT collection

// try {
//   const collectionMetaData = await nodeProvider.fetchNFTCollectionMetaData(contractIdOfNFTCollection);
//   console.log(`Collection URI: ${collectionMetaData.collectionUri}`);
//   console.log(`Total Supply: ${collectionMetaData.totalSupply}`);

//   // Now, you can use the address and contract ID to check for NFTs belonging to this collection
//   const result = await nodeProvider.contracts.getContractsAddressState(addressToQuery, {
//     group: groupOfAddress(addressToQuery),
//   });

//   // Extract and process the relevant information from the 'result' object
//   // The specific details will depend on the structure of the Alephium blockchain and the data returned by the API.
//   console.log(result);
// } catch (error) {
//   console.error('Error querying NFT collection metadata:', error);
// }

// export function subContractId(parentContractId: string, pathInHex: string, group: number): string {
//   if (group < 0 || group >= TOTAL_NUMBER_OF_GROUPS) {
//     throw new Error(`Invalid group ${group}`)
//   }
//   const data = Buffer.concat([hexToBinUnsafe(parentContractId), hexToBinUnsafe(pathInHex)])
//   const bytes = Buffer.concat([
//     blake.blake2b(blake.blake2b(data, undefined, 32), undefined, 32).slice(0, -1),
//     Buffer.from([group])
//   ])
//   return binToHex(bytes)
// }
// const nftCollectionMetadata = await nodeProvider.fetchNFTCollectionMetaData('5a9ee0ebeea418915f81ad034de5cb683c474785b6252705b8558eac39a3f400')

// console.log(nftCollectionMetadata)


// const nftMetadata = await web3.getCurrentNodeProvider().fetchNFTMetaData("613321faceb409e4ebba12552f3161941b56b6b585f79f5e732febd01e6b7300")

// console.log(nftMetadata)


// const contractId = '5a9ee0ebeea418915f81ad034de5cb683c474785b6252705b8558eac39a3f400'
// const subContractIdd = subContractId(contractId, '0', 0)
// console.log(subContractIdd)

// const contractAddress = addressFromContractId(subContractIdd)
// console.log(binToHex(contractIdFromAddress(contractAddress)) === subContractIdd)
// console.log(contractAddress)

// const tostring = hexToString(subContractIdd)
// console.log(tostring)


// const nftMetadata3 = await web3.getCurrentNodeProvider().fetchNFTMetaData(hexToString(subContractIdd))
// console.log(nftMetadata3)
