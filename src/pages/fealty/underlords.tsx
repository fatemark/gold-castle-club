// pages/index.tsx
import React, { useState, useEffect } from 'react';
import { createFealtyForGoldContract,  declareWar } from '@/services/swearfealty.service'
import { useWallet, AlephiumConnectButtonCustom } from '@alephium/web3-react'
import { node, addressFromContractId } from '@alephium/web3'
import { FealtyConfig } from '@/services/utils.fealty';
import { GoldTokenConfig } from '@/services/utils';
import getOwnedNfts from '@/services/walletquery';
import styles from '../../styles/Fealty.module.css'
import { getAvailableIndex } from '../../services/database_services/serverContractsQuery'
import { useRouter } from 'next/router';
import { createMarriageOffer, becomeLover } from '../../services/marriage.service'
import { declareAnathemaByLord, declareAnathemaByHighLord } from '../../services/anathema.service'
import { getUnderlords, getattackers, getAnathemaDeclarerDeclarations } from '../../services/database_services/fealtyQuery'
import { checkFealtycontract } from '../../services/database_services/serverContractsQuery';
import Image from 'next/image';
import { getKingdomType, getbackground, getLoverParamour, getgendersuffix, getLoverCount, getwartarget, adjustFontSize } from '../../services/kingdom_services/kingdom';

const Underlords: React.FC = () => {

const { signer, account } = useWallet()
const [bribeAmount, setBribeAmount] = useState('')
const [minimumRarity, setMinimumRarity] = useState('')
const [nftData, setNftData] = useState<any[]>([]);
const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
const [campaignMessage, setCampaignMessage] = useState('');
const [isValidInput, setIsValidInput] = useState(true); // Set to true initially
const [selectedNftContractId, setSelectedNftContractId] = useState<string>('');
const [expandedNftData, setExpandedNftData] = useState<any | null>(null);
const [underlords, setunderlords] = useState<any[]>([]);
const [loveLetter, setLoveLetter] = useState('');
const [anathemaReason, setanathemaReason] = useState('');
const [dowryAmount, setdowryAmount] = useState('')
const [anathemaBribeAmount, setanathemaBribeAmount] = useState('')
const [timeAmount, setTimeAmount] = useState('')
const [ongoingTxId, setOngoingTxId] = useState<string>()
const [activeButton, setActiveButton] = useState(0);
const [attackers, setAttackers] = useState<any[]>([]);
const [anathemaDeclarations, setAnathemaDeclarations] = useState<any[]>([]);

function getNFTUriByContractAddress(inputid: string) {
  const nft = nftData.find(item => item.nftcontractid === inputid);
  if (nft && nft.nfturi) {
      return nft.nfturi;
  } else {
      return null; // or any other indication that the NFT was not found
  }
}

const handleSwitchChange = (index: number) => {
  setActiveButton(index);
  setSelectedNftContractId('')
};

useEffect(() => {
  async function fetchAttackers() {
    if (expandedNftData) { // Check if expandedNftData is not null
      const fetchedAttackers = await getattackers(expandedNftData.nftselfcontractaddress);

      // Check if fetchedAttackers is an array before sorting
      if (Array.isArray(fetchedAttackers)) {
        console.log('lentgh:', fetchedAttackers.length)
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
}, [expandedNftData]); 

useEffect(() => {
  async function fetchAnathemaDeclarations() {
    if (expandedNftData) { // Check if expandedNftData is not null
      console.log(expandedNftData.nftselfcontractaddress)
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

useEffect(() => {
    async function fetchunderlords() {
        const fetchedunderlords = await getUnderlords();
        if (Array.isArray(fetchedunderlords)) {
        fetchedunderlords.sort((a, b) => {
            // First, sort by rarity
            if (b.rarity !== a.rarity) {
                return b.rarity - a.rarity; // Sort by rarity descending
            } else {
                // If rarity is equal, sort by voting power
                return b.votingpower - a.votingpower; // Sort by voting power descending
            }
        });
        setunderlords(fetchedunderlords);
      }
    }

    fetchunderlords();
}, []);


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

const findHighestvotingpowerNftIndex = (underlords: any[]) => {
  if (underlords.length === 0 || !underlords[0]) {return null}
  let highestvotingpowerIndex = 0;
  let highestvotingpowerValue = underlords[0].votingpower;
  for (let i = 1; i < underlords.length; i++) {
    if (underlords[i] && underlords[i].votingpower > highestvotingpowerValue) {
      highestvotingpowerIndex = i;
      highestvotingpowerValue = underlords[i].votingpower;
    }
  }
  return highestvotingpowerIndex;
};
const toggleExpand = (index: number) => {
  setExpandedIndex(expandedIndex === index ? null : index);
  if (expandedIndex === index) {
    setExpandedNftData(null); // Collapse the currently expanded item
  } else {
    setExpandedNftData(underlords[index]); // Expand the clicked item
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



const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedContractId = event.target.value;
  console.log(selectedContractId)
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
    console.log(bribe,
      time,
      lordAddress,
      minimumClass,
      BigInt(lordSubjectIndex), // Use the obtained lordSubjectIndex
      campaignMessage,
      subjecttarget,
      signer)
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
     checkFealtycontract();
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
     checkFealtycontract();
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
     checkFealtycontract();
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
      console.log(reason)
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
     checkFealtycontract();
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
     checkFealtycontract();
      }
    } else {
      // Handle the case where selectedNftContractId is null or other conditions are not met
      console.error('Invalid input or missing signer or selectedNftContractId.');
    }
  };

  const handleBecomeLover = async () => {
    if (signer && expandedNftData) {
      const selfloverAddress = expandedNftData.nftselfcontractaddress;
      const lovertargetAddress = addressFromContractId(selectedNftContractId);
      const result = await becomeLover(
        selfloverAddress, 
        lovertargetAddress,
        signer
        );
        setOngoingTxId(result.txId);
     checkFealtycontract();
    }
else {
      // Handle the case where selectedNftContractId is null or other conditions are not met
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

const defaultImageIndex = expandedIndex === null ? findHighestvotingpowerNftIndex(underlords) : null;



const sortedNftData = [...(Array.isArray(nftData) ? nftData : [])].sort((a, b) => b.rarity - a.rarity);



  return (
<div style= { {  
  backgroundImage: `url(/backgrounds/fatemark_Cats_in_golden_armor_in_front_of_a_golden_castle_Larry_b11cab21-7334-4122-8cda-d4e2721f9172_resized.webp)`,
  backgroundSize: '1600px', // Let the browser size the background image
  backgroundRepeat: 'repeat', // Repeat the background image
  height: '100vh',
  width: '100%',
  paddingTop: '100px',
  overflow: 'auto' // or 'hidden' depending on your layout
 } } >
{underlords.length > 0 && (
  <div className={styles.collectiontwoColumnLayout}>
    <ul className={styles.collection} style= { { backgroundColor: 'rgba(8, 81, 155, 0.432)' , color: '#FFFFFF' } } >
      <h1>The underlords &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; The lone wolves &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; Lords without vassals</h1>
      {underlords.map((nft, index) =>(
        <li key={index} className={`${styles.nft} ${expandedIndex === index ? styles.expanded : ''}`}  style= { { backgroundColor: 'rgba(180, 59, 3, 0.766)'  } }  onClick={() => toggleExpand(index)}>
  <div className={styles.threeColumnLayout} style= { {  display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative'  } } >
    <div style= { {  display: 'flex', flexDirection: 'column', alignItems: 'left', fontFamily:'NewTimesRoman'  } } >
    <p style= { {  fontWeight: 'bold'  } } >R.{nft.rarity}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; The {getKingdomType(nft.rarity)} of the {nft.title} {nft.name} </p>
    </div>
    <div style= { {  display: 'flex', flexDirection: 'column', alignItems: 'right'  } } >
    <div style= { {  display: 'flex', flexDirection: 'row', alignItems: 'center' } } >

        <div className={styles.powertextbox}>
        <p>{nft.votingpower} &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;{nft.maxpowerpotential}&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;{nft.maxdefensivepower}</p>
        </div>
        <div style= { {  display: 'flex', flexDirection: 'column', alignItems: 'right', marginLeft:'5px'  } }>
          <Image src={`/item/${nft.item.replace(/\s+/g, '_').toLowerCase()}.png`} alt="png" style= { {  alignSelf: 'end', marginRight:'5px'  } } width={55} height={55}/>
          </div>
    <div style= { {  display: 'flex', flexDirection: 'column', alignItems: 'right'  } }>
          <Image src={`/allegiance/${nft.allegiance.replace(/\s+/g, '_').toLowerCase()}.png`} alt="png" style= { {  alignSelf: 'end', marginRight:'5px'  } } width={55} height={55}/>
          </div>
        <Image src={`/class/${nft.rarity}.png`} alt="png" style= { {  alignSelf: 'end', marginLeft:'5px'  } } width={55} height={55}/> 
             </div>
    </div>
  </div>
          {expandedIndex === index && (
            <div className={styles.imageContainer}>
              <div className={styles.threeColumnLayout} style= { {  display: 'flex', justifyContent: 'space-between', alignItems: 'center'  } } >
              <div >
              <div className={styles.smallpowertextbox}>
              <p >{nft.members - 1} vassals</p>
              </div>
              <div className={styles.smallpowertextbox}>
              <p >Total attack power: {nft.maxpowerpotential}</p>
              </div>
              <div className={styles.smallpowertextbox}>
              <p>Total defensive power: {nft.maxdefensivepower}</p>
            </div>
            <div className={styles.bigpowertextbox}>
              <p>{nft.unique_trait}</p>
              </div>
              </div>
              <div style= { {  display: 'flex', flexDirection: 'column', alignItems: 'right'  } } >


              <div >
              <div className={styles.smallinfotextbox}>
              <p >{nft.class}</p>
              </div>
              <div className={styles.smallinfotextbox}>
              <p>Votingpower: {nft.votingpower}</p>
            </div>
            <div className={styles.smallinfotextbox}>
              <p >Allegiance: {nft.allegiance}</p>
              </div>
              <div className={styles.smallinfotextbox}>
              <p>Item: {nft.item}</p>
            </div>
              <div className={styles.smallinfotextbox}>
              <p >Solo: {nft.solo_attack}</p>
              </div>
              <div className={styles.smallinfotextbox}>
              <p>Group: {nft.group_attack}</p>
            </div>
            { nft.potentialmarriage != nft.nftselfcontractaddress && (
            <div className={styles.smallinfotextbox}>
              <p>Married to: {nft.wife}</p>
            </div>
            ) }
              { nft.potentialmarriage == nft.nftselfcontractaddress && (
            <div className={styles.smallinfotextbox}>
              <p>Unmarried</p>
            </div>
            ) }
              { nft.wartarget != nft.nftselfcontractaddress && (
            <div className={styles.smallinfotextbox}>
              <p>At war with: {nft.wartargetname}</p>
            </div>
            ) }
              { nft.wartarget == nft.nftselfcontractaddress && (
            <div className={styles.smallinfotextbox}>
              <p>Not at war</p>
            </div>
            ) }
            <div className={styles.smallinfotextbox}>
              <p>{nft.domain}, {nft.subdomain}</p>
            </div>
              </div>

            </div>
              <div>

                <button
                className={styles.explorelordbutton}
                onClick={(e) => { 
                    e.stopPropagation(); // Stop the event from bubbling up
                    handleExploreLord(nft.nftselfcontractaddress); // Call the handler function
                 } } >
                {nft.name}
                </button>
                </div>
          </div>
            </div>
          )}
        </li>
      ))}
    </ul>
    <div className={styles.overlordinfoscroll}>


    <div className={styles.buttonContainer}>
  <button style= { { backgroundColor: '#FF69B4' } }  onClick={() => handleSwitchChange(0)}>
    Marriage
  </button>
  <button style= { { backgroundColor: '#ffd000' } }  onClick={() => handleSwitchChange(1)}>
    Fealty
  </button>
  <button style= { { backgroundColor: '#b50c0c' } }  onClick={() => handleSwitchChange(2)}>
    War
  </button>
  <button style= { { backgroundColor: '#000000' } }  onClick={() => handleSwitchChange(3)}>
    Anathema
  </button>
</div>



      {defaultImageIndex !== null && selectedNftContractId == '' && (
        <img src={`https://xasdsxuik7lxfsh5ugx3at6of2bxjihsbk45linvxgjalpqquxoq.arweave.net/uCQ5XohX13LI_aGvsE_OLoN0oPIKudWhtbmSBb4Qpd0`} width="500vw" height="500vw" alt={'Old Asia'} />
      )}
{expandedIndex !== null && selectedNftContractId == '' && (
  <img src={`${expandedNftData?.nfturi}`} alt={`NFT ${expandedNftData?.nftindex}`} 
  width="500vw" height="500vw"/>
)}

{selectedNftContractId != '' && expandedIndex != null && (
<div className={styles.twoColumnLayout}>
  <img src={`${expandedNftData?.nfturi}`} alt={`NFT ${expandedNftData?.nftindex}`} width="50%" height="50%" />
  <img src={`${getNFTUriByContractAddress(selectedNftContractId)}`} alt={`NFT ${expandedNftData?.nftindex}`} width="50%" height="50%" style= { {  border: '3px solid green'  } } />

</div>)}

{selectedNftContractId != '' && expandedIndex == null && (
  <img src={`${getNFTUriByContractAddress(selectedNftContractId)}`} alt={`NFT ${expandedNftData?.nftindex}`} style= { {  border: '3px solid green'  } } />
)}




      {activeButton === 0 && ( 
<div >
      <select style= { { backgroundColor: '#FF69B4', color: '#ADD8E6', textShadow: '0 0 2px #000000' } } 
        className={styles.fealtyselect}
        value={selectedNftContractId}
        onChange={handleSelectChange}
           >
        <option value="">Select a subject</option>
        {sortedNftData
          .filter(nft => nft.rarity < expandedNftData?.rarity && nft.marriagetime < Date.now() && nft.gender !== expandedNftData?.gender)
          .map((nft) => (
            <option key={nft.nftcontractid} value={nft.nftcontractid}>
              {nft.rarity} {nft.name}, {nft.title}
            </option>
          ))}
        </select>
        <button style= { { backgroundColor: '#FF69B4', color: '#ADD8E6', textShadow: '0 0 2px #000000' } } 
        className={styles.fealtybribeofferbutton}
        onClick={handleCreateSpecificMarriageContract}
        disabled={!selectedNftContractId} // Disable the button if no option is selected
        >
        Propose to {expandedNftData?.name}
        </button>

        { expandedNftData != null && (
          <button style= { { backgroundColor: 'rgba(220, 64, 186, 0.636', color: '#FFD700', textShadow: '0 0 2px #000000', fontFamily: 'TimesNewRoman' } } 
        className={styles.fealtybribeofferbutton}
        onClick={handleBecomeLover}
        disabled={!selectedNftContractId} // Disable the button if no option is selected
        >
        Become {getLoverParamour(expandedNftData.gender, expandedNftData.rarity)} of {expandedNftData?.name}
        </button>
        )}

        <div className={styles.inputContainer} >
            <div className={styles.inputField} >
              <label style= { { backgroundColor: '#FF69B4', color: '#ADD8E6', textShadow: '0 0 2px #000000' } }  className={styles.fealtyInputField} htmlFor="time-amount">
                Time (in days):
              </label>
              <input className={styles.fealtyInput} style= { { backgroundColor: 'rgba(205, 105, 180, 0.5)', color: '#ADD8E6', textShadow: '0 0 2px #000000' } } 
                type="number"
                id="time-amount"
                name="time"
                max="1"
                min="10000"
                value={timeAmount}
                onChange={(e) => {
                  setTimeAmount(e.target.value);
                 } } 
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => adjustFontSize(e.target)}
              />
            </div>
            <div className={styles.inputField}>
              <label style= { { backgroundColor: '#FF69B4', color: '#ADD8E6', textShadow: '0 0 2px #000000' } }  className={styles.fealtyInputField} htmlFor="dowry-amount">
                Your dowry:
              </label>
              <input className={styles.fealtyInput}  style= { { backgroundColor: 'rgba(205, 105, 180, 0.5)', color: '#ADD8E6', textShadow: '0 0 2px #000000' } } 
                type="number"
                id="dowry-amount"
                name="dowry"
                max="2000000000000000000000000000000000000000000"
                min="1"
                value={dowryAmount}
                onChange={(e) => {
                  setdowryAmount(e.target.value);
                  setIsValidInput(!isNaN(parseFloat(e.target.value)));
                 } } 
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => adjustFontSize(e.target)}
              />
            </div>
          </div>
          <div className={styles.inputContainer}>
            <div className={styles.inputField}>
              <label style= { { backgroundColor: '#FF69B4', color: '#ADD8E6', textShadow: '0 0 2px #000000' } }  className={styles.fealtyInputField} htmlFor="love-letter">
                Love letter:
              </label>
              <textarea 
                className={styles.fealtyInput}
                id="love-letter"
                name="loveletter"
                value={loveLetter}
                onChange={(e) => setLoveLetter(e.target.value)}
                style= { {  backgroundColor: 'rgba(205, 105, 180, 0.5)', color: '#ADD8E6', textShadow: '0 0 2px #000000', wordWrap: 'break-word', overflowY: 'auto', fontSize: '16px'  } } 
                maxLength={144}
              />
            </div>
          </div>
  </div> )}


  {activeButton === 1 && ( 
<div>
      <select
        className={styles.fealtyselect}
        value={selectedNftContractId}
        onChange={handleSelectChange}
           >
        <option value="">Select a subject</option>
        {sortedNftData
          .filter(nft => nft.rarity > expandedNftData?.rarity)
          .map((nft) => (
            <option key={nft.nftcontractid} value={nft.nftcontractid}>
              {nft.rarity} {nft.name}, {nft.title}
            </option>
          ))}
        </select>
        <button
        className={styles.fealtybribeofferbutton}
        onClick={handleCreateFealtyContract}
        disabled={!selectedNftContractId} // Disable the button if no option is selected
        >
        Ask fealty from {expandedNftData?.name} 
        </button>

        <div className={styles.inputContainer}>
            <div className={styles.inputField}>
              <label className={styles.fealtyInputField} htmlFor="time-amount">
                Time (in days):
              </label>
              <input className={styles.fealtyInput} 
                type="number"
                id="time-amount"
                name="time"
                max="100000000000000"
                min="1"
                value={timeAmount}
                onChange={(e) => {
                  setTimeAmount(e.target.value);
                 } } 
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => adjustFontSize(e.target)}
              />
            </div>
            <div className={styles.inputField}>
              <label className={styles.fealtyInputField} htmlFor="dowry-amount">
                Your bribe:
              </label>
              <input className={styles.fealtyInput}
                type="number"
                id="dowry-amount"
                name="dowry"
                max="2000000000000000000000000000000000000000000"
                min="1"
                value={bribeAmount}
                onChange={(e) => {
                  setBribeAmount(e.target.value);
                  setIsValidInput(!isNaN(parseFloat(e.target.value)));
                 } } 
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => adjustFontSize(e.target)}
              />
            </div>
          </div>
          <div className={styles.inputContainer}>
            <div className={styles.inputField}>
              <label className={styles.fealtyInputField} htmlFor="campaignMessage">
                Campaign message:
              </label>
              <textarea 
                className={styles.fealtyInput}
                id="campaignMessage"
                name="campaignMessage"
                value={campaignMessage}
                onChange={(e) => setCampaignMessage(e.target.value)}
                style= { {  wordWrap: 'break-word', overflowY: 'auto', fontSize: '16px'  } } 
                maxLength={144}
              />
            </div>
          </div>
  </div> )}



  {activeButton === 2 && ( 
<div>
<select style= { { backgroundColor: '#b50c0c', color: '#ffd000', textShadow: '0 0 2px #000000' } } 
className={styles.fealtyselect}
value={selectedNftContractId}
onChange={handleSelectChange}
   >
<option value="">Select a subject</option>
{sortedNftData
  .map((nft) => (
    <option key={nft.nftcontractid} value={nft.nftcontractid}>
      {nft.rarity} {nft.name}, {nft.title}
    </option>
  ))}
</select>
<button
className={styles.fealtybribeofferbutton}
onClick={handleDeclareWar}
disabled={!selectedNftContractId} // Disable the button if no option is selected
>
Declare war on {expandedNftData?.name}
</button>
{ expandedNftData != null && attackers.length > 0 && expandedNftData.wartarget != expandedNftData.nftselfcontractaddress &&(
<div>
          <div className={styles.overlordinfobox} style= { { backgroundColor: '#ff19008a' } } >
            <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } } >
              <h1>{expandedNftData.name} is at war with {expandedNftData.wartargetname}</h1>
            </div>
          </div>

          <div className={styles.overlordinfobox} style= { { backgroundColor: '#ff19008a' } } >
            <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } } >
             <h1>{expandedNftData.name} is being attacked by these members:</h1>
            </div>
            <ul>
             {attackers.map((attacker, index) =>(
              <button className={styles.fealtybribeofferbutton} style= { { fontFamily: 'TimesNewRoman' } }  
              key = {index} 
              onClick={(e) => { 
               e.stopPropagation(); // Stop the event from bubbling up
               handleExploreKingdom(attacker.nftselfcontractaddress); // Call the handler function
               } } 
               >
              The {getKingdomType(attacker.rarity)} of {attacker.name}

              </button>
              ))}
            </ul>
          </div>
        </div>
        
)}


{ expandedNftData != null && attackers.length == 0 && expandedNftData.wartarget != expandedNftData.nftselfcontractaddress &&(
<div>
      <div className={styles.overlordinfobox} style= { { backgroundColor: '#ff19008a' } } >
        <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } } >
          <h1>{expandedNftData.name} is at war with {expandedNftData.wartargetname}</h1>
        </div>

          </div>

<div className={styles.overlordinfobox} style= { { backgroundColor: '#ff19008a' } } >
  <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } } >
    <h1>{expandedNftData.name} is not under attack</h1>
  </div>
</div>
</div>
)}







{ expandedNftData != null && attackers.length > 0 && expandedNftData.wartarget == expandedNftData.nftselfcontractaddress &&(
<div>
      <div className={styles.overlordinfobox} style= { { backgroundColor: '#ff19008a' } } >
        <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } } >
          <h1>{expandedNftData.name} is not at war</h1>
        </div>
          </div>

<div className={styles.overlordinfobox} style= { { backgroundColor: '#ff19008a' } } >
  <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } } >
    <h1>{expandedNftData.name} is being attacked by these members:</h1>
  </div>
  <ul>
{attackers.map((attacker, index) =>(
  <button className={styles.fealtybribeofferbutton} style= { { fontFamily: 'TimesNewRoman' } }    
  key = {index}      
  onClick={(e) => { 
    e.stopPropagation(); // Stop the event from bubbling up
    handleExploreKingdom(attacker.nftselfcontractaddress); // Call the handler function
   } } 
  >
The {getKingdomType(attacker.rarity)} of {attacker.name}

  </button>
))}
</ul>
</div>
</div>

)}






{ expandedNftData != null && attackers.length === 0 && expandedNftData.wartarget === expandedNftData.nftselfcontractaddress &&(
  <div>
              <div className={styles.overlordinfobox} style= { { backgroundColor: '#ff19008a' } } >
                  <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } } >
                    <h1>{expandedNftData.name} is not at war</h1>
                  </div>
          </div>
          <div className={styles.overlordinfobox} style= { { backgroundColor: '#ff19008a' } } >
          <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } } >
            <h1>{expandedNftData.name} is not under attack</h1>
          </div>

          </div>
  </div>
)}
</div>
)}



{activeButton === 3 && ( 

  <div >
    {expandedNftData != null && expandedNftData.anathema == false && (
    <div>
      <select style= { { backgroundColor: '#000000', color: '#ffd000', textShadow: '0 0 2px #000000' } } 
        className={styles.fealtyselect}
        value={selectedNftContractId}
        onChange={handleSelectChange}
           >
        <option value="">Select a subject</option>
        {sortedNftData
        .filter(nft => (nft.rarity - (expandedNftData?.rarity ?? 0) >= 3) || (nft.nftselfcontractaddress === expandedNftData?.feudallord))
        .map((nft) => (
            <option key={nft.nftcontractid} value={nft.nftcontractid}>
              {nft.rarity} {nft.name}, {nft.title}
            </option>
          ))}
        </select>
        <button  style= { { backgroundColor: '#000000', color: '#ffd000', textShadow: '0 0 2px #000000' } } 
        className={styles.fealtybribeofferbutton}
        onClick={handleAnathemaByHighLord}
        disabled={!selectedNftContractId && !bribeAmount} // Disable the button if no option is selected
        >
        Declare Anathema on {expandedNftData?.name}
        </button>

        <div className={styles.inputContainer} >

                <div className={styles.inputField}>
                  <label style= { { backgroundColor: '#000000', color: '#ffd000', textShadow: '0 0 2px #000000' } }  className={styles.fealtyInputField} htmlFor="dowry-amount">
                    Open for bribes:
                  </label>
                  <input className={styles.fealtyInput}  style= { {  backgroundColor: 'rgba(211, 211, 211, 0.1)', color: '#ffd000', textShadow: '0 0 2px #000000' } } 
                    type="number"
                    id="dowry-amount"
                    name="dowry"
                    max="2000000000000000000000000000000000000000000"
                    min="1"
                    value={anathemaBribeAmount}
                    onChange={(e) => {
                      setanathemaBribeAmount(e.target.value);
                      setIsValidInput(!isNaN(parseFloat(e.target.value)));
                     } } 
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => adjustFontSize(e.target)}
                  />
                </div>
            <div className={styles.inputField}>
              <label style= { { backgroundColor: '#000000', color: '#ffd000', textShadow: '0 0 2px #000000' } }  className={styles.fealtyInputField} htmlFor="love-letter">
                Reason:
              </label>
              <textarea 
                className={styles.fealtyInput}
                id="anathemaReason"
                name="anathemaReason"
                value={anathemaReason}
                onChange={(e) => setanathemaReason(e.target.value)}
                style= { {  backgroundColor: 'rgba(211, 211, 211, 0.1)', color: '#ffd000', textShadow: '0 0 2px #000000', wordWrap: 'break-word', overflowY: 'auto', fontSize: '16px'  } } 
                maxLength={144}
              />
            </div>
      </div>
      </div>)}



          { expandedNftData != null && anathemaDeclarations.length > 0 && expandedNftData.anathema == false &&(
<div>
          <div className={styles.overlordinfobox} style= { { backgroundColor: '#000000' } } >
            <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } } >
             <h1>{expandedNftData.name} has declared anathema</h1>
            </div>
            <ul>
             {anathemaDeclarations.map((declaration, index) =>(
              <div   key = {index} > 
              { declaration.members > 1 && (
            <button className={styles.fealtybribeofferbutton} style= { { fontFamily: 'TimesNewRoman' } }
            key = {index}                
            onClick={(e) => { 
             e.stopPropagation(); // Stop the event from bubbling up
             handleExploreKingdom(declaration.scroundreladdress); // Call the handler function
             } } 
             >
            On the {getKingdomType(declaration.rarity)} {declaration.name}
            </button>
              )}
                              { declaration.members == 1 && (
            <button className={styles.fealtybribeofferbutton} style= { { fontFamily: 'TimesNewRoman', backgroundColor:'#0B45C1', color:'#ffd000', textShadow: '0 0 2px #000000' } }          
            key = {index}      
            onClick={(e) => { 
             e.stopPropagation(); // Stop the event from bubbling up
             handleExploreLord(declaration.scroundreladdress); // Call the handler function
             } } 
             >
            On {declaration.name}
            </button>
              )}
            </div>
            
              ))}
            </ul>
          </div>
        </div>
        
)}


{ expandedNftData != null && anathemaDeclarations.length == 0 && expandedNftData.anathema == true &&(
<div>            

    <div className={styles.overlordinfobox} style= { { backgroundImage: `url(/backgrounds/anathema.png)` } } >
        <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman', backgroundColor:'rgba(255,255,255,0.5)' } } >
          <h1>The {getKingdomType(expandedNftData.anathemadeclarerrarity)} of {expandedNftData.anathemadeclarername} has declared anathema on {expandedNftData.name}</h1>
        </div>
      </div>

  <div className={styles.overlordinfobox} style= { { backgroundColor: '#ffffff00' } } >
    <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } } >
     <h1>{expandedNftData.name} has not declared anathema </h1>
   </div>
  </div>
  
</div>
)}







{ expandedNftData != null && anathemaDeclarations.length > 0 && expandedNftData.anathema == true &&(
<div>

      <div className={styles.overlordinfobox} style= { { backgroundImage: `url(/backgrounds/anathema.png)` } } >
        <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman', backgroundColor:'rgba(255,255,255,0.5)' } } >
          <h1>The {getKingdomType(expandedNftData.anathemadeclarerrarity)} of {expandedNftData.anathemadeclarername} has declared anathema on {expandedNftData.name}</h1>
        </div>
      </div>


      <div className={styles.overlordinfobox} style= { { backgroundColor: '#000000' } } >
            <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } } >
             <h1>{expandedNftData.name} has declared anathema</h1>
            </div>
            <ul>
             {anathemaDeclarations.map((declaration, index) =>(
              <div   key = {index} > 
              { declaration.members > 1 && (
            <button className={styles.fealtybribeofferbutton} style= { { fontFamily: 'TimesNewRoman' } }   
            key = {index}             
            onClick={(e) => { 
             e.stopPropagation(); // Stop the event from bubbling up
             handleExploreKingdom(declaration.scroundreladdress); // Call the handler function
             } } 
             >
            On the {getKingdomType(declaration.rarity)} {declaration.name}
            </button>
              )}
                              { declaration.members == 1 && (
            <button className={styles.fealtybribeofferbutton} style= { { fontFamily: 'TimesNewRoman', backgroundColor:'#0B45C1', color:'#ffd000', textShadow: '0 0 2px #000000' } }          
            onClick={(e) => { 
             e.stopPropagation(); // Stop the event from bubbling up
             handleExploreLord(declaration.scroundreladdress); // Call the handler function
             } } 
             >
            On {declaration.name}
            </button>
              )}
            </div>
              ))}
            </ul>
          </div>
</div>
)}






{ expandedNftData != null && anathemaDeclarations.length == 0 && expandedNftData.anathema == false &&(
  <div>
        <div className={styles.overlordinfobox} style= { { backgroundColor: '#ffffff00' } } >
          <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } } >
          <h1>{expandedNftData.name} has not declared anathema </h1>
        </div>
        <div style= { { backgroundColor:'000000', color:'ffd000' } } >
        <button className={styles.fealtybribeofferbutton}   style= { { backgroundColor:'#000000', color:'#ffd000', textShadow: '0 0 2px #000000' } }      
              onClick={(e) => { 
               e.stopPropagation(); // Stop the event from bubbling up
               handleExploreOverlords(); // Call the handler function
               } } 
               >
              Explore lords to declare anathema

              </button>
              </div>
        </div>
  </div>
)}








  </div>
)}








    </div>
  </div>
   )}
</div>
  );
};

export default Underlords;