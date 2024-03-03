import { NetworkId } from '@alephium/web3'
import { loadDeployments } from '../../artifacts/ts/deployments'

export interface FealtyConfig {
  network: NetworkId
  fealtyIndex: number
  fealtyAddress: string
  fealtyId: string
}

function getNetwork(): NetworkId {
  const network = (process.env.NEXT_PUBLIC_NETWORK ?? 'mainnet') as NetworkId
  return network
}

function getFealtyConfig(): FealtyConfig {
  const network = getNetwork()
  const Fealty = loadDeployments(network).contracts.Fealty.contractInstance
  const fealtyIndex = Fealty.groupIndex
  const fealtyAddress = Fealty.address
  const fealtyId = Fealty.contractId

  return { network, fealtyIndex, fealtyAddress, fealtyId }
}


export const FealtyConfig = getFealtyConfig()