import { NetworkId } from '@alephium/web3'
import { loadDeployments } from '../../artifacts/ts/deployments'

export interface GoldTokenConfig {
  network: NetworkId
  groupIndex: number
  GoldTokenAddress: string
  GoldTokenId: string
}

function getNetwork(): NetworkId {
  const network = (process.env.NEXT_PUBLIC_NETWORK ?? 'mainnet') as NetworkId
  return network
}


function getGoldTokenConfig(): GoldTokenConfig {
  const network = getNetwork()
  const GoldToken = loadDeployments(network).contracts.GoldToken.contractInstance
  const groupIndex = GoldToken.groupIndex
  const GoldTokenAddress = GoldToken.address
  const GoldTokenId = GoldToken.contractId
  return { network, groupIndex, GoldTokenAddress, GoldTokenId }
}

export const GoldTokenConfig = getGoldTokenConfig()


