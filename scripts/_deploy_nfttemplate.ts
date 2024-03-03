import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { NFT } from '../artifacts/ts'
import { stringToHex } from '@alephium/web3'

// This deploy function will be called by cli deployment tool automatically
// Note that deployment scripts should prefixed with numbers (starting from 0)
const deployNFT: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  // Get settings
  const tokenUriamount = network.settings.tokenUri
  const collectionIdamount = network.settings.collectionId
  const nftIndexamount = network.settings.nftIndex
  const potentialMarriage = network.settings.potentialMarriage
  const nftclass = network.settings.nftclass
  const feudalLord = network.settings.feudalLord
  const yearoftime = network.settings.yearoftime
  const marriageTime = network.settings.marriageTime
  const feudalTime = network.settings.feudalTime
  const marketPlaceId = network.settings.marketplaceId
  const fealtyId = network.settings.fealtyId
  const result = await deployer.deployContract(NFT, {
    // The amount of token to be issued
    // The initial states of the gold contract

    initialFields: {
      tokenUri: stringToHex(tokenUriamount),
      collectionId: collectionIdamount,
      nftIndex: 0n,
      nftclass: 0n,
      vote: 0n,
      voteTime: 0n,
      warStarted: 0n,
      wartarget: feudalLord,
      marriage: potentialMarriage,
      marriageTime: 0n,
      feudalLord: feudalLord,
      feudalTime: 0n,
      fealtyId: fealtyId,
      owner: feudalLord,
      anathema: false,
      anathemaDeclaredCount: 0n,
      lovercount: 0n,
      anathemaCooldown: 0n
    }
  })
  console.log('Nft template id: ' + result.contractInstance.contractId)
  console.log('Nft template address: ' + result.contractInstance.address)
}

export default deployNFT
