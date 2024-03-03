// pages/index.tsx
import React, { useState, useEffect } from 'react';
import { swearFealtyWithoutGoldFree, createFealtyForGoldContract, declareWar, becomeOverlord } from '@/services/swearfealty.service'
import { useWallet, AlephiumConnectButtonCustom } from '@alephium/web3-react'
import { addressFromContractId } from '@alephium/web3'
import { FealtyConfig } from '@/services/utils.fealty';
import { GoldTokenConfig } from '@/services/utils';
import getOwnedNfts from '@/services/walletquery';
import styles from '../styles/Fealty.module.css'
import { getAvailableIndex } from '../services/database_services/serverContractsQuery'
import { getattackers, getAnathemaDeclarerDeclarations } from '../services/database_services/fealtyQuery'
import { useRouter } from 'next/router';
import { createMarriageOffer, marryOwnCollection, divorce, becomeLover } from '../services/marriage.service'
import { declareAnathemaByLord, declareAnathemaByHighLord } from '../services/anathema.service'
import { checkFealtycontract } from '../services/database_services/serverContractsQuery';
import { destroyNft, changeOwner } from '../services/nft.token.service'
import { NftMintconfig } from '@/services/nftutils';
import Image from 'next/image';
import { getKingdomType, getbackground, getLoverParamour, getgendersuffix, getLoverCount, getwartarget, adjustFontSize } from '../services/kingdom_services/kingdom';

const Mycollection: React.FC = () => {

const { signer, account } = useWallet()
const [bribeAmount, setBribeAmount] = useState('')
const [minimumRarity, setMinimumRarity] = useState('')
const [nftData, setNftData] = useState<any[]>([]);
const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
const [campaignMessage, setCampaignMessage] = useState('');
const [isValidInput, setIsValidInput] = useState(true); // Set to true initially
const [selectedNftContractId, setSelectedNftContractId] = useState<string>('');
const [expandedNftData, setExpandedNftData] = useState<any | null>(null);
const [attackers, setAttackers] = useState<any[]>([]);
const [anathemaDeclarations, setAnathemaDeclarations] = useState<any[]>([]);
const [loveLetter, setLoveLetter] = useState('');
const [anathemaReason, setanathemaReason] = useState('');
const [dowryAmount, setdowryAmount] = useState('')
const [anathemaBribeAmount, setanathemaBribeAmount] = useState('')
const [timeAmount, setTimeAmount] = useState('')
const [maxlovercount, setMaxlovercount] = useState('')
const [ongoingTxId, setOngoingTxId] = useState<string>()
const [activeButton, setActiveButton] = useState(0);

const handleSwitchChange = (index: number) => {
  setActiveButton(index);
  setSelectedNftContractId('');
};


const router = useRouter();

const handleExploreKingdom = (nftSelfContractAddress: string) => {
  // Construct the route using string interpolation
  const route = `/fealty/overlord/${nftSelfContractAddress}`;
  
  // Navigate to the constructed route
  router.push(route);
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
        const fetchedNftData = await getOwnedNfts(account.address);
        setNftData(fetchedNftData);
      }
    } catch (error) {
      // Handle error
    }
  }

  fetchNftData();
}, [account]); // Don't forget to add navigate to the dependency array

const findHighestvotingpowerNftIndex = (sortedNftData: any[]) => {
  if (sortedNftData.length === 0 || !sortedNftData[0]) {return null}
  let highestvotingpowerIndex = 0;
  let highestvotingpowerValue = sortedNftData[0].votingpower;
  for (let i = 1; i < sortedNftData.length; i++) {
    if (sortedNftData[i] && sortedNftData[i].votingpower > highestvotingpowerValue) {
      highestvotingpowerIndex = i;
      highestvotingpowerValue = sortedNftData[i].votingpower;
    }
  }
  return highestvotingpowerIndex;
};







const toggleExpand = (index: number) => {
  setExpandedIndex(expandedIndex === index ? null : index);
  if (expandedIndex === index) {
    setExpandedNftData(null); // Collapse the currently expanded item
    setSelectedNftContractId('');
  } else {
    setExpandedNftData(sortedNftData[index]); // Expand the clicked item
    setSelectedNftContractId('');
  }
};

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
        console.log("fetchedAttackers is not an array:", fetchedAttackers);
        setAttackers([]);
      }
    }
  }
  fetchAttackers();
}, [expandedNftData]); // Include expandedNftData and attackers in the dependency array

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
  }
  fetchAnathemaDeclarations();
}, [expandedNftData]);

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
  setSelectedNftContractId(selectedContractId);
};


const handleSwearFealtyWithinCollection = async () => {
  if (signer && selectedNftContractId) {

  const fealtyId = FealtyConfig.fealtyId;
  const goldtokenid = GoldTokenConfig.GoldTokenId;
  const lordaddress =  expandedNftData.nftselfcontractaddress
  const subjectaddress = addressFromContractId(selectedNftContractId)
  const result = await swearFealtyWithoutGoldFree(
    BigInt(0),
    lordaddress,
    subjectaddress,
    signer
  );
  setOngoingTxId(result.txId);
 checkFealtycontract();
} else {
  console.error('No available index found.');
}
}



const handleDestroyNft = async () => {
  if (signer && expandedNftData) {
  const nftId = expandedNftData.nftcontractid;
  const result = await destroyNft(
    nftId,
    NftMintconfig.NftCollectionAsiaId,
    signer
  );
  setOngoingTxId(result.txId);
  checkFealtycontract();
} else {
  console.error('No available index found.');
}
}

const handleChangeOwner = async () => {
  if (signer && expandedNftData) {
  const nftId = expandedNftData.nftcontractid;
  const result = await changeOwner(
    nftId,
    NftMintconfig.NftCollectionAsiaId,
    signer
  );
  setOngoingTxId(result.txId);
  checkFealtycontract();
} else {
  console.error('No available index found.');
}
}


const handleMarryWithinCollection = async () => {
  if (signer && selectedNftContractId) {

  const fealtyId = FealtyConfig.fealtyId;
  const goldtokenid = GoldTokenConfig.GoldTokenId;
  const proposer =  expandedNftData.nftselfcontractaddress
  const proposee = addressFromContractId(selectedNftContractId)
  const result = await marryOwnCollection(
    fealtyId,
    proposee,
    proposer,
    BigInt(0),
    signer
  );
  setOngoingTxId(result.txId);
  checkFealtycontract();
} else {
  console.error('No available index found.');
}
}

const handleCreateFealtyContract = async () => {
  if (signer && expandedNftData && bribeAmount && timeAmount && campaignMessage) {
    const bribe = BigInt(Math.floor(parseFloat(bribeAmount)));
    const time = BigInt(Math.floor(parseFloat(timeAmount) * 1000 * 60 * 60 * 24));
    const lordAddress = expandedNftData.nftselfcontractaddress;
    const minimumClass = BigInt(minimumRarity);
    const subjecttarget = lordAddress;
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
     checkFealtycontract();
    } else {
      console.error('No available index found.');
    }
  } else {
    // Handle the case where selectedNftContractId is null or other conditions are not met
    console.error('Invalid input or missing signer or selectedNftContractId.');
  }
};

const handleCreateMarriageContract = async () => {
  if (signer) {
    const dowry = BigInt(Math.floor(parseFloat(dowryAmount)));
    const time =  BigInt(Math.floor(parseFloat(timeAmount) * 1000 * 60 * 60 * 24));
    console.log(expandedNftData.nftselfcontractaddress)
    const proposer = expandedNftData.nftselfcontractaddress;
    console.log(proposer)
    const proposee = proposer
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
        BigInt(maxlovercount),
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

  const handleDivorce = async () => {
    if (signer && expandedNftData) {
      const wifeHusband = expandedNftData.potentialmarriage;
      const claimant = expandedNftData.nftselfcontractaddress;
      const divorcefee = BigInt(150000) * BigInt(expandedNftData.rarity) + BigInt(150000)
      const result = await divorce(
        divorcefee,
        wifeHusband, 
        claimant,
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

  const handleBecomeOverlord = async () => {
    if (signer && expandedNftData) {
      const lordAddress = expandedNftData.nftselfcontractaddress;
      const result = await becomeOverlord(
        lordAddress,
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



const sortedNftData = [...(Array.isArray(nftData) ? nftData : [])].sort((a, b) => b.rarity - a.rarity);



const defaultImageIndex = expandedIndex === null ? findHighestvotingpowerNftIndex(sortedNftData) : null;

 


function getOverlord(overlordname: any, name: any, overlordrarity: any): string {
  if (overlordname != name) {
        const kingdomtypeofoverlord = getKingdomType(overlordrarity)
        return `Part of the ${kingdomtypeofoverlord} of ${overlordname}`
  }
  else {
    return 'Sworn to no one'
  }
}

function getFeudallord(feudallordname: any, name: any): string {
  if (feudallordname == name) {
        return `Sworn to no one`
  }
  else {
    return `Sworn to ${feudallordname}`
  }
}

function getOppositeGenderSuffix(gender: any): string {
  switch (gender) {
      case 'man':
          return "her";
      case 'woman':
          return "his";
      default:
        return 'his';
  }
}

function getWifeOrHusband(gender: any): string {
  switch (gender) {
      case 'man':
          return "wife";
      case 'woman':
          return "husband";
      default:
        return 'companion';
  }
}


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

function FormattedBribe(rarity: number) {
  const result = 150000 + 150000 * rarity;
  const formattedResult = useFormattedBribe(result);
  return formattedResult;
}


  return (
<div className={styles.fealtybackground}>
{sortedNftData.length > 0 && (
  <div className={styles.collectiontwoColumnLayout}>
    <ul className={styles.collection} style= { { backgroundColor: '#695acd41' , color: '#000000' } }>
      <div className={styles.overlordinfo} style= { { width:'1000px', maxWidth:'100%', textAlign:'center' } } >
      <h1 className={styles.outlined_text}>Your collection &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; Gold Castle Club &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; {sortedNftData.length} NFTs</h1>
      </div>
      {sortedNftData.map((nft, index) =>(
        <li key={index} className={`${styles.nft} ${expandedIndex === index ? styles.expanded : ''}`}  style= { { backgroundColor: '#4c37d4b2', color:'#ffffff'  } } onClick={() => toggleExpand(index)}>
  <div className={styles.threeColumnLayout} style= { {  display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative'  } }>
    <div style= { {  display: 'flex', flexDirection: 'column', alignItems: 'left', fontFamily: 'TimesNewRoman'  } }>
    <p style= { {  fontWeight: 'bold'  } }>R.{nft.rarity}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; The {getKingdomType(nft.rarity)} of the {nft.title} {nft.name} </p>
    </div>
    <div style= { {  display: 'flex', flexDirection: 'column', alignItems: 'right'  } }>
    <div style= { {  display: 'flex', flexDirection: 'row', alignItems: 'center' } }>
    <div className={styles.powertextbox} style= { { marginRight:'10px' } }>
        <p>{nft.votingpower} &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;{nft.maxpowerpotential}&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;{nft.maxdefensivepower}</p>
        </div>
        <div style= { {  display: 'flex', flexDirection: 'column', alignItems: 'right'  } }>
          <Image src={`/item/${nft.item.replace(/\s+/g, '_').toLowerCase()}.png`} alt="png" style= { {  alignSelf: 'end', marginRight:'5px'  } } width={70} height={70}/>
          </div>
    <div style= { {  display: 'flex', flexDirection: 'column', alignItems: 'right'  } }>
          <Image src={`/allegiance/${nft.allegiance.replace(/\s+/g, '_').toLowerCase()}.png`} alt="png" style= { {  alignSelf: 'end', marginRight:'5px'  } } width={70} height={70}/>
          </div>
        <Image src={`/class/${nft.rarity}.png`} alt="png" style= { {  alignSelf: 'end', marginLeft:'5px'  } } width={77} height={77}/>
    </div>
    </div>
  </div>
          {expandedIndex === index && (
            <div className={styles.imageContainer}>
              <div className={styles.threeColumnLayout} style= { {  display: 'flex', justifyContent: 'space-between', alignItems: 'center'  } }>
              <div >
              <div className={styles.smallpowertextbox}>
              <p >{nft.members - 1} vassals</p>
              </div>
              <div className={styles.smallpowertextbox}>
              <p >Votingpower: {nft.votingpower}</p>
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

              
              <div style= { {  display: 'flex', flexDirection: 'column', alignItems: 'right'  } }>


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
              <p>{nft.item}</p>
            </div>
              <div className={styles.smallinfotextbox}>
              <p >Solo: {nft.solo_attack}</p>
              </div>
              <div className={styles.smallinfotextbox}>
              <p>Group: {nft.group_attack}</p>
            </div>
            <div className={styles.smallinfotextbox}>
              <p>{nft.domain}, {nft.subdomain}</p>
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
            <div style= { { fontFamily: 'timesnewroman' } } className={styles.smallinfotextbox}>
              <p>{getFeudallord(nft.feudallordname, nft.name)}</p>
            </div>
            <div style= { { fontFamily: 'timesnewroman' } } className={styles.smallinfotextbox}>
              <p>{getOverlord(nft.overlordname, nft.name, nft.overlordrarity)}</p>
            </div>
              </div>

            </div>
              <div>
             
                { nft.members > 1 && (
                <button
                className={styles.explorekingdombutton}
                onClick={(e) => { 
                    e.stopPropagation(); // Stop the event from bubbling up
                    handleExploreKingdom(nft.nftselfcontractaddress); // Call the handler function
                 } }>
                Explore this {getKingdomType(nft.rarity)}
                </button>
                )}
                <button
                className={styles.explorelordbutton}
                onClick={(e) => { 
                    e.stopPropagation(); // Stop the event from bubbling up
                    handleExploreLord(nft.nftselfcontractaddress); // Call the handler function
                 } }>
                {nft.name}
                </button>
                <button style= { { backgroundColor:'#000000' } }
                className={styles.explorelordbutton}
                onClick={(e) => { 
                    e.stopPropagation(); // Stop the event from bubbling up
                    handleDestroyNft(); // Call the handler function
                 } }>
                Destroy Nft
                </button>

                <button style= { { backgroundColor:'#ffffff' } }
                className={styles.explorelordbutton}
                onClick={(e) => { 
                    e.stopPropagation(); // Stop the event from bubbling up
                    handleChangeOwner(); // Call the handler function
                 } }>
                Confirm Ownership
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
  <button style= { { backgroundColor: '#FF69B4' } } onClick={() => handleSwitchChange(0)}>
    Marriage
  </button>
  <button style= { { backgroundColor: '#ffd000' } } onClick={() => handleSwitchChange(1)}>
    Fealty
  </button>
  <button style= { { backgroundColor: '#b50c0c' } } onClick={() => handleSwitchChange(2)}>
    War
  </button>
  <button style= { { backgroundColor: '#000000' } } onClick={() => handleSwitchChange(3)}>
    Anathema
  </button>
</div>



      {defaultImageIndex !== null && selectedNftContractId == '' &&  (
        <img src={`/backgrounds/orangecat.webp`} width={500} height={500} alt={`NFT ${sortedNftData[defaultImageIndex].nftindex}`} />
      )} 
{expandedIndex !== null && selectedNftContractId == '' && (
  <img src={`${expandedNftData?.nfturi}`} alt={`NFT ${expandedNftData?.nftindex}`} width="450vw" height="450vw"/>
)}

{selectedNftContractId != '' && expandedIndex != null && (
<div className={styles.collectiontwoColumnLayout}>
  <img src={`${expandedNftData?.nfturi}`} alt={`NFT ${expandedNftData?.nftindex}`} width="50%" height="50%" />
  <img src={`${getNFTUriByContractAddress(selectedNftContractId)}`} alt={`NFT ${expandedNftData?.nftindex}`} width="50%" height="50%" style= { {  border: '3px solid green'  } } />

</div>)}

{selectedNftContractId != '' && expandedIndex == null && (
  <img src={`${getNFTUriByContractAddress(selectedNftContractId)}`} alt={`NFT ${expandedNftData?.nftindex}`} style= { {  border: '3px solid green'  } }  width="450vw" height="450vw"/>
)}





      {activeButton === 0 && ( 
<div >
      <select style= { { backgroundColor: '#FF69B4', color: '#ADD8E6', textShadow: '0 0 2px #000000', fontFamily: 'TimesNewRoman' } }
        className={styles.fealtyselect}
        value={selectedNftContractId}
        onChange={handleSelectChange}
           >
        <option value="" >Select a subject</option>
        {sortedNftData
          .filter(nft => nft.marriagetime < Date.now() && nft.gender !== expandedNftData?.gender)
          .map((nft) => (
            <option key={nft.nftcontractid} value={nft.nftcontractid}>
              {nft.rarity} {nft.name}, {nft.title}
            </option>
          ))}
        </select>
        <button style= { { backgroundColor: '#FF69B4', color: '#ADD8E6', textShadow: '0 0 2px #000000', fontFamily: 'TimesNewRoman' } }
        className={styles.fealtybribeofferbutton}
        onClick={handleMarryWithinCollection}
        disabled={!selectedNftContractId} // Disable the button if no option is selected
        >
        Marry this subject to {expandedNftData?.name}
        </button>
        { expandedNftData != null && (
          <button style= { { backgroundColor: 'rgba(220, 64, 186, 0.636', color: '#FFD700', textShadow: '0 0 2px #000000', fontFamily: 'TimesNewRoman' } }
        className={styles.fealtybribeofferbutton}
        onClick={handleBecomeLover}
        disabled={!selectedNftContractId} // Disable the button if no option is selected
        >
        Make this subject {getLoverParamour(expandedNftData.gender, expandedNftData.rarity)} of {expandedNftData?.name}
        </button>
        )}
        {expandedIndex !== null && expandedNftData.ismarried != true && (
        <div className={styles.overlordinfobox}>

        <button style= { { backgroundColor: '#FF69B4', color: '#ADD8E6', textShadow: '0 0 2px #000000' } }
        className={styles.fealtybribeofferbutton}
        onClick={handleCreateMarriageContract}
        disabled={!timeAmount || !dowryAmount || !loveLetter} // Disable the button if no option is selected
        >
        Create an open marriage offer
        </button>
        <div className={styles.inputContainer} >
            <div className={styles.inputField} >
              <label style= { { backgroundColor: '#FF69B4', color: '#ADD8E6', textShadow: '0 0 2px #000000' } } className={styles.fealtyInputField} htmlFor="time-amount">
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
              <label style= { { backgroundColor: '#FF69B4', color: '#ADD8E6', textShadow: '0 0 2px #000000' } } className={styles.fealtyInputField} htmlFor="dowry-amount">
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
              <label style= { { backgroundColor: '#FF69B4', color: '#ADD8E6', textShadow: '0 0 2px #000000', width: '100%' } } className={styles.fealtyInputField} htmlFor="dowry-amount">
                Max lovers in {getOppositeGenderSuffix(expandedNftData.gender)} past:
              </label>
              <input className={styles.fealtyInput}  style= { { backgroundColor: 'rgba(205, 105, 180, 0.5)', color: '#ADD8E6', textShadow: '0 0 2px #000000' } }
                type="number"
                id="max-lovercount"
                name="dowry"
                max="2000000000000000000000000000000000000000000"
                min="0"
                value={maxlovercount}
                onChange={(e) => {
                  setMaxlovercount(e.target.value);
                  setIsValidInput(!isNaN(parseFloat(e.target.value)));
                 } }
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => adjustFontSize(e.target)}
              />
            </div>
            <div className={styles.inputField}>
              <label style= { { backgroundColor: '#FF69B4', color: '#ADD8E6', textShadow: '0 0 2px #000000' } } className={styles.fealtyInputField} htmlFor="love-letter">
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
  </div>)}
{ expandedNftData != null && expandedNftData.ismarried == true && expandedNftData.marriagetime < Date.now() && (
  <button
        className={styles.divorcebutton}
        onClick={handleDivorce}
        >
        Divorce your beloved {getWifeOrHusband(expandedNftData.gender)} {expandedNftData.wife} ( {FormattedBribe(expandedNftData.rarity)} fee )
        </button>
)}
  </div> )}




  {activeButton === 1 && ( 
<div>
        { expandedNftData!= null && expandedNftData.feudallord != expandedNftData.nftselfcontractaddress && expandedNftData.rarity >= 5 && expandedNftData.feudaltime < Date.now() && (
        <button style= { { fontFamily: 'TimesNewRoman' } }
        className={styles.becomeoverlordbutton}
        onClick={handleBecomeOverlord}
        >
         Become overlord of your own {getKingdomType(expandedNftData.rarity)} and leave the {getKingdomType(expandedNftData.overlordrarity)} of {expandedNftData.overlordname}. You will stop being a vassal of {expandedNftData.feudallordname}
        </button>
        )}
      <select
        className={styles.fealtyselect}
        value={selectedNftContractId}
        onChange={handleSelectChange} style= { { fontFamily: 'TimesNewRoman' } }
           >
        <option value="">Select a subject</option>
        {sortedNftData
          .filter(nft => nft.rarity < expandedNftData?.rarity)
          .map((nft) => (
            <option key={nft.nftcontractid} value={nft.nftcontractid}>
              {nft.rarity} {nft.name}, {nft.title}
            </option>
          ))}
        </select>
        <button style= { { fontFamily: 'TimesNewRoman' } }
        className={styles.fealtybribeofferbutton}
        onClick={handleSwearFealtyWithinCollection}
        disabled={!selectedNftContractId} // Disable the button if no option is selected
        >
        Swear this subject to {expandedNftData?.name}
        </button>
        {expandedIndex !== null &&(
        <div className={styles.overlordinfobox} style= { { backgroundColor:'#ffd0008a' } }>

<button style= { { fontFamily: 'TimesNewRoman' } }
        className={styles.fealtybribeofferbutton}
        onClick={handleCreateFealtyContract}
        disabled={!bribeAmount || !timeAmount || !minimumRarity || !campaignMessage} // Disable the button if no option is selected
        >
        Create an open fealty offer
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
                value= { bribeAmount}
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
              <label className={styles.fealtyInputField} style= { { width:'80%' } } htmlFor="time-amount">
                Minimum rarity:
              </label>
              <input className={styles.fealtyInput} 
                type="number"
                id="time-amount"
                name="time"
                max="100000000000000"
                min="1"
                value={minimumRarity}
                onChange={(e) => {
                  setMinimumRarity(e.target.value);
                 } }
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => adjustFontSize(e.target)}
              />
            </div>
            <div className={styles.inputField}>
              <label className={styles.fealtyInputField} style= { { width:'80%' } }htmlFor="campaignMessage">
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
          </div>)}
  </div> 

  )}






  {activeButton === 2 &&(   
    <div> 
      {expandedNftData === null && (
<div>
    <button
    className={styles.fealtybribeofferbutton} style= { { fontFamily: 'TimesNewRoman' } }
    onClick={handleExploreOverlords}
      >
    Find lords to declare war on</button>
</div>
      )}



{ expandedNftData != null && attackers.length > 0 && expandedNftData.wartarget != expandedNftData.nftselfcontractaddress &&(
<div>
          <div className={styles.overlordinfobox} style= { { backgroundColor: '#ff19008a' } }>
            <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } }>
              <h1>{expandedNftData.name} is at war with {expandedNftData.wartargetname}</h1>
            </div>
          </div>

          <div className={styles.overlordinfobox} style= { { backgroundColor: '#ff19008a' } }>
            <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } }>
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
      <div className={styles.overlordinfobox} style= { { backgroundColor: '#ff19008a' } }>
        <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } }>
          <h1>{expandedNftData.name} is at war with {expandedNftData.wartargetname}</h1>
        </div>

          </div>

<div className={styles.overlordinfobox} style= { { backgroundColor: '#ff19008a' } }>
  <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } }>
    <h1>{expandedNftData.name} is not under attack</h1>
  </div>
</div>
</div>
)}







{ expandedNftData != null && attackers.length > 0 && expandedNftData.wartarget == expandedNftData.nftselfcontractaddress &&(
<div>
      <div className={styles.overlordinfobox} style= { { backgroundColor: '#ff19008a' } }>
        <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } }>
          <h1>{expandedNftData.name} is not at war</h1>
        </div>
              <div>
                <button
                key = {expandedIndex}      

                className={styles.fealtybribeofferbutton} style= { { fontFamily: 'TimesNewRoman' } }
                onClick={handleExploreOverlords}
                  >
                Find lords to declare war on</button>
            </div>
          </div>

<div className={styles.overlordinfobox} style= { { backgroundColor: '#ff19008a' } }>
  <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } }>
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
              <div className={styles.overlordinfobox} style= { { backgroundColor: '#ff19008a' } }>
                  <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } }>
                    <h1>{expandedNftData.name} is not at war</h1>
                  </div>
                        <div>
                          <button
                          className={styles.fealtybribeofferbutton} style= { { fontFamily: 'TimesNewRoman' } }
                          onClick={handleExploreOverlords}
                            >
                          Find lords to declare war on</button>
                      </div>
          </div>
          <div className={styles.overlordinfobox} style= { { backgroundColor: '#ff19008a' } }>
          <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } }>
            <h1>{expandedNftData.name} is not under attack</h1>
          </div>

          </div>
  </div>
)}

</div>)}











{activeButton === 3 && ( 
  
  <div>
    

{ expandedNftData != null && anathemaDeclarations.length > 0 && expandedNftData.anathema == false &&(
<div>
          <div className={styles.overlordinfobox} style= { { backgroundColor: '#000000' } }>
            <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } }>
             <h1>{expandedNftData.name} has declared anathema</h1>
            </div>
            <ul>
             {anathemaDeclarations.map((declaration, index) =>(
              <div key={index}> 
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


{ expandedNftData != null && anathemaDeclarations.length == 0 && expandedNftData.anathema == true &&(
<div>            

    <div className={styles.overlordinfobox} style= { { backgroundImage: `url(/backgrounds/anathema.png)` } }>
        <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman', backgroundColor:'rgba(255,255,255,0.5)' } }>
          <h1>The {getKingdomType(expandedNftData.anathemadeclarerrarity)} of {expandedNftData.anathemadeclarername} has declared anathema on {expandedNftData.name}</h1>
        </div>
      </div>

  <div className={styles.overlordinfobox} style= { { backgroundColor: '#ffffff00' } }>
    <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } }>
     <h1>{expandedNftData.name} has not declared anathema </h1>
   </div>
  </div>
  
</div>
)}







{ expandedNftData != null && anathemaDeclarations.length > 0 && expandedNftData.anathema == true &&(
<div>

      <div className={styles.overlordinfobox} style= { { backgroundImage: `url(/backgrounds/anathema.png)` } }>
        <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman', backgroundColor:'rgba(255,255,255,0.5)' } }>
          <h1>The {getKingdomType(expandedNftData.anathemadeclarerrarity)} of {expandedNftData.anathemadeclarername} has declared anathema on {expandedNftData.name}</h1>
        </div>
      </div>


      <div className={styles.overlordinfobox} style= { { backgroundColor: '#000000' } }>
            <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } }>
             <h1>{expandedNftData.name} has declared anathema</h1>
            </div>
            <ul>
             {anathemaDeclarations.map((declaration, index) =>(
              <div key={index}> 
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
        <div className={styles.overlordinfobox} style= { { backgroundColor: '#ffffff00' } }>
          <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } }>
          <h1>{expandedNftData.name} has not declared anathema </h1>
        </div>
        <div style= { { backgroundColor:'000000', color:'ffd000' } }>
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

export default Mycollection;