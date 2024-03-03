import { DUST_AMOUNT, ExecuteScriptResult, SignerProvider, stringToHex } from '@alephium/web3'
import { CreateFealtyForGoldContract } from '../../artifacts/ts/scripts'
import { SwearFealtyForGold } from '../../artifacts/ts/scripts'
import { RescindGoldForFealtyOffer } from '../../artifacts/ts/scripts'
import { SwearFealtyWithoutGoldFree } from '../../artifacts/ts/scripts'
import { DeclareWar } from '../../artifacts/ts/scripts'
import { BecomeOverlord } from '../../artifacts/ts/scripts'

import { FealtyConfig } from './utils.fealty'


export const swearFealtyWithoutGoldFree = async (
  time: bigint,
  lordAddress: string,
  subjectAddress: string,
  signer: SignerProvider
): Promise<ExecuteScriptResult> => {
  return await SwearFealtyWithoutGoldFree.execute(
    signer,
    {
    initialFields: {
      lordAddress: lordAddress,
      subjectAddress: subjectAddress,
      time: time,
      fealtyId: FealtyConfig.fealtyId
          },
    attoAlphAmount: DUST_AMOUNT
  })
}


export const createFealtyForGoldContract = async (
  bribe: bigint,
  time: bigint,
  lordAddress: string,
  minimumClass: bigint,
  lordSubjectIndex: bigint,
  fealtyId: string,
  goldtokenid: string,
  campaign: string,
  subjecttarget: string,
  signer: SignerProvider
): Promise<ExecuteScriptResult> => {
  return await CreateFealtyForGoldContract.execute(
    signer,
    {
    initialFields: {
      bribe: bribe,
      time: time,
      lordAddress: lordAddress,
      minimumClass: minimumClass,
      lordSubjectIndex: lordSubjectIndex,
      fealtyId: fealtyId,
      goldtokenid: goldtokenid,
      campaign: stringToHex(campaign),
      subjecttarget: subjecttarget,
      },
    attoAlphAmount: BigInt(1e18) + DUST_AMOUNT,
    tokens: [
      {
        id: goldtokenid,
        amount: bribe
      }
    ]

  })
}


export const swearFealtyForGold = async (
  lordAddress: string,
  subjectAddress: string,
  lordSubjectIndex: bigint,
  fealtyId: string,
  lordNftIndex: bigint,
  signer: SignerProvider
): Promise<ExecuteScriptResult> => {
  return await SwearFealtyForGold.execute(
    signer,
    {
    initialFields: {
      lordAddress: lordAddress,
      subjectAddress: subjectAddress,
      lordSubjectIndex: lordSubjectIndex,
      fealtyId: fealtyId
      },
    attoAlphAmount: DUST_AMOUNT,
  })
}



export const rescindFealtyOffer = async (
  lordAddress: string,
  lordSubjectIndex: bigint,
  fealtyId: string,
  signer: SignerProvider
): Promise<ExecuteScriptResult> => {
  return await RescindGoldForFealtyOffer.execute(
    signer,
    {
    initialFields: {
      fealtyId: fealtyId,
      lordAddress: lordAddress,
      lordSubjectIndex: lordSubjectIndex
      },
    attoAlphAmount: DUST_AMOUNT,
  })
}

export const declareWar = async (
  selfAddress: string,
  targetAddress: string,
  signer: SignerProvider
): Promise<ExecuteScriptResult> => {
  const fealtyId = FealtyConfig.fealtyId;
  return await DeclareWar.execute(
    signer,
    {
    initialFields: {
      selfAddress: selfAddress,
      target: targetAddress,
      fealtyId: fealtyId
      },
    attoAlphAmount: DUST_AMOUNT
  })
}


export const becomeOverlord = async (
  lordAddress: string,
  signer: SignerProvider
): Promise<ExecuteScriptResult> => {
  const fealtyId = FealtyConfig.fealtyId;
  return await BecomeOverlord.execute(
    signer,
    {
    initialFields: {
      lordAddress: lordAddress,
      fealtyId: fealtyId
      },
    attoAlphAmount: DUST_AMOUNT
  })
}