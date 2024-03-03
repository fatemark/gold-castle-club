import { DUST_AMOUNT, ExecuteScriptResult, NodeProvider, SignerProvider } from '@alephium/web3'
import { useTxStatus } from '@alephium/web3-react'
import { Mint } from '../../artifacts/ts/scripts'
import { GetRealIndex } from '../services/database_services/getindexforminting'
import { DestroyNft } from '../../artifacts/ts/scripts'
import { ChangeOwner } from '../../artifacts/ts/scripts'

export const mintNft = async (
  mintPrice: bigint,
  nftCollectionContractId: string,
  signer: SignerProvider
): Promise<ExecuteScriptResult> => {
 console.log(signer)
  return await Mint.execute(
    signer,
    {
    initialFields: {
      mintPrice: mintPrice,
      nftCollectionId: nftCollectionContractId,
      },
    attoAlphAmount: DUST_AMOUNT + BigInt(1e18) + mintPrice
  })
}


export const destroyNft = async (
  nftId: string,
  nftCollectionContractId: string,
  signer: SignerProvider
): Promise<ExecuteScriptResult> => {
 console.log(signer)
  return await DestroyNft.execute(
    signer,
    {
    initialFields: {
      nftId: nftId,
      nftCollectionId: nftCollectionContractId,
      },
    attoAlphAmount: DUST_AMOUNT,
    tokens: [
      {
        id: nftId,
        amount: BigInt(1)
      }
    ]
  })
}


export const changeOwner = async (
  nftId: string,
  nftCollectionContractId: string,
  signer: SignerProvider
): Promise<ExecuteScriptResult> => {
 console.log(signer)
  return await ChangeOwner.execute(
    signer,
    {
    initialFields: {
      nftId: nftId,
      nftCollectionId: nftCollectionContractId,
      },
    attoAlphAmount: DUST_AMOUNT + DUST_AMOUNT,
    tokens: [
      {
        id: nftId,
        amount: BigInt(1)
      }
    ]
  })
}


