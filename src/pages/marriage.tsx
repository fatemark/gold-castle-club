// pages/index.tsx                 .filter(nft => nft.gender =! expandedOfferData.gender && nft.marriagetime < Date.now() )

import React, { useState, useEffect } from 'react';
import getMarriageOffers from '../services/database_services/marriageQuery'
import { acceptMarriageOffer, rescindMarriageOffer } from '@/services/marriage.service'
import { swearFealtyWithoutGoldFree, createFealtyForGoldContract, swearFealtyForGold, rescindFealtyOffer } from '@/services/swearfealty.service'
import { useWallet } from '@alephium/web3-react'
import { node, addressFromContractId, hexToString } from '@alephium/web3'
import { FealtyConfig } from '@/services/utils.fealty';
import { GoldTokenConfig } from '@/services/utils';
import getOwnedNfts from '@/services/walletquery';
import styles from '../styles/Fealty.module.css'
import { getAvailableIndex } from '../services/database_services/serverContractsQuery'
import { useRouter } from 'next/router';
import { checkFealtycontract } from '../services/database_services/serverContractsQuery';
import Image from 'next/image';
import { getKingdomType, getbackground, getLoverParamour, getgendersuffix, getLoverCount, getwartarget, adjustFontSize } from '../services/kingdom_services/kingdom';


const MarriageOffers: React.FC = () => {

const { signer, account } = useWallet()
const [ongoingTxId, setOngoingTxId] = useState<string>()
const [selectedContainer, setSelectedContainer] = useState<number | null>(null);
const [bribeAmount, setBribeAmount] = useState('')
const [timeAmount, setTimeAmount] = useState('')
const [minimumRarity, setMinimumRarity] = useState('')
const [nftData, setNftData] = useState<any[]>([]);
const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
const [campaignMessage, setCampaignMessage] = useState('');
const [buttonClicked, setButtonClicked] = useState(false);
const [isValidInput, setIsValidInput] = useState(true); // Set to true initially
const [firstClick, setFirstClick] = useState(false);
const [selectedNftContractId, setSelectedNftContractId] = useState<string | null>(null);
const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
const [selectedNftToMarry, setselectedNftToMarry] = useState<string | null>(null);
const [expandedOfferData, setexpandedOfferData] = useState<any | null>(null);
const [fealtyOfferData, setFealtyOfferData] = useState<any[]>([]);
const [selectedNftContractAddress, setSelectedNftContractAddress] = useState<string | null>(null);
const router = useRouter();

// Update the useEffect to check if the input is a valid number and update isValidInput accordingly
useEffect(() => {
  if (bribeAmount && !isNaN(parseFloat(bribeAmount))) {
    setIsValidInput(true);
  } else {
    setIsValidInput(false);
  }
}, [bribeAmount]);


// Handle input change
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setBribeAmount(e.target.value);
};

const handleMinimumClassInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setMinimumRarity(e.target.value);
};

const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setTimeAmount(e.target.value);
}



const handleExploreLord = (nftSelfContractAddress: string) => {
  // Construct the route using string interpolation
  const route = `/fealty/overlord/underlord/${nftSelfContractAddress}`;
  
  // Navigate to the constructed route
  router.push(route);
};

function getNFTUriByContractAddress(inputid: string) {
  const nft = nftData.find(item => item.nftcontractid === inputid);
  if (nft && nft.nfturi) {
      return nft.nfturi;
  } else {
      return null; // or any other indication that the NFT was not found
  }
}

useEffect(() => {
  async function fetchNftData() {
    try {
      if (account) {
        const nftData = await getOwnedNfts(account.address);
        setNftData(nftData);
      }
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }

  fetchNftData();
}, [account]);

const findHighestRarityNftIndex = (nftData: any[]) => {
  if (nftData.length === 0 || !nftData[0]) return null;
  let highestRarityIndex = 0;
  let highestRarityValue = nftData[0].rarity;
  for (let i = 1; i < nftData.length; i++) {
    if (nftData[i].rarity > highestRarityValue) {
      highestRarityIndex = i;
      highestRarityValue = nftData[i].rarity;
    }
  }
  return highestRarityIndex;
};

const toggleExpand = (index: number) => {
  setExpandedIndex(expandedIndex === index ? null : index);
  setSelectedNftContractId(expandedIndex === index ? null : sortedFealtyOfferData[index].nftcontractid);
  setSelectedRarity(expandedIndex === index ? null : sortedFealtyOfferData[index].rarity);
  if (expandedIndex === index) {
    setexpandedOfferData(null); // Collapse the currently expanded item
    setselectedNftToMarry(null)

  } else {
    setexpandedOfferData(sortedFealtyOfferData[index]); // Expand the clicked item
    setselectedNftToMarry(null)
  }
};
console.log(expandedOfferData?.nftindex)

// Add an event listener to the select dropdown to prevent click events from bubbling up
const handleSelectClick = (e: React.MouseEvent<HTMLSelectElement, MouseEvent>) => {
  e.stopPropagation();
  const selectedNftContractId = (e.target as HTMLSelectElement).value;
  setSelectedNftContractAddress(selectedNftContractId); // Update the selectedNftContractAddress state
};

const handleMarryForGold = async () => {
  if (signer && selectedNftToMarry) {
    const proposee = addressFromContractId(selectedNftToMarry);
    const proposer = expandedOfferData.proposeraddress;
    const fealtyId = FealtyConfig.fealtyId;
    const result = await acceptMarriageOffer(fealtyId, proposee, proposer,signer);
    setOngoingTxId(result.txId);
    checkFealtycontract();
  }
 else {
  // Handle the case where selectedNftContractId is null or other conditions are not met
  console.error('Invalid input or missing signer or selectedNftContractId.');
}
};

 

const handleRescindMarriageOffer = async () => {
  if (signer && expandedOfferData) {
    const proposer = expandedOfferData.proposeraddress;
    const fealtyId = FealtyConfig.fealtyId;
    const result = await rescindMarriageOffer(fealtyId, proposer, signer);
    setOngoingTxId(result.txId);
    checkFealtycontract();
  }
 else {
  // Handle the case where selectedNftContractId is null or other conditions are not met
  console.error('Invalid input or missing signer or selectedNftContractId.');
}
};


function getgendersuffix(genderinput: string): string {
  if (genderinput == 'man') {
    return 'his'
  }
  else if (genderinput == 'women') {
    return 'her'
  }
  else {
    return 'his'
  }
}

const handleExploreKingdom = (nftSelfContractAddress: string) => {
  // Construct the route using string interpolation
  const route = `/fealty/overlord/${nftSelfContractAddress}`;
  
  // Navigate to the constructed route
  router.push(route);
};




useEffect(() => {
  async function fetchFealtyOfferData() {
    try {
      const fealtyOfferData = await getMarriageOffers(1); // Correct function call
      setFealtyOfferData(fealtyOfferData);
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }
  fetchFealtyOfferData();
}, []);


const useFormattedBribe = (amount: number) => {
  const formatBribe = (amount: number) => {
      const suffixes = ['', 'thousand', 'million', 'billion', 'trillion'];
      let suffixIndex = 0;
      
      while (amount >= 1000 && suffixIndex < suffixes.length - 1) {
          suffixIndex++;
          amount /= 1000.0;
      }
      
      let formattedAmount: string;
      
      if (Number.isInteger(amount)) {
          formattedAmount = amount.toFixed(0); // Convert to whole number
      } else {
          formattedAmount = amount.toFixed(2); // Round to two decimals
      }

      return `${formattedAmount} ${suffixes[suffixIndex]}`;
  };

  return formatBribe(amount);
};

function FormattedBribe(bribe: number) {
  const formattedResult = useFormattedBribe(bribe);
  return formattedResult;
}

function getGenderSuffix(gender: any): string {
  switch (gender) {
      case 'man':
          return "his";
      case 'woman':
          return "her";
      default:
        return 'his';
  }
}

function getMarriageOfferTarget(proposergender: any, proposername: any, proposeename: any): string {
  if (proposername == proposeename) {
    switch (proposergender) {
      case 'man':
          return "any woman";
      case 'woman':
          return "any man";
      default:
        return 'anyone';
  }
}
  else {
    return proposeename
  }
}

const getBackgroundColor = (gender: string) => {
  return gender === 'man' ? 'rgba(4, 83, 242, 0.458)' : // Blue for male
         gender === 'woman' ? 'rgba(242, 4, 230, 0.458)' : // Pink for female
         '#FFFFFF'; // Default color
};


const sortedNftData = [...(Array.isArray(nftData) ? nftData : [])].sort((a, b) => b.rarity - a.rarity);

// Calculate sortedFealtyOfferData after fealtyOfferData has been updated
const sortedFealtyOfferData = [...fealtyOfferData].sort((a, b) => {
  // Find the index of a's proposeraddress in sortednftdata
  const indexA = sortedNftData.findIndex(item => item.nftselfcontractaddress === a.proposee);
  // Find the index of b's proposeraddress in sortednftdata
  const indexB = sortedNftData.findIndex(item => item.nftselfcontractaddress === b.proposee);
  
  // If both a and b have proposeraddress values found in sortednftdata
  if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB; // Sort based on their positions in sortednftdata
  } else if (indexA !== -1) {
      return -1; // a has proposeraddress in sortednftdata, so it comes before b
  } else if (indexB !== -1) {
      return 1; // b has proposeraddress in sortednftdata, so it comes before a
  } else {
      return a.lordsubjectindex - b.lordsubjectindex; // Sort based on lordsubjectindex if neither has proposeraddress in sortednftdata
  }defaultImageIndex
});

const defaultImageIndex = expandedIndex === null ? findHighestRarityNftIndex(sortedFealtyOfferData) : null;

const hasEqualNftSelfContract = (proposeeaddress: string) => {
  if (nftData != null && Array.isArray(nftData)) {
    return nftData.some(item => item.nftselfcontractaddress === proposeeaddress);
  }
  return false; // or handle the case when nftData is not available
};


const getAcceptOrNot = (proposeeaddress: string, proposeraddress: string) => {
  // Check if there is a match between proposeeaddress and any nftselfcontractaddress in nftData
  if (nftData != null && Array.isArray(nftData)) {
    const yourOfferMatch = nftData.some(item => item.nftselfcontractaddress === proposeraddress);
    const hasMatch = nftData.some(item => item.nftselfcontractaddress === proposeeaddress);

    // Return 'Offer by you' if there is a match, otherwise return 'Offer for you' if hasMatch is true
    if (yourOfferMatch) {
      return 'Offer by you';
    } else if (hasMatch) {
      return '  Offer for you';
    }
  }
  // Handle the case when nftData is not available or is not an array
  return undefined; // or whatever you need to return in this case
};

const getBorderColor = (proposee: string, proposeraddress: string) => {
  // Check if there is a match between proposeeaddress and any nftselfcontractaddress in nftData
  if (nftData != null && Array.isArray(nftData)) {
    const hasMatch = nftData.some(item => item.nftselfcontractaddress === proposee);
    const yourOfferMatch = nftData.some(item => item.nftselfcontractaddress === proposeraddress);

    // Return 'Offer for you' if there is a match, otherwise return undefined
    if (yourOfferMatch) {
      return 'black';
    }
    else if (hasMatch) {
      return 'green';
    }
  }
  // Handle the case when nftData is not available or is not an array
  return 'none'; // or whatever you need to return in this case
};



  return (
<div className={styles.marriageoffersbackground}>
  <div className={styles.collectiontwoColumnLayout}>
  <ul className={styles.collection} style= { { backgroundColor: 'rgba(4, 190, 242, 0.458)' , color: '#ffd000' } } >
  <h1>Offers &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; Mary and receive a $GOLD dowry</h1>
  {sortedFealtyOfferData.map((offer, index) => (
    <li 
  key={index} 
  className={`${styles.nft} ${
    expandedIndex === index ? styles.expanded : ''
  } ${expandedIndex === index ? styles.expandedBorderRadius : ''}`}  
  style= { {  backgroundColor: getBackgroundColor(offer.proposergender),
    border: `5px solid ${getBorderColor(offer.proposee, offer.proposeraddress)}` } } 
    onClick={() => toggleExpand(index)}
>  <div className={styles.threeColumnLayout} style= { {  display: 'flex', justifyContent: 'space-between', alignItems: 'center'  } } >
    <div style= { {  display: 'flex', flexDirection: 'column', alignItems: 'left' } } >
      <div className={styles.marryofferbox} style= { { backgroundColor: getBackgroundColor(offer.proposergender) } }  >
      <p style= { {  fontWeight: 'bold', alignSelf: 'start' } } >{offer.name} offers {FormattedBribe(offer.dowry)} $GOLD to {getMarriageOfferTarget(offer.proposergender, offer.name, offer.proposeename)} </p>
      </div>
    </div>    
    <div style= { {  display: 'flex', flexDirection: 'column', alignItems: 'right'  } } >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

      {getAcceptOrNot(offer.proposee, offer.proposeraddress)}
      <Image src={`/allegiance/${offer.allegiance.replace(/\s+/g, '_').toLowerCase()}.png`} alt="png" style={{ marginRight: '5px', marginLeft:'5px' }} width={55} height={55} />
    <Image src={`/class/${offer.rarity}.png`} alt="png" style={{ marginRight: '5px' }} width={55} height={55} />    </div>
  </div>
  </div>

      {expandedIndex === index && (
                 <div className={styles.imageContainer}>
                   <div className={styles.threeColumnLayout} style= { {  display: 'flex', justifyContent: 'space-between', alignItems: 'center'  } } >
                     <div >
                        <div className={styles.smallmarriageoffertextbox}>
                        <p > You will be married for at least {parseFloat((offer.time / (3600000 * 24)).toFixed(1))} days</p>
                        </div>
                        <div className={styles.smallmarriageoffertextbox}>
                        <p > You will receive {FormattedBribe(offer.dowry)} $GOLD dowry</p>
                        </div>
                        <div className={styles.bigpowertextbox} style= { { backgroundColor: getBackgroundColor(offer.proposergender) } } >
                        <p>The love letter of {offer.name}: {hexToString(offer.loveletter)}</p>
                        </div>
                      </div>

                      <div style= { {  display: 'flex', flexDirection: 'column', alignItems: 'right'  } } >
    
                        <div >
                          <div className={styles.smallmarriageoffertextbox} style= { { width:'19vw', marginBottom:'3px' } } >
                          <p > Minimum R.{offer.rarity} required</p>
                          </div>
                          <div className={styles.smallmarriageofferinfotextbox}>
                          <p >Rarity: {offer.rarity}</p>
                          </div>
                          <div className={styles.smallmarriageofferinfotextbox}>
                          <p >Members: {offer.members}</p>
                          </div>
                          <div className={styles.smallmarriageofferinfotextbox}>
                          <p>Votingpower: {offer.votingpower}</p>
                          </div>
                          <div className={styles.smallmarriageofferinfotextbox}>
                          <p >Attack Power: {offer.maxpowerpotential}</p>
                          </div>
                          <div className={styles.smallmarriageofferinfotextbox}>
                          <p>Defensive Power: {offer.maxdefensivepower}</p>
                          </div>
                          <div className={styles.smallmarriageofferinfotextbox}>
                          <p>Natural Allegiance: {offer.allegiance}</p>
                          </div>
                          <div className={styles.smallmarriageofferinfotextbox}>
                          <p>Married to: {offer.wife}</p>
                          </div>
                          <div className={styles.smallmarriageofferinfotextbox}>
                          <p>At war with: {offer.wartargetname}</p>
                          </div>
                          <div className={styles.bigpowertextbox}>
                          <p>{offer.unique_trait}</p>
                          </div>
                        </div>
    
                      </div>
                    
                    

                      <div>
                  {sortedNftData.length > 0 && sortedNftData.some(nft => nft.nftselfcontractaddress == expandedOfferData?.proposeraddress)  && (

                    <button
                      className={styles.offerfealtybutton} style= { { backgroundColor:'#000000', width:'10vw', height:'9vh' } } 
                      onClick={(e) => {
                        e.stopPropagation();
                      if (expandedOfferData) {
                        if (expandedOfferData) {
                          handleRescindMarriageOffer();
                        } else {
                          console.error('Selected NFT not found in sortedNftData');
                        }
                      } else {
                        console.error('No NFT selected.');
                      }
                     } } 
                    >
                      Rescind offer
                    </button>
                  )}

                      {sortedNftData.length > 0 && expandedOfferData.proposeraddress == expandedOfferData.proposee && !sortedNftData.some(nft => nft.nftselfcontractaddress == expandedOfferData?.proposeraddress) && (
                        <select
                          className={styles.offerselectbutton}
                          onChange={(e) => setselectedNftToMarry(e.target.value)}
                          onClick={handleSelectClick}
                          style= { { backgroundColor:'#FF69B4' } } 
                        >
                          <option value="">Select your nft</option>
                          {sortedNftData
                            .filter(nft => nft.gender !== expandedOfferData.proposergender && nft.marriagetime < Date.now() )
                            // Filter options with rarity lower than selectedNftToMarry's rarity
                            .map((nft) => (
                              <option key={nft.nftcontractid} value={nft.nftcontractid}>
                                {nft.rarity} {nft.name}, {nft.title}
                              </option>
                            ))}
                        </select>
                      )}

            {sortedNftData.length > 0 && expandedOfferData.proposeraddress != expandedOfferData.proposee && !sortedNftData.some(nft => nft.nftselfcontractaddress == expandedOfferData?.proposeraddress) && (
                        <select
                          className={styles.offerselectbutton}
                          onChange={(e) => setselectedNftToMarry(e.target.value)}
                          onClick={handleSelectClick}
                          style= { { backgroundColor:'#FF69B4' } } 
                        >
                          <option value="">Select your nft</option>
                          {sortedNftData
                            .filter(nft => nft.gender !== expandedOfferData.proposergender && nft.marriagetime < Date.now() && nft.nftselfcontractaddress == expandedOfferData.proposee)
                            // Filter options with rarity lower than selectedNftToMarry's rarity
                            .map((nft) => (
                              <option key={nft.nftcontractid} value={nft.nftcontractid}>
                                {nft.rarity} {nft.name}, {nft.title}
                              </option>
                            ))}
                        </select>
                      )}


                          {sortedNftData.length > 0 && !sortedNftData.some(nft => nft.nftselfcontractaddress == expandedOfferData?.proposeraddress) && (
                <button
                  className={styles.offerfealtybutton} style= { { backgroundColor:'#FF69B4' } } 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedNftToMarry) {
                      const selectedNft = sortedNftData.find(nft => nft.nftcontractid === selectedNftToMarry);
                      if (selectedNft) {
                        handleMarryForGold();
                      } else {
                        console.error('Selected NFT not found in sortedNftData');
                      }
                    } else {
                      console.error('No NFT selected.');
                    }
                   } } 
                >
                  Marry {offer.name}
                </button>)}

                <button
                className={styles.explorekingdombutton}
                onClick={(e) => { 
                    e.stopPropagation(); // Stop the event from bubbling up
                    handleExploreKingdom(offer.proposeraddress); // Call the handler function
                 } } >
                Explore {getGenderSuffix(offer.proposergender)} {getKingdomType(offer.rarity)}
                </button>

                <button
                className={styles.explorelordbutton}
                onClick={(e) => { 
                    e.stopPropagation(); // Stop the event from bubbling up
                    handleExploreLord(offer.proposeraddress); // Call the handler function
                 } } >
                {offer.name}
                </button>
                </div>
          </div>
        </div>
      )}
    </li>
  ))}
</ul>

<div className={styles.overlordinfoscroll}>






{defaultImageIndex !== null && selectedNftToMarry == null && (
        <img src={`https://xasdsxuik7lxfsh5ugx3at6of2bxjihsbk45linvxgjalpqquxoq.arweave.net/uCQ5XohX13LI_aGvsE_OLoN0oPIKudWhtbmSBb4Qpd0`} width="500vw" height="500vw" alt={`Old Asia`} />
        )}
{expandedIndex !== null && selectedNftToMarry == null && (
  <img src={`${expandedOfferData?.nfturi}`} alt={`NFT ${expandedOfferData?.nftindex}`} width="500vw" height="500vw"/>
)}

{selectedNftToMarry != null && expandedIndex != null && (
<div className={styles.collectiontwoColumnLayout}>
  <img src={`${expandedOfferData?.nfturi}`} alt={`NFT ${expandedOfferData?.nftindex}`} width="50%" height="50%" />
  <img src={`${getNFTUriByContractAddress(selectedNftToMarry)}`} alt={`NFT ${expandedOfferData?.nftindex}`} width="50%" height="50%" style= { {  border: '3px solid green'  } } />

</div>)}

{selectedNftToMarry != null && expandedIndex == null && (
  <img src={`${getNFTUriByContractAddress(selectedNftToMarry)}`} alt={`NFT ${expandedOfferData?.nftindex}`} style= { {  border: '3px solid green'  } }  width="500vw" height="500vw"/>
)}






{expandedIndex === null && (
<div className={styles.overlordtitle} style= { { marginTop: '5px' } } >
<h1> {"<<<----"} Explore the marriage offers</h1>
  </div>
  )}

{expandedIndex !== null && nftData[expandedIndex] && (
                      <div>
                  {sortedNftData.length > 0 && sortedNftData.some(nft => nft.nftselfcontractaddress == expandedOfferData?.proposeraddress)  && (

                  <button
                  className={styles.offerfealtybutton} style= { { backgroundColor:'#FF69B4' } } 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (expandedOfferData) {
                      if (expandedOfferData) {
                        handleRescindMarriageOffer();
                      } else {
                        console.error('Selected NFT not found in sortedNftData');
                      }
                    } else {
                      console.error('No NFT selected.');
                    }
                   } } 
                  >
                  Rescind offer
                  </button>)}
        

                      {sortedNftData.length > 0 && expandedOfferData.proposeraddress == expandedOfferData.proposee && !sortedNftData.some(nft => nft.nftselfcontractaddress == expandedOfferData?.proposeraddress) && (
                        <select
                          className={styles.offerselectbutton}
                          onChange={(e) => setselectedNftToMarry(e.target.value)}
                          onClick={handleSelectClick}
                          style= { { backgroundColor:'#FF69B4' } } 
                        >
                          <option value="">Select your nft</option>
                          {sortedNftData
                            .filter(nft => nft.gender !== expandedOfferData.proposergender && nft.marriagetime < Date.now() )
                            // Filter options with rarity lower than selectedNftToMarry's rarity
                            .map((nft) => (
                              <option key={nft.nftcontractid} value={nft.nftcontractid}>
                                {nft.rarity} {nft.name}, {nft.title}
                              </option>
                            ))}
                        </select>
                      )}

            {sortedNftData.length > 0 && expandedOfferData.proposeraddress != expandedOfferData.proposee && !sortedNftData.some(nft => nft.nftselfcontractaddress == expandedOfferData?.proposeraddress) && (
                        <select
                          className={styles.offerselectbutton}
                          onChange={(e) => setselectedNftToMarry(e.target.value)}
                          onClick={handleSelectClick}
                          style= { { backgroundColor:'#FF69B4' } } 
                        >
                          <option value="">Select your nft</option>
                          {sortedNftData
                            .filter(nft => nft.gender !== expandedOfferData.proposergender && nft.marriagetime < Date.now() && nft.nftselfcontractaddress == expandedOfferData.proposee)
                            // Filter options with rarity lower than selectedNftToMarry's rarity
                            .map((nft) => (
                              <option key={nft.nftcontractid} value={nft.nftcontractid}>
                                {nft.rarity} {nft.name}, {nft.title}
                              </option>
                            ))}
                        </select>
                      )}


                          {sortedNftData.length > 0 && !sortedNftData.some(nft => nft.nftselfcontractaddress == expandedOfferData?.proposeraddress) && (
                <button
                  className={styles.offerfealtybutton} style= { { backgroundColor:'#FF69B4' } } 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedNftToMarry) {
                      const selectedNft = sortedNftData.find(nft => nft.nftcontractid === selectedNftToMarry);
                      if (selectedNft) {
                        handleMarryForGold();
                      } else {
                        console.error('Selected NFT not found in sortedNftData');
                      }
                    } else {
                      console.error('No NFT selected.');
                    }
                   } } 
                >
                  Marry {expandedOfferData.name}
                </button>)}

                <button
                className={styles.explorekingdombutton}
                onClick={(e) => { 
                    e.stopPropagation(); // Stop the event from bubbling up
                    handleExploreKingdom(expandedOfferData.proposeraddress); // Call the handler function
                 } } >
                Explore {getGenderSuffix(expandedOfferData.proposergender)} {getKingdomType(expandedOfferData.rarity)}
                </button>

                <button
                className={styles.explorelordbutton}
                onClick={(e) => { 
                    e.stopPropagation(); // Stop the event from bubbling up
                    handleExploreLord(expandedOfferData.proposeraddress); // Call the handler function
                 } } >
                {expandedOfferData.name}
                </button>
                </div>
)}






{expandedIndex !== null && nftData[expandedIndex] && expandedOfferData.overlord !== expandedOfferData.proposeraddress &&(
<div className={styles.overlordinfobox}>
  <div className={styles.overlordtitle}>
<h1> The Overlord of {expandedOfferData.name}: </h1>
  </div>

  <img src={`${expandedOfferData?.overlordnfturi}`} alt={`NFT ${expandedOfferData?.nftindex}`} width="500vw" height="500vw"/>
                
                <div className={styles.overlordsmalltitle}>
                <h2>{expandedOfferData.overlordname}</h2>
                </div>
                <div>
                                <button
                className={styles.explorekingdombutton}
                onClick={(e) => { 
                    e.stopPropagation(); // Stop the event from bubbling up
                    handleExploreKingdom(expandedOfferData.overlord); // Call the handler function
                 } } >
                Explore this {getKingdomType(expandedOfferData.overlordrarity)}
                </button>

                </div>
          
                  <div className={styles.smalloverlordtextbox}>
                  <p>Overlord of {expandedOfferData.overlordmembers - 1} vassals</p>
                  </div>
                  <div className={styles.smalloverlordtextbox}>
                  <p>At war with: {expandedOfferData.overlordwartargetname}</p>
                  </div>
                  <div className={styles.smalloverlordtextbox}>
                  <p>Political voting power: {expandedOfferData.overlordvotingpower} </p>
                  </div>
                  <div className={styles.smalloverlordtextbox}>
                  <p>A total attack power of: {expandedOfferData.overlordmaxpowerpotential} </p>
                  </div>
                  <div className={styles.smalloverlordtextbox}>
                  <p>A total defensive power of: {expandedOfferData.overlordmaxdefensivepower} </p>
                  </div>
                  <div className={styles.smalloverlordtextbox}>
                  <p>Natural Allegiance: {expandedOfferData.overlordallegiance} </p>
                  </div>
 </div>
 )}

{expandedIndex !== null && nftData[expandedIndex] && expandedOfferData.overlord === expandedOfferData.proposeraddress &&(
  <div className={styles.overlordinfobox}>
  <div className={styles.overlordtitle}>
<h1> {expandedOfferData.name} is overlord of the {getKingdomType(expandedOfferData.rarity)} in {getGenderSuffix(expandedOfferData.proposergender)} own right </h1>
  </div>
 
  </div>


)}


    </div>
  </div>
</div>

  );
};

export default MarriageOffers;