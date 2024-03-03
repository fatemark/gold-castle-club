import React, { useState, useEffect } from 'react';
import getMarriageOffers from '../services/database_services/marriageQuery'
import { swearFealtyWithoutGoldFree, createFealtyForGoldContract, swearFealtyForGold, rescindFealtyOffer } from '@/services/swearfealty.service'
import { useWallet, AlephiumConnectButtonCustom } from '@alephium/web3-react'
import { node, addressFromContractId, hexToString } from '@alephium/web3'
import getOwnedNfts from '@/services/walletquery';
import styles from '../styles/Fealty.module.css'
import { useRouter } from 'next/router';
import { voteInElection } from '../services/voting.service'
import { Overlord, getElectionVoteCounts } from '../services/database_services/fealtyQuery'
import { electionAndFealtyChecker } from '../services/database_services/serverContractsQuery'

const Government: React.FC = () => {

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
const [selectedNftToSwearTo, setSelectedNftToSwearTo] = useState<string | null>(null);
const [expandedOfferData, setexpandedOfferData] = useState<any | null>(null);
const [fealtyOfferData, setFealtyOfferData] = useState<any[]>([]);
const [selectedNftContractAddress, setSelectedNftContractAddress] = useState<string | null>(null);
const [electionvotecount, setElectionvotecount] = useState<any[]>([]);
const [countdownSeconds, setCountdownSeconds] = useState(0);
const [countdownMinutes, setCountdownMinutes] = useState(0);
const [countdownHours, setCountdownHours] = useState(0);
const [countdownDays, setCountdownDays] = useState(0);

const router = useRouter();
const [repliesDisplay, setRepliesDisplay] = useState('none');
const [commentDisplay, setCommentDisplay] = useState('inline');

const handleMouseEnter = () => {
  setRepliesDisplay('inline');
  setCommentDisplay('none');
}

const handleMouseLeave = () => {
  setRepliesDisplay('none');
  setCommentDisplay('inline');
}

useEffect(() => {
  const intervalId = setInterval(() => {
    const currentTime = Math.floor(Date.now() / 1000); // Current Unix timestamp
    const timeDifference = electionvotecount[0]?.electiondeadline / 1000 - currentTime;

    if (timeDifference <= 0) {
      // If target time has passed, stop the timer
      clearInterval(intervalId);
      return;
    }

    // Calculate days
    const days = Math.floor(timeDifference / (60 * 60 * 24));
    // Calculate remaining time after subtracting days
    const remainingTime = timeDifference - days * (60 * 60 * 24);
    // Calculate hours
    const hours = Math.floor(remainingTime / (60 * 60));
    // Calculate remaining time after subtracting hours
    const remainingTimeAfterHours = remainingTime - hours * (60 * 60);
    // Calculate minutes
    const minutes = Math.floor(remainingTimeAfterHours / 60);
    // Calculate remaining seconds
    const seconds = remainingTimeAfterHours % 60;

    setCountdownDays(days);
    setCountdownHours(hours);
    setCountdownMinutes(minutes);
    setCountdownSeconds(seconds);
  }, 1000); // Update every second

  // Cleanup function to clear the interval when the component unmounts
  return () => clearInterval(intervalId);
}, [electionvotecount]);


const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedContractId = event.target.value;
  console.log(selectedContractId)
  setSelectedNftContractId(selectedContractId);
};




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



useEffect(() => {
  async function fetchElectionVoteCount() {
    try {
        const election = await getElectionVoteCounts(0);
        console.log(election)
        setElectionvotecount(election);
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }

  fetchElectionVoteCount();
}, []);


function getelectionpercentages(electionoption: number, electionvotecount: any) {
  let totalvotes = 0;
  for (let i = 0; i <= 7; i++) {
    totalvotes += electionvotecount[`option${i}` as keyof typeof electionvotecount];
  }
  console.log(totalvotes)
  if (totalvotes > 0) {
  const percentage = (electionvotecount[`option${electionoption}` as keyof typeof electionvotecount] / totalvotes) * 100
  console.log(percentage)
  return percentage
  } else {
    return 0
  }
}



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
  } else {
    setexpandedOfferData(sortedFealtyOfferData[index]); // Expand the clicked item
  }
};

// Add an event listener to the select dropdown to prevent click events from bubbling up
const handleSelectClick = (e: React.MouseEvent<HTMLSelectElement, MouseEvent>) => {
  e.stopPropagation();
  const selectedNftContractId = (e.target as HTMLSelectElement).value;
  setSelectedNftContractAddress(selectedNftContractId); // Update the selectedNftContractAddress state
};

const defaultImageIndex = expandedIndex === null ? findHighestRarityNftIndex(nftData) : null;


const handleVoteInElection = async (voteinput: number) => {
  if (signer && selectedNftContractId) {
    const voter = addressFromContractId(selectedNftContractId);
    const vote = BigInt(voteinput)
    const result = await voteInElection(voter, vote, signer);
    setOngoingTxId(result.txId);
    electionAndFealtyChecker();
  }
 else {
  // Handle the case where selectedNftContractId is null or other conditions are not met
  console.error('Invalid input or missing signer or selectedNftContractId.');
}
};

const handleswearFealtyWithoutGoldFree = async () => {
  if (signer && selectedNftContractId && selectedNftToSwearTo) {
    const lordAddress = addressFromContractId(selectedNftContractId);
    const subjectAddress = addressFromContractId(selectedNftToSwearTo);
    const time = BigInt(100000);
    const result = await swearFealtyWithoutGoldFree(time, lordAddress, subjectAddress, signer);
    setOngoingTxId(result.txId);
  }
 else {
  // Handle the case where selectedNftContractId is null or other conditions are not met
  console.error('Invalid input or missing signer or selectedNftContractId.');
}
};


const handleExploreKingdom = (nftSelfContractAddress: string) => {
  // Construct the route using string interpolation
  const route = `/fealty/overlord/${nftSelfContractAddress}`;
  
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
      
      const formattedAmount = amount % 1 === 0 ? `${amount.toFixed(0)}` : `${amount.toFixed(1)}`;
      
      return `${formattedAmount} ${suffixes[suffixIndex]}`;
  };

  return formatBribe(amount);
};


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


// Calculate sortedFealtyOfferData after fealtyOfferData has been updated
const sortedFealtyOfferData = [...fealtyOfferData].sort((a, b) => a.lordsubjectindex - b.lordsubjectindex);



const sortedNftData = [...(Array.isArray(nftData) ? nftData : [])].sort((a, b) => b.rarity - a.rarity);

  return (
<div className={styles.marriageoffersbackground} style= { { backgroundImage:`url(/backgrounds/senate.webp)`, 
  backgroundSize: '2000px' // Let the browser size the background image,
 } } >
  <div className={styles.governmentlayout}>
  
  <div className={styles.electioninfo}>
  <div className={styles.overlordinfo} style= { { width:'98%', maxWidth:'88%', textAlign:'center', marginLeft:'5%' } } >
  <div className={styles.powertextbox}>
      <h1> The consuls, senate and nobilityy of Gold Castle Club </h1>
      </div>
      </div>

      <div className={styles.overlordinfo} style= { { width:'1000px', maxWidth:'88%', textAlign:'center', marginLeft:'5%', marginBottom:'2px', marginTop:'0px', padding:'10px' } } >
  <div className={styles.governmentpowertextbox}>
      <h2> The seats of the consuls remain unoccupied. The senate is empty. The Emperor has yet to take up the mantle</h2>
      </div>
      </div>

      {defaultImageIndex !== null && (
        <img src={`/backgrounds/government/planetator.webp`} alt={`Planetator`} width="450rem" height="450rem"/>
      )}


  </div>

    <div className={styles.votinginfo} >

      <div className={styles.overlordinfo} style= { { width:'90%', maxWidth:'90%', textAlign:'center', marginLeft:'5%', marginBottom:'2px', marginTop:'12%', padding:'10px' } } >
      <div className={styles.powertextbox}>
          <h1> Election</h1>
        </div>
      </div>

      <div className={styles.overlordinfo} style= { { width:'90%', maxWidth:'90%', textAlign:'center', marginLeft:'5%', marginBottom:'2px', padding:'10px', height:'10vh' } } >
      { electionvotecount != null && (
      <div className={styles.governmentpowertextbox} style= { {  fontSize:'10px', whiteSpace:'normal', height:'7vh' } } >     
         <h2> {electionvotecount[`electionquestion` as keyof typeof electionvotecount]} </h2>
        </div>
      )}
      </div>


      {!sortedNftData.some(nft => nft.isoverlord) && sortedNftData.length > 0 && (
      <div className={styles.overlordinfo} style= { { width:'90%', maxWidth:'90%', textAlign:'center', marginLeft:'5%', marginBottom:'2px', padding:'10px', height:'10vh' } } >
      <div className={styles.governmentpowertextbox} style= { {  fontSize:'14px', whiteSpace:'normal', height:'7vh', backgroundColor:'#000000' } } >     
         <h3>You don't have any eligible overlords to vote. You have delegated votingpower to an overlord</h3>
        </div>
      </div>
      )}
            { account == null && (
                 <AlephiumConnectButtonCustom>
            {({ show, isConnected, disconnect, truncatedAddress }) => {
                if (isConnected) {
                    return (
                        <div>
                            <button className = "connectButton" onClick={disconnect}>Connected</button>
                        </div>
                    );
                } else {
                    return ( <div> 
                      <button style= { { marginTop:'25px', fontSize:'32px' } }  className = "toconnectButton" onClick={show}>Connect to vote</button>
                      </div>
                    );
                }
             } } 
        </AlephiumConnectButtonCustom>
      )}

      {sortedNftData.some(nft => nft.isoverlord == true) && (
<div>

      <div className={styles.overlordinfo} style= { { width:'90%', maxWidth:'90%', textAlign:'center', marginLeft:'5%', marginBottom:'2px', padding:'10px', height:'8.2vh' } } >
      <div className={styles.governmentpowertextbox} style= { {  fontSize:'35px', whiteSpace:'normal', height:'5vh' } } >     
         <h3>Vote now:</h3>
        </div>
      </div>



      <select style= { { backgroundColor: '#15540e', color: '#ffd000', textShadow: '0 0 2px #000000' } } 
          className={styles.fealtyselect}
          value={selectedNftContractId ?? ''}
          onChange={handleSelectChange}
            >
          <option value="">Select an overlord to vote</option>
          {sortedNftData
          .filter(nft => (nft.isoverlord == true && nft.rarity > 0 && nft.votetime < electionvotecount[0]?.electiondeadline))
          .map((nft) => (
              <option key={nft.nftcontractid} value={nft.nftcontractid}>
                  {nft.rarity} {nft.name}, {nft.title}
              </option>
          ))}
      </select>
            


</div>
      )}

      <div className={styles.buttonContainer}>
  <button style= { { backgroundColor: '#FF69B4' } }  onClick={() => handleVoteInElection(1)}
    disabled={!selectedNftContractId}>
    Yes, even peasants
  </button>
  <button style= { { backgroundColor: '#ffd000' } }  onClick={() => handleVoteInElection(2)}
    disabled={!selectedNftContractId}>
    R.1 or better
  </button>
  <button style= { { backgroundColor: '#b50c0c' } }  onClick={() => handleVoteInElection(3)}
    disabled={!selectedNftContractId}>
    R.5 or better
  </button>
  <button style= { { backgroundColor: '#000000' } }  onClick={() => handleVoteInElection(4)} 
  disabled={!selectedNftContractId}>
    R.8 or better
  </button>
</div>


{electionvotecount != null && (
<div className={styles.buttonContainer}  onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
  <label style= { { backgroundColor: '#FF69B4' } }    >
  <span style= { { display: repliesDisplay, fontSize:'25px' } } >{electionvotecount[0]?.option1} votes</span>
      <span style= { { display: commentDisplay } } >{getelectionpercentages(1, electionvotecount)} %</span>
  </label>
  <label style= { { backgroundColor: '#ffd000' } }    >
  <span style= { { display: repliesDisplay, fontSize:'25px' } } >{electionvotecount[0]?.option2} votes</span>
      <span style= { { display: commentDisplay } } >{getelectionpercentages(2, electionvotecount)} %</span>
  </label>
  <label style= { { backgroundColor: '#b50c0c' } }    >
  <span style= { { display: repliesDisplay, fontSize:'25px' } } >{electionvotecount[0]?.option3} votes</span>
      <span style= { { display: commentDisplay } } >{getelectionpercentages(3, electionvotecount)} %</span>
  </label>
  <label style= { { backgroundColor: '#000000' } }   >
      <span style= { { display: repliesDisplay, fontSize:'25px' } } >{electionvotecount[0]?.option4} votes</span>
      <span style= { { display: commentDisplay } } >{getelectionpercentages(4, electionvotecount)} %</span>
    </label>
</div>
)}

  {/* <span>{getelectionpercentages(4, electionvotecount)}%</span> */}

<div className={styles.overlordinfo} style= { { width:'90%', maxWidth:'90%', textAlign:'center', marginLeft:'5%', marginBottom:'2px', padding:'10px', height:'8.2vh' } } >
      <div className={styles.governmentpowertextbox} style= { {  fontSize:'15px', whiteSpace:'normal', height:'5vh' } } >     

    {countdownDays != null && countdownHours != null && countdownMinutes && countdownSeconds &&(
      <div>
    {countdownDays} Days &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;{countdownHours} hours &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;{countdownMinutes} minutes &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;{countdownSeconds} seconds
    </div> 
    )}

    </div> 
    </div>

      </div>
  </div>
</div>

  );
};

export default Government;