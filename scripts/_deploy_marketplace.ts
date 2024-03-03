import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { MarketPlace } from '../artifacts/ts'
import { stringToHex } from '@alephium/web3'

// This deploy function will be called by cli deployment tool automatically
// Note that deployment scripts should prefixed with numbers (starting from 0)
const deployMarketPlace: DeployFunction<Settings> = async (
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
  const systemowner = network.settings.systemowner
  const listingTemplateId = network.settings.listingTemplateId
  const result = await deployer.deployContract(MarketPlace, {
    // The amount of token to be issued
    // The initial states of the gold contract

    initialFields: {
        listingTemplateId: listingTemplateId,
        marketplaceOwner: systemowner
          }
  })
  console.log('Marketplace id: ' + result.contractInstance.contractId)
  console.log('Marketplace address: ' + result.contractInstance.address)
}

export default deployMarketPlace

