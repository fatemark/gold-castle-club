import { NetworkId } from '@alephium/web3'
import { loadDeployments } from '../../artifacts/ts/deployments'

export interface MarketPlaceConfig {
  network: NetworkId
  MarketPlaceIndex: number
  MarketPlaceAddress: string
  MarketPlaceId: string
}

function getNetwork(): NetworkId {
  const network = (process.env.NEXT_PUBLIC_NETWORK ?? 'mainnet') as NetworkId
  return network
}

function getMarketPlaceConfig(): MarketPlaceConfig {
  const network = getNetwork()
  const MarketPlace = loadDeployments(network).contracts.MarketPlace.contractInstance
  const MarketPlaceIndex = MarketPlace.groupIndex
  const MarketPlaceAddress = MarketPlace.address
  const MarketPlaceId = MarketPlace.contractId

  return { network, MarketPlaceIndex, MarketPlaceAddress, MarketPlaceId }
}


export const MarketPlaceConfig = getMarketPlaceConfig()