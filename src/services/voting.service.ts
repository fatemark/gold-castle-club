import { DUST_AMOUNT, ExecuteScriptResult, SignerProvider } from '@alephium/web3'
import { VoteInElection } from '../../artifacts/ts/scripts'
import { DeclareWar } from '../../artifacts/ts/scripts'
import { FealtyConfig } from './utils.fealty'

export const voteInElection = async (
    selectedNft: string,
    voteInput: bigint,
  signer: SignerProvider
): Promise<ExecuteScriptResult> => {
  const fealtyId = FealtyConfig.fealtyId;
  return await VoteInElection.execute(
    signer,
    {
    initialFields: {
    selfAddress: selectedNft,
    voteInput: voteInput,
    fealtyId: fealtyId
          },
    attoAlphAmount: DUST_AMOUNT
  })
}

export const declareWar = async (
    selectedNft: string,
    target: string,
    signer: SignerProvider
  ): Promise<ExecuteScriptResult> => {
    return await DeclareWar.execute(
      signer,
      {
      initialFields: {
      fealtyId: FealtyConfig.fealtyId,
      selfAddress: selectedNft,
      target: target
            },
      attoAlphAmount: DUST_AMOUNT
    })
  }