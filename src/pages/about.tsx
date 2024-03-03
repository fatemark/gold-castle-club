// pages/index.tsx                 .filter(nft => nft.gender =! expandedOfferData.gender && nft.marriagetime < Date.now() )

import React, { useState, useEffect } from 'react';
import styles from '../styles/Fealty.module.css'


const About: React.FC = () => {





  return (
<div className={styles.marriageoffersbackground} style= { { backgroundImage:`url(/backgrounds/palace.webp)`, 
  backgroundSize: '2000px' // Let the browser size the background image,
 } } >
  <div className={styles.twoColumnLayout}>
  
  <div className={styles.electioninfo}>
  <div className={styles.overlordinfo} style= { { width:'98%', maxWidth:'88%', textAlign:'center', marginLeft:'5%', marginBottom:'0px', marginTop:'0px' } } >
  <div className={styles.powertextbox}>
      <h1> The GOLD CASTLE CLUB </h1>
      </div>
      </div>

      <div className={styles.twoColumnLayout}>
      <div className={styles.overlordinfo} style= { { width:'75%', maxWidth:'88%', textAlign:'center', marginLeft:'5%', color:'#FFD700', backgroundColor:'#1661cab3' } } >
      <p>The NFTs of Gold Castle Club become more powerful when you combine them. Every NFT is relevant because of this inherent feature. You are able to make powerful alliances even if your NFT is not the most powerful. And if you're done, sell it on the market. You can also destroy the NFT and get refunded 1 ALPH.</p>
      <p>Each NFT has its own stats. For example, some NFTs have much higher hp and ap stats, making them ascendant. Others have high magic and these are called magic ascendant. Others have rare and powerful items and allegiances associated with them.</p>
      <p>To gain more power you can marry the NFTs to each other or have them swear fealty, for free, within your own NFT collection, or in exchange for a $GOLD bribe to an NFT outside your collection. This way, even if you do not own the most powerful NFT, you can become part of something bigger. A good emperor or empress will happily welcome a peasant into his or her empire</p>
      <p>Use your empires and kingdoms to wage war and vote in elections. The members of Gold Castle Club and their vassals form the government. Winners of the war will gain large sums of $GOLD as spoils of war. All the direct and indirect vassals will share in the spoils.</p>
      <p>If an emperor wins the war, the kings sworn to him will receive $GOLD, but also the dukes sworn to those kings and those sworn to those dukes in turn...all the way down until the lowliest peasant</p>
      <p>At the moment, the war mechanism is under development. We want to make it a game involving strategy and alliances. Declaring war occurs on-chain and can already be done with the release of the Old Asia Collection. The exact rules of war will be revealed soon</p>
      <p>Items and allegiances have different strategic values, and combining NFTs of the same allegiance can have an advantage. New collections, like the upcoming Old Europe collection, can interact with the older collections. This way older collections will never lose their value</p>

      </div>
      <div className={styles.overlordinfo} style= { { width:'50%', maxWidth:'88%', textAlign:'center', marginLeft:'5%', color:'#FFD700', backgroundColor:'#1661cab3' } } >
      <p>$GOLD is the token used for bribes, dowries, and spoils of war in Gold Castle Club. 82.5% Is part of the lotteryfund, 5% will be airdropped to NFT holders (including future collections), 12.5% will be used as rewards in the war over the course of 25 wars.</p>
      <p> $GOLD can be withdrawn from the lottery in exchange for ALPH with the chance of winning 50 billion $GOLD or one of the smaller jackpots. The average won amount when betting 1 ALPH is 25 million $GOLD. All ALPH that the contract receives is added to the ALPH jackpot.</p>
      <p>For each bet, you have another chance to win the entire ALPH jackpot along with any $GOLD winnings. You can also win a smaller jackpot of 10%, 22%, 25%, or 50% of the ALPH jackpot.</p>
      </div>
      </div>




  </div>

    <div className={styles.overlordinfo} style= { { width:'10%' } } >

      <div className={styles.overlordinfo} style= { { width:'90%', maxWidth:'90%', textAlign:'center', marginLeft:'5%', marginBottom:'0px', marginTop:'2%', padding:'10px' } } >
      <div className={styles.powertextbox}>
          <h1> $GOLD</h1>
        </div>
      </div>

      <div className={styles.overlordinfo} style= { { width:'90%', maxWidth:'90%', textAlign:'center', marginLeft:'5%', marginBottom:'12px', padding:'10px', height:'10vh' } } >
      <div className={styles.governmentpowertextbox} style= { {  fontSize:'14px', whiteSpace:'normal', height:'7vh' } } >     
         <h2> $GOLD, the currency for bribes, war and paying dowries, and winning big ALPH jackpots</h2>
        </div>
      </div>



        <img src={`/backgrounds/orangecat.webp`} alt={`Planetator`} width="450rem" height="450rem"/>

      </div>
  </div>
</div>

  );
};

export default About;