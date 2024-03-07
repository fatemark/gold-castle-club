import React, { useEffect, useState } from 'react';
import { createFealtyForGoldContract, declareWar, becomeOverlord } from '@/services/swearfealty.service'
import { useWallet } from '@alephium/web3-react'
import { node, addressFromContractId, hexToString } from '@alephium/web3'
import { FealtyConfig } from '@/services/utils.fealty';
import { GoldTokenConfig } from '@/services/utils';
import getOwnedNfts from '@/services/walletquery';
import styles from '../../../../styles/Fealty.module.css'
import { getAvailableIndex } from '../../../../services/database_services/serverContractsQuery'
import { useRouter } from 'next/router';
import { declareAnathemaByHighLord, declareAnathemaByLord, revokeAnathemaByBribe, revokeAnathemaByDeclarer, revokeAnathemaByHighLord, revokeAnathemaByTime } from '@/services/anathema.service';
import { createMarriageOffer, becomeLover } from '../../../../services/marriage.service'
import { getattackers, getAnathemaDeclarerDeclarations, getSingleNftData, Overlord } from '../../../../services/database_services/fealtyQuery'
import { checkFealtycontract } from '../../../../services/database_services/serverContractsQuery';
import { getKingdomType, getbackground, getLoverParamour, getgendersuffix, getLoverCount, getwartarget, adjustFontSize } from '../../../../services/kingdom_services/kingdom';

const SelfLord: React.FC = () => {

const { signer, account } = useWallet()

const [bribeAmount, setBribeAmount] = useState('')
const [minimumRarity, setMinimumRarity] = useState('')
const [campaignMessage, setCampaignMessage] = useState('');
const [isValidInput, setIsValidInput] = useState(true); // Set to true initially
const [firstClick, setFirstClick] = useState(false);
const [selectedNftToSwearTo, setSelectedNftToSwearTo] = useState<string | null>(null);
const [overlords, setOverlords] = useState<any[]>([]);
const [loveLetter, setLoveLetter] = useState('');
const [dowryAmount, setdowryAmount] = useState('')
const [timeAmount, setTimeAmount] = useState('')
const [ongoingTxId, setOngoingTxId] = useState<string>()
const [anathemaReason, setanathemaReason] = useState('');
const [anathemaBribeAmount, setanathemaBribeAmount] = useState('')
const [attackers, setAttackers] = useState<any[]>([]);
const [anathemaDeclarations, setAnathemaDeclarations] = useState<any[]>([]);
const [feudallordData, setFeudallordData] = useState<Overlord | null>(null);



const [nftData, setNftData] = useState<any[]>([]);
const [selectedNftContractId, setSelectedNftContractId] = useState<string>('');

const [FirstLords, setFirstLords] = useState<any[]>([]);
const router = useRouter();


const { nftselfcontractaddress } = router.query;
const [activeButton, setActiveButton] = useState(4);



const handleExploreLord = (nftSelfContractAddress: string) => {
  // Construct the route using string interpolation
  const route = `/fealty/overlord/underlord/${nftSelfContractAddress}`;
  
  // Navigate to the constructed route
  router.push(route);
};


const handleSwitchChange = (index: number) => {
  setActiveButton(index);
};


useEffect(() => {
  async function fetchAttackers() {
    if (nftselfcontractaddress && typeof nftselfcontractaddress === 'string') { // Check if feudallordData is not null
      const fetchedAttackers = await getattackers(nftselfcontractaddress);

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
}, [nftselfcontractaddress]); // Include feudallordData and attackers in the dependency array


const handleBecomeLover = async () => {
  if (signer && feudallordData) {
    const selfloverAddress = feudallordData.nftselfcontractaddress;
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

useEffect(() => {
  async function fetchAnathemaDeclarations() {
    if (nftselfcontractaddress && typeof nftselfcontractaddress === 'string') { // Check if feudallordData is not null
      const fetchedAnathemaDeclarations = await getAnathemaDeclarerDeclarations(nftselfcontractaddress);

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
}, [nftselfcontractaddress]);


useEffect(() => {
  async function fetchFeudalLord() {
    try {
      if (typeof nftselfcontractaddress === 'string') { // Check if nftselfcontractaddress is a string
        const contractAddress = nftselfcontractaddress;
        console.log("Contract address:", contractAddress); // Log the contract address
        const fetchedFeudalLord = await getSingleNftData(contractAddress);
        setFeudallordData(fetchedFeudalLord);
        console.log(feudallordData)
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  console.log("nftselfcontractaddress:", nftselfcontractaddress); // Log the value of nftselfcontractaddress
  fetchFeudalLord();
}, [nftselfcontractaddress]);

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



const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedContractId = event.target.value;
  console.log(selectedContractId)
  setSelectedNftContractId(selectedContractId);
};

const handleCreateFealtyContract = async () => {
  if (signer && selectedNftContractId && feudallordData && nftselfcontractaddress && typeof nftselfcontractaddress === 'string') {
    const bribe = BigInt(Math.floor(parseFloat(bribeAmount)));
    const time = BigInt(Math.floor(parseFloat(timeAmount) * 1000 * 60 * 60 * 24));
    const lordAddress = addressFromContractId(selectedNftContractId);
    const minimumClass = BigInt(feudallordData.rarity);
    const subjecttarget = nftselfcontractaddress;
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
  if (signer && selectedNftContractId && feudallordData && nftselfcontractaddress && typeof nftselfcontractaddress === 'string') {
    const dowry = BigInt(Math.floor(parseFloat(dowryAmount)));
    const time =  BigInt(Math.floor(parseFloat(timeAmount) * 1000 * 60 * 60 * 24));
    const proposer = addressFromContractId(selectedNftContractId);
    const proposee = nftselfcontractaddress;
    const maxlovercount = BigInt(feudallordData.lovercount);
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
        maxlovercount,
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
    if (signer && selectedNftContractId && nftselfcontractaddress && typeof nftselfcontractaddress === 'string') {
      const selfAddress = addressFromContractId(selectedNftContractId);
      const targetAddress = nftselfcontractaddress;
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
    if (signer && selectedNftContractId && feudallordData && nftselfcontractaddress && typeof nftselfcontractaddress === 'string') {
      const declarerLordAddress = addressFromContractId(selectedNftContractId);
      const scroundrelAddress = nftselfcontractaddress;
      const bribe = BigInt(anathemaBribeAmount);
      const reason = anathemaReason;
      const feudallord = feudallordData.feudallord;
      console.log(bribe)
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


  const handleRevokeAnathemaByHighLord = async () => {
    if (signer && nftselfcontractaddress && typeof nftselfcontractaddress === 'string') {
      const revokeraddress = addressFromContractId(selectedNftContractId);
      const scroundreladdress = nftselfcontractaddress;
      // Call the execute method of getAvailableIndex to get the lordSubjectIndex
      if (revokeraddress) {
        const result = await revokeAnathemaByHighLord(
          scroundreladdress,
          revokeraddress,
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


  const handleRevokeAnathemaByDeclarer = async () => {
    if (signer && nftselfcontractaddress && typeof nftselfcontractaddress === 'string' && feudallordData) {
      const revokeraddress = feudallordData.anathemadeclarer;
      const scroundreladdress = nftselfcontractaddress;
      // Call the execute method of getAvailableIndex to get the lordSubjectIndex
      if (revokeraddress) {
        const result = await revokeAnathemaByDeclarer(
          scroundreladdress,
          revokeraddress,
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

  const handleRevokeAnathemaByBribe = async () => {
    if (signer && nftselfcontractaddress && typeof nftselfcontractaddress === 'string' && feudallordData) {
      const scroundreladdress = nftselfcontractaddress;
      const bribe = BigInt(feudallordData.anathemabribe);
      const revokerAddress = addressFromContractId(selectedNftContractId);
      if (scroundreladdress && bribe) {
        console.log(scroundreladdress, bribe)
        const result = await revokeAnathemaByBribe(
          scroundreladdress,
          bribe,
          revokerAddress,
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

  const handleRevokeAnathemaByTime = async () => {
    if (signer && nftselfcontractaddress && typeof nftselfcontractaddress === 'string') {
      const scroundreladdress = nftselfcontractaddress;
      if (scroundreladdress) {
        const result = await revokeAnathemaByTime(
          scroundreladdress,
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

  const handleBecomeOverlord = async () => {
    if (signer && feudallordData) {
      const lordAddress = feudallordData.nftselfcontractaddress;
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


  const handleExploreOverlords = () => {
    // Construct the route using string interpolation
    const route = `/fealty`;
    
    // Navigate to the constructed route
    router.push(route);
  };
  

const sortedNftData = [...(Array.isArray(nftData) ? nftData : [])].sort((a, b) => b.rarity - a.rarity);



function getFeudalLordInfo(selffeudaladdress: string, feudallord: string, feudallordname: string): string {
  if (selffeudaladdress == feudallord){
    return 'is sworn to no one'
  }
  else if (selffeudaladdress != feudallord) {
    return `is sworn to ${feudallordname}`
  }
  else {
    return 'is sworn to no one'
  }
}



function getOverLordName(selfoverlordaddress: string, overlordaddress: string, overlordname: string, overlordrarity: number, genderofself: string): string {
  if (selfoverlordaddress == overlordaddress) {
    return `Overlord of the ${getKingdomType(overlordrarity)} in ${getgendersuffix(genderofself)} own right`
  }
  else if (selfoverlordaddress != overlordaddress) {
    return `Is part of the ${getKingdomType(overlordrarity)} of ${overlordname}`
  }
  else
    return `Overlord of the ${getKingdomType(overlordrarity)} in ${getgendersuffix(genderofself)} own right`
}




  return (
    <div>
    {feudallordData != null && (
      <div style= { {  
        backgroundImage: `url(/backgrounds/fealtybackgrounds/${getbackground(feudallordData.ap, feudallordData.gender, feudallordData.rarity, feudallordData.item, feudallordData.allegiance, feudallordData.magic, feudallordData.group_attack, feudallordData.solo_attack, feudallordData.class)}.webp)`,
        backgroundSize: '300px', // Let the browser size the background image
        backgroundRepeat: 'repeat', // Repeat the background image
        height: '100vh',
        width: '100%',
        paddingTop: '100px',
        overflow: 'auto' // or 'hidden' depending on your layout
       } } >
{nftselfcontractaddress != null && feudallordData != null &&(
  <div className={styles.twoColumnLayout}>
   
    <div className={styles.underlordinfo}>


    <div className={styles.imageContainer}>
      <div className={styles.nftpagetitle} style= { { fontFamily: 'TimesNewRoman' } } >
      <h1>R.{feudallordData.rarity}  &nbsp;&nbsp;&nbsp; |  &nbsp;&nbsp;&nbsp;{feudallordData.name} &nbsp;&nbsp;&nbsp; |  &nbsp;&nbsp;&nbsp; {feudallordData.age} years old</h1>
      </div>
                  <div className={styles.threeColumnLayout} style= { {  display: 'flex', justifyContent: 'space-between', alignItems: 'center'  } } >

                  <div className={styles.smallpowernftpagetextbox}>
                  <p >{feudallordData.members - 1} vassals </p>
                  </div>

                  <div className={styles.smallpowernftpagetextbox}>
                  <p >Votingpower: {feudallordData.votingpower}</p>
                  </div>

                  </div>

                  <div className={styles.threeColumnLayout} style= { {  display: 'flex', justifyContent: 'space-between', alignItems: 'center'  } } >

                  <div className={styles.smallpowernftpagetextbox}>
                  <p >Total attack power: {feudallordData.maxpowerpotential}</p>
                  </div>

                  <div className={styles.smallpowernftpagetextbox}>
                  <p>Total defensive power: {feudallordData.maxdefensivepower}</p>
                </div>
                </div>



                  
                </div>
                  <div style= { {  display: 'flex', flexDirection: 'column', alignItems: 'right'  } } >
  
                  <div className={styles.threeColumnLayout} style= { {  display: 'flex', justifyContent: 'space-between', alignItems: 'center'  } } >

                    <div className={styles.smallinfotextboxself}>
                    <p >{feudallordData.class}</p>
                    </div>

                    <div className={styles.smallinfotextboxself}>
                    <p>{feudallordData.title}</p>
                    </div>

                    </div>
                    <div className={styles.threeColumnLayout} style= { {  display: 'flex', justifyContent: 'space-between', alignItems: 'center'  } } >


                    <div className={styles.smallinfotextboxself}>
                    <p >HP: {feudallordData.hp}</p>
                    </div>

                    <div className={styles.smallinfotextboxself}>
                    <p>Magic: {feudallordData.magic}</p>
                    </div>

                    </div>
                    <div className={styles.threeColumnLayout} style= { {  display: 'flex', justifyContent: 'space-between', alignItems: 'center'  } } >


                    <div className={styles.smallinfotextboxself}>
                    <p >Attack: {feudallordData.ap}</p>
                    </div>


                    <div className={styles.smallinfotextboxself}>
                    <p>Lives like a cat: {feudallordData.lives}</p>
                    </div>


                    </div>
                    <div className={styles.threeColumnLayout} style= { {  display: 'flex', justifyContent: 'space-between', alignItems: 'center'  } } >


                    <div className={styles.smallinfotextboxself}>
                      <p>Solo attack: {feudallordData.solo_attack}</p>
                    </div>

                    <div className={styles.smallinfotextboxself}>
                      <p>Group attack: {feudallordData.group_attack}</p>
                    </div>

                    </div>
                    <div className={styles.threeColumnLayout} style= { {  display: 'flex', justifyContent: 'space-between', alignItems: 'center'  } } >


                    <div className={styles.smallinfotextboxself}>
                      <p>Allegiance: {feudallordData.allegiance}</p>
                    </div>

                    <div className={styles.smallinfotextboxself}>
                      <p>Item: {feudallordData.item}</p>
                    </div>

                    </div>

                  <div className={styles.threeColumnLayout} style= { {  display: 'flex', justifyContent: 'space-between', alignItems: 'center'  } } >

                  <div className={styles.smallinfotextboxself}>
                  <p >{feudallordData.subdomain}, {feudallordData.domain}</p>
                  </div>

                  <div className={styles.smallinfotextboxself}>
                  <p>Wisdom: {feudallordData.wisdom}</p>
                  </div>

</div>
<div className={styles.threeColumnLayout} style= { {  display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop:'5px'  } } >

{ feudallordData.potentialmarriage != feudallordData.nftselfcontractaddress && (
<div className={styles.smallinfotextboxself}   style= { { backgroundColor: '#FF69B4', color: '#ADD8E6', textShadow: '0 0 2px #000000' } } >
  <p>Married to: {feudallordData.wife}</p>
</div>
)}

{ feudallordData.potentialmarriage == feudallordData.nftselfcontractaddress && (
<div className={styles.smallinfotextboxself}   style= { { backgroundColor: '#FF69B4', color: '#ADD8E6', textShadow: '0 0 2px #000000' } } >
  <p>Unmarried</p>
</div>
)}
<div className={styles.smallinfotextboxself}   style= { { backgroundColor: '#FF69B4', color: '#ADD8E6', textShadow: '0 0 2px #000000' } } >
  <p>{getLoverCount(feudallordData.gender, feudallordData.lovercount)}</p>
</div>

</div>



<div className={styles.threeColumnLayout} style= { {  display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop:'5px'  } } >


<div className={styles.smallinfotextboxself}     style= { { backgroundColor: '#c60a0a', color: '#ffd000', textShadow: '0 0 0px #000000' } } >
  <p>{getFeudalLordInfo(feudallordData.nftselfcontractaddress, feudallordData.feudallord, feudallordData.feudallordname)}</p>
</div>

<div className={styles.smallinfotextboxself}     style= { { backgroundColor: '#c60a0a', color: '#ffd000', textShadow: '0 0 0px #000000' } } >
  <p>{getOverLordName(feudallordData.nftselfcontractaddress, feudallordData.overlord, feudallordData.overlordname, feudallordData.overlordrarity, feudallordData.gender)}</p>
</div>

</div>





<div className={styles.threeColumnLayout} style= { {  display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop:'5px'  } } >


<div className={styles.smallinfotextboxself} style= { { backgroundColor: '#c60a0a', color: '#ffd000', textShadow: '0 0 0px #000000', fontFamily:'TimesNewRoman' } }  >
<p >{feudallordData.name} {getwartarget(feudallordData.nftselfcontractaddress, feudallordData.wartarget, feudallordData.wartargetname)}</p>
</div>

{attackers != null &&(
<div className={styles.smallinfotextboxself} style= { { backgroundColor: '#c60a0a', color: '#ffd000', textShadow: '0 0 0px #000000' } }  >
<p>Faces attacks on {attackers.length} fronts</p>
</div>
)}

</div>

          
          <div className={styles.bigpowertextbox} style= { { width:'100%', fontSize:'16px' } } >
           <p>{feudallordData.unique_trait}</p>
           </div>

          {feudallordData.anathema == true && hexToString(feudallordData.anathemareason) != '[object Undefined]' && (
          <div className={styles.bigpowertextbox}  style= { { width:'100%', backgroundColor:'#000000', fontSize:'16px' } } >
          <p>Was declared Anathema with this reason: {hexToString(feudallordData.anathemareason)}</p>
          </div>
          )}
                            <div>
                              {feudallordData.members > 1 && (
                <button
                className={styles.explorekingdombutton} style= { { width:"80%", marginTop:'20px', height:'7vh' } } 
                onClick={(e) => { 
                    e.stopPropagation(); // Stop the event from bubbling up
                    handleExploreKingdom(feudallordData.nftselfcontractaddress); // Call the handler function
                 } } >
                Explore the {getKingdomType(feudallordData.rarity)} of {feudallordData.name}
                </button>
              )}
                </div>
            </div>







      </div>


    <div className={styles.underlordinfo}>

    <div className={styles.buttonContainer} style= { { width:'26.5%' } }>
    <button style= { { backgroundColor: '#0B45C1' } }  onClick={() => handleSwitchChange(4)}>
    Card
  </button>
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



{activeButton === 4 && ( 

  <img src={`${feudallordData?.nfturi}`} alt={`NFT ${feudallordData?.nftindex}`} />

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
          .filter(nft => nft.marriagetime < Date.now() && nft.gender !== feudallordData?.gender)
          .map((nft) => (
            <option key={nft.nftcontractid} value={nft.nftcontractid}>
              {nft.rarity} {nft.name}, {nft.title}
            </option>
          ))}
        </select>
        <button style= { { backgroundColor: '#FF69B4', color: '#ADD8E6', textShadow: '0 0 2px #000000' } } 
        className={styles.fealtybribeofferbutton}
        onClick={handleCreateMarriageContract}
        disabled={!selectedNftContractId} // Disable the button if no option is selected
        >
        Propose to {feudallordData?.name}
        </button>
        { feudallordData != null && (
          <button style= { { backgroundColor: 'rgba(220, 64, 186, 0.636', color: '#FFD700', textShadow: '0 0 2px #000000', fontFamily: 'TimesNewRoman' } } 
        className={styles.fealtybribeofferbutton}
        onClick={handleBecomeLover}
        disabled={!selectedNftContractId} // Disable the button if no option is selected
        >
        Make this subject {getLoverParamour(feudallordData.gender, feudallordData.rarity)} of {feudallordData?.name}
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

        { feudallordData!= null && feudallordData.feudallord != feudallordData.nftselfcontractaddress && feudallordData.rarity >= 5 && feudallordData.feudaltime < Date.now() && sortedNftData.some(nft => nft.nftselfcontractaddress == feudallordData?.nftselfcontractaddress) && (
                <button style= { { fontFamily: 'TimesNewRoman' } } 
                className={styles.becomeoverlordbutton}
                onClick={handleBecomeOverlord}
                >
                Become overlord of your own {getKingdomType(feudallordData.rarity)} and leave the {getKingdomType(feudallordData.overlordrarity)} of {feudallordData.overlordname}. You will stop being a vassal of {feudallordData.feudallordname}
                </button>
                )}


      <select
        className={styles.fealtyselect}
        value={selectedNftContractId}
        onChange={handleSelectChange}
           >
        <option value="">Select a subject</option>
        {sortedNftData
          .filter(nft => nft.rarity > feudallordData?.rarity)
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
        Ask fealty from {feudallordData?.name} 
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
Declare war on {feudallordData?.name}
</button>
{ feudallordData != null && attackers.length > 0 && feudallordData.wartarget != feudallordData.nftselfcontractaddress &&(
<div>
          <div className={styles.overlordinfobox} style= { { backgroundColor: '#ff19008a' } } >
            <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } } >
              <h1>{feudallordData.name} is at war with {feudallordData.wartargetname}</h1>
            </div>
          </div>

          <div className={styles.overlordinfobox} style= { { backgroundColor: '#ff19008a' } } >
            <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } } >
             <h1>{feudallordData.name} is being attacked by these members:</h1>
            </div>
            <ul>
             {attackers.map((attacker, index) =>(
              <div key = {index} >
              { attacker.members > 1 && (
              <button className={styles.fealtybribeofferbutton} style= { { fontFamily: 'TimesNewRoman' } }          
              onClick={(e) => { 
               e.stopPropagation(); // Stop the event from bubbling up
               handleExploreKingdom(attacker.nftselfcontractaddress); // Call the handler function
               } } 
               >
              The {getKingdomType(attacker.rarity)} of {attacker.name} 
              </button>
             )}
                                        { attacker.members == 1 && (
              <button className={styles.fealtybribeofferbutton} style= { { fontFamily: 'TimesNewRoman' } }          
              onClick={(e) => { 
               e.stopPropagation(); // Stop the event from bubbling up
               handleExploreLord(attacker.nftselfcontractaddress); // Call the handler function
               } } 
               >
              The {getKingdomType(attacker.rarity)} of {attacker.name} 
              </button>
             )}
             </div>
              ))}
            </ul>
          </div>
        </div>
        
)}


{ feudallordData != null && attackers.length == 0 && feudallordData.wartarget != feudallordData.nftselfcontractaddress &&(
<div>
      <div className={styles.overlordinfobox} style= { { backgroundColor: '#ff19008a' } } >
        <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } } >
          <h1>{feudallordData.name} is at war with {feudallordData.wartargetname}</h1>
        </div>

          </div>

<div className={styles.overlordinfobox} style= { { backgroundColor: '#ff19008a' } } >
  <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } } >
    <h1>{feudallordData.name} is not under attack</h1>
  </div>
</div>
</div>
)}







{ feudallordData != null && attackers.length > 0 && feudallordData.wartarget == feudallordData.nftselfcontractaddress &&(
<div>
      <div className={styles.overlordinfobox} style= { { backgroundColor: '#ff19008a' } } >
        <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } } >
          <h1>{feudallordData.name} is not at war</h1>
        </div>
          </div>

<div className={styles.overlordinfobox} style= { { backgroundColor: '#ff19008a' } } >
  <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } } >
    <h1>{feudallordData.name} is being attacked by these members: </h1>
  </div>
  <ul>
{attackers.map((attacker, index) =>(
              <div key = {index}>
              { attacker.members > 1 && (
              <button className={styles.fealtybribeofferbutton} style= { { fontFamily: 'TimesNewRoman' } }          
              onClick={(e) => { 
               e.stopPropagation(); // Stop the event from bubbling up
               handleExploreKingdom(attacker.nftselfcontractaddress); // Call the handler function
               } } 
               >
              The {getKingdomType(attacker.rarity)} of {attacker.name} 
              </button>
             )}
                           { attacker.members == 1 && (
              <button className={styles.fealtybribeofferbutton} style= { { fontFamily: 'TimesNewRoman' } }          
              onClick={(e) => { 
               e.stopPropagation(); // Stop the event from bubbling up
               handleExploreLord(attacker.nftselfcontractaddress); // Call the handler function
               } } 
               >
              The {getKingdomType(attacker.rarity)} of {attacker.name} 
              </button>
             )}
             </div>
             
        ))}
</ul>
</div>
</div>

)}






{ feudallordData != null && attackers.length === 0 && feudallordData.wartarget === feudallordData.nftselfcontractaddress &&(
  <div>
              <div className={styles.overlordinfobox} style= { { backgroundColor: '#ff19008a' } } >
                  <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } } >
                    <h1>{feudallordData.name} is not at war</h1>
                  </div>
          </div>
          <div className={styles.overlordinfobox} style= { { backgroundColor: '#ff19008a' } } >
          <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } } >
            <h1>{feudallordData.name} is not under attack</h1>
          </div>

          </div>
  </div>
)}
</div>
)}












{activeButton === 3 && ( 


<div >
{feudallordData?.anathema == false && ( 
<div >
      <select style= { { backgroundColor: '#000000', color: '#ffd000', textShadow: '0 0 2px #000000' } } 
        className={styles.fealtyselect}
        value={selectedNftContractId}
        onChange={handleSelectChange}
           >
        <option value="">Select a subject</option>
        {sortedNftData
        .filter(nft => (nft.rarity - (feudallordData?.rarity ?? 0) >= 3) || (nft.nftselfcontractaddress === feudallordData?.feudallord))
        .map((nft) => (
            <option key={nft.nftcontractid} value={nft.nftcontractid}>
              {nft.rarity} {nft.name}, {nft.title}
            </option>
          ))}
        </select>
        <button  style= { { backgroundColor: '#000000', color: '#ffd000', textShadow: '0 0 2px #000000' } } 
        className={styles.fealtybribeofferbutton}
        onClick={handleAnathemaByHighLord}
        disabled={!selectedNftContractId} // Disable the button if no option is selected
        >
        Declare Anathema on {feudallordData?.name}
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
          </div>
          )}



  {feudallordData?.anathema == true && feudallordData.anathematime + 31536000000 > Date.now() * 1000 && (
  <div>
         <button className={styles.revokeanathemabutton}       
              onClick={(e) => { 
               e.stopPropagation(); // Stop the event from bubbling up
               handleRevokeAnathemaByTime(); // Call the handler function
               } } >
                Revoke Anathema by time {feudallordData.anathematime}
          </button>
  </div>
  )}

{feudallordData?.anathema == true && (sortedNftData.some(nft => nft.nftselfcontractaddress === feudallordData?.anathemadeclarer) || sortedNftData.some(nft => nft.rarity >= feudallordData?.anathemadeclarerrarity + 3)) && (
          <select style= { { backgroundColor: '#15540e', color: '#ffd000', textShadow: '0 0 2px #000000' } } 
        className={styles.fealtyselect}
        value={selectedNftContractId}
        onChange={handleSelectChange}
           >
        
        <option value="">Select a revoker</option>
        {sortedNftData
          .filter(nft => nft.nftselfcontractaddress == feudallordData.anathemadeclarer || nft.rarity >= feudallordData.anathemadeclarerrarity + 3)
          .map((nft) => (
            <option key={nft.nftcontractid} value={nft.nftcontractid}>
              {nft.rarity} {nft.name}, {nft.title}
            </option>
          ))}

        </select>
        )}

          {feudallordData?.anathema == true && sortedNftData.some(nft => nft.nftselfcontractaddress === feudallordData?.anathemadeclarer) && (

                  <button className={styles.revokeanathemabutton}
                        onClick={(e) => { 
                        e.stopPropagation(); // Stop the event from bubbling up
                        handleRevokeAnathemaByDeclarer(); // Call the handler function
                         } } >
                          Revoke Anathema by revoking the anathema you declared
                    </button>
          )}

          {feudallordData?.anathema == true && sortedNftData.some(nft => nft.rarity >= feudallordData?.anathemadeclarerrarity + 3) && (

            <button className={styles.revokeanathemabutton}        
            onClick={(e) => { 
            e.stopPropagation(); // Stop the event from bubbling up
            handleRevokeAnathemaByHighLord(); // Call the handler function
             } } >
              Revoke Anathema by revoking the anathema by higher lord
            </button>
          )}



{feudallordData?.anathema == true && (
          <select style= { { backgroundColor: '#FFD700', color: '#000000' } } 
        className={styles.fealtyselect}
        value={selectedNftContractId}
        onChange={handleSelectChange}
           >
        
        <option value="">Select bribepayer</option>
        {sortedNftData
          .map((nft) => (
            <option key={nft.nftcontractid} value={nft.nftcontractid}>
              {nft.rarity} {nft.name}, {nft.title}
            </option>
          ))}

        </select>
        )}


  {feudallordData?.anathema == true && (
  <div>
         <button className={styles.revokeanathemabutton}      
              onClick={(e) => { 
               e.stopPropagation(); // Stop the event from bubbling up
               handleRevokeAnathemaByBribe(); // Call the handler function
               } } >
                Revoke Anathema by paying the {feudallordData.anathemabribe} $GOLD bribe 
          </button>
  </div>
  )}







          { feudallordData != null && anathemaDeclarations.length > 0 && feudallordData.anathema == false &&(
<div>
          <div className={styles.overlordinfobox} style= { { backgroundColor: '#000000' } } >
            <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } } >
             <h1>{feudallordData.name} has declared anathema</h1>
            </div>
            <ul>
             {anathemaDeclarations.map((declaration, index) =>(
              <div key = {index}> 
                { declaration.members > 1 && (
              <button className={styles.fealtybribeofferbutton} style= { { fontFamily: 'TimesNewRoman' } }          
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


{ feudallordData != null && anathemaDeclarations.length == 0 && feudallordData.anathema == true &&(
<div>            

    <div className={styles.overlordinfobox} style= { { backgroundImage: `url(/backgrounds/anathema.png)` } } >
        <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman', backgroundColor:'rgba(255,255,255,0.5)' } } >
          <h1>The {getKingdomType(feudallordData.anathemadeclarerrarity)} of {feudallordData.anathemadeclarername} has declared anathema on {feudallordData.name}</h1>
        </div>
      </div>

  <div className={styles.overlordinfobox} style= { { backgroundColor: '#ffffff00' } } >
    <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } } >
     <h1>{feudallordData.name} has not declared anathema </h1>
   </div>
  </div>
  
</div>
)}







{ feudallordData != null && anathemaDeclarations.length > 0 && feudallordData.anathema == true &&(
<div>

      <div className={styles.overlordinfobox} style= { { backgroundImage: `url(/backgrounds/anathema.png)` } } >
        <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman', backgroundColor:'rgba(255,255,255,0.5)' } } >
          <h1>The {getKingdomType(feudallordData.anathemadeclarerrarity)} of {feudallordData.anathemadeclarername} has declared anathema on {feudallordData.name}</h1>
        </div>
      </div>


      <div className={styles.overlordinfobox} style= { { backgroundColor: '#000000' } } >
            <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } } >
             <h1>{feudallordData.name} has declared anathema</h1>
            </div>
            <ul>
             {anathemaDeclarations.map((declaration, index) =>(
              <div key = {index}> 
              { declaration.members > 1 && (
            <button className={styles.fealtybribeofferbutton} style= { { fontFamily: 'TimesNewRoman' } }          
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






{ feudallordData != null && anathemaDeclarations.length == 0 && feudallordData.anathema == false &&(
  <div>
        <div className={styles.overlordinfobox} style= { { backgroundColor: '#ffffff00' } } >
          <div className={styles.overlordinfobox} style= { { fontFamily: 'TimesNewRoman' } } >
          <h1>{feudallordData.name} has not declared anathema </h1>
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
   )}</div>)}
</div>
  );
};

export default SelfLord;