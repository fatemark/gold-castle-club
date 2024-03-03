import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { FealtyForGold } from '../artifacts/ts'
import { stringToHex } from '@alephium/web3'

// This deploy function will be called by cli deployment tool automatically
// Note that deployment scripts should prefixed with numbers (starting from 0)
const deployfealtyforgold: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  // Get settings
  const lordAddress = network.settings.lordAddress
  const goldtokenid = network.settings.goldtokenid
  const fealtyId = network.settings.fealtyId
  const result = await deployer.deployContract(FealtyForGold, {
    // The amount of token to be issued
    // The initial states of the gold contract
    initialFields: {
    minimumClass: 0n,
    lordAddress: lordAddress,
    lordnftclass: 0n,
    bribe: 2n,
    time: 60000n,
    goldtokenid: goldtokenid,
    fealtyId: fealtyId,
    owner: lordAddress,
    campaign: stringToHex('In God We Trust'),
    subjecttarget: lordAddress
    }
  })
  console.log('fealtyforgold contract id: ' + result.contractInstance.contractId)
  console.log('fealtyforgold contract address: ' + result.contractInstance.address)
}

export default deployfealtyforgold
