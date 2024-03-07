
// pages/index.tsx
import React, { useState } from 'react';
import { declareWar } from '../services/swearfealty.service'
import { ChangeCollectionid, withDrawRoyalty, withdrawFromCollection, airdropWithdraw, destroyCollection } from '@/services/ownerServices.service'
import { useWallet } from '@alephium/web3-react'
import { node } from '@alephium/web3'
import { FealtyConfig } from '@/services/utils.fealty';
import { NftMintconfig } from '@/services/nftutils'
import { GoldTokenConfig } from '@/services/utils';
import styles from '../styles/Fealty.module.css'
import { destroyNft } from '../services/nft.token.service';

const ChancellorService: React.FC = () => {

const { signer, account } = useWallet()
const [ongoingTxId, setOngoingTxId] = useState<string>()





  const handledestroy = async () => {
    if (signer) {
      const nftId = 'f349f3ff0b3db9102aa20315bf676362af9e06822874c3a6900e33249ff83200'
      const newcollection = NftMintconfig.NftCollectionAsiaId;
      const result = await destroyNft(nftId, newcollection, signer)
      setOngoingTxId(result.txId)
    }
  }

const handleChangeCollectionid = async () => {
  if (signer) {
    // Call the mintNft function from your service with the necessary parameters
    // You may need to adjust this depending on how your service and NftMintconfig are set up
    const collectiontochangenumber = BigInt(0)
    // const newcollection = 'c25995ef063daffc268b69b1c3bc692b0640c58beaa4d27ffec1f574a0891100'
    const newcollection = NftMintconfig.NftCollectionAsiaId;
    const fealtyId = FealtyConfig.fealtyId;
    const result = await ChangeCollectionid(collectiontochangenumber, newcollection, fealtyId, signer)
    setOngoingTxId(result.txId)
  }
}

const handleChangeGoldTokenId = async () => {
  if (signer) {
    // Call the mintNft function from your service with the necessary parameters
    // You may need to adjust this depending on how your service and NftMintconfig are set up
    const collectiontochangenumber = BigInt(7)
    // const newcollection = 'c25995ef063daffc268b69b1c3bc692b0640c58beaa4d27ffec1f574a0891100'
    const newgoldtokenid = GoldTokenConfig.GoldTokenId;
    const fealtyId = FealtyConfig.fealtyId;
    const result = await ChangeCollectionid(collectiontochangenumber, newgoldtokenid, fealtyId, signer)
    setOngoingTxId(result.txId)
  }
}



const handleWithDrawRoyalty = async () => {
  if (signer) {
    // Call the mintNft function from your service with the necessary parameters
    // You may need to adjust this depending on how your service and NftMintconfig are set up
    const toAddress = account.address
    const amount = BigInt(1)
    const nftCollectionId = NftMintconfig.NftCollectionAsiaId;
    const result = await withDrawRoyalty(toAddress, amount, nftCollectionId, signer)
    setOngoingTxId(result.txId)
  }
}

const handleWithdrawFromCollection = async () => {
  if (signer) {
    // Call the mintNft function from your service with the necessary parameters
    // You may need to adjust this depending on how your service and NftMintconfig are set up
    const toAddress = account.address
    const amount = BigInt(1e18)
    const nftCollectionId = NftMintconfig.NftCollectionAsiaId;
    const result = await withdrawFromCollection(toAddress, amount, nftCollectionId, signer)
    setOngoingTxId(result.txId)
  }
}

const handleDeclareWar = async () => {
  if (signer) {
    const selfId = '9f0cd7ee469b2d4471e82e4aff7004e34c7403487bfe387da98a33938e4e6000'
    const targetAddress = '288XZbgoEthsVCW262GydAAAoes9a3DFeXByhPmMk4ZSo';
    // Call the execute method of getAvailableIndex to get the lordSubjectIndex
            console.log(selfId, targetAddress, signer)
      // If lordSubjectIndex is not -1, it means a valid index is available
      const fealtyId = FealtyConfig.fealtyId;
      const goldtokenid = GoldTokenConfig.GoldTokenId;
      const result = await declareWar(
        selfId,
        targetAddress,
        signer
      )
      setOngoingTxId(result.txId);
  }
}


const handleAirdropWithdraw = async () => {
  if (signer) {
    const amount = BigInt(80_000_000_000)
      // If lordSubjectIndex is not -1, it means a valid index is available
      const fealtyId = FealtyConfig.fealtyId;
      const goldtokenid = GoldTokenConfig.GoldTokenId;
      const result = await airdropWithdraw(
        amount,
        signer
      )
      setOngoingTxId(result.txId);
  }
}

const handledestroyCollection = async () => {
  if (signer) {
    const amount = BigInt(80_000_000_000)
      // If lordSubjectIndex is not -1, it means a valid index is available
      const fealtyId = FealtyConfig.fealtyId;
      const goldtokenid = GoldTokenConfig.GoldTokenId;
      const result = await destroyCollection(
        signer
      )
      setOngoingTxId(result.txId);
  }
}


return (
    <div className="padding_top">
      <button className={styles.goldofferfealtybutton} onClick={handleChangeCollectionid}> Change asia collection id</button>
      <button className={styles.goldofferfealtybutton} onClick={handleChangeGoldTokenId}> Change goldtokenid id</button>
      <button className={styles.goldofferfealtybutton} onClick={handleWithDrawRoyalty}> Withdraw</button>
      <button className={styles.goldofferfealtybutton} onClick={handleWithdrawFromCollection}> Withdraw</button>
      <button className={styles.goldofferfealtybutton} onClick={handledestroy}> destroy nft template</button>
      <button className={styles.goldofferfealtybutton} onClick={handleAirdropWithdraw}> Airdrop withdraw</button>
      <button className={styles.goldofferfealtybutton} onClick={handledestroyCollection}> Destroy collection</button>


      
    </div>
  );
};

export default ChancellorService;
