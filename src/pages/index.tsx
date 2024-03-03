import React from 'react'
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { TokenDapp } from '@/components/TokenDapp'
import { useWallet } from '@alephium/web3-react'
import { GoldTokenConfig } from '@/services/utils'
import { NftMintconfig } from '@/services/nftutils'
import { useRouter } from 'next/router'; // Import useRouter from Next.js



export default function Home() {
  const { connectionStatus } = useWallet();
  const router = useRouter(); // Initialize useRouter

  const handleRedirectToMyCollection = () => {
    router.push('/collections/mycollection'); // Navigate to MyCollectionComponent
  };

  return (
    <>
      <div className={`${styles.container} homepagebackground`}>
        <Head >
          <title>Gold Token</title>
          <meta name="description" content="The Gold Castle Club" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <TokenDapp config={GoldTokenConfig} NftMintconfig={NftMintconfig} />

      </div>
      
    </>
  )
}
