import React, { useCallback, useEffect } from 'react'
import { FC, useState } from 'react'
import styles from '../styles/Home.module.css'
import { withdrawToken } from '@/services/token.service'
import { mintNft } from '@/services/nft.token.service'
import { TxStatus } from './TxStatus'
import { useWallet } from '@alephium/web3-react'
import { addressFromContractId, node, NodeProvider, web3 } from '@alephium/web3'
import { GoldTokenConfig } from '@/services/utils'
import { NftMintconfig } from '@/services/nftutils'
import { GoldStateData, getGoldTokenWinners, GoldTokenContract, fetchGoldTokenState } from '../services/database_services/goldcontractQuery';
import { checkMinting, checkGoldContract, fetchNullOwnersCount } from '../services/database_services/serverContractsQuery'
import { useRouter } from 'next/router';

const initialWinnersData: GoldTokenContract[] = [];
//const nodeProvider = new NodeProvider('http://localhost:22973')
web3.setCurrentNodeProvider("https://wallet.mainnet.alephium.org")
const nodeProvider = web3.getCurrentNodeProvider()

export const TokenDapp: FC<{
  config: GoldTokenConfig,
  NftMintconfig: NftMintconfig
}> = ({ config, NftMintconfig }) => {
  const { signer, account } = useWallet()
  const addressGroup = config.groupIndex
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [ongoingTxId, setOngoingTxId] = useState<string>()
  const [JackpotBettingAmount, setJackpotBettingAmount] = useState('')
  const [winnersData, setWinnersData] = useState<GoldTokenContract[]>(initialWinnersData);
  const [goldStateData, setGoldStateData] = useState<GoldStateData | null>(null);
  const [ongoingMintTxId, setOngoingMintTxId] = useState<string>()
  const [showImage, setShowImage] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const router = useRouter();
  const [mintedNftCount, setMintedNftCount] = useState<number | null>(null);


  const handleMouseLeave = (e: Event) => {
    // Ensure the event is a MouseEvent before using properties like relatedTarget
    if (e instanceof MouseEvent) {
      const relatedTarget = e.relatedTarget as Node;
      const currentTarget = e.currentTarget as HTMLElement;
  
      if (!currentTarget.contains(relatedTarget)) {
        const lotteryContainer = document.querySelector(`.${styles.lotterytextContainer}`);
        if (lotteryContainer) {
          lotteryContainer.classList.remove('hover');
        }
      }
    }
  };


  useEffect(() => {
    async function fetchWinnersData() {
      try {
        const winnersData = await getGoldTokenWinners();
        setWinnersData(winnersData);
      } catch (error) {
        console.error('Error occurred:', error);
      }
    }

    fetchWinnersData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const goldStateData = await fetchGoldTokenState();
        setGoldStateData(goldStateData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getData();
  }, []);


  useEffect(() => {
    const container = document.querySelector(`.${styles.lotterytextContainer}`);
    
    if (container) {
      container.addEventListener('mouseleave', handleMouseLeave);
  
      return () => {
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);
  

  // Define handleClick function
  const handleClick = () => {
    const route = `/about`;
    router.push(route);  
  };

  const handleGovernment = () => {
    const route = `/government`;
    router.push(route);
  };
  const handleContractlink = () => {
    window.location.href = `https://explorer.alephium.org/addresses/${config.GoldTokenAddress}`; // Replace with your desired URL
  };
  const handlecollectionClick = () => {
    const route = `/mycollection`;
    router.push(route);
    };



  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (signer) {
    // Convert withdrawAmount to a BigInt and multiply by 10**18
    const baseUnitAmount = BigInt(withdrawAmount) * BigInt(10 ** 18)
    const result = await withdrawToken(signer, baseUnitAmount.toString(), config.GoldTokenId)
    setOngoingTxId(result.txId);
    checkGoldContract();
   }
  }


  function formatNumber(num: number) {
    // Nine Zeroes for Billions
    return Math.abs(Number(num)) >= 1.0e+9

    ? (Math.abs(Number(num)) / 1.0e+9).toFixed(1) + " billion"
    // Six Zeroes for Millions 
    : Math.abs(Number(num)) >= 1.0e+6

    ? (Math.abs(Number(num)) / 1.0e+6).toFixed(1) + " million"
    // Three Zeroes for Thousands
    : Math.abs(Number(num)) >= 1.0e+3

    ? (Math.abs(Number(num)) / 1.0e+3).toFixed(1) + " thousand"

    : Math.abs(Number(num));
}


  const txStatusCallback = useCallback(
    async (status: node.TxStatus, numberOfChecks: number): Promise<any> => {
      if ((status.type === 'Confirmed' && numberOfChecks > 2) || (status.type === 'TxNotFound' && numberOfChecks > 3)) {
        setOngoingTxId(undefined)
      }

      return Promise.resolve()
    },
    [setOngoingTxId]
  )


  const handleNftMint = async () => {
    if (signer) {
      // Call the mintNft function from your service with the necessary parameters
      // You may need to adjust this depending on how your service and NftMintconfig are set up
      const index = BigInt(1)
      const mintPrice = BigInt(0.25e18)
      const result = await mintNft(mintPrice, NftMintconfig.NftCollectionAsiaId, signer)
      checkMinting()
      setOngoingMintTxId(result.txId)
    }
  }

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  if (/^\d*$/.test(value)) { // Check if the value consists of only digits
    setWithdrawAmount(value);
  }
};


useEffect(() => {
  // Fetch the count of rows where owner is NULL when the component mounts
  fetchNullOwnersCount()
      .then(count => {
          setMintedNftCount(count);
      })
      .catch(error => {
          console.error('Error fetching null owners count:', error);
          // Handle error if needed
      });
}, []); // Empty dependency array ensures the effect runs only once




  console.log('ongoing..', ongoingTxId)
  return (
    <>   
      {ongoingTxId && <TxStatus txId={ongoingTxId} txStatusCallback={txStatusCallback} />}
      <div>
      <div className={`columns`}>

        <form className={`${styles.tokenDappBackground}`} onSubmit={handleWithdrawSubmit}>
          <>
          <div className={styles.simpletextContainer} onClick={handleClick}>
            <h2 className={styles.title}>$Gold Castle on Alephium </h2>
          </div>
          <div className={styles.simpleundertextContainer} onClick={handleGovernment}>
            <h3 className={styles.title}>Veni Vedi Vici</h3>
          </div>
          <div className={styles.contracttextContainer} onClick={handleContractlink}>
            <p>Contract Address: {config.GoldTokenAddress}</p>
          </div>
          <div className={styles.lotterytextContainer}>
            <p>Win jackpots up to 50 Billion $GOLD</p>
            
          </div>       

            <table>
              
              <thead>
                
                <tr>
                  <td>Biggest wins</td>
                  <th>Day time</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                
                  {winnersData.map((winner, index) => (
                  <tr key={index} style={{ background: 'white', color: 'black' }}>
                    <td>{formatNumber(winner.wonamount)} $GOLD</td>
                    <td>{new Date(winner.datetime * 1000).toLocaleString()}</td>
                    <td>{winner.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <label htmlFor="withraw-mount">Your bet:</label>
            <input
              type="number"
              id="transfer-amount"
              name="amount"
              max="2000000000000000000000000000000000000000"
              min="1"
              value={withdrawAmount}
              onChange={(e) => handleInputChange(e)}
              pattern="\d+"

            />
            <button className={styles.rollbutton} type="submit" value="Roll the Dice" disabled={!signer}>
              Roll the Dice
            </button>
          </>
          {goldStateData && (
              <div className={`${styles.alphLottery}`}>
                <div className={styles.smallcolumn}>
      

                <h1>Alph Jackpot: {Number(goldStateData.jackpot)/1e18} ALPH</h1>
                </div>

                 </div>)}
        </form>



        <div className={`${styles.nftmint}`}>
              <div className={styles.simpletextContainer} onClick={handlecollectionClick}>
            <h2 >Gold Castle Club Membership</h2>
          </div>

          <div className={styles.newmintContainer}>
            <h3 className={styles.title}>Old Asia Mint sold out within a few hours</h3>
          </div>
          <div className={styles.newWrapperContainer}>
             <div className={styles.newLeftSideContainer}>
                <div className={styles.checkraritiesandclassesredirect}>
                  <h3 className={styles.title}>Asian Collection Mint</h3>
                </div>
                <div className={styles.mintNowActioncontainer}>
                  <h3 className={styles.title}>Mint for 1.25 ALPH</h3>
                </div>
                <button className={styles.mySpecialButton} onClick={handleNftMint} disabled={!signer}>  Mint    </button>


             </div>
             
           <div className={styles.newcollectionexampleContainer} onClick={handleClick}>
            <div className={styles.mintimagebackground} style={{ backgroundImage: "url('https://xasdsxuik7lxfsh5ugx3at6of2bxjihsbk45linvxgjalpqquxoq.arweave.net/uCQ5XohX13LI_aGvsE_OLoN0oPIKudWhtbmSBb4Qpd0')" }}></div>
           </div>



          </div>

       </div>
       
      </div> 
      </div>

    </>
  )
}

