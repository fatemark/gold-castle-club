import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { Anathema } from '../artifacts/ts'
import { stringToHex } from '@alephium/web3'

// This deploy function will be called by cli deployment tool automatically
// Note that deployment scripts should prefixed with numbers (starting from 0)
const deployAnathema: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  // Get settings
  const lordaddress = network.settings.lordAddress
  const fealtyId = network.settings.fealtyId
  const goldtokenid = network.settings.goldtokenid
  const result = await deployer.deployContract(Anathema, {
    // The amount of token to be issued
    // The initial states of the gold contract
    initialFields: {
      owner: lordaddress,
      lordDeclarerAddress: lordaddress,
      declarerNftClass: 0n,
      scroundrelAddress: lordaddress,
      bribe: 0n,
      fealtyId: fealtyId,
      timeDeclared: 0n,
      reason: stringToHex("You don't love me")
    }
  })
  console.log('Anathema contract id: ' + result.contractInstance.contractId)
  console.log('Anathema contract address: ' + result.contractInstance.address)
}

export default deployAnathema


