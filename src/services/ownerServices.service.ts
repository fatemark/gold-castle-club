import { DUST_AMOUNT, ExecuteScriptResult, SignerProvider } from '@alephium/web3'
import { ChangeCollectionId } from '../../artifacts/ts/scripts'
import { WithDrawRoyalty } from '../../artifacts/ts/scripts'
import { WithDrawFromCollection } from '../../artifacts/ts/scripts'
import { AirdropWithdraw } from '../../artifacts/ts/scripts'

import { GoldTokenConfig } from './utils'
// import { GetRealIndex } from '../services/database_services/getindexforminting'

export const ChangeCollectionid = async (
collectiontochangenumber: bigint,
newcollection: string,
fealtyId: string,
signer: SignerProvider
): Promise<ExecuteScriptResult> => {
  return await ChangeCollectionId.execute(
    signer,
    {
    initialFields: {
    collectiontochangenumber: collectiontochangenumber,
    newcollection: newcollection,
    fealtyId: fealtyId
      },
    attoAlphAmount: DUST_AMOUNT
  })
}


export const withDrawRoyalty = async (
  to: string,
  amount: bigint,
  nftCollectionId: string,
  signer: SignerProvider
  ): Promise<ExecuteScriptResult> => {
    return await WithDrawRoyalty.execute(
      signer,
      {
      initialFields: {
        to: to,
        amount: amount,
        nftCollectionId: nftCollectionId
        },
      attoAlphAmount: DUST_AMOUNT
    })
  }

  export const withdrawFromCollection = async (
    to: string,
    amount: bigint,
    nftCollectionId: string,
    signer: SignerProvider
    ): Promise<ExecuteScriptResult> => {
      return await WithDrawFromCollection.execute(
        signer,
        {
        initialFields: {
          to: to,
          amount: amount,
          nftCollectionId: nftCollectionId
          },
        attoAlphAmount: DUST_AMOUNT
      })
    }



    export const airdropWithdraw = async (
      amount: bigint,
      signer: SignerProvider
      ): Promise<ExecuteScriptResult> => {
        const token = GoldTokenConfig.GoldTokenId;
        return await AirdropWithdraw.execute(
          signer,
          {
          initialFields: {
            token: token,
            amount: amount
            },
          attoAlphAmount: DUST_AMOUNT
        })
      }