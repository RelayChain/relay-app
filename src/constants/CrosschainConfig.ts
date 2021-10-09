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
  disableTransfer?: boolean;
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
  exchangeContractAddress?: string
  rateZeroToRelay?: number
  zeroContractAddress?: string
  relayContractAddress?: string
  marketPlace?: string
}

export type ChainbridgeConfig = {
  chains: BridgeConfig[]
}

export const crosschainConfig: ChainbridgeConfig = {
  chains: [
    {
      chainId: 1,
      networkId: 1,
      name: 'Ethereum',
      bridgeAddress: '0x820BCd8dBA1D4343e4c4Aa071CeA6450ee99a318',
      erc20HandlerAddress: '0xF687e1481d85F8b9F4D1f4D4C15348CeF8E5a762',
      rpcUrl: 'https://main-light.eth.linkpool.io/',
      type: 'Ethereum',
      blockExplorer: 'https://etherscan.io/tx',
      nativeTokenSymbol: 'ETH',
      exchangeContractAddress: '0x63ec665a5df5be71f74c77b144894b7befcfdaef',
      rateZeroToRelay: 0.01,
      zeroContractAddress: '0xF0939011a9bb95c3B791f0cb546377Ed2693a574',
      relayContractAddress: '0x5D843Fa9495d23dE997C394296ac7B4D721E841c',
      marketPlace: 'https://app.uniswap.org/',
      tokens: [
        {
          address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          name: 'WETH',
          symbol: 'WETH',
          assetBase: 'ETH',
          decimals: 18,
          resourceId: '0x0000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc201'
        },
        {
          address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
          name: "USDT",
          symbol: "USDT",
          assetBase: 'USDT',
          decimals: 6,
          resourceId: "0x0000000000000000000000dAC17F958D2ee523a2206206994597C13D831ec701",
        },
        {
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          name: 'USDC',
          symbol: 'USDC',
          assetBase: 'USDC',
          decimals: 6,
          resourceId: '0x0000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4801'
        },
        {
          address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
          name: 'wBTC',
          symbol: 'wBTC',
          assetBase: 'BTC',
          decimals: 8,
          resourceId: '0x00000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c59901'
        },
        {
          address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          name: 'DAI',
          symbol: 'DAI',
          assetBase: 'DAI',
          decimals: 18,
          resourceId: '0x00000000000000000000006b175474e89094c44da98b954eedeac495271d0f01'
        },
        {
          address: '0xF0939011a9bb95c3B791f0cb546377Ed2693a574',
          name: 'ZERO(ETH)',
          symbol: 'ZERO',
          assetBase: 'ZERO',
          decimals: 18,
          resourceId: '0x0000000000000000000000F0939011a9bb95c3B791f0cb546377Ed2693a57401'
        },
        {
          address: '0x743864B0562754F47f91CD400Ac8d4356a8fc720',
          name: 'eAVAX',
          symbol: 'eAVAX',
          assetBase: 'C-AVAX', // TODO: why C-AVAX
          decimals: 18,
          resourceId: '0x0000000000000000000000B31f66AA3C1e785363F0875A1B74E27b85FD66c702'
        },
        // {
        //   address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
        //   name: 'LINK',
        //   symbol: 'LINK',
        //   assetBase: 'LINK',
        //   decimals: 18,
        //   resourceId: '0x0000000000000000000000514910771af9ca656af840dff83e8264ecf986ca01'
        // },
        // {
        //   address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
        //   name: 'AAVE',
        //   symbol: 'AAVE',
        //   assetBase: 'AAVE',
        //   decimals: 18,
        //   resourceId: '0x00000000000000000000007Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE901'
        // },
        // {
        //   address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        //   name: 'UNI',
        //   symbol: 'UNI',
        //   assetBase: 'UNI',
        //   decimals: 18,
        //   resourceId: '0x00000000000000000000001f9840a85d5aF5bf1D1762F925BDADdC4201F98401'
        // },
        {
          address: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
          name: 'SUSHI',
          symbol: 'SUSHI',
          assetBase: 'SUSHI',
          decimals: 18,
          resourceId: '0x00000000000000000000006B3595068778DD592e39A122f4f5a5cF09C90fE201'
        },
        // {
        //   address: '0x111111111117dC0aa78b770fA6A738034120C302',
        //   name: '1INCH',
        //   symbol: '1INCH',
        //   assetBase: '1INCH',
        //   decimals: 18,
        //   resourceId: '0x0000000000000000000000111111111117dc0aa78b770fa6a738034120c30201'
        // },
        // {
        //   address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
        //   name: 'YFI',
        //   symbol: 'YFI',
        //   assetBase: 'YFI',
        //   decimals: 18,
        //   resourceId: '0x00000000000000000000000bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e01'
        // },
        // {
        //   address: '0x823cE9cca0b9eE2BC4C2d764d304691d770DbBe9',
        //   name: 'Gondola',
        //   symbol: 'GDL',
        //   assetBase: 'GDL',
        //   decimals: 18,
        //   resourceId: '0x0000000000000000000000823cE9cca0b9eE2BC4C2d764d304691d770DbBe901'
        // },
        // {
        //   address: '0x433d86336dB759855A66cCAbe4338313a8A7fc77',
        //   name: 'INDA',
        //   symbol: 'INDA',
        //   assetBase: 'INDA',
        //   decimals: 2,
        //   resourceId: '0x0000000000000000000000433d86336dB759855A66cCAbe4338313a8A7fc7701'
        // },
        // {
        //   address: '0x0c572544a4Ee47904d54aaA6A970AF96B6f00E1b',
        //   name: 'Wasder Token',
        //   symbol: 'WAS',
        //   assetBase: 'WAS',
        //   decimals: 18,
        //   resourceId: '0x00000000000000000000000c572544a4Ee47904d54aaA6A970AF96B6f00E1b01'
        // },
        {
          address: '0x1d37986F252d0e349522EA6C3B98Cb935495E63E',
          name: 'ChartEx',
          symbol: 'CHART',
          assetBase: 'CHART',
          decimals: 18,
          resourceId: '0x00000000000000000000001d37986F252d0e349522EA6C3B98Cb935495E63E01'
        },
        {
          address: '0xF268fE3d6909508ddA90DccF2bf69050D19f4CdD',
          name: 'Grow Token',
          symbol: 'GROW',
          assetBase: 'GROW',
          decimals: 18,
          resourceId: '0x0000000000000000000000081A4D4e4A0cC74D6a7A61578f86b8C93CC950a003'
        },
        // {
        //   address: '0x0c572544a4Ee47904d54aaA6A970AF96B6f00E1b',
        //   name: 'Wasder Token',
        //   symbol: 'WAS',
        //   assetBase: 'WAS',
        //   decimals: 18,
        //   resourceId: '0x00000000000000000000000c572544a4Ee47904d54aaA6A970AF96B6f00E1b01'
        // },
        {
          address: '0x5D843Fa9495d23dE997C394296ac7B4D721E841c',
          name: 'Relay Token',
          symbol: 'RELAY',
          assetBase: 'RELAY',
          decimals: 18,
          resourceId: '0x00000000000000000000005D843Fa9495d23dE997C394296ac7B4D721E841c01'
        },
        {
          address: '0x265Bd427974812123fC1489Cb8B3192AD10791e6',
          name: 'Binance token',
          symbol: 'BNB',
          assetBase: 'BNB',
          decimals: 18,
          resourceId: '0x0000000000000000000000bb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c03'
        },
        {
          address: '0x700e5679684398B9b6FB545cf520C647C0a0066E',
          name: 'Huobi token',
          symbol: 'HT',
          assetBase: 'HT',
          decimals: 18,
          resourceId: '0x00000000000000000000005545153CCFcA01fbd7Dd11C0b23ba694D9509A6F04'
        },
        {
          address: '0x6Ac493F0A7b0eC7946fe026d67B492bb64710807',
          name: 'MAI',
          symbol: 'MAI (miMatic)',
          assetBase: 'MAI (miMatic)',
          decimals: 18,
          resourceId: '0x0000000000000000000000a3fa99a148fa48d14ed51d610c367c61876997f105'
        },
        {
          address: '0xd4a8D3A592C109D17ECcE6f974d80249F9630c17',
          name: 'Canary',
          symbol: 'CNR',
          assetBase: 'CNR',
          decimals: 18,
          resourceId: '0x00000000000000000000008D88e48465F30Acfb8daC0b3E35c9D6D7d36abaf02'
        },
        {
          address: '0x6FDE45b643D2F21472Ef42e81146B492b9E68b08',
          name: 'MOVR',
          symbol: 'MOVR',
          assetBase: 'MOVR',
          decimals: 18,
          resourceId: '0x000000000000000000000098878B06940aE243284CA214f92Bb71a2b032B8A06'
        },
      ]
    },
    {
      chainId: 2,
      networkId: 43114,
      name: 'Avalanche',
      bridgeAddress: '0xc81A7Ec0c677Ca8a773750A20BF617bc41e09565',
      erc20HandlerAddress: '0x43BEddB3199F2a635C85FfC4f1af228198D268Ab',
      rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
      type: 'Ethereum',
      blockExplorer: 'https://blockscout.com/etc/kotti/tx',
      nativeTokenSymbol: 'AVAX',
      defaultGasPrice: 225,
      exchangeContractAddress: '0x3f9F80f64a921Db7956Fc285f96b97FfB9B9b1b1',
      rateZeroToRelay: 0.01,
      zeroContractAddress: '0x008E26068B3EB40B443d3Ea88c1fF99B789c10F7',
      relayContractAddress: '0x78c42324016cd91D1827924711563fb66E33A83A',
      marketPlace: 'https://www.traderjoexyz.com/',
      tokens: [
        {
          address: '0xf6F3EEa905ac1da6F6DD37d06810C6Fcb0EF5183',
          name: 'zETH',
          symbol: 'zETH',
          assetBase: 'ETH',
          decimals: 18,
          resourceId: '0x0000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc201'
        },
        {
          address: "0x650CECaFE61f3f65Edd21eFacCa18Cc905EeF0B7",
          name: "zUSDT",
          symbol: "zUSDT",
          assetBase: 'USDT',
          decimals: 6,
          resourceId: "0x0000000000000000000000dAC17F958D2ee523a2206206994597C13D831ec701",
        },
        {
          address: '0x474Bb79C3e8E65DcC6dF30F9dE68592ed48BBFDb',
          name: 'zUSDC',
          symbol: 'zUSDC',
          assetBase: 'USDC',
          decimals: 6,
          resourceId: '0x0000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4801'
        },
        {
          address: '0xc4f4Ff34A2e2cF5e4c892476BB2D056871125452',
          name: 'zBTC',
          symbol: 'zBTC',
          assetBase: 'BTC',
          decimals: 8,
          resourceId: '0x00000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c59901'
        },
        {
          address: '0x12f108E6138d4A9c58511e042399cF8f90D5673f',
          name: 'zDAI',
          symbol: 'zDAI',
          assetBase: 'DAI',
          decimals: 18,
          resourceId: '0x00000000000000000000006b175474e89094c44da98b954eedeac495271d0f01'
        },
        {
          address: '0x008E26068B3EB40B443d3Ea88c1fF99B789c10F7',
          name: 'ZERO',
          symbol: 'ZERO',
          assetBase: 'ZERO',
          decimals: 18,
          resourceId: '0x0000000000000000000000F0939011a9bb95c3B791f0cb546377Ed2693a57401'
        },
        {
          address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
          name: 'WAVAX',
          symbol: 'WAVAX',
          assetBase: 'C-AVAX', // TODO: why C-AVAX?
          decimals: 18,
          resourceId: '0x0000000000000000000000B31f66AA3C1e785363F0875A1B74E27b85FD66c702'
        },
        // {
        //   address: '0xc770701264aD059DD5700Ff68e85ea7A2CaaeF0B',
        //   name: 'zLINK',
        //   symbol: 'zLINK',
        //   assetBase: 'LINK',
        //   decimals: 18,
        //   resourceId: '0x0000000000000000000000514910771af9ca656af840dff83e8264ecf986ca01'
        // },
        // {
        //   address: '0xbf5a94cFe186FC22aFd6637243b9822586960825',
        //   name: 'zAAVE',
        //   symbol: 'zAAVE',
        //   assetBase: 'AAVE',
        //   decimals: 18,
        //   resourceId: '0x00000000000000000000007Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE901'
        // },
        {
          address: '0xBa9aF11661520129Af69d233E92d69BD40CD90AF',
          name: 'zUNI',
          symbol: 'zUNI',
          assetBase: 'UNI',
          decimals: 18,
          resourceId: '0x00000000000000000000001f9840a85d5aF5bf1D1762F925BDADdC4201F98401'
        },
        {
          address: '0xD4feE2e3F88B9138B74a323B40bC63bcc1A1B9eC',
          name: 'zSUSHI',
          symbol: 'zSUSHI',
          assetBase: 'SUSHI',
          decimals: 18,
          resourceId: '0x00000000000000000000006B3595068778DD592e39A122f4f5a5cF09C90fE201'
        },
        {
          address: '0x5a0dDfA245c02d1256AfDcDa38aDFE89F34367Ce',
          name: 'z1INCH',
          symbol: 'z1INCH',
          assetBase: '1INCH',
          decimals: 18,
          resourceId: '0x0000000000000000000000111111111117dc0aa78b770fa6a738034120c30201'
        },
        // {
        //   address: '0xD94f76f8DD5c3832dd798621c0d673bBae9D946b',
        //   name: 'zYFI',
        //   symbol: 'zYFI',
        //   assetBase: 'YFI',
        //   decimals: 18,
        //   resourceId: '0x00000000000000000000000bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e01'
        // },
        // {
        //   address: '0xd606199557c8ab6f4cc70bd03facc96ca576f142',
        //   name: 'Gondola',
        //   symbol: 'GDL',
        //   assetBase: 'GDL',
        //   decimals: 18,
        //   resourceId: '0x0000000000000000000000D606199557c8Ab6F4Cc70bD03FaCc96ca576f14202'
        // },
        // {
        //   address: '0x791FD27ef5ea8deE4746A1b2A1b95b6247f67b7D',
        //   name: 'INDA',
        //   symbol: 'INDA',
        //   assetBase: 'INDA',
        //   decimals: 2,
        //   resourceId: '0x0000000000000000000000433d86336dB759855A66cCAbe4338313a8A7fc7701'
        // },
        {
          address: '0xD769bDFc0CaEe933dc0a047C7dBad2Ec42CFb3E2',
          name: 'ChartEx',
          symbol: 'CHART',
          assetBase: 'CHART',
          decimals: 18,
          resourceId: '0x00000000000000000000001d37986F252d0e349522EA6C3B98Cb935495E63E01'
        },
        {
          address: '0x5506bD8C8F5D6733E2738496d5C51Ed62934C9f8',
          name: 'Grow Token',
          symbol: 'GROW',
          assetBase: 'GROW',
          decimals: 18,
          resourceId: '0x0000000000000000000000081A4D4e4A0cC74D6a7A61578f86b8C93CC950a003'
        },
        // {
        //   address: '0xDE03bB9EFf0804516Be4Bdac5761b7526798aF0F',
        //   name: 'Wasder Token',
        //   symbol: 'WAS',
        //   assetBase: 'WAS',
        //   decimals: 18,
        //   resourceId: '0x00000000000000000000000c572544a4Ee47904d54aaA6A970AF96B6f00E1b01'
        // },
        {
          address: '0x78c42324016cd91D1827924711563fb66E33A83A',
          name: 'Relay Token',
          symbol: 'RELAY',
          assetBase: 'RELAY',
          decimals: 18,
          resourceId: '0x00000000000000000000005D843Fa9495d23dE997C394296ac7B4D721E841c01'
        },
        {
          address: '0x217F94a628A23273b97770C20A5e134D40B87b5F',
          name: 'Binance token',
          symbol: 'BNB',
          assetBase: 'BNB',
          decimals: 18,
          resourceId: '0x0000000000000000000000bb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c03'
        },
        {
          address: '0xCDEB5641dC5BF05845317B00643A713CCC3b22e6',
          name: 'Huobi token',
          symbol: 'HT',
          assetBase: 'HT',
          decimals: 18,
          resourceId: '0x00000000000000000000005545153CCFcA01fbd7Dd11C0b23ba694D9509A6F04'
        },
        {
          address: '0x3B55E45fD6bd7d4724F5c47E0d1bCaEdd059263e',
          name: 'MAI',
          symbol: 'MAI (miMatic)',
          assetBase: 'MAI (miMatic)',
          decimals: 18,
          resourceId: '0x0000000000000000000000a3fa99a148fa48d14ed51d610c367c61876997f105'
        },
        {
          address: '0x8D88e48465F30Acfb8daC0b3E35c9D6D7d36abaf',
          name: 'Canary',
          symbol: 'CNR',
          assetBase: 'CNR',
          decimals: 18,
          resourceId: '0x00000000000000000000008D88e48465F30Acfb8daC0b3E35c9D6D7d36abaf02'
        },
        {
          address: '0xF873633DF9D5cDd62BB1f402499CC470a72A02D7',
          name: 'MOVR',
          symbol: 'MOVR',
          assetBase: 'MOVR',
          decimals: 18,
          resourceId: '0x000000000000000000000098878B06940aE243284CA214f92Bb71a2b032B8A06'
        },
        {
          address: '0xA56B1b9f4e5A1A1e0868F5Fd4352ce7CdF0C2A4F',
          name: 'MATIC',
          symbol: 'MATIC',
          assetBase: 'MATIC',
          decimals: 18,
          resourceId: '0x00000000000000000000000d500B1d8E8eF31E21C99d1Db9A6444d3ADf127005'
        },
        {
          address: '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
          name: 'USD Coin',
          symbol: 'USDC.e',
          assetBase: 'USDC.e',
          decimals: 6,
          resourceId: '0x0000000000000000000000A7D7079b0FEaD91F3e65f86E8915Cb59c1a4C66402'
        },
        {
          address: '0xc7198437980c041c805A1EDcbA50c1Ce5db95118',
          name: 'Tether USD',
          symbol: 'USDT.e',
          assetBase: 'USDT.e',
          decimals: 6,
          resourceId: '0x0000000000000000000000c7198437980c041c805A1EDcbA50c1Ce5db9511802'
        },
        {
          address: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
          name: 'Dai Stablecoin',
          symbol: 'DAI.e',
          assetBase: 'DAI.e',
          decimals: 18,
          resourceId: '0x0000000000000000000000d586E7F844cEa2F87f50152665BCbc2C279D8d7002'
        },
        {
          address: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
          name: 'Wrapped Ether',
          symbol: 'WETH.e',
          assetBase: 'WETH.e',
          decimals: 18,
          resourceId: '0x000000000000000000000049D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB02'
        },
      ]
    },
    {
      chainId: 3,
      networkId: 56,
      name: 'Smart Chain',
      bridgeAddress: '0xAC6953D66e06eea69d0F7435C679ae0d0c02B282',
      erc20HandlerAddress: '0x3Ea1f65cf49297eA6d265291a2b09D0f2AE649D6',
      rpcUrl: 'https://bsc-dataseed2.binance.org',
      type: 'Ethereum',
      gasLimit: 6721975,
      defaultGasPrice: 12.5,
      blockExplorer: 'https://bscscan.com/',
      nativeTokenSymbol: 'BNB',
      exchangeContractAddress: '0xFCB89d87FF5c07B44B774806063318c1D411571d',
      rateZeroToRelay: 0.01,
      zeroContractAddress: '0x1f534d2B1ee2933f1fdF8e4b63A44b2249d77EAf',
      relayContractAddress: '0xE338D4250A4d959F88Ff8789EaaE8c32700BD175',
      marketPlace: 'https://pancakeswap.finance/',
      tokens: [
        {
          address: '0xBF7e0761417F49b3FAFae564C842823f5f79DB15',
          name: 'zUSDT',
          symbol: 'zUSDT',
          assetBase: 'USDT',
          decimals: 6,
          resourceId: '0x0000000000000000000000dAC17F958D2ee523a2206206994597C13D831ec701'
        },
        {
          address: '0x4022AfEB287052e6e587d39bA99f79cAFC47B570',
          name: 'zUSDC',
          symbol: 'zUSDC',
          assetBase: 'USDC',
          decimals: 6,
          resourceId: '0x0000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4801'
        },
        {
          address: '0x7c815BBc21FED2B97CA163552991A5C30d6a2336',
          name: 'zETH',
          symbol: 'zETH',
          assetBase: 'ETH',
          decimals: 18,
          resourceId: '0x0000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc201',
        },
        {
          address: '0xB6D5487b00e53e7009E6560189EB8B8c22e11Bf3',
          name: 'zBTC',
          symbol: 'zBTC',
          assetBase: 'BTC',
          decimals: 8,
          resourceId: '0x00000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c59901',
        },
        {
          address: '0x7e7bAFF135c42ed90C0EdAb16eAe48ecEa417018',
          name: 'zDAI',
          symbol: 'zDAI',
          assetBase: 'DAI',
          decimals: 18,
          resourceId: '0x00000000000000000000006b175474e89094c44da98b954eedeac495271d0f01',
        },
        {
          address: '0x1f534d2B1ee2933f1fdF8e4b63A44b2249d77EAf',
          name: 'ZERO(BSC)',
          symbol: 'ZERO',
          assetBase: 'ZERO',
          decimals: 18,
          resourceId: '0x0000000000000000000000F0939011a9bb95c3B791f0cb546377Ed2693a57401',
        },
        {
          address: '0xaC532d2FC81a077C9F93Be7ea698E2f1d224Ec04',
          name: 'zAVAX',
          symbol: 'zAVAX',
          assetBase: 'AVAX',
          decimals: 18,
          resourceId: '0x0000000000000000000000B31f66AA3C1e785363F0875A1B74E27b85FD66c702',
        },
        // {
        //   address: '0xE1D075E79d17fBE745f575634Fb055c62c39CaF4',
        //   name: 'zLINK',
        //   symbol: 'zLINK',
        //   assetBase: 'LINK',
        //   decimals: 18,
        //   resourceId: '0x0000000000000000000000514910771af9ca656af840dff83e8264ecf986ca01',
        // },
        // {
        //   address: '0xc69CF0e0d00adbF1ab447340C31E39fcf9Ef6cb5',
        //   name: 'zAAVE',
        //   symbol: 'zAAVE',
        //   assetBase: 'AAVE',
        //   decimals: 18,
        //   resourceId: '0x00000000000000000000007Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE901',
        // },
        {
          address: '0xA6b4a72a6f8116dab486fB88192450CF3ed4150C',
          name: 'zUNI',
          symbol: 'zUNI',
          assetBase: 'UNI',
          decimals: 18,
          resourceId: '0x00000000000000000000001f9840a85d5aF5bf1D1762F925BDADdC4201F98401',
        },
        {
          address: '0x2D6d5bc58adEDa28f62B0aBc3f53F5EAef497FCc',
          name: 'zSUSHI',
          symbol: 'zSUSHI',
          assetBase: 'SUSHI',
          decimals: 18,
          resourceId: '0x00000000000000000000006B3595068778DD592e39A122f4f5a5cF09C90fE201',
        },
        {
          address: '0xD83FEaB895bDebF9D3E1BE50b7d4d81cf4a0211c',
          name: 'z1INCH',
          symbol: 'z1INCH',
          assetBase: '1INCH',
          decimals: 18,
          resourceId: '0x0000000000000000000000111111111117dc0aa78b770fa6a738034120c30201',
        },
        // {
        //   address: '0xaaa777E372788F498462B7ed0fAaad7BA264586D',
        //   name: 'zYFI',
        //   symbol: 'zYFI',
        //   assetBase: 'YFI',
        //   decimals: 18,
        //   resourceId: '0x00000000000000000000000bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e01',
        // },
        // {
        //   address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
        //   name: 'BUSD',
        //   symbol: 'BUSD',
        //   assetBase: 'BUSD',
        //   decimals: 18,
        //   resourceId: '0x0000000000000000000000aaa777E372788F498462B7ed0fAaad7BA264586D03'
        // },
        // {
        //   address: '0xd705223747C7AF3386a70abbE586d390A6877687',
        //   name: 'Gondola (GDL)',
        //   symbol: 'GDL',
        //   assetBase: 'GDL',
        //   decimals: 18,
        //   resourceId: '0x0000000000000000000000d705223747C7AF3386a70abbE586d390A687768703'
        // },
        // {
        //   address: '0xC878A79B63A41a831E469AE1A830A765eFd9d468',
        //   name: 'INDA',
        //   symbol: 'INDA',
        //   assetBase: 'INDA',
        //   decimals: 2,
        //   resourceId: '0x0000000000000000000000433d86336dB759855A66cCAbe4338313a8A7fc7701'
        // },
        {
          address: '0xc33A42C9D19f944FA12ff46f27B3B85e18a13778',
          name: 'ChartEx',
          symbol: 'CHART',
          assetBase: 'CHART',
          decimals: 18,
          resourceId: '0x00000000000000000000001d37986F252d0e349522EA6C3B98Cb935495E63E01'
        },
        {
          address: '0x4f491d389A5bF7C56bd1e4d8aF2280fD217C8543',
          name: 'Wise Token',
          symbol: 'WISB',
          assetBase: 'WISB',
          decimals: 18,
          // resourceId: '0x00000000000000000000004f491d389A5bF7C56bd1e4d8aF2280fD217C854303'
          resourceId: "",
          disableTransfer: true,
        },
        {
          address: '0x081A4D4e4A0cC74D6a7A61578f86b8C93CC950a0',
          name: 'Grow Token',
          symbol: 'GROW',
          assetBase: 'GROW',
          decimals: 18,
          resourceId: '0x0000000000000000000000081A4D4e4A0cC74D6a7A61578f86b8C93CC950a003'
        },
        // {
        //   address: '0x0f236c7EDda9c1e87036dD258bd9D1bcC37EA66C',
        //   name: 'Wasder Token',
        //   symbol: 'WAS',
        //   assetBase: 'WAS',
        //   decimals: 18,
        //   resourceId: '0x00000000000000000000000c572544a4Ee47904d54aaA6A970AF96B6f00E1b01'
        // },
        // {
        //   address: '0xb9D8592E16A9c1a3AE6021CDDb324EaC1Cbc70d6',
        //   name: 'PERA',
        //   symbol: 'PERA',
        //   assetBase: 'PERA',
        //   decimals: 18,
        //   resourceId: '0x0000000000000000000000b9D8592E16A9c1a3AE6021CDDb324EaC1Cbc70d603'
        // },
        {
          address: '0xE338D4250A4d959F88Ff8789EaaE8c32700BD175',
          name: 'Relay Token',
          symbol: 'RELAY',
          assetBase: 'RELAY',
          decimals: 18,
          resourceId: '0x00000000000000000000005D843Fa9495d23dE997C394296ac7B4D721E841c01'
        },
        {
          address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
          name: 'Binance token',
          symbol: 'BNB',
          assetBase: 'BNB',
          decimals: 18,
          resourceId: '0x0000000000000000000000bb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c03'
        },
        {
          address: '0xd4a8D3A592C109D17ECcE6f974d80249F9630c17',
          name: 'Huobi token',
          symbol: 'HT',
          assetBase: 'HT',
          decimals: 18,
          resourceId: '0x00000000000000000000005545153CCFcA01fbd7Dd11C0b23ba694D9509A6F04'
        },
        {
          address: '0xAff99EaaEdd9429ff46B18b554837bba353d7858',
          name: 'MAI',
          symbol: 'MAI (miMatic)',
          assetBase: 'MAI (miMatic)',
          decimals: 18,
          resourceId: '0x0000000000000000000000a3fa99a148fa48d14ed51d610c367c61876997f105'
        },
        {
          address: '0x7Ea7D47f638C100481D1347BacF1CdF1F4054454',
          name: 'Canary',
          symbol: 'CNR',
          assetBase: 'CNR',
          decimals: 18,
          resourceId: '0x00000000000000000000008D88e48465F30Acfb8daC0b3E35c9D6D7d36abaf02'
        },
        {
          address: '0x0083828F14884667F9Da2E24D583874D1D7EDA72',
          name: 'MOVR',
          symbol: 'MOVR',
          assetBase: 'MOVR',
          decimals: 18,
          resourceId: '0x000000000000000000000098878B06940aE243284CA214f92Bb71a2b032B8A06'
        },
      ]
    },
    {
      chainId: 4,
      networkId: 128,
      name: 'HECO',
      bridgeAddress: "0xd323AFA844299f69A5aa5AE0961b5a7BDbE6D3f5",
      erc20HandlerAddress: '0xA21D529B86ef6B71C0caaE4669726755876a0Dc0',
      rpcUrl: 'https://http-mainnet-node.huobichain.com',
      type: 'Ethereum',
      gasLimit: 60000,
      defaultGasPrice: 10,
      blockExplorer: 'https://hecoinfo.com/',
      nativeTokenSymbol: 'HT',
      marketPlace: 'https://ht.mdex.com/#/swap?lang=en',
      tokens: [
        {
          address: '0xaC021dF3FF6939CFdCA4ce5a3D1b6048CA5aaBF4',
          name: 'zUSDC',
          symbol: 'zUSDC',
          assetBase: 'USDC',
          decimals: 6,
          resourceId: '0x0000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4801'
        },
        {
          address: '0x9A9D4653820D079218007d8Ec0a4AEe1e1E1D394',
          name: 'zETH',
          symbol: 'zETH',
          assetBase: 'ETH',
          decimals: 18,
          resourceId: '0x0000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc201'
        },
        {
          address: '0x683844fE2ec704f80bD032D0d94089315Ec58D5b',
          name: 'zBTC',
          symbol: 'zBTC',
          assetBase: 'BTC',
          decimals: 8,
          resourceId: '0x00000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c59901'
        },
        {
          address: '0x8aeb905Eed42Dce79e6e2357AAA0d51FA128800a',
          name: 'zDAI',
          symbol: 'zDAI',
          assetBase: 'DAI',
          decimals: 18,
          resourceId: '0x00000000000000000000006b175474e89094c44da98b954eedeac495271d0f01'
        },
        {
          address: '0x0E4564692B15Af6526b6910CFd9E1F4B6671CA1A',
          name: 'ZERO',
          symbol: 'ZERO',
          assetBase: 'ZERO',
          decimals: 18,
          resourceId: '0x0000000000000000000000F0939011a9bb95c3B791f0cb546377Ed2693a57401'
        },
        {
          address: '0x96b59499D6067B94ee2D1C558A31fA8dC4E3640d',
          name: 'zAVAX',
          symbol: 'zAVAX',
          assetBase: 'AVAX',
          decimals: 18,
          resourceId: '0x0000000000000000000000B31f66AA3C1e785363F0875A1B74E27b85FD66c702'
        },
        // {
        //   address: '0x72157E63Bd6F546901C6121CA478061F8756271a',
        //   name: 'zLINK',
        //   symbol: 'zLINK',
        //   assetBase: 'LINK',
        //   decimals: 18,
        //   resourceId: '0x0000000000000000000000514910771af9ca656af840dff83e8264ecf986ca01'
        // },
        // {
        //   address: '0xA0F347628657051e28eafCb2713Beb85c44D931F',
        //   name: 'zAAVE',
        //   symbol: 'zAAVE',
        //   assetBase: 'AAVE',
        //   decimals: 18,
        //   resourceId: '0x00000000000000000000007Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE901'
        // },
        {
          address: '0x75286d76389613960d3466399DB15201e037116f',
          name: 'zUNI',
          symbol: 'zUNI',
          assetBase: 'zUNI',
          decimals: 18,
          resourceId: '0x00000000000000000000001f9840a85d5aF5bf1D1762F925BDADdC4201F98401'
        },
        {
          address: '0x98659e9A7ddc51eE3A2FB386d20B481c77E8C8bf',
          name: 'zSUSHI',
          symbol: 'zSUSHI',
          assetBase: 'SUSHI',
          decimals: 18,
          resourceId: '0x00000000000000000000006B3595068778DD592e39A122f4f5a5cF09C90fE201'
        },
        {
          address: '0x5a32a14EF0c756dc016c0EcaA68f65258504B851',
          name: 'z1INCH',
          symbol: 'z1INCH',
          assetBase: '1INCH',
          decimals: 18,
          resourceId: '0x0000000000000000000000111111111117dc0aa78b770fa6a738034120c30201'
        },
        // {
        //   address: '0xD4Cc96d31f4a272B34804B121b871a0432b38911',
        //   name: 'zYFI',
        //   symbol: 'zYFI',
        //   assetBase: 'YFI',
        //   decimals: 18,
        //   resourceId: '0x00000000000000000000000bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e01'
        // },
        {
          address: '0x3D1f2C168F4b6028f422e43755a60F0384b63568',
          name: 'zUSDT',
          symbol: 'zUSDT',
          assetBase: 'USDT',
          decimals: 18,
          resourceId: '0x0000000000000000000000dAC17F958D2ee523a2206206994597C13D831ec701'
        },
        // {
        //   address: '0x4E76805F76c13BfaA1D6558596A12086e4bE3E2C',
        //   name: 'INDA',
        //   symbol: 'INDA',
        //   assetBase: 'INDA',
        //   decimals: 2,
        //   resourceId: '0x0000000000000000000000433d86336dB759855A66cCAbe4338313a8A7fc7701'
        // },
        {
          address: '0x8C2f0dBa074f120Eef8530da5F8a825796c505a4',
          name: 'ChartEx',
          symbol: 'ChartEx',
          assetBase: 'Chart',
          decimals: 18,
          resourceId: '0x00000000000000000000001d37986F252d0e349522EA6C3B98Cb935495E63E01'
        },
        {
          address: '0x87F86C5870e96a55A29e37f0c11C7620edb7B203',
          name: 'GROW',
          symbol: 'GROW',
          assetBase: 'GROW',
          decimals: 18,
          resourceId: '0x0000000000000000000000081A4D4e4A0cC74D6a7A61578f86b8C93CC950a003'
        },
        // {
        //   address: '0xc9EFDAC4fE5828361b0aE69d1C16670CDa712BDc',
        //   name: 'WAS',
        //   symbol: 'WAS',
        //   assetBase: 'WAS',
        //   decimals: 18,
        //   resourceId: '0x00000000000000000000000c572544a4Ee47904d54aaA6A970AF96B6f00E1b01'
        // },
        {
          address: '0xf1361d97a1b134eBF96A9aA482BC005D4F41177e',
          name: 'Relay Token',
          symbol: 'RELAY',
          assetBase: 'RELAY',
          decimals: 18,
          resourceId: '0x00000000000000000000005D843Fa9495d23dE997C394296ac7B4D721E841c01'
        },
        {
          address: '0x62351EC62b06e4122eDf19b84655D5846CB343bE',
          name: 'Binance token',
          symbol: 'BNB',
          assetBase: 'BNB',
          decimals: 18,
          resourceId: '0x0000000000000000000000bb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c03'
        },
        {
          address: '0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F',
          name: 'Huobi token',
          symbol: 'WHT',
          assetBase: 'HT',
          decimals: 18,
          resourceId: '0x00000000000000000000005545153CCFcA01fbd7Dd11C0b23ba694D9509A6F04'
        },
        {
          address: '0xe73A1e986978Ec0Be829C04a110447644E08Ab71',
          name: 'MAI',
          symbol: 'MAI (miMatic)',
          assetBase: 'MAI (miMatic)',
          decimals: 18,
          resourceId: '0x0000000000000000000000a3fa99a148fa48d14ed51d610c367c61876997f105'
        },
        {
          address: '0x9583b56B806AD0BafD554f2DE9C6f0246BC464A9',
          name: 'Canary',
          symbol: 'CNR',
          assetBase: 'CNR',
          decimals: 18,
          resourceId: '0x00000000000000000000008D88e48465F30Acfb8daC0b3E35c9D6D7d36abaf02'
        },
        {
          address: '0x1F62cb751f2fBac367011bC9F5f6Db310dc0A5e5',
          name: 'MOVR',
          symbol: 'MOVR',
          assetBase: 'MOVR',
          decimals: 18,
          resourceId: '0x000000000000000000000098878B06940aE243284CA214f92Bb71a2b032B8A06'
        },
      ]
    },
    {
      chainId: 5,
      networkId: 137,
      name: 'Polygon',
      bridgeAddress: "0xAC6953D66e06eea69d0F7435C679ae0d0c02B282",
      erc20HandlerAddress: '0x3Ea1f65cf49297eA6d265291a2b09D0f2AE649D6',
      rpcUrl: 'https://rpc-mainnet.matic.network',
      type: 'Ethereum',
      gasLimit: 60000,
      defaultGasPrice: 2,
      blockExplorer: 'https://polygonscan.com/',
      nativeTokenSymbol: 'MATIC',
      exchangeContractAddress: '0xb0dcE4EE2CF51B2E27a7C368EA36A4af16603b58',
      rateZeroToRelay: 0.01,
      zeroContractAddress: '0xb67176655e7919a27aA34C279157124619aDFd4B',
      relayContractAddress: '0x904371845Bc56dCbBcf0225ef84a669b2fD6bd0d',
      marketPlace: 'https://quickswap.exchange/',
      tokens: [
        {
          address: '0x404Ab89684d499Dbe864a1B9811fEb9be2fFADA2',
          name: 'zUSDT',
          symbol: 'zUSDT',
          assetBase: 'USDT',
          decimals: 6,
          resourceId: '0x0000000000000000000000dAC17F958D2ee523a2206206994597C13D831ec701'
        },
        {
          address: '0x823cE9cca0b9eE2BC4C2d764d304691d770DbBe9',
          name: 'zUSDC',
          symbol: 'zUSDC',
          assetBase: 'USDC',
          decimals: 6,
          resourceId: '0x0000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4801'
        },
        {
          address: '0x4801D3057109758C3Cc82859Fe28C56928020330',
          name: 'zETH',
          symbol: 'zETH',
          assetBase: 'ETH',
          decimals: 18,
          resourceId: '0x0000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc201',
        },
        {
          address: '0x2FaB07236d5E1F400568E475B21dBc6AdFEd57D5',
          name: 'zBTC',
          symbol: 'zBTC',
          assetBase: 'BTC',
          decimals: 8,
          resourceId: '0x00000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c59901',
        },
        {
          address: '0x5b75Ff9e5c15Bb94AB166A80dD5398B3B9f50E25',
          name: 'zDAI',
          symbol: 'zDAI',
          assetBase: 'DAI',
          decimals: 18,
          resourceId: '0x00000000000000000000006b175474e89094c44da98b954eedeac495271d0f01',
        },
        {
          address: '0xb67176655e7919a27aA34C279157124619aDFd4B',
          name: 'ZERO(Matic)',
          symbol: 'ZERO',
          assetBase: 'ZERO',
          decimals: 18,
          resourceId: '0x0000000000000000000000F0939011a9bb95c3B791f0cb546377Ed2693a57401',
        },
        {
          address: '0x2C89bbc92BD86F8075d1DEcc58C7F4E0107f286b',
          name: 'zAVAX',
          symbol: 'zAVAX',
          assetBase: 'AVAX',
          decimals: 18,
          resourceId: '0x0000000000000000000000B31f66AA3C1e785363F0875A1B74E27b85FD66c702',
        },
        // {
        //   address: '0x317Edd9783a712Cb412806e6273d7c81C6738D98',
        //   name: 'zLINK',
        //   symbol: 'zLINK',
        //   assetBase: 'LINK',
        //   decimals: 18,
        //   resourceId: '0x0000000000000000000000514910771af9ca656af840dff83e8264ecf986ca01',
        // },
        // {
        //   address: '0x52AbdB3536a3a966056e096F2572B2755df26eac',
        //   name: 'zAAVE',
        //   symbol: 'zAAVE',
        //   assetBase: 'AAVE',
        //   decimals: 18,
        //   resourceId: '0x00000000000000000000007Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE901',
        // },
        {
          address: '0xba79bf6D52934D3b55FE0c14565A083c74FBD224',
          name: 'zUNI',
          symbol: 'zUNI',
          assetBase: 'UNI',
          decimals: 18,
          resourceId: '0x00000000000000000000001f9840a85d5aF5bf1D1762F925BDADdC4201F98401',
        },
        {
          address: '0x3Fc84b2B0F0CFa85A83F5215ec0A56930a49C141',
          name: 'zSUSHI',
          symbol: 'zSUSHI',
          assetBase: 'SUSHI',
          decimals: 18,
          resourceId: '0x00000000000000000000006B3595068778DD592e39A122f4f5a5cF09C90fE201',
        },
        {
          address: '0x10B34Bd0d3b4532BE749b39Aae4B01d229e538E3',
          name: 'z1INCH',
          symbol: 'z1INCH',
          assetBase: '1INCH',
          decimals: 18,
          resourceId: '0x0000000000000000000000111111111117dc0aa78b770fa6a738034120c30201',
        },
        // {
        //   address: '0x7c815BBc21FED2B97CA163552991A5C30d6a2336',
        //   name: 'zYFI',
        //   symbol: 'zYFI',
        //   assetBase: 'YFI',
        //   decimals: 18,
        //   resourceId: '0x00000000000000000000000bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e01',
        // },
        // {
        //   address: '0x21d815016bF0a24CA6E169bd1A32C50514aab91F',
        //   name: 'INDA',
        //   symbol: 'INDA',
        //   assetBase: 'INDA',
        //   decimals: 2,
        //   resourceId: '0x0000000000000000000000433d86336dB759855A66cCAbe4338313a8A7fc7701'
        // },
        {
          address: '0x083c56d87eAD73D6231C165Ec450C6E28f3399C9',
          name: 'ChartEx',
          symbol: 'CHART',
          assetBase: 'CHART',
          decimals: 18,
          resourceId: '0x00000000000000000000001d37986F252d0e349522EA6C3B98Cb935495E63E01'
        },
        {
          address: '0xDcDC86A38d1ddA13EEB346eeBf34d0148C8197d9',
          name: 'Grow Token',
          symbol: 'GROW',
          assetBase: 'GROW',
          decimals: 18,
          resourceId: '0x0000000000000000000000081A4D4e4A0cC74D6a7A61578f86b8C93CC950a003'
        },
        // {
        //   address: '0xfaEF64930CDD15a19B24EA71Efa14d37f2401169',
        //   name: 'Wasder Token',
        //   symbol: 'WAS',
        //   assetBase: 'WAS',
        //   decimals: 18,
        //   resourceId: '0x00000000000000000000000c572544a4Ee47904d54aaA6A970AF96B6f00E1b01'
        // },
        // {
        //   address: '0x52dd5771Cd20Fbb5B4B1E6FBd5e92F6290de6a47',
        //   name: 'PERA',
        //   symbol: 'PERA',
        //   assetBase: 'PERA',
        //   decimals: 18,
        //   resourceId: '0x000000000000000000000052dd5771Cd20Fbb5B4B1E6FBd5e92F6290de6a4705'
        // },
        {
          address: '0x904371845Bc56dCbBcf0225ef84a669b2fD6bd0d',
          name: 'Relay Token',
          symbol: 'RELAY',
          assetBase: 'RELAY',
          decimals: 18,
          resourceId: '0x00000000000000000000005D843Fa9495d23dE997C394296ac7B4D721E841c01'
        },
        {
          address: '0x5c4b7CCBF908E64F32e12c6650ec0C96d717f03F',
          name: 'Binance token',
          symbol: 'BNB',
          assetBase: 'BNB',
          decimals: 18,
          resourceId: '0x0000000000000000000000bb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c03'
        },
        {
          address: '0xA731349fa468614c1698fc46ebf06Da6F380239e',
          name: 'Huobi token',
          symbol: 'HT',
          assetBase: 'HT',
          decimals: 18,
          resourceId: '0x00000000000000000000005545153CCFcA01fbd7Dd11C0b23ba694D9509A6F04'
        },
        {
          address: '0xa3fa99a148fa48d14ed51d610c367c61876997f1',
          name: 'MAI',
          symbol: 'MAI (miMatic)',
          assetBase: 'MAI (miMatic)',
          decimals: 18,
          resourceId: '0x0000000000000000000000a3fa99a148fa48d14ed51d610c367c61876997f105'
        },
        {
          address: '0x34421517f71e1B888eF40D7f176469263Fa92Cc8',
          name: 'Canary',
          symbol: 'CNR',
          assetBase: 'CNR',
          decimals: 18,
          resourceId: '0x00000000000000000000008D88e48465F30Acfb8daC0b3E35c9D6D7d36abaf02'
        },
        {
          address: '0x08193764bd81a742c15125e48f41b1232068c912',
          name: 'MINT',
          symbol: 'MINT',
          assetBase: 'MINT',
          decimals: 18,
          resourceId: '0x000000000000000000000008193764bd81a742c15125e48f41b1232068c91205'
        },
        {
          address: '0x8E1035519567A2C260767f600471bc9Ff3Df896E',
          name: 'MOVR',
          symbol: 'MOVR',
          assetBase: 'MOVR',
          decimals: 18,
          resourceId: '0x000000000000000000000098878B06940aE243284CA214f92Bb71a2b032B8A06'
        },
        {
          address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
          name: 'MATIC',
          symbol: 'MATIC',
          assetBase: 'MATIC',
          decimals: 18,
          resourceId: '0x00000000000000000000000d500B1d8E8eF31E21C99d1Db9A6444d3ADf127005'
        },
        {
          address: '0xB85517b87BF64942adf3A0B9E4c71E4Bc5Caa4e5',
          name: 'FANTOM',
          symbol: 'FTM',
          assetBase: 'FTM',
          decimals: 18,
          resourceId: '0x000000000000000000000021be370D5312f44cB42ce377BC9b8a0cEF1A4C8307'
        }
      ]
    },
    {
      chainId: 6,
      networkId: 1285,
      name: 'Moonriver',
      bridgeAddress: "0xc3a720588d915274B3c81c0bDf473D3FFb279017",
      erc20HandlerAddress: '0x3e3f619940d9a20DbcF3F7c0c7958f4A67Fac688',
      rpcUrl: 'https://rpc.moonriver.moonbeam.network',
      type: 'Ethereum',
      gasLimit: 60000,
      defaultGasPrice: 2,
      blockExplorer: 'https://blockscout.moonriver.moonbeam.network/',
      nativeTokenSymbol: 'MOVR',
      marketPlace: 'https://solarbeam.io/exchange/swap',
      tokens: [
        {
          address: '0x14a0243C333A5b238143068dC3A7323Ba4C30ECB',
          name: 'zAVAX',
          symbol: 'zAVAX',
          assetBase: 'AVAX',
          decimals: 18,
          resourceId: '0x0000000000000000000000B31f66AA3C1e785363F0875A1B74E27b85FD66c702',
        },
        {
          address: '0x5Bb79B71f06b5bd501f18872199Df644DE2C62dB',
          name: 'USDC',
          symbol: 'USDC',
          assetBase: 'USDC',
          decimals: 6,
          resourceId: '0x0000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4801'
        },
        {
          address: '0xF78CD6939Ee62629ea93a33878B3E2a1748ed1c8',
          name: 'DAI',
          symbol: 'DAI',
          assetBase: 'DAI',
          decimals: 18,
          resourceId: '0x00000000000000000000006b175474e89094c44da98b954eedeac495271d0f01'
        },
        {
          address: '0xAd7F1844696652ddA7959a49063BfFccafafEfe7',
          name: 'Relay Token',
          symbol: 'RELAY',
          assetBase: 'RELAY',
          decimals: 18,
          resourceId: '0x00000000000000000000005D843Fa9495d23dE997C394296ac7B4D721E841c01'
        },
        {
          address: '0x98878B06940aE243284CA214f92Bb71a2b032B8A',
          name: 'MOVR',
          symbol: 'MOVR',
          assetBase: 'MOVR',
          decimals: 18,
          resourceId: '0x000000000000000000000098878B06940aE243284CA214f92Bb71a2b032B8A06'
        },
        {
          address: '0x682F81e57EAa716504090C3ECBa8595fB54561D8',
          name: 'MATIC',
          symbol: 'MATIC',
          assetBase: 'MATIC',
          decimals: 18,
          resourceId: '0x00000000000000000000000d500B1d8E8eF31E21C99d1Db9A6444d3ADf127005'
        },
        {
          address: '0x7f5a79576620C046a293F54FFCdbd8f2468174F1',
          name: 'MAI',
          symbol: 'MAI (miMatic)',
          assetBase: 'MAI (miMatic)',
          decimals: 18,
          resourceId: '0x0000000000000000000000a3fa99a148fa48d14ed51d610c367c61876997f105'
        },
        {
          address: '0xaD12daB5959f30b9fF3c2d6709f53C335dC39908',
          name: 'FANTOM',
          symbol: 'FTM',
          assetBase: 'FTM',
          decimals: 18,
          resourceId: '0x000000000000000000000021be370D5312f44cB42ce377BC9b8a0cEF1A4C8307'
        },
        {
          address: '0x98878B06940aE243284CA214f92Bb71a2b032B8A',
          name: 'Moonriver Token',
          symbol: 'MOVR',
          assetBase: 'MOVR',
          decimals: 18,
          resourceId: '0x000000000000000000000098878B06940aE243284CA214f92Bb71a2b032B8A06'
        },
        {
          address: '0xD8B99eae34afDF1a9bFA5770066404ee4468d0f2',
          name: 'USD Coin',
          symbol: 'USDC.e',
          assetBase: 'USDC',
          decimals: 6,
          resourceId: '0x0000000000000000000000A7D7079b0FEaD91F3e65f86E8915Cb59c1a4C66402'
        },
        {
          address: '0xf97C8556Af29089D5d1627096958187b11F1915C',
          name: 'Tether USD',
          symbol: 'USDT.e',
          assetBase: 'USDT',
          decimals: 6,
          resourceId: '0x0000000000000000000000c7198437980c041c805A1EDcbA50c1Ce5db9511802'
        },
        {
          address: '0x26dFff76D9123A1C79279AbC29B676c48A8BD77e',
          name: 'Dai Stablecoin',
          symbol: 'DAI.e',
          assetBase: 'DAI',
          decimals: 18,
          resourceId: '0x0000000000000000000000d586E7F844cEa2F87f50152665BCbc2C279D8d7002'
        },
        {
          address: '0x14f6F4639C6ca0Dcf69bB0911789343D75A54878',
          name: 'Wrapped Ether',
          symbol: 'WETH.e',
          assetBase: 'WETH',
          decimals: 18,
          resourceId: '0x000000000000000000000049D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB02'
        },
        {
          address: '0x63F2ADf5f76F00d48fe2CBef19000AF13Bb8de82',
          name: 'FreeRiver Token',
          symbol: 'FREE',
          assetBase: 'FREE',
          decimals: 18,
          resourceId: '0x000000000000000000000063F2ADf5f76F00d48fe2CBef19000AF13Bb8de8206'
        },
        {
          address: '0x062bD733268269d7Ecb85Cd3EA84281E6bEd7f5F',
          name: 'Dragon Token',
          symbol: 'DRAGON',
          assetBase: 'DRAGON',
          decimals: 18,
          resourceId: '0x0000000000000000000000062bD733268269d7Ecb85Cd3EA84281E6bEd7f5F06'
        },
        {
          address: '0x436a2A6e675ECef26aa90c517aBC464882481BA2',
          name: 'Binance Token',
          symbol: 'BNB',
          assetBase: 'BNB',
          decimals: 18,
          resourceId: '0x0000000000000000000000bb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c03'
        },
      ]
    },
    {
      chainId: 7,
      networkId: 250,
      name: 'Fantom',
      bridgeAddress: "0xAa6520a71619f3a77F12b87BAfA1f32F7002dFEa",
      erc20HandlerAddress: '0x502B4683D213C68507fc6d19417df0bB7995b23B',
      rpcUrl: 'https://rpcapi.fantom.network',
      type: 'Ethereum',
      gasLimit: 60000,
      defaultGasPrice: 2,
      blockExplorer: 'https://ftmscan.com/',
      nativeTokenSymbol: 'FTM',
      marketPlace: 'https://pwawallet.fantom.network/',
      tokens: [
        {
          address: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
          name: 'FANTOM',
          symbol: 'FTM',
          assetBase: 'FTM',
          decimals: 18,
          resourceId: '0x000000000000000000000021be370D5312f44cB42ce377BC9b8a0cEF1A4C8307'
        }
      ] 
  },
  {
    chainId: 8,
    networkId: 336,
    name: 'Shiden',
    bridgeAddress: "0x86355488458DC123184c7cc0fA40DCd7E065Bb67",
    erc20HandlerAddress: '0x074412fae37D4C3de9964980352faD07aacDd674',
    rpcUrl: 'https://rpc.shiden.astar.network:8545',
    type: 'Ethereum',
    gasLimit: 60000,
    defaultGasPrice: 2,
    blockExplorer: 'https://shiden.subscan.io',
    nativeTokenSymbol: 'SDN',
    marketPlace: 'https://portal.astar.network/#/balance/balance-plasm',
    tokens: [
      {
        address: '0x17fcCD90a1911c3C2e0cCb7922b233a0f15A46B1',
        name: 'Moonriver Token',
        symbol: 'MOVR',
        assetBase: 'MOVR',
        decimals: 18,
        resourceId: '0x000000000000000000000098878B06940aE243284CA214f92Bb71a2b032B8A06'
      },
      {
        address: '0x64D70C807C20B5F3bCadC4D92874Fc986049D76D',
        name: 'MAI',
        symbol: 'miMatic',
        assetBase: 'miMatic',
        decimals: 18,
        resourceId: '0x0000000000000000000000a3fa99a148fa48d14ed51d610c367c61876997f105'
      },
      {
        address: '0xcc4e0a2fc0c95304175236666c80a056E530BA2e',
        name: 'Avalanche Token',
        symbol: 'AVAX',
        assetBase: 'AVAX',
        decimals: 18,
        resourceId: '0x0000000000000000000000B31f66AA3C1e785363F0875A1B74E27b85FD66c702'
      },
      {
        address: '0x64D70C807C20B5F3bCadC4D92874Fc986049D76D',
        name: 'MAI',
        symbol: 'miMatic',
        assetBase: 'miMatic',
        decimals: 18,
        resourceId: '0x0000000000000000000000a3fa99a148fa48d14ed51d610c367c61876997f105'
      },
      {
        address: '0xe174aa1927a429815c61ae6a7b2608ECd61e100a',
        name: 'Fantom Token',
        symbol: 'FTM',
        assetBase: 'FTM',
        decimals: 18,
        resourceId: '0x000000000000000000000021be370D5312f44cB42ce377BC9b8a0cEF1A4C8307'
      },
      {
        address: '0xb53973ad94eB16FbD138805AcE4173416F016e7E',
        name: 'USD Coin',
        symbol: 'USDC.e',
        assetBase: 'USDC',
        decimals: 6,
        resourceId: '0x0000000000000000000000A7D7079b0FEaD91F3e65f86E8915Cb59c1a4C66402'
      },
      {
        address: '0x35188e3CB4e5eb81350f7b47E153354A12794FeC',
        name: 'Tether USD',
        symbol: 'USDT.e',
        assetBase: 'USDT',
        decimals: 6,
        resourceId: '0x0000000000000000000000c7198437980c041c805A1EDcbA50c1Ce5db9511802'
      },
      {
        address: '0x7b7e696df8Ca22A8dC6c1dC14c4D5bC153a225D5',
        name: 'Dai Stablecoin',
        symbol: 'DAI.e',
        assetBase: 'DAI',
        decimals: 18,
        resourceId: '0x0000000000000000000000d586E7F844cEa2F87f50152665BCbc2C279D8d7002'
      },
      {
        address: '0x3Fbd1C493227ff8c32be165aCbe483897e3B496d',
        name: 'Wrapped Ether',
        symbol: 'WETH.e',
        assetBase: 'WETH',
        decimals: 18,
        resourceId: '0x000000000000000000000049D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB02'
      },
      {
        address: '0x3671af96072B60296F79e17Df07c4Ac2c3f43dEC',
        name: 'FreeRiver Token',
        symbol: 'FREE',
        assetBase: 'FREE',
        decimals: 18,
        resourceId: '0x000000000000000000000063F2ADf5f76F00d48fe2CBef19000AF13Bb8de8206'
      },
      {
        address: '0x30C47c0ceBc79bCEfd3F9714F5FFbc86555D7615',
        name: 'Dragon Token',
        symbol: 'DRAGON',
        assetBase: 'DRAGON',
        decimals: 18,
        resourceId: '0x0000000000000000000000062bD733268269d7Ecb85Cd3EA84281E6bEd7f5F06'
      },
      {
        address: '0x8b0977D8993CB89d7129e7DE4B3f316DC24d237e',
        name: 'Binance Token',
        symbol: 'BNB',
        assetBase: 'BNB',
        decimals: 18,
        resourceId: '0x0000000000000000000000bb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c03'
      },
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
  //     defaultGasPrice: 225,
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
