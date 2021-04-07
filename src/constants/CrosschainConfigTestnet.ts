// import { ChainId, Token } from '@zeroexchange/sdk';

export type TokenConfig = {
  chainId?: string
  address: string
  decimals: number
  name?: string
  symbol?: string
  imageUri?: string
  resourceId: string
  isNativeWrappedToken?: boolean
  assetBase: string
}

export type BridgeConfig = {
  chainId: number
  networkId: number
  name: string
  bridgeAddress: string
  erc20HandlerAddress: string
  rpcUrl: string
  gasLimit?: number
  type: 'Ethereum' | 'Substrate'
  tokens: TokenConfig[]
  nativeTokenSymbol: string
  //This should be the full path to display a tx hash, without the trailing slash, ie. https://etherscan.io/tx
  blockExplorer?: string
  defaultGasPrice?: number
}

export type ChainbridgeConfig = {
  chains: BridgeConfig[]
}

export const crosschainConfig: ChainbridgeConfig = {
  chains: [
    {
      chainId: 1,
      networkId: 4,
      name: 'Rinkeby',
      bridgeAddress: '0xC113367F7b35E695C8570d768E7F67b48b2E135D',
      erc20HandlerAddress: '0x083D9DacEb094e2b6C018AEbF58BB7c4D01E17db',
      rpcUrl: 'https://rinkeby.infura.io/v3/45174a29359d4b07ade01676259bc47a',
      type: 'Ethereum',
      blockExplorer: 'https://rinkeby.etherscan.io',
      nativeTokenSymbol: 'ETH',
      tokens: [
        {
          address: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
          name: 'WETH',
          symbol: 'WETH',
          assetBase: 'ETH',
          decimals: 18,
          resourceId: '0x0000000000000000000000c778417e063141139fce010982780140aa0cd5ab01'
        },
        {
          address: '0xc66227E44bf1E6F043919A65707b826e3E9f1132',
          name: 'USDT',
          symbol: 'USDT',
          assetBase: 'USDT',
          decimals: 6,
          resourceId: '0x0000000000000000000000c66227E44bf1E6F043919A65707b826e3E9f113201'
        },
        {
          address: '0xeb8f08a975Ab53E34D8a0330E0D34de942C95926',
          name: 'USDC',
          symbol: 'USDC',
          assetBase: 'USDC',
          decimals: 6,
          resourceId: '0x0000000000000000000000eb8f08a975ab53e34d8a0330e0d34de942c9592601'
        },
        {
          address: '0x9EfCe00Be4E0c2D9aEF18aACe4e273D9ebcf574a',
          name: 'ZERO',
          symbol: 'ZERO',
          assetBase: 'ZERO',
          decimals: 18,
          resourceId: '0x00000000000000000000009efce00be4e0c2d9aef18aace4e273d9ebcf574a01'
        }
      ]
    },
    {
      chainId: 2,
      networkId: 43113,
      name: 'Avalanche',
      bridgeAddress: '0xD73CFAACEfe4812d350d38f634fA61eC3aFdFEbA',
      erc20HandlerAddress: '0xff7c781E1ed2A67a790Be70536299c7DFE4D5f33',
      rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
      type: 'Ethereum',
      blockExplorer: 'https://cchain.explorer.avax-test.network',
      nativeTokenSymbol: 'AVAX',
      defaultGasPrice: 470,
      tokens: [
        {
          address: '0x3BaDD0399e9c1DFAd16dddb42D6759afE0e3e6f2',
          name: 'zETH',
          symbol: 'zETH',
          assetBase: 'zETH',
          decimals: 18,
          resourceId: '0x00000000000000000000003BaDD0399e9c1DFAd16dddb42D6759afE0e3e6f202'
        },
        {
          address: '0x63cF3afFD720F23c55cD652Ba2242EfE1bccFBfC',
          name: 'zUSDT',
          symbol: 'zUSDT',
          assetBase: 'USDT',
          decimals: 6,
          resourceId: '0x000000000000000000000063cF3afFD720F23c55cD652Ba2242EfE1bccFBfC02'
        },
        {
          address: '0xA14Af06dEc505ca794635f827a24B976a434d427',
          name: 'zUSDC',
          symbol: 'zUSDC',
          assetBase: 'USDC',
          decimals: 6,
          resourceId: '0x0000000000000000000000A14Af06dEc505ca794635f827a24B976a434d42702'
        },
        {
          address: '0x5C2E43c99318F60Acc6503f40d734B64dA7106cc',
          name: 'ZERO',
          symbol: 'ZERO',
          assetBase: 'ZERO',
          decimals: 18,
          resourceId: '0x00000000000000000000005C2E43c99318F60Acc6503f40d734B64dA7106cc02'
        }
      ]
    },
    {
      chainId: 3,
      networkId: 97,
      name: 'Smart Chain',
      bridgeAddress: '0xD73CFAACEfe4812d350d38f634fA61eC3aFdFEbA',
      erc20HandlerAddress: '0xff7c781E1ed2A67a790Be70536299c7DFE4D5f33',
      rpcUrl: 'https://data-seed-prebsc-1-s2.binance.org:8545',
      type: 'Ethereum',
      gasLimit: 6721975,
      defaultGasPrice: 12.5,
      blockExplorer: 'https://testnet.bscscan.com',
      nativeTokenSymbol: 'BNB',
      tokens: [
        {
          address: '0x7239C57c6E24C2d5cBdf6ca186d46ef33967539e',
          name: 'zETH',
          symbol: 'zETH',
          assetBase: 'zETH',
          decimals: 18,
          resourceId: '0x00000000000000000000007239C57c6E24C2d5cBdf6ca186d46ef33967539e03'
        },
        {
          address: '0xe874dCF01d498DDe836d1F6B7f1Fe125217e4eaf',
          name: 'zUSDT',
          symbol: 'zUSDT',
          assetBase: 'USDT',
          decimals: 6,
          resourceId: '0x0000000000000000000000e874dCF01d498DDe836d1F6B7f1Fe125217e4eaf03'
        },
        {
          address: '0xB366412128A00620B42825312564307Db2d5Cc45',
          name: 'zUSDC',
          symbol: 'zUSDC',
          assetBase: 'USDC',
          decimals: 6,
          resourceId: '0x0000000000000000000000B366412128A00620B42825312564307Db2d5Cc4503'
        },
        {
          address: '0x9BBba9D5be49c777A1c9cDF4ED7965A27CaBb7F2',
          name: 'ZERO',
          symbol: 'ZERO',
          assetBase: 'ZERO',
          decimals: 18,
          resourceId: '0x00000000000000000000009BBba9D5be49c777A1c9cDF4ED7965A27CaBb7F203'
        }
      ]
    }
  ]

  // rinkeby - FUJI
  // chains: [
  //   {
  //     chainId: 4,
  //     networkId: 4,
  //     name: "Rinkeby",
  //     bridgeAddress: "0x06E4d0FCd55eacb617dFCd0C5e75D8b005894bD2",
  //     erc20HandlerAddress: "0x754977d76601b473474Ba8FBac0Fa2A20Aa84694",
  //     rpcUrl: "https://rinkeby.infura.io/v3/45174a29359d4b07ade01676259bc47a",
  //     type: "Ethereum",
  //     blockExplorer: "https://ropsten.etherscan.io/tx",
  //     nativeTokenSymbol: "ETH",
  //     tokens: [
  //       {
  //         address: "0x6Cfe8eA9cb32dcf1Cd7188fA68366c099a8FfC7E",
  //         name: "wETH",
  //         symbol: "wETH",
  //         assetBase: 'ETH',
  //         decimals: 18,
  //         resourceId:
  //           "0x00000000000000000000006Cfe8eA9cb32dcf1Cd7188fA68366c099a8FfC7E00",
  //       },
  //       {
  //         address: "0x86d646e76806dcd652a5afa7aaa20d428b76a356",
  //         name: "USDT",
  //         symbol: "USDT",
  //         assetBase: 'USDT',
  //         decimals: 18,
  //         resourceId:
  //           "0x000000000000000000000086D646e76806DCD652a5aFA7AaA20D428B76A35600",
  //       },
  //       {
  //         address: "0xA49992e58b3242852DE6D6c8c5B01e3f16Ec1c0a",
  //         name: "wBTC",
  //         symbol: "wBTC",
  //         assetBase: 'wBTC',
  //         decimals: 18,
  //         resourceId:
  //           "0x0000000000000000000000A49992e58b3242852DE6D6c8c5B01e3f16Ec1c0a00",
  //       },
  //       {
  //         address: "0x790Bdb1d44EcE3e6b45F3D4307C08e4636365D24",
  //         name: "wUSDC",
  //         symbol: "wUSDC",
  //         assetBase: 'wUSDC',
  //         decimals: 18,
  //         resourceId:
  //           "0x0000000000000000000000790Bdb1d44EcE3e6b45F3D4307C08e4636365D2400",
  //       },
  //     ],
  //   },
  //   {
  //     chainId: 5,
  //     networkId: 43113,
  //     name: "Avalanche",
  //     bridgeAddress: "0xeef5d5C87cDD5F1c2ec89AC6c7B86EeB76299603",
  //     erc20HandlerAddress: "0x267d83dD863cbc4E7926CbF776E392a937C65533",
  //     rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
  //     type: "Ethereum",
  //     blockExplorer: "https://blockscout.com/etc/kotti/tx",
  //     nativeTokenSymbol: "AVAX",
  //     defaultGasPrice: 470,
  //     tokens: [
  //       {
  //         address: "0xbe113Dc920b8774c3f03195D6b3445F9B7884C2D",
  //         name: "zETH",
  //         symbol: "zETH",
  //         assetBase: 'ETH',
  //         decimals: 18,
  //         resourceId:
  //           "0x0000000000000000000000be113Dc920b8774c3f03195D6b3445F9B7884C2D01",
  //       },
  //       {
  //         address: "0x1569c1edc28F7141Cf5FdE18f27e5E4db6E85a34",
  //         name: "zUSDT",
  //         symbol: "zUSDT",
  //         assetBase: 'USDT',
  //         decimals: 18,
  //         resourceId:
  //           "0x00000000000000000000001569c1edc28F7141Cf5FdE18f27e5E4db6E85a3401",
  //       },
  //       {
  //         address: "0xBdc570Df37814c873C3a9bCF3751E52A36758d2f",
  //         name: "zBTC",
  //         symbol: "zBTC",
  //         assetBase: 'BTC',
  //         decimals: 18,
  //         resourceId:
  //           "0x0000000000000000000000Bdc570Df37814c873C3a9bCF3751E52A36758d2f01",
  //       },
  //       {
  //         address: "0x961b714a7d2c4B263fcB91b26a5CFd6268b874ec",
  //         name: "zUSDC",
  //         symbol: "zUSDC",
  //         assetBase: 'USDC',
  //         decimals: 18,
  //         resourceId:
  //           "0x0000000000000000000000961b714a7d2c4B263fcB91b26a5CFd6268b874ec01",
  //       },
  //     ],
  //   },
  // ],

  // DEVNET
  //   erc20ResourceId:
  //   "0x00000000000000000000000021605f71845f372A9ed84253d2D024B7B10999f4",
  // chains: [
  // {
  //   chainId: 1,
  //   networkId: 5,
  //   name: "Ethereum - A",
  //   bridgeAddress: "0x62877dDCd49aD22f5eDfc6ac108e9a4b5D2bD88B",
  //   erc20HandlerAddress: "0x3167776db165D8eA0f51790CA2bbf44Db5105ADF",
  //   rpcUrl: "http://localhost:8545",
  //   type: "Ethereum",
  //   tokens: [
  //     {
  //       address: "0x21605f71845f372A9ed84253d2D024B7B10999f4",
  //       name: "Test EthA",
  //       symbol: "TESTA",
  //       imageUri: ETHIcon,
  //     },
  //   ],
  // },
  // {
  //   chainId: 2,
  //   networkId: 6,
  //   name: "Ethereum - B",
  //   bridgeAddress: "0x62877dDCd49aD22f5eDfc6ac108e9a4b5D2bD88B",
  //   erc20HandlerAddress: "0x3167776db165D8eA0f51790CA2bbf44Db5105ADF",
  //   rpcUrl: "http://localhost:8546",
  //   type: "Ethereum",
  //   tokens: [
  //     {
  //       address: "0x21605f71845f372A9ed84253d2D024B7B10999f4",
  //       name: "Test EthB",
  //       symbol: "TESTB",
  //       imageUri: ETHIcon,
  //     },
  //   ],
  // },
  // ]
}
