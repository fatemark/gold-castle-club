import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { NFTPublicSaleCollectionRandomWithRoyalty } from '../artifacts/ts'
import { stringToHex } from '@alephium/web3'

// This deploy function will be called by cli deployment tool automatically
// Note that deployment scripts should prefixed with numbers (starting from 0)
const deployNFTcollection: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  // Get settings
  const nftTemplateId = network.settings.nftTemplateId
  const collectionUriamount = network.settings.collectionUri
  const collectioncollectionOwner = network.settings.collectionOwner
  const nftBaseUriamount = network.settings.nftBaseUri
  const maxSupplyamount = network.settings.maxSupply
  const mintPriceamount = network.settings.mintPrice
  const royaltyRateamount = network.settings.royaltyRate
  const marketPlaceId = network.settings.marketplaceId
  const systemowner = network.settings.systemowner
  const fealtyId = network.settings.fealtyId
  const listingTemplateId = network.settings.listingTemplateId
  const result = await deployer.deployContract(NFTPublicSaleCollectionRandomWithRoyalty, {
    // The amount of token to be issued
    // The initial states of the gold contract

    initialFields: {
      nftTemplateId: nftTemplateId,
      collectionUri: stringToHex('https://ib4gdds545n7nxdcaurwju2m7xykpccuzj74kc7uulj3uqc7zgha.arweave.net/QHhhjl3nW_bcYgUjZNNM_fCniFTKf8UL9KLTukBfyY4'),
      collectionOwner: systemowner,
      nftBaseUri: stringToHex('https://arweave.net/dbdvbcYroy6tjCodD4f4HHgPXmYJGLQdPqPHKNto3v0/'),
      maxSupply: 563n,
      maxmaxnumber: 563n,
      mintPrice: 1_000_000_000_000_000_000n,
      royaltyRate: 200n,
      totalSupply: 563n,
      fealtyId: fealtyId
    }
  })
  console.log('Nft collection id: ' + result.contractInstance.contractId)
  console.log('Nft collection address: ' + result.contractInstance.address)
}

export default deployNFTcollection
