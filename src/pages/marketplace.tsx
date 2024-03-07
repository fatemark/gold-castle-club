// pages/index.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { swearFealtyWithoutGoldFree, createFealtyForGoldContract, swearFealtyForGold, rescindFealtyOffer, declareWar } from '@/services/swearfealty.service'
import { useWallet, AlephiumConnectButtonCustom } from '@alephium/web3-react'
import { node, addressFromContractId } from '@alephium/web3'
import { FealtyConfig } from '@/services/utils.fealty';
import { GoldTokenConfig } from '@/services/utils';
import getOwnedNfts from '@/services/walletquery';
import styles from '../styles/Fealty.module.css'
import { getAvailableIndex, checkMarketplace } from '../services/database_services/serverContractsQuery'
import { useRouter } from 'next/router';
import { createMarriageOffer } from '../services/marriage.service'
import { declareAnathemaByLord, declareAnathemaByHighLord } from '../services/anathema.service'
import { getOverlords, getattackers, getAnathemaDeclarerDeclarations } from '../services/database_services/fealtyQuery'
import { createListing, buyListing, revokeListing } from '../services/listing.service';
import { getMarketplaceListings } from '../services/database_services/offersQuery';
import { getKingdomType, getbackground, getLoverParamour, getgendersuffix, getLoverCount, getwartarget, adjustFontSize } from '../services/kingdom_services/kingdom';
import Image from 'next/image';

const Marketplace: React.FC = () => {

const { signer, account } = useWallet()
const [bribeAmount, setBribeAmount] = useState('')
const [minimumRarity, setMinimumRarity] = useState('')
const [nftData, setNftData] = useState<any[]>([]);
const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
const [campaignMessage, setCampaignMessage] = useState('');
const [isValidInput, setIsValidInput] = useState(true); // Set to true initially
const [firstClick, setFirstClick] = useState(false);
const [selectedNftContractId, setSelectedNftContractId] = useState<string>('');
const [selectedNftToSwearTo, setSelectedNftToSwearTo] = useState<string | null>(null);
const [expandedNftData, setExpandedNftData] = useState<any | null>(null);
const [overlords, setOverlords] = useState<any[]>([]);
const [loveLetter, setLoveLetter] = useState('');
const [anathemaReason, setanathemaReason] = useState('');
const [dowryAmount, setdowryAmount] = useState('')
const [anathemaBribeAmount, setanathemaBribeAmount] = useState('')
const [timeAmount, setTimeAmount] = useState('')
const [priceAmount, setPriceAmount] = useState('')

const [ongoingTxId, setOngoingTxId] = useState<string>()
const [activeButton, setActiveButton] = useState(0);
const [attackers, setAttackers] = useState<any[]>([]);
const [anathemaDeclarations, setAnathemaDeclarations] = useState<any[]>([]);

const [marketplaceListings, setMarketplaceListings] = useState<any[]>([]);
const timeouttime = 5000

const handleSwitchChange = (index: number) => {
  setActiveButton(index);
};

useEffect(() => {
  async function fetchMarketPlaceListings() {
    try {
      const listingData = await getMarketplaceListings(1); // Correct function call
      setMarketplaceListings(listingData);
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }
  fetchMarketPlaceListings();
}, []);

useEffect(() => {
  async function fetchAttackers() {
    if (expandedNftData) { // Check if expandedNftData is not null
      const fetchedAttackers = await getattackers(expandedNftData.nftselfcontractaddress);

      // Check if fetchedAttackers is an array before sorting
      if (Array.isArray(fetchedAttackers)) {
        fetchedAttackers.sort((a, b) => {
          // First, sort by rarity
          if (b.rarity !== a.rarity) {
              return b.rarity - a.rarity; // Sort by rarity descending
          } else {
              // If rarity is equal, sort by voting power
              return b.votingpower - a.votingpower; // Sort by voting power descending
          }
        });
        setAttackers(fetchedAttackers);
      } else {
        setAttackers([]);
      }
    }
  }
  fetchAttackers();
}, [expandedNftData, attackers]); 

useEffect(() => {
  async function fetchAnathemaDeclarations() {
    if (expandedNftData) { // Check if expandedNftData is not null
      const fetchedAnathemaDeclarations = await getAnathemaDeclarerDeclarations(expandedNftData.nftselfcontractaddress);

      // Check if fetchedAttackers is an array before sorting
      if (Array.isArray(fetchedAnathemaDeclarations)) {
        fetchedAnathemaDeclarations.sort((a, b) => {
          // First, sort by rarity
          if (b.rarity !== a.rarity) {
              return b.rarity - a.rarity; // Sort by rarity descending
          } else {
              // If rarity is equal, sort by voting power
              return b.votingpower - a.votingpower; // Sort by voting power descending
          }
        });
        setAnathemaDeclarations(fetchedAnathemaDeclarations);
      } else {
        console.log("fetchedAttackers is not an array:", fetchedAnathemaDeclarations);
        setAnathemaDeclarations([]);
      }
    }
    console.log(anathemaDeclarations)
  }
  fetchAnathemaDeclarations();
}, [expandedNftData]);




const router = useRouter();

const handleExploreKingdom = (nftSelfContractAddress: string) => {
  // Construct the route using string interpolation
  const route = `/fealty/overlord/${nftSelfContractAddress}`;
  
  // Navigate to the constructed route
  router.push(route);
};



useEffect(() => {
  async function fetchNftData() {
    try {
      if (account) {
        const fetchedNftData = await getOwnedNfts(account.address);
        setNftData(fetchedNftData);
      }
    } catch (error) {
      // Handle error
    }
  }

  fetchNftData();
}, [account]); // Don't forget to add navigate to the dependency array

const findHighestvotingpowerNftIndex = (overlords: any[]) => {
  if (overlords.length === 0 || !overlords[0]) {return null}
  let highestvotingpowerIndex = 0;
  let highestvotingpowerValue = overlords[0].votingpower;
  for (let i = 1; i < overlords.length; i++) {
    if (overlords[i] && overlords[i].votingpower > highestvotingpowerValue) {
      highestvotingpowerIndex = i;
      highestvotingpowerValue = overlords[i].votingpower;
    }
  }
  return highestvotingpowerIndex;
};
const toggleExpand = (index: number) => {
  setExpandedIndex(expandedIndex === index ? null : index);
  if (expandedIndex === index) {
    setExpandedNftData(null); // Collapse the currently expanded item
  } else {
    setExpandedNftData(sortedListingData[index]); // Expand the clicked item
    setSelectedNftContractId('')
  }
};

// Add an event listener to the select dropdown to prevent click events from bubbling up
const handleSelectClick = (e: React.MouseEvent<HTMLSelectElement>) => {
  e.stopPropagation();
};

useEffect(() => {
  if (dowryAmount && !isNaN(parseFloat(dowryAmount))) {
    setIsValidInput(true);
  } else {
    setIsValidInput(false);
  }
}, [dowryAmount]);

// Handle input change
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setdowryAmount(e.target.value);
};

// Handle time input change
const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setTimeAmount(e.target.value);
};


function getNFTUriByContractAddress(inputid: string) {
  const nft = nftData.find(item => item.nftcontractid === inputid);
  if (nft && nft.nfturi) {
      return nft.nfturi;
  } else {
      return null; // or any other indication that the NFT was not found
  }
}


const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedContractId = event.target.value;
  setSelectedNftContractId(selectedContractId);
};

const handleCreateFealtyContract = async () => {
  if (signer && selectedNftContractId) {
    const bribe = BigInt(Math.floor(parseFloat(bribeAmount)));
    const time = BigInt(Math.floor(parseFloat(timeAmount) * 1000 * 60 * 60 * 24));
    const lordAddress = addressFromContractId(selectedNftContractId);
    const minimumClass = BigInt(expandedNftData.rarity);
    const subjecttarget = addressFromContractId(expandedNftData.nftcontractid);
    // Call the execute method of getAvailableIndex to get the lordSubjectIndex
    const lordSubjectIndex = await getAvailableIndex.execute(lordAddress);
    if (lordSubjectIndex !== -1) {
      // If lordSubjectIndex is not -1, it means a valid index is available
      const fealtyId = FealtyConfig.fealtyId;
      const goldtokenid = GoldTokenConfig.GoldTokenId;
      const result = await createFealtyForGoldContract(
        bribe,
        time,
        lordAddress,
        minimumClass,
        BigInt(lordSubjectIndex), // Use the obtained lordSubjectIndex
        fealtyId,
        goldtokenid,
        campaignMessage,
        subjecttarget,
        signer
      );
      setOngoingTxId(result.txId);
      setTimeout(() => {
      checkMarketplace()
    }, timeouttime);
    } else {
      console.error('No available index found.');
    }
  } else {
    // Handle the case where selectedNftContractId is null or other conditions are not met
    console.error('Invalid input or missing signer or selectedNftContractId.');
  }
};

const handleCreateSpecificMarriageContract = async () => {
  if (signer && selectedNftContractId) {
    const dowry = BigInt(Math.floor(parseFloat(dowryAmount)));
    const time =  BigInt(Math.floor(parseFloat(timeAmount) * 1000 * 60 * 60 * 24));
    const proposer = addressFromContractId(selectedNftContractId);
    const proposee = addressFromContractId(expandedNftData.nftcontractid);
    const maxlover = BigInt(expandedNftData.lovercount)
    // Call the execute method of getAvailableIndex to get the lordSubjectIndex
    if (proposer) {
      // If lordSubjectIndex is not -1, it means a valid index is available
      const fealtyId = FealtyConfig.fealtyId;
      const goldtokenid = GoldTokenConfig.GoldTokenId;
      const result = await createMarriageOffer(
        fealtyId,
        dowry,
        goldtokenid,
        proposee,
        proposer,
        time,
        loveLetter,
        maxlover,
        signer
      );
      setOngoingTxId(result.txId);
      setTimeout(() => {
        checkMarketplace()
      }, timeouttime);
    } else {
      console.error('No available index found.');
    }
  } else {
    // Handle the case where selectedNftContractId is null or other conditions are not met
    console.error('Invalid input or missing signer or selectedNftContractId.');
  }
};

  const handleDeclareWar = async () => {
    if (signer && selectedNftContractId) {
      const selfAddress = addressFromContractId(selectedNftContractId);
      const targetAddress = addressFromContractId(expandedNftData.nftcontractid);
      // Call the execute method of getAvailableIndex to get the lordSubjectIndex

      if (targetAddress) {
        // If lordSubjectIndex is not -1, it means a valid index is available
        const fealtyId = FealtyConfig.fealtyId;
        const goldtokenid = GoldTokenConfig.GoldTokenId;
        const result = await declareWar(
          selfAddress,
          targetAddress,
          signer
        );
        setOngoingTxId(result.txId);
        setTimeout(() => {
          checkMarketplace()
        }, timeouttime);
      } else {
        console.error('No available index found.');
      }
    } else {
      // Handle the case where selectedNftContractId is null or other conditions are not met
      console.error('Invalid input or missing signer or selectedNftContractId.');
    }
  };

  const handleAnathemaByHighLord = async () => {
    if (signer && selectedNftContractId) {
      const declarerLordAddress = addressFromContractId(selectedNftContractId);
      const scroundrelAddress = addressFromContractId(expandedNftData.nftcontractid);
      const bribe = BigInt(anathemaBribeAmount);
      const reason = anathemaReason;
      const feudallord = expandedNftData.feudallord;
      // Call the execute method of getAvailableIndex to get the lordSubjectIndex
      if (feudallord == declarerLordAddress) {
        const fealtyId = FealtyConfig.fealtyId;
        const goldtokenid = GoldTokenConfig.GoldTokenId;
        const result = await declareAnathemaByLord(
          scroundrelAddress,
          declarerLordAddress,
          bribe,
          reason,
          signer
        );
        setOngoingTxId(result.txId);
        setTimeout(() => {
          checkMarketplace()
        }, timeouttime);
        }
      else {
        // If lordSubjectIndex is not -1, it means a valid index is available
        const fealtyId = FealtyConfig.fealtyId;
        const goldtokenid = GoldTokenConfig.GoldTokenId;
        const result = await declareAnathemaByHighLord(
          scroundrelAddress,
          declarerLordAddress,
          bribe,
          reason,
          signer
        );
        setOngoingTxId(result.txId);
      }
    } else {
      // Handle the case where selectedNftContractId is null or other conditions are not met
      console.error('Invalid input or missing signer or selectedNftContractId.');
    }
  };

  
    const handleBuyListing = async (listingprice: number, nftId: string) => {
      if (signer && nftId) {
        const price =  BigInt(listingprice);
        if (nftId) {
          const result = await buyListing(
            nftId,
            price,
            signer
          );
          setOngoingTxId(result.txId);
          setTimeout(() => {
            checkMarketplace()
          }, timeouttime);
        } else {
          console.error('No available index found.');
        }
      } else {
        // Handle the case where selectedNftContractId is null or other conditions are not met
        console.error('Invalid input or missing signer or selectedNftContractId.');
      }
    };

    const handleCreateListing = async () => {
      if (signer && selectedNftContractId) {
        const price =  BigInt(Math.floor(parseFloat(priceAmount) * 10 ** 18));
        const nftId = selectedNftContractId;
        if (nftId) {
          // If lordSubjectIndex is not -1, it means a valid index is available
          const fealtyId = FealtyConfig.fealtyId;
          const goldtokenid = GoldTokenConfig.GoldTokenId;
          const result = await createListing(
            nftId,
            price,
            signer
          );
          setOngoingTxId(result.txId);
          setTimeout(() => {
            checkMarketplace()
          }, timeouttime);
        } else {
          console.error('No available index found.');
        }
      } else {
        // Handle the case where selectedNftContractId is null or other conditions are not met
        console.error('Invalid input or missing signer or selectedNftContractId.');
      }
    };


    const handleRevokeListing = async (nftId: string) => {
      if (signer && nftId) {
        if (nftId) {
          console.log(nftId)
          const result = await revokeListing(
            nftId,
            signer
          );
          setOngoingTxId(result.txId);
          setTimeout(() => {
            checkMarketplace()
          }, timeouttime);
        } else {
          console.error('No available index found.');
        }
      } else {
        console.error('Invalid input or missing signer or selectedNftContractId.');
      }
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

const handleExploreOverlords = () => {
  // Construct the route using string interpolation
  const route = `/fealty`;
  
  // Navigate to the constructed route
  router.push(route);
};

const handleExploreLord = (nftSelfContractAddress: string) => {
  // Construct the route using string interpolation
  const route = `/fealty/overlord/underlord/${nftSelfContractAddress}`;
  
  // Navigate to the constructed route
  router.push(route);
};





const sortedNftData = [...(Array.isArray(nftData) ? nftData : [])].sort((a, b) => b.rarity - a.rarity);

const sortedListingData = [...(Array.isArray(marketplaceListings) ? marketplaceListings : [])].sort((a, b) => b.rarity - a.rarity);


const isLister = (lister: string) => {
  if (lister == account?.address) {
    return true;
  }
  else {
  return false; // or handle the case when nftData is not available
  }
};


  return (
<div className={styles.marriageoffersbackground} style= { {  
  backgroundImage: `url(/backgrounds/marketplace.webp)`,
  backgroundSize: '1800px', // Let the browser size the background image
 } } >
  <div className={styles.twoColumnLayout}>
    <ul className={styles.collection} style= { { backgroundColor: '#033d5aa0' , color: '#ffffff' } } >
      <h1>Marketplace Listings &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; Trading coming soon</h1>
      {sortedListingData.map((offer, index) =>(
        <li key={index} className={`${styles.nft} ${expandedIndex === index ? styles.expanded : ''}`}  style= { { backgroundColor: '#033d5aa0',
        border: isLister(offer.lister) ? '5px solid gold' : 'none' 
         } }  onClick={() => toggleExpand(index)}>
  <div className={styles.threeColumnLayout} style= { {  display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative'  } } >
    <div style= { {  display: 'flex', flexDirection: 'column', alignItems: 'left', fontFamily:'TimesNewRoman'  } } >
    <p style= { {  fontWeight: 'bold'  } } >R.{offer.rarity}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; The {getKingdomType(offer.rarity)} of the {offer.title} {offer.name} </p>
    </div>
    <div style= { {  display: 'flex', flexDirection: 'column', alignItems: 'right'  } } >
    <div style= { {  display: 'flex', flexDirection: 'row', alignItems: 'center' } } >

        <Image src={`/allegiance/${offer.allegiance.replace(/\s+/g, '_').toLowerCase()}.png`} alt="png" style={{ marginRight: '5px', marginLeft:'5px' }} width={55} height={55} />
    <Image src={`/class/${offer.rarity}.png`} alt="png" style={{ marginRight: '5px' }} width={55} height={55} />  
    <div className={styles.powertextbox}>
        <p>{offer.price / 1e18} ALPH</p>
        </div>
    </div>
    </div>
  </div>
          {expandedIndex === index && (
            <div className={styles.imageContainer}>
              <div className={styles.threeColumnLayout} style= { {  display: 'flex', justifyContent: 'space-between', alignItems: 'center'  } } >
              <div >
              <div className={styles.smallpowertextbox}>
              <p >{offer.members - 1} vassals</p>
              </div>
              <div className={styles.smallpowertextbox}>
              <p >Votingpower: {offer.votingpower}</p>
              </div>
              <div className={styles.smallpowertextbox}>
              <p >Total attack power: {offer.maxpowerpotential}</p>
              </div>
              <div className={styles.smallpowertextbox}>
              <p>Total defensive power: {offer.maxdefensivepower}</p>
            </div>
            <div className={styles.bigpowertextbox}>
              <p>{offer.unique_trait}</p>
              </div>
              </div>
              <div style= { {  display: 'flex', flexDirection: 'column', alignItems: 'right'  } } >


              <div >


            <div className={styles.smallinfotextbox}>
              <p >Allegiance: {offer.allegiance}</p>
              </div>
              <div className={styles.smallinfotextbox}>
              <p>Item: {offer.item}</p>
            </div>
            { offer.wife != 'Unmarried' && (
            <div className={styles.smallinfotextbox}>
              <p>Married to: {offer.wife}</p>
            </div>
            )}
            { offer.wife == 'Unmarried' && (
            <div className={styles.smallinfotextbox}>
              <p>Unmarried</p>
            </div>
            )}
            { offer.wartargetname != 'N.A.' && (
            <div className={styles.smallinfotextbox}>
              <p>At war with: {offer.wartargetname}</p>
            </div>
            )}
            { offer.wartargetname == 'N.A.' && (
            <div className={styles.smallinfotextbox}>
              <p>Not at war</p>
            </div>
            )}
              { offer.overlord != addressFromContractId(offer.nftid) && (
            <div className={styles.smallinfotextbox}>
              <p>Vassal of {offer.overlordname}</p>
            </div>
            )}
            { offer.overlord == addressFromContractId(offer.nftid) && (
            <div className={styles.smallinfotextbox}>
              <p>Overlord of the {getKingdomType(offer.rarity)}</p>
            </div>
            )}
              </div>
              <div>

                <button
                className={styles.explorekingdombutton}
                onClick={(e) => { 
                    e.stopPropagation(); // Stop the event from bubbling up
                    handleExploreKingdom(offer.nftselfcontractaddress); // Call the handler function
                 } } >
                Explore this {getKingdomType(offer.rarity)}
                </button>
                <button
                className={styles.explorelordbutton}
                onClick={(e) => { 
                    e.stopPropagation(); // Stop the event from bubbling up
                    handleExploreLord(offer.nftselfcontractaddress); // Call the handler function
                 } } >
                {offer.name}
                </button>
                </div>
            </div>

              <div>
                { offer.lister != account?.address && (
                <button 
                className={styles.buykingdombutton}
                onClick={(e) => { 
                    e.stopPropagation(); // Stop the event from bubbling up
                    handleBuyListing(offer.price, offer.nftid); // Call the handler function
                 } } >
                Buy this {getKingdomType(offer.rarity)}
                </button>
                  )}
                                  { offer.lister == account?.address && (
                <button style = { { backgroundColor:'#000000' } } 
                className={styles.buykingdombutton}
                onClick={(e) => { 
                    e.stopPropagation(); // Stop the event from bubbling up
                    handleRevokeListing(offer.nftid); // Call the handler function
                 } } >
                Revoke this listing
                </button>
                  )}
                </div>
          </div>
            </div>
          )}
        </li>
      ))}
    </ul>
    <div className={styles.overlordinfoscroll} style= { { backgroundColor:'#033d5aa0' } } >



      {expandedIndex == null && selectedNftContractId == '' &&  (
        <img width="450rem" height="450rem" src={`/goldcoins.webp`} alt={`NFT ${expandedNftData?.nftindex}`}/>
      )}
{expandedIndex !== null && sortedListingData[expandedIndex] &&  selectedNftContractId == '' &&  (
  <img src={`${expandedNftData?.nfturi}`} alt={`NFT ${expandedNftData?.nftindex}`} width="450rem" height="450rem"/>
)}

{selectedNftContractId !== '' && (
  <img src={`${getNFTUriByContractAddress(selectedNftContractId)}`} alt={`NFT ${expandedNftData?.nftindex}`} width="450rem" height="450rem" style= { {  border: '3px solid green'  } } 
  />
)}







  
      <select style= { { backgroundColor: 'rgb(22, 97, 202)', color: '#FFD700', textShadow: '0 0 2px #000000' } } 
        className={styles.fealtyselect}
        value={selectedNftContractId}
        onChange={handleSelectChange}
           >
        <option value="">Select an NFT</option>
        {sortedNftData
          .map((nft) => (
            <option key={nft.nftcontractid} value={nft.nftcontractid}>
              {nft.rarity} {nft.name}, {nft.title}
            </option>
          ))}
        </select>
        <button style= { { backgroundColor: 'rgb(22, 97, 202)', color: '#FFD700', textShadow: '0 0 2px #000000' } } 
        className={styles.fealtybribeofferbutton}
        onClick={handleCreateListing}
        disabled={!selectedNftContractId} // Disable the button if no option is selected
        >
        Create listing
        </button>

        <div className={styles.inputContainer} >
            <div className={styles.inputField} >
              <label style= { { backgroundColor: 'rgb(22, 97, 202)', color: '#FFD700', textShadow: '0 0 2px #000000' } }  className={styles.fealtyInputField} htmlFor="time-amount">
                Price in ALPH:
              </label>
              <input className={styles.fealtyInput} style= { { backgroundColor: 'rgba(55, 108, 183, 0.64)', color: '#FFD700', textShadow: '0 0 2px #000000' } } 
                type="number"
                id="time-amount"
                name="time"
                max="1"
                min="10000"
                value={priceAmount}
                onChange={(e) => {
                  setPriceAmount(e.target.value);
                 } } 
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => adjustFontSize(e.target)}
              />
            </div>
           
          </div>
    
 


























    </div>
  </div>

</div>
  );
};

export default Marketplace;