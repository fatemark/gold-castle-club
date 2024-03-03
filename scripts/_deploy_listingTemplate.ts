import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { NftListing } from '../artifacts/ts'
import { stringToHex } from '@alephium/web3'

// This deploy function will be called by cli deployment tool automatically
// Note that deployment scripts should prefixed with numbers (starting from 0)
const deployNftListing: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  // Get settings
  const marketplaceId = network.settings.marketplaceId
  const collectionUriamount = network.settings.collectionUri
  const collectionOwner = network.settings.collectionOwner
  const nftBaseUriamount = network.settings.nftBaseUri
  const maxSupplyamount = network.settings.maxSupply
  const mintPriceamount = network.settings.mintPrice
  const royaltyRateamount = network.settings.royaltyRate
  const totalSupplyamount = network.settings.totalSupply
  const goldtokenid = network.settings.goldtokenid
  const fealtyId = network.settings.fealtyId
  const result = await deployer.deployContract(NftListing, {
    // The amount of token to be issued
    // The initial states of the gold contract

    initialFields: {
        marketplaceId: marketplaceId,
        nftId: '',
        price: 0n,
        lister: collectionOwner
          }
  })
  console.log('Nft listing template id: ' + result.contractInstance.contractId)
  console.log('Nft listing template address: ' + result.contractInstance.address)
}

export default deployNftListing

