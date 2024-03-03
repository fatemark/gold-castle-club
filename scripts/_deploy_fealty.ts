import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { Fealty } from '../artifacts/ts'

// This deploy function will be called by cli deployment tool automatically
// Note that deployment scripts should prefixed with numbers (starting from 0)
const deployFealtyandmarriage: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  // Get settings
  const fealtyforgoldid = network.settings.fealtyforgoldid
  const goldtokenid = network.settings.goldtokenid
  const collectionId = network.settings.collectionId
  const systemowner = network.settings.systemowner
  const specificmarriagetemplateid = network.settings.specificmarriagetemplateid
  const anathemaId = network.settings.anathemaId
  const result = await deployer.deployContract(Fealty, {
    // The amount of token to be issued
    // The initial states of the gold contract
    initialFields: {
    goldtokenid: goldtokenid,
    anathemaId: anathemaId,
    asiaCollectionid: collectionId,
    fealtyforgoldid: fealtyforgoldid,
    systemowner: systemowner,
    specificmarriagetemplateid: specificmarriagetemplateid,
    europeCollectionid: collectionId,
    americasCollectionid: collectionId,
    africaCollectionid: collectionId,
    antarticaOceaniaCollectionid: collectionId,
    championsCollectionid: collectionId,
    countriesCollectionid: collectionId,
    divorcefee: 150_000n

    }
  })
  console.log('Fealty contract id: ' + result.contractInstance.contractId)
  console.log('Fealty contract address: ' + result.contractInstance.address)
}

export default deployFealtyandmarriage

