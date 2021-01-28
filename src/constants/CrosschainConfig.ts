export type TokenConfig = {
  chainId?: string;
  address: string;
  decimals: number;
  name?: string;
  symbol?: string;
  imageUri?: string;
  resourceId: string;
  isNativeWrappedToken?: boolean;
  assetBase: string;
};

export type BridgeConfig = {
  chainId: number;
  networkId: number;
  name: string;
  bridgeAddress: string;
  erc20HandlerAddress: string;
  rpcUrl: string;
  type: 'Ethereum' | 'Substrate';
  tokens: TokenConfig[];
  nativeTokenSymbol: string;
  //This should be the full path to display a tx hash, without the trailing slash, ie. https://etherscan.io/tx
  blockExplorer?: string;
  defaultGasPrice?: number;
};

export type ChainbridgeConfig = {
  chains: BridgeConfig[];
};

export const crosschainConfig: ChainbridgeConfig = {
  chains: [
    {
      chainId: 1,
      networkId: 1,
      name: 'Ethereum',
      bridgeAddress: '0x278cDd6847ef830c23cac61C17Eab837fEa1C29A',
      erc20HandlerAddress: '0xB8B493600A5b200Ca2c58fFA9dced00694fB3E38',
      rpcUrl: 'https://mainnet.infura.io/v3/45174a29359d4b07ade01676259bc47a',
      type: 'Ethereum',
      blockExplorer: 'https://etherscan.io/tx',
      nativeTokenSymbol: 'ETH',
      tokens: [
        {
          address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          name: 'WETH',
          symbol: 'WETH',
          assetBase: 'ETH',
          decimals: 18,
          resourceId:
            '0x0000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200'
        },
        {
          address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          name: 'USDT',
          symbol: 'USDT',
          assetBase: 'USDT',
          decimals: 18,
          resourceId:
            '0x0000000000000000000000dAC17F958D2ee523a2206206994597C13D831ec700'
        }
      ]
    },
    {
      chainId: 2,
      networkId: 43114,
      name: 'Avalanche',
      bridgeAddress: '0x827CdA479f93CA75cAe0E6927de09e33285617Ac',
      erc20HandlerAddress: '0xebb531992d89A5d4bd6fd9D76fa2669336cec3d4',
      rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
      type: 'Ethereum',
      blockExplorer: 'https://blockscout.com/etc/kotti/tx',
      nativeTokenSymbol: 'AVAX',
      defaultGasPrice: 523,
      tokens: [
        {
          address: '0xf6F3EEa905ac1da6F6DD37d06810C6Fcb0EF5183',
          name: 'zETH',
          symbol: 'zETH',
          assetBase: 'ETH',
          decimals: 18,
          resourceId:
            '0x0000000000000000000000f6F3EEa905ac1da6F6DD37d06810C6Fcb0EF518301'
        },
        {
          address: '0xa14d2e53e7578cD69A6B97Bff054F56280A8d2C8',
          name: 'zUSDT',
          symbol: 'zUSDT',
          assetBase: 'USDT',
          decimals: 18,
          resourceId:
            '0x0000000000000000000000a14d2e53e7578cD69A6B97Bff054F56280A8d2C801'
        }
      ]
    }
  ]


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
