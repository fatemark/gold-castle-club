import { Configuration } from '@alephium/cli'
import { Address, Number256 } from '@alephium/web3'

// Settings are usually for configuring
export type Settings = {
  issueTokenAmount: Number256,
  issueLotteryAmount: Number256
  nftTemplateId: string,
  collectionUri: string,
  collectionOwner: string,
  nftBaseUri: string,
  maxSupply: Number256,
  mintPrice: Number256,
  royaltyRate: Number256,     // basis point. e.g. 2.5% == 250 basis point
  totalSupply: Number256,
  tokenUri: string,
  collectionId: string,
  nftIndex: Number256,
  potentialMarriage: string,
  feudalLord: string,
  nftclass: Number256,
  marriageTime: Number256,
  feudalTime: Number256,
  yearoftime: Number256,
  goldtokenid: string,
  lordAddress: string,
  fealtyforgoldid: string,
  systemowner: string,
  proposer: string,
  offertaker: string,
  proposee: string,
  specificmarriagetemplateid: string,
  fealtyId: string,
  airdropbalance: Number256,
  warfund: Number256,
  wartime: Number256,
  chancellor: string,
  wartarget: string,
  vote: Number256,
  voteTime: Number256,
  anathemaId: string,
  owner: string,
  listingTemplateId: string,
  marketplaceId: string
}
const defaultSettings: Settings = {
  nftTemplateId: "53d10762aec2b7612c9df5e400e77578747a24ef2e316ffac39e1ff3c8595e00",
  specificmarriagetemplateid: "49b3f99d6635712d357aeaeb3595e93dc6174eda5570652adf9202cc287f9800",
  fealtyforgoldid: '4fe0566cc7cc0a3e7f26cb1a0011310cabf0f4453406af97e22bb30ac17f0400', 
  anathemaId: "390d30ac38b4cc1e1a9be2466aa9f3d1b7adcd81b68862f80f3b0a9d8374f300",

  listingTemplateId: "7bae06d74b8f763c91e3445d58a81c9086707f8a715441a424616eefaa46f200",
  marketplaceId: '1049eaa6d1660be75b8dd960d9d852ec0f2e06a5fc58a8d8df78534d39ac1600',

  fealtyId: "8805ae3a93cc73766aa8bbf1deb83814798924acb23be5e1e328dd904d247f00",

  goldtokenid: '0beffdfa642818060ca796ff770bb42d437c93f4f5c381ef89b226ec6ae5f500',  


  collectionId: "68858bfeec8b260a98cef84852cb102eee8f123008edcfbf503a603f63f86000",



  nftclass: 0n, 
  issueTokenAmount: 20_000_000_000_000n, 
  issueLotteryAmount: 16_500_000_000_000n,
  airdropbalance: 1_000_000_000_000n,
  warfund: 2_500_000_000_000n,
  yearoftime: 31_536_000_000n, 
  wartime: 0n,
  vote: 0n,
  voteTime: 0n,
  maxSupply: 563n, mintPrice: 2n, royaltyRate: 200n, totalSupply: 0n,

  owner: "18nnC2vtUCsKRPwGfr3DUidsGhUypjHtMCjprC9N8jseP",
  wartarget: "18nnC2vtUCsKRPwGfr3DUidsGhUypjHtMCjprC9N8jseP",
  potentialMarriage: "18nnC2vtUCsKRPwGfr3DUidsGhUypjHtMCjprC9N8jseP", 
  feudalLord: "18nnC2vtUCsKRPwGfr3DUidsGhUypjHtMCjprC9N8jseP",
  chancellor: "18nnC2vtUCsKRPwGfr3DUidsGhUypjHtMCjprC9N8jseP",
  collectionOwner: "18nnC2vtUCsKRPwGfr3DUidsGhUypjHtMCjprC9N8jseP",
  lordAddress: "18nnC2vtUCsKRPwGfr3DUidsGhUypjHtMCjprC9N8jseP",
  systemowner: "18nnC2vtUCsKRPwGfr3DUidsGhUypjHtMCjprC9N8jseP",
  proposer: "18nnC2vtUCsKRPwGfr3DUidsGhUypjHtMCjprC9N8jseP",
  offertaker: "18nnC2vtUCsKRPwGfr3DUidsGhUypjHtMCjprC9N8jseP",
  proposee: "18nnC2vtUCsKRPwGfr3DUidsGhUypjHtMCjprC9N8jseP",

  collectionUri: 'https://ib4gdds545n7nxdcaurwju2m7xykpccuzj74kc7uulj3uqc7zgha.arweave.net/QHhhjl3nW_bcYgUjZNNM_fCniFTKf8UL9KLTukBfyY4',
  nftBaseUri: "https://arweave.net/dbdvbcYroy6tjCodD4f4HHgPXmYJGLQdPqPHKNto3v0/",

  tokenUri: "https://arweave.net/-btcHeaNJIKSLEW-2gQc3bqHJIChPR2I6AXCVQ/", 
  nftIndex: 0n, marriageTime: 0n, feudalTime: 0n
}


const configuration: Configuration<Settings> = {
  networks: {
    devnet: {
      nodeUrl: 'http://localhost:22973',
      privateKeys: [
        'a642942e67258589cd2b1822c631506632db5a12aabcf413604e785300d762a5' // group 0
      ],
      settings: defaultSettings
    },

    testnet: {
      nodeUrl: (process.env.NODE_URL as string) ?? 'https://wallet-v20.testnet.alephium.org',
      privateKeys: process.env.PRIVATE_KEYS === undefined ? ['6b11fbf771e471786ed83087f9a85dc3a6e02e70426d1ea78ec79d64a32b6a80'] : process.env.PRIVATE_KEYS.split(','),
      settings: defaultSettings
    },

    mainnet: {
      nodeUrl: (process.env.NODE_URL as string) ?? 'https://wallet-v20.mainnet.alephium.org',
      privateKeys: process.env.PRIVATE_KEYS === undefined ? [''] : process.env.PRIVATE_KEYS.split(','),
      settings: defaultSettings
    }
  }
}

export default configuration
