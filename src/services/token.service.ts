import { DUST_AMOUNT, ExecuteScriptResult, SignerProvider } from '@alephium/web3'
import { Withdraw } from '../../artifacts/ts/scripts'

export const withdrawToken = async (
  signerProvider: SignerProvider,
  amount: string,
  tokenId: string
): Promise<ExecuteScriptResult> => {
  // Assuming ALPH has 18 decimal places, similar to Ethereum's Ether
  const attoAlphAmount = BigInt(amount) + DUST_AMOUNT ;
  return await Withdraw.execute(signerProvider, {
    initialFields: {
      token: tokenId,
      amount: BigInt(amount)
      },
    attoAlphAmount: attoAlphAmount
  })
}
