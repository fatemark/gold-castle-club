import { DUST_AMOUNT, ExecuteScriptResult, SignerProvider, stringToHex } from '@alephium/web3'
import { CreateMarriageOffer } from '../../artifacts/ts/scripts'
import { AcceptMarriageOffer } from '../../artifacts/ts/scripts'
import { MarryOwnCollection } from '../../artifacts/ts/scripts'
import { RescindMarriageOffer } from '../../artifacts/ts/scripts'
import { Divorce } from '../../artifacts/ts/scripts'
import { BecomeLover } from '../../artifacts/ts/scripts'

import { GoldTokenConfig } from './utils'
import { FealtyConfig } from './utils.fealty'

// import { GetRealIndex } from '../services/database_services/getindexforminting'

export const createMarriageOffer = async (
  fealtyId: string,
  dowry: bigint,
  goldtokenid: string,
  proposee: string,
  proposer: string,
  time: bigint,
  loveletter: string,
  maxlovercount: bigint,
  signer: SignerProvider
): Promise<ExecuteScriptResult> => {
  return await CreateMarriageOffer.execute(
    signer,
    {
    initialFields: {
      fealtyId: fealtyId,
      dowry: dowry,
      goldtokenid: goldtokenid,
      proposee: proposee,
      proposer: proposer,
      time: time,
      loveletter: stringToHex(loveletter),
      maxlovercount: maxlovercount
    },
    attoAlphAmount: BigInt(1e18) + DUST_AMOUNT,
    tokens: [
      {
        id: goldtokenid,
        amount: dowry
      }
    ]

  })
}



export const acceptMarriageOffer = async (
  fealtyId: string,
  proposee: string,
  proposer: string,
  signer: SignerProvider
): Promise<ExecuteScriptResult> => {
  return await AcceptMarriageOffer.execute(
    signer,
    {
    initialFields: {
      proposee: proposee,
      proposer: proposer,
      fealtyId: fealtyId,
      },
    attoAlphAmount: DUST_AMOUNT
  })
}


export const marryOwnCollection = async (
  fealtyId: string,
  proposee: string,
  proposer: string,
  extratime: bigint,
  signer: SignerProvider
): Promise<ExecuteScriptResult> => {
  return await MarryOwnCollection.execute(
    signer,
    {
    initialFields: {
      proposee: proposee,
      proposer: proposer,
      extratime: extratime,
      fealtyId: fealtyId,
      },
    attoAlphAmount: DUST_AMOUNT
  })
}


export const rescindMarriageOffer = async (
  fealtyId: string,
  proposer: string,
  signer: SignerProvider
): Promise<ExecuteScriptResult> => {
  return await RescindMarriageOffer.execute(
    signer,
    {
    initialFields: {
      proposer: proposer,
      fealtyId: fealtyId,
      },
    attoAlphAmount: DUST_AMOUNT
  })
}

export const divorce = async (
  divorcefee: bigint,
  wifeHusband: string,
  claimant: string,
  signer: SignerProvider
): Promise<ExecuteScriptResult> => {
  return await Divorce.execute(
    signer,
    {
    initialFields: {
      wifeHusband: wifeHusband,
      claimant: claimant,
      fealtyId: FealtyConfig.fealtyId,
      goldtokenid: GoldTokenConfig.GoldTokenId,
      divorcefee: divorcefee
      },
    attoAlphAmount: DUST_AMOUNT,
    tokens: [
      {
        id: GoldTokenConfig.GoldTokenId,
        amount: divorcefee
      }
    ]

  })
}


export const becomeLover = async (
  selfloverAddress: string,
  lovertargetAddress: string,
  signer: SignerProvider
): Promise<ExecuteScriptResult> => {
  const fealtyId = FealtyConfig.fealtyId;
  return await BecomeLover.execute(
    signer,
    {
    initialFields: {
      selfloverAddress: selfloverAddress,
      lovertargetAddress: lovertargetAddress,
      fealtyId: fealtyId,
      },
    attoAlphAmount: DUST_AMOUNT
  })
}