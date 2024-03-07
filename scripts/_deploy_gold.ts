import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { GoldToken } from '../artifacts/ts'

// This deploy function will be called by cli deployment tool automatically
// Note that deployment scripts should prefixed with numbers (starting from 0)
const deployGold: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  // Get settings
  const issueTokenAmount = network.settings.issueTokenAmount
  const issueLotteryAmount = network.settings.issueLotteryAmount
  const chancellor = network.settings.chancellor
  const warfund = network.settings.warfund
  const airdropbalance = network.settings.airdropbalance
  const wartime = network.settings.wartime
  const fealtyId = network.settings.fealtyId
  const result = await deployer.deployContract(GoldToken, {
    // The amount of token to be issued
    issueTokenAmount: issueTokenAmount,
    // The initial states of the gold contract
    initialFields: {
      symbol: Buffer.from('GOLD', 'utf8').toString('hex'),
      name: Buffer.from('Gold Castle Club', 'utf8').toString('hex'),
      decimals: 0n,
      supply: issueTokenAmount,
      chancellor:chancellor,
      lotterybalance: issueLotteryAmount,
      warfund: warfund,
      airdropbalance: airdropbalance,
      wartime: wartime,
      fealtyId: fealtyId,
      jackpot: 0n
    }
  })
  console.log('Goldtoken contract id: ' + result.contractInstance.contractId)
  console.log('Goldtoken contract address: ' + result.contractInstance.address)
}

export default deployGold
