import { DUST_AMOUNT, ExecuteScriptResult, SignerProvider } from '@alephium/web3'
import { CreateListing } from '../../artifacts/ts/scripts'
import { BuyListing } from '../../artifacts/ts/scripts'
import { RevokeListing } from '../../artifacts/ts/scripts'
import { MarketPlaceConfig } from './marketplaceUtils'


export const createListing = async (
  nftId: string,
  price: bigint,
  signer: SignerProvider
): Promise<ExecuteScriptResult> => {
  const MarketPlaceId = MarketPlaceConfig.MarketPlaceId
  return await CreateListing.execute(
    signer,
    {
    initialFields: {
    nftId: nftId,
    price: price,
    marketplaceId: MarketPlaceId
      },
    attoAlphAmount: BigInt(1e18) + DUST_AMOUNT,
    tokens: [
        {
          id: nftId,
          amount: 1n
        }
      ]
  })
}


export const buyListing = async (
    nftId: string,
    price: bigint,
    signer: SignerProvider
  ): Promise<ExecuteScriptResult> => {
    const MarketPlaceId = MarketPlaceConfig.MarketPlaceId
    return await BuyListing.execute(
      signer,
      {
      initialFields: {
      marketplaceId: MarketPlaceId,
      price: price,
      nftId: nftId,
        },
      attoAlphAmount: price + DUST_AMOUNT,
    })
  }


  export const revokeListing = async (
    nftId: string,
    signer: SignerProvider
  ): Promise<ExecuteScriptResult> => {
    const MarketPlaceId = MarketPlaceConfig.MarketPlaceId
    return await RevokeListing.execute(
      signer,
      {
      initialFields: {
      marketplaceId: MarketPlaceId,
      nftId: nftId,
        },
      attoAlphAmount: DUST_AMOUNT,
    })
  }