import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { MarriageSpecific } from '../artifacts/ts'

// This deploy function will be called by cli deployment tool automatically
// Note that deployment scripts should prefixed with numbers (starting from 0)
const deploySpecificMarriage: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  // Get settings
  const proposer = network.settings.proposer
  const goldtokenid = network.settings.goldtokenid
  const fealtyId = network.settings.fealtyId
  const proposee = network.settings.proposee
  const result = await deployer.deployContract(MarriageSpecific, {
    // The amount of token to be issued
    // The initial states of the gold contract
    initialFields: {
    proposer: proposer,
    dowry: 2n,
    time: 60000n,
    goldtokenid: goldtokenid,
    fealtyId: fealtyId,
    proposee: proposee,
    owner: proposee,
    loveletter: '',
    maxlovercount: 0n
    }
  })
  console.log('Marriage contract template id: ' + result.contractInstance.contractId)
  console.log('Marriage contract template address: ' + result.contractInstance.address)
}

export default deploySpecificMarriage