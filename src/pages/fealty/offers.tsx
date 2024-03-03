// pages/index.tsx
import React, { useState, useEffect } from 'react';
import { getFealtyOffers } from '../../services/database_services/offersQuery'
import { swearFealtyWithoutGoldFree, createFealtyForGoldContract, swearFealtyForGold, rescindFealtyOffer } from '@/services/swearfealty.service'
import { useWallet } from '@alephium/web3-react'
import { node, addressFromContractId, hexToString } from '@alephium/web3'
import { FealtyConfig } from '@/services/utils.fealty';
import getOwnedNfts from '@/services/walletquery';
import styles from '../../styles/Fealty.module.css'
import { useRouter } from 'next/router';
import { checkFealtycontract } from '../../services/database_services/serverContractsQuery';
import Image from 'next/image';
import { getKingdomType, getbackground, getLoverParamour, getgendersuffix, getLoverCount, getwartarget, adjustFontSize } from '../../services/kingdom_services/kingdom';


const Fealtyoffers: React.FC = () => {

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
const [selectedNftToBecomeSubject, setselectedNftToBecomeSubject] = useState<string | null>(null);
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
    setselectedNftToBecomeSubject(null)
  } else {
    setexpandedOfferData(sortedFealtyOfferData[index]); // Expand the clicked item
    setselectedNftToBecomeSubject(null)
  }
};
console.log(expandedOfferData?.nftindex)

// Add an event listener to the select dropdown to prevent click events from bubbling up
const handleSelectClick = (e: React.MouseEvent<HTMLSelectElement, MouseEvent>) => {
  e.stopPropagation();
  const selectedNftContractId = (e.target as HTMLSelectElement).value;
  setSelectedNftContractAddress(selectedNftContractId); // Update the selectedNftContractAddress state
};


const handleSwearFealtyForGold = async (subjectAddress: string) => {
  if (signer) {
    const lordAddress = expandedOfferData.lordaddress;
    const lordSubjectIndex = BigInt(expandedOfferData.lordsubjectindex);
    const fealtyId = FealtyConfig.fealtyId;
    const lordNftIndex = BigInt(expandedOfferData.nftindex);
    const result = await swearFealtyForGold(lordAddress, subjectAddress, lordSubjectIndex, fealtyId, lordNftIndex, signer);
    setOngoingTxId(result.txId);
    checkFealtycontract();
  }
};

const handlerescindFealtyOffer = async () => {
  if (signer) {
    // Call the mintNft function from your service with the necessary parameters
    // You may need to adjust this depending on how your service and NftMintconfig are set up
    const lordAddress = expandedOfferData.lordaddress;
    const lordSubjectIndex = expandedOfferData.lordsubjectindex;
    const fealtyId = FealtyConfig.fealtyId;
    const result = await rescindFealtyOffer(lordAddress, lordSubjectIndex, fealtyId, signer)
    setOngoingTxId(result.txId)
    checkFealtycontract();
  }
}

const handleExploreKingdom = (nftSelfContractAddress: string) => {
  // Construct the route using string interpolation
  const route = `/fealty/overlord/${nftSelfContractAddress}`;
  
  // Navigate to the constructed route
  router.push(route);
};

const handleExploreLord = (nftSelfContractAddress: string) => {
  // Construct the route using string interpolation
  const route = `/fealty/overlord/underlord/${nftSelfContractAddress}`;
  
  // Navigate to the constructed route
  router.push(route);
};

const adjustFontSize = (input: HTMLInputElement) => {
  const container = input.parentNode as HTMLElement; // Cast parentNode to HTMLElement
  const maxWidth = container.offsetWidth - 20; // Adjust for padding
  const inputValue = input.value;
  const numberOfDigits = inputValue.length;

  // Determine the approximate width of the text based on the number of digits
  const approximateTextWidth = numberOfDigits * 25; // Adjust the multiplier as needed

  // Compare the approximate text width to the container width
  if (approximateTextWidth > maxWidth) {
    // Calculate a new font size based on the available space in the container
    const newFontSize = maxWidth / numberOfDigits;
    input.style.fontSize = `${newFontSize}px`;
  } else {
    // Reset font size if the input value fits within the container
    input.style.fontSize = '40px'; // Reset to default
  }
};


useEffect(() => {
  async function fetchFealtyOfferData() {
    try {
      const fealtyOfferData = await getFealtyOffers(1); // Correct function call
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

function getNFTUriByContractAddress(inputid: string) {
  const nft = nftData.find(item => item.nftcontractid === inputid);
  if (nft && nft.nfturi) {
      return nft.nfturi;
  } else {
      return null; // or any other indication that the NFT was not found
  }
}


// Calculate sortedFealtyOfferData after fealtyOfferData has been updated
const sortedFealtyOfferData = [...fealtyOfferData].sort((a, b) => a.rarity - b.rarity);


console.log(fealtyOfferData)

const sortedNftData = [...(Array.isArray(nftData) ? nftData : [])].sort((a, b) => b.rarity - a.rarity);


const getBorderColor = (subjectaddress: string, lordaddress: string) => {
  // Check if there is a match between proposeeaddress and any nftselfcontractaddress in nftData
  if (nftData != null && Array.isArray(nftData)) {
    const hasMatch = nftData.some(item => item.nftselfcontractaddress === subjectaddress);
    const yourOfferMatch = nftData.some(item => item.nftselfcontractaddress === lordaddress);

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


const getAcceptOrNot = (subjectaddress: string, lordaddress: string) => {
  // Check if there is a match between proposeeaddress and any nftselfcontractaddress in nftData
  if (nftData != null && Array.isArray(nftData)) {
    const yourOfferMatch = nftData.some(item => item.nftselfcontractaddress === lordaddress);
    const hasMatch = nftData.some(item => item.nftselfcontractaddress === subjectaddress);

    // Return 'Offer by you' if there is a match, otherwise return 'Offer for you' if hasMatch is true
    if (yourOfferMatch) {
      return 'Offer by you';
    } else if (hasMatch) {
      return 'Offer for you';
    }
  }
  // Handle the case when nftData is not available or is not an array
  return undefined; // or whatever you need to return in this case
};

function getFealtyOfferTargetName(lordname: any, subjectname: any): string {
  if (lordname == subjectname) {
        return 'anyone';
  }
  else {
    return subjectname
  }
}

const defaultImageIndex = expandedIndex === null ? findHighestRarityNftIndex(sortedFealtyOfferData) : null;


  return (
<div className={styles.goldoffersbackground}>
  <div className={styles.collectiontwoColumnLayout}>
  <ul className={styles.collection} style= { { backgroundColor: '#695acd41' , color: '#ffd000' } } >
  <h1>Offers &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; Swear fealty in exchange for a $GOLD bribe</h1>
  {sortedFealtyOfferData.map((offer, index) => (
    <li 
  key={index} 
  className={`${styles.nft} ${
    expandedIndex === index ? styles.expanded : ''
  } ${expandedIndex === index ? styles.expandedBorderRadius : ''}`}  
  style= { {   backgroundImage: `url(/backgrounds/fealtybackgrounds/${getbackground(offer.ap, offer.gender, offer.rarity, offer.item, offer.allegiance, offer.magic, offer.group_attack, offer.solo_attack, offer.classtype)}.png)`,
  backgroundSize: '200px', 
  backgroundRepeat: 'repeat', 
  border: `5px solid ${getBorderColor(offer.subjectaddress, offer.lordaddress)}`
 } }  
  onClick={() => toggleExpand(index)}
>  <div className={styles.threeColumnLayout} style= { {  display: 'flex', justifyContent: 'space-between', alignItems: 'center'  } } >
    <div style= { {  display: 'flex', flexDirection: 'column', alignItems: 'left'  } } >
      <div className={styles.offerbox}>
      <p style= { {  fontWeight: 'bold', alignSelf: 'start'  } } >{offer.name} offers {FormattedBribe(offer.bribe)} $GOLD to {getFealtyOfferTargetName(offer.name, offer.subjectname)} </p>
      </div>
    </div>

    
    <div style= { {  display: 'flex', flexDirection: 'column', alignItems: 'right'  } } >
    <div style={{ display: 'flex', alignItems: 'end' }}>

          { (nftData.some(item => item.nftselfcontractaddress === offer.subjectaddress) || nftData.some(item => item.nftselfcontractaddress === offer.lordaddress)) && (
        <div className={styles.powertextbox}>
          {getAcceptOrNot(offer.subjectaddress, offer.lordaddress)}
        </div>
      )}
    <Image src={`/allegiance/${offer.allegiance.replace(/\s+/g, '_').toLowerCase()}.png`} alt="png" style={{ marginRight: '5px', marginLeft:'5px' }} width={55} height={55} />
    <Image src={`/class/${offer.rarity}.png`} alt="png" style={{ marginRight: '5px' }} width={55} height={55} />
</div> 

    </div>
  </div>
      {expandedIndex === index && (
                 <div className={styles.imageContainer}>
                  <div className={styles.threeColumnLayout} style= { {  display: 'flex', justifyContent: 'space-between', alignItems: 'center'  } } >
                  <div >
                  <div className={styles.smalloffertextbox}>
                  <p > You will swear fealty for {parseFloat((offer.time / (3600000 * 24)).toFixed(1))} days</p>
                  </div>
                  <div className={styles.smalloffertextbox}>
                  <p > You will receive {FormattedBribe(offer.bribe)} $GOLD</p>
                  </div>
                <div className={styles.bigpowertextbox}>
                  <p>The campaign message of {offer.name}: {hexToString(offer.campaign)}</p>
                  </div>
                  </div>
                  <div style= { {  display: 'flex', flexDirection: 'column', alignItems: 'right'  } } >
  
                  <div >
                  <div className={styles.smalloffertextbox} style= { { width:'400px', marginBottom:'3px' } } >
                  <p > Minimum R.{offer.minimumnftclass} required</p>
                  </div>
                  <div className={styles.smallofferinfotextbox}>
                  <p >Rarity: {offer.rarity}</p>
                  </div>
                  <div className={styles.smallofferinfotextbox}>
                  <p >Vassals: {offer.members - 1}</p>
                  </div>
                  <div className={styles.smallofferinfotextbox}>
                  <p>Votingpower: {offer.votingpower}</p>
                </div>
                <div className={styles.smallofferinfotextbox}>
                  <p >Attack Power: {offer.maxpowerpotential}</p>
                  </div>
                  <div className={styles.smallofferinfotextbox}>
                  <p>Defensive Power: {offer.maxdefensivepower}</p>
                </div>
                <div className={styles.smallofferinfotextbox}>
                  <p>Natural Allegiance: {offer.allegiance}</p>
                </div>
                { offer.potentialmarriage != offer.nftselfcontractaddress && (
            <div className={styles.smallofferinfotextbox}>
              <p>Married to: {offer.wife}</p>
            </div>
            ) }
              { offer.potentialmarriage == offer.nftselfcontractaddress && (
            <div className={styles.smallofferinfotextbox}>
              <p>Unmarried</p>
            </div>
            ) }
              { offer.wartarget != offer.nftselfcontractaddress && (
            <div className={styles.smallofferinfotextbox}>
              <p>At war with: {offer.wartargetname}</p>
            </div>
            ) }
              { offer.wartarget == offer.nftselfcontractaddress && (
            <div className={styles.smallofferinfotextbox}>
              <p>Not at war</p>
            </div>
            ) }
                <div className={styles.bigpowertextbox}>
                  <p>{offer.unique_trait}</p>
                  </div>
                  </div>
    
                </div>
                  <div>
                    


                  {sortedNftData.length > 0 && sortedNftData.some(nft => nft.nftselfcontractaddress == expandedOfferData?.lordaddress)  && (
                <button
                  className={styles.offerfealtybutton} style= { { backgroundColor:'#000000', width:'10vw', height:'9vh' } } 
                  onClick={(e) => {
                    e.stopPropagation();
                  if (expandedOfferData) {
                    if (expandedOfferData) {
                      handlerescindFealtyOffer();
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


              


        {sortedNftData.length > 0 && expandedOfferData.lordaddress == expandedOfferData.subjectaddress && !sortedNftData.some(nft => nft.nftselfcontractaddress == expandedOfferData?.lordaddress) && (
            <select
              className={styles.offerselectbutton}
              onChange={(e) => setselectedNftToBecomeSubject(e.target.value)}
              onClick={handleSelectClick}
            >
              <option value="">Select your nft</option>
              {sortedNftData
                .filter(nft => nft.rarity >= expandedOfferData.minimumnftclass && nft.rarity < expandedOfferData.rarity)
                // Filter options with rarity lower than selectedNftToBecomeSubject's rarity
                .map((nft) => (
                  <option key={nft.nftcontractid} value={nft.nftcontractid}>
                    {nft.rarity} {nft.name}, {nft.title}
                  </option>
                ))}
            </select>
          )}


          {sortedNftData.length > 0 && expandedOfferData.lordaddress != expandedOfferData.subjectaddress && !sortedNftData.some(nft => nft.nftselfcontractaddress == expandedOfferData?.lordaddress) && (
                      <select
                      className={styles.offerselectbutton}
                      onChange={(e) => setselectedNftToBecomeSubject(e.target.value)}
                      onClick={handleSelectClick}
                    >
                      <option value="">Select your nft</option>
                      {sortedNftData
                        .filter(nft => nft.rarity >= expandedOfferData.minimumnftclass && nft.rarity < expandedOfferData.rarity)
                        // Filter options with rarity lower than selectedNftToBecomeSubject's rarity
                        .map((nft) => (
                          <option key={nft.nftcontractid} value={nft.nftcontractid}>
                            {nft.rarity} {nft.name}, {nft.title}
                          </option>
                        ))}
                    </select>
                  )}




{sortedNftData.length > 0 && expandedOfferData.lordaddress == expandedOfferData.subjectaddress && !sortedNftData.some(nft => nft.nftselfcontractaddress == expandedOfferData?.lordaddress) && (
<button
  className={styles.offerfealtybutton}
  onClick={(e) => {
    e.stopPropagation();
    if (selectedNftToBecomeSubject) {
      const selectedNft = sortedNftData.find(nft => nft.nftcontractid === selectedNftToBecomeSubject);
      if (selectedNft) {
        handleSwearFealtyForGold(selectedNft.nftselfcontractaddress);
      } else {
        console.error('Selected NFT not found in sortedNftData');
      }
    } else {
      console.error('No NFT selected.');
    }
   } } 
>
  Swear this subject to {offer.name}
</button>)}


{sortedNftData.length > 0 && expandedOfferData.lordaddress != expandedOfferData.subjectaddress && !sortedNftData.some(nft => nft.nftselfcontractaddress == expandedOfferData?.lordaddress) && (
<button
  className={styles.offerfealtybutton}
  onClick={(e) => {
    e.stopPropagation();
    if (selectedNftToBecomeSubject) {
      const selectedNft = sortedNftData.find(nft => nft.nftcontractid === selectedNftToBecomeSubject);
      if (selectedNft) {
        handleSwearFealtyForGold(selectedNft.nftselfcontractaddress);
      } else {
        console.error('Selected NFT not found in sortedNftData');
      }
    } else {
      console.error('No NFT selected.');
    }
   } } 
>
  Swear this subject to {offer.name}
</button>)}
              { offer.members > 1 && (
              <button
                className={styles.explorekingdombutton}
                onClick={(e) => { 
                    e.stopPropagation(); // Stop the event from bubbling up
                    handleExploreKingdom(offer.lordaddress); // Call the handler function
                 } } >
                Explore {getGenderSuffix(offer.gender)} {getKingdomType(offer.rarity)}
                </button>
              )}
                <button
                className={styles.explorelordbutton}
                onClick={(e) => { 
                    e.stopPropagation(); // Stop the event from bubbling up
                    handleExploreLord(offer.lordaddress); // Call the handler function
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


{defaultImageIndex !== null && selectedNftToBecomeSubject == null && (
        <img src={`${sortedFealtyOfferData[defaultImageIndex].nfturi}`} alt={`NFT ${sortedFealtyOfferData[defaultImageIndex].name}`} width="500vw" height="500vw" />
      )}
{expandedIndex !== null && selectedNftToBecomeSubject == null && (
  <img src={`${expandedOfferData?.nfturi}`} alt={`NFT ${expandedOfferData?.nftindex}`} width="500vw" height="500vw"/>
)}

{selectedNftToBecomeSubject != null && expandedIndex != null && (
<div className={styles.collectiontwoColumnLayout}>
  <img src={`${expandedOfferData?.nfturi}`} alt={`NFT ${expandedOfferData?.nftindex}`} width="50%" height="50%" />
  <img src={`${getNFTUriByContractAddress(selectedNftToBecomeSubject)}`} alt={`NFT ${expandedOfferData?.nftindex}`} width="50%" height="50%" style= { {  border: '3px solid green'  } } />

</div>)}

{selectedNftToBecomeSubject != null && expandedIndex == null && (
  <img src={`${getNFTUriByContractAddress(selectedNftToBecomeSubject)}`} alt={`NFT ${expandedOfferData?.nftindex}`} style= { {  border: '3px solid green'  } }  width="500vw" height="500vw"/>
)}



{expandedIndex === null && (
<div className={styles.overlordtitle} style= { { marginTop: '5px' } } >
<h1> {"<<<----"} Explore the fealty offers</h1>
  </div>
  )}





{expandedIndex !== null && nftData[expandedIndex] && (

<div>
                <button
                className={styles.explorelordbutton}
                onClick={(e) => { 
                    e.stopPropagation(); // Stop the event from bubbling up
                    handleExploreLord(expandedOfferData.lordaddress); // Call the handler function
                 } } >
                {expandedOfferData.name}
                </button>
                { expandedOfferData.members > 1 && (
                <button
                className={styles.explorekingdombutton}
                onClick={(e) => { 
                    e.stopPropagation(); // Stop the event from bubbling up
                    handleExploreKingdom(expandedOfferData.lordaddress); // Call the handler function
                 } } >
                Explore {getGenderSuffix(expandedOfferData.gender)} {getKingdomType(expandedOfferData.rarity)}
                </button>
                )}
</div>
)}









                    
{expandedIndex !== null &&  expandedOfferData.rarity > 0 && sortedNftData.length > 0 && (
  <div>
            <select
              className={styles.offerselectbutton}
              onChange={(e) => setselectedNftToBecomeSubject(e.target.value)}
              onClick={handleSelectClick}
            >
              <option value="">Select your nft</option>
              {sortedNftData
                .filter(nft => nft.rarity >= expandedOfferData.minimumnftclass && nft.rarity < expandedOfferData.rarity)
                // Filter options with rarity lower than selectedNftToBecomeSubject's rarity
                .map((nft) => (
                  <option key={nft.nftcontractid} value={nft.nftcontractid}>
                    {nft.rarity} {nft.name}, {nft.title}
                  </option>
                ))}
            </select>
          
          {sortedNftData.length > 0 && (
<button
  className={styles.offerfealtybutton}
  onClick={(e) => {
    e.stopPropagation();
    if (selectedNftToBecomeSubject) {
      const selectedNft = sortedNftData.find(nft => nft.nftcontractid === selectedNftToBecomeSubject);
      if (selectedNft) {
        handleSwearFealtyForGold(selectedNft.nftselfcontractaddress);
      } else {
        console.error('Selected NFT not found in sortedNftData');
      }
    } else {
      console.error('No NFT selected.');
    }
   } } 
>
  Swear this subject to {expandedOfferData.name}
</button>)}
</div>)}


















{expandedIndex !== null && nftData[expandedIndex] && expandedOfferData.overlord !== expandedOfferData.lordaddress &&(
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

{expandedIndex !== null && nftData[expandedIndex] && expandedOfferData.overlord === expandedOfferData.lordaddress &&(
  <div className={styles.overlordinfobox}>
  <div className={styles.overlordtitle}>
<h1> {expandedOfferData.name} is overlord of the {getKingdomType(expandedOfferData.rarity)} in {getGenderSuffix(expandedOfferData.gender)} own right </h1>
  </div>
 
  </div>


)}


    </div>
  </div>
</div>

  );
};

export default Fealtyoffers;