import { NetworkId } from '@alephium/web3'
import { loadDeployments } from '../../artifacts/ts/deployments'

export interface NftMintconfig {
  network: NetworkId
  NftCollectionAsiaIndex: number
  NftCollectionAsiaAddress: string
  NftCollectionAsiaId: string
}

function getNetwork(): NetworkId {
  const network = (process.env.NEXT_PUBLIC_NETWORK ?? 'mainnet') as NetworkId
  return network
}

function getNftMintconfig(): NftMintconfig {
  const network = getNetwork()
  const NFTPublicSaleCollectionRandomWithRoyalty = loadDeployments(network).contracts.NFTPublicSaleCollectionRandomWithRoyalty.contractInstance
  const NftCollectionAsiaIndex = NFTPublicSaleCollectionRandomWithRoyalty.groupIndex
  const NftCollectionAsiaAddress = NFTPublicSaleCollectionRandomWithRoyalty.address
  const NftCollectionAsiaId = NFTPublicSaleCollectionRandomWithRoyalty.contractId

  return { network, NftCollectionAsiaIndex, NftCollectionAsiaAddress, NftCollectionAsiaId }
}


export const NftMintconfig = getNftMintconfig()