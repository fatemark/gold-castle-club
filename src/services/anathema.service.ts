import { DUST_AMOUNT, ExecuteScriptResult, SignerProvider, stringToHex } from '@alephium/web3'
import { DeclareAnathemaByLord } from '../../artifacts/ts/scripts'
import { DeclareAnathemaByHighLord } from '../../artifacts/ts/scripts'
import { RevokeAnathemaByBribe } from '../../artifacts/ts/scripts'
import { RevokeAnathemaByDeclarer } from '../../artifacts/ts/scripts'
import { RevokeAnathemaByHighLord } from '../../artifacts/ts/scripts'
import { RevokeAnathemaByTime } from '../../artifacts/ts/scripts'
import { FealtyConfig } from '@/services/utils.fealty';
import { GoldTokenConfig } from '@/services/utils'
// import { GetRealIndex } from '../services/database_services/getindexforminting'

export const declareAnathemaByLord = async (
  scroundrelAddress: string,
  declarerLordAddress: string,
  bribe: bigint,
  reason: string,
  signer: SignerProvider
): Promise<ExecuteScriptResult> => {
  const fee = BigInt(bribe) / BigInt(40);
  const goldtokenid = GoldTokenConfig.GoldTokenId;
  return await DeclareAnathemaByLord.execute(
    signer,
    {
    initialFields: {
    scroundrelAddress: scroundrelAddress,
    declarerLordAddress: declarerLordAddress,
    bribe: bribe,
    fealtyId: FealtyConfig.fealtyId,
    goldtokenid: GoldTokenConfig.GoldTokenId,
    reason: stringToHex(reason)
      },
    attoAlphAmount: BigInt(1e18) + DUST_AMOUNT,
    tokens: [
      {
        id: goldtokenid,
        amount: fee
      }
    ]
  })
}

export const declareAnathemaByHighLord = async (
  scroundrelAddress: string,
  declarerLordAddress: string,
  bribe: bigint,
  reason: string,
  signer: SignerProvider
): Promise<ExecuteScriptResult> => {
  const fee = BigInt(bribe) / BigInt(10);
  const goldtokenid = GoldTokenConfig.GoldTokenId;
  return await DeclareAnathemaByHighLord.execute(
    signer,
    {
    initialFields: {
    scroundrelAddress: scroundrelAddress,
    declarerLordAddress: declarerLordAddress,
    bribe: bribe,
    fealtyId: FealtyConfig.fealtyId,
    goldtokenid: goldtokenid,
    reason: stringToHex(reason),
      },
    attoAlphAmount: BigInt(1e18) + DUST_AMOUNT,
    tokens: [
      {
        id: goldtokenid,
        amount: fee
      }
    ]
  })
}


export const revokeAnathemaByBribe = async (
  scroundrelAddress: string,
  bribe: bigint,
  revokerAddress: string,
  signer: SignerProvider
): Promise<ExecuteScriptResult> => {
  const goldtokenid = GoldTokenConfig.GoldTokenId;
  return await RevokeAnathemaByBribe.execute(
    signer,
    {
    initialFields: {
    scroundrelAddress: scroundrelAddress,
    bribe: bribe,
    fealtyId: FealtyConfig.fealtyId,
    goldtokenid: goldtokenid,
    lordAddress: revokerAddress
      },
    attoAlphAmount: DUST_AMOUNT,
    tokens: [
      {
        id: goldtokenid,
        amount: bribe
      }
    ]
  })
}


export const revokeAnathemaByDeclarer = async (
  scroundrelAddress: string,
  revokerAddress: string,
  signer: SignerProvider
): Promise<ExecuteScriptResult> => {
  const goldtokenid = GoldTokenConfig.GoldTokenId;
  return await RevokeAnathemaByDeclarer.execute(
    signer,
    {
    initialFields: {
    scroundrelAddress: scroundrelAddress,
    revokerAddress: revokerAddress,
    fealtyId: FealtyConfig.fealtyId,
      },
    attoAlphAmount: DUST_AMOUNT,
  })
}

export const revokeAnathemaByHighLord = async (
  scroundrelAddress: string,
  revokerAddress: string,
  signer: SignerProvider
): Promise<ExecuteScriptResult> => {
  const goldtokenid = GoldTokenConfig.GoldTokenId;
  return await RevokeAnathemaByHighLord.execute(
    signer,
    {
    initialFields: {
    scroundrelAddress: scroundrelAddress,
    revokerAddress: revokerAddress,
    fealtyId: FealtyConfig.fealtyId,
      },
    attoAlphAmount: DUST_AMOUNT,
  })
}

export const revokeAnathemaByTime = async (
  scroundrelAddress: string,
  signer: SignerProvider
): Promise<ExecuteScriptResult> => {
  const goldtokenid = GoldTokenConfig.GoldTokenId;
  return await RevokeAnathemaByTime.execute(
    signer,
    {
    initialFields: {
    scroundrelAddress: scroundrelAddress,
    fealtyId: FealtyConfig.fealtyId,
      },
    attoAlphAmount: DUST_AMOUNT,
  })
}