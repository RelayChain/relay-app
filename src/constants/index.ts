import { AVAX, BNB, DEV, MATIC, ChainId, ETHER, HECO, JSBI, Percent, Token, WETH } from '@zeroexchange/sdk'
import { fortmatic, injected, portis, walletconnect, walletlink } from '../connectors'

import { AbstractConnector } from '@web3-react/abstract-connector'

export const AVAX_ROUTER_ADDRESS = process.env.REACT_APP_TESTNET
  ? '0x9310C59b5062e46914Fee525798950aB8eA92dF0'
  : '0x85995d5f8ee9645cA855e92de16FA62D26398060'
export const SMART_CHAIN_ROUTER_ADDRESS = process.env.REACT_APP_TESTNET
  ? '0xB3275050341b6E4Cb8D6D80579dB451B89F64EdE'
  : '0xba79bf6D52934D3b55FE0c14565A083c74FBD224'
export const ETH_ROUTER_ADDRESS = process.env.REACT_APP_TESTNET
  ? '0x70Ee974E2339E41D582593622c8a653842d9d52d'
  : '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'

export const MATIC_ROUTER_ADDRESS = process.env.REACT_APP_TESTNET
  ? '0x9310C59b5062e46914Fee525798950aB8eA92dF0'
  : '0x9894B0F28CcfA0F5c5F74EAC88f161110C5F8027'

export const HECO_ROUTER_ADDRESS = process.env.REACT_APP_TESTNET
  ? '0x2d29a75276abd2ad768f1db1706e62526e73b93b'
  : '0x2d29a75276abd2ad768f1db1706e62526e73b93b'
export const MOONBASE_ROUTER_ADDRESS = process.env.REACT_APP_TESTNET ? '0xaD3eE6686B40655b34e0D150f99715c87A75DF37' : ''

export const MUMBAI_ROUTER_ADDRESS = process.env.REACT_APP_TESTNET ? '0x9310C59b5062e46914Fee525798950aB8eA92dF0' : ''
export const MOONRIVER_ROUTER_ADDRESS = process.env.REACT_APP_TESTNET ? '0x9310C59b5062e46914Fee525798950aB8eA92dF0' : ''
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const AVAX_ADDRESS = '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const returnNumberDecimals = (num: string, decimals: number) => {
  return parseFloat(
    parseFloat(num)
      .toFixed(decimals)
      .toString()
  )
}

export const returnBalanceNum = (obj?: any, decimals?: number) => {
  const str = obj.toExact()
  const [str1, str2] = str.split('.')
  if (str2) {
    return str1.length + decimals
  } else {
    return str1.length
  }
}

export const ZERO = new Token(ChainId.MAINNET, '0xf0939011a9bb95c3b791f0cb546377ed2693a574', 18, 'ZERO', 'Zero Exchange')
export const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
export const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USDC')
export const USDT = new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD')
export const COMP = new Token(ChainId.MAINNET, '0xc00e94Cb662C3520282E6f5717214004A7f26888', 18, 'COMP', 'Compound')
export const MKR = new Token(ChainId.MAINNET, '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', 18, 'MKR', 'Maker')
export const AMPL = new Token(ChainId.MAINNET, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth')
export const WBTC = new Token(ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped BTC')
export const SUSHI = new Token(ChainId.MAINNET, '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2', 18, 'SUSHI', 'Wrapped BTC')
export const WAS = new Token(ChainId.MAINNET, '0x0c572544a4Ee47904d54aaA6A970AF96B6f00E1b', 18, 'WAS', 'Wasder Token')
export const BIOS = new Token(ChainId.MAINNET, '0xAACa86B876ca011844b5798ECA7a67591A9743C8', 18, 'BIOS', 'BIOS')
export const XIOT = new Token(ChainId.MAINNET, '0x31024A4C3e9aEeb256B825790F5cb7ac645e7cD5', 3, 'XIOT', 'Xiotri')
export const RELAY = new Token(ChainId.MAINNET, '0x5D843Fa9495d23dE997C394296ac7B4D721E841c', 18, 'RELAY', 'Relay in Ethereum')

export const CHART = new Token(ChainId.AVALANCHE, '0x1d37986F252d0e349522EA6C3B98Cb935495E63E', 18, 'CHART', 'ChartEx')

export const WAVAX = new Token(ChainId.AVALANCHE, '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', 18, 'WAVAX', 'Avalanche')
export const zZERO = new Token(ChainId.AVALANCHE, '0x008E26068B3EB40B443d3Ea88c1fF99B789c10F7', 18, 'ZERO', 'Zero Exchange')
export const aRELAY = new Token(ChainId.AVALANCHE, '0x78c42324016cd91D1827924711563fb66E33A83A', 18, 'RELAY', 'RELAY in Avalanche')
export const zDAI = new Token(ChainId.AVALANCHE, '0x12f108E6138d4A9c58511e042399cF8f90D5673f', 18, 'zDAI', 'Dai Stablecoin')
export const zUSDC = new Token(ChainId.AVALANCHE, '0x474Bb79C3e8E65DcC6dF30F9dE68592ed48BBFDb', 6, 'zUSDC', 'zUSDC')
export const zETH = new Token(ChainId.AVALANCHE, '0xf6F3EEa905ac1da6F6DD37d06810C6Fcb0EF5183', 6, 'zETH', 'Ether')
export const zUSDT = new Token(ChainId.AVALANCHE, '0x650CECaFE61f3f65Edd21eFacCa18Cc905EeF0B7', 6, 'zUSDT', 'zUSDT')
export const zBTC = new Token(ChainId.AVALANCHE, '0xc4f4Ff34A2e2cF5e4c892476BB2D056871125452', 8, 'zBTC', 'zBTC')
export const zUNI = new Token(ChainId.AVALANCHE, '0xBa9aF11661520129Af69d233E92d69BD40CD90AF', 18, 'zUNI', 'zUNI')
export const zSUSHI = new Token(ChainId.AVALANCHE, '0xD4feE2e3F88B9138B74a323B40bC63bcc1A1B9eC', 18, 'zSUSHI', 'zSUSHI')
export const pngDAI = new Token(ChainId.AVALANCHE, '0xbA7dEebBFC5fA1100Fb055a87773e1E99Cd3507a', 18, 'pngDAI', 'pngDAI')
export const pngUSDT = new Token(ChainId.AVALANCHE, '0xde3A24028580884448a5397872046a019649b084', 6, 'pngUSDT', 'pngUSDT')
export const gondolaUSDTPool = new Token(ChainId.AVALANCHE, '0xE586dB7Db75B87A3E84110a73b99960F5f106c6A', 18, 'gndUSDT', 'Gondola pool USDT/ZUSDT')
export const gondolaETHPool = new Token(ChainId.AVALANCHE, '0xc37ECFA7Bbf1dF92Da7C4A3d92d8CF8657D1FF7f', 18, 'gndETH', 'Gondola pool USDT/ZUSDT')
export const gondolaDAIPool = new Token(ChainId.AVALANCHE, '0x2036C0EB5C42eF7f1ca06dF57D07F79eb3a2e0C8', 18, 'gndETH', 'Gondola pool DAI/ZDAI')

export const pngETH = new Token(ChainId.AVALANCHE, '0xf20d962a6c8f70c731bd838a3a388D7d48fA6e15', 18, 'pngETH', 'pngETH')
export const GDL = new Token(ChainId.AVALANCHE, '0xD606199557c8Ab6F4Cc70bD03FaCc96ca576f142', 18, 'GDL', 'Gondola')
export const zCHART = new Token(ChainId.AVALANCHE, '0xD769bDFc0CaEe933dc0a047C7dBad2Ec42CFb3E2', 18, 'CHART', 'ChartEx')

export const WBNB = new Token(ChainId.SMART_CHAIN, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'WBNB', 'SMART_CHAIN')

export const bscZERO = new Token(ChainId.SMART_CHAIN, '0x1f534d2B1ee2933f1fdF8e4b63A44b2249d77EAf', 18, 'ZERO', 'ZERO Exchange')
export const bscBUSD = new Token(ChainId.SMART_CHAIN, '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 18, 'BUSD', 'BUSD')
export const bscWBNB = new Token(ChainId.SMART_CHAIN, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'WBNB', 'WBNB')
export const bscUSDC = new Token(ChainId.SMART_CHAIN, '0x4022AfEB287052e6e587d39bA99f79cAFC47B570', 6, 'zUSDC', 'zUSDC')
export const bscUSDT = new Token(ChainId.SMART_CHAIN, '0xBF7e0761417F49b3FAFae564C842823f5f79DB15', 6, 'zUSDT', 'zUSDT')
export const bscBTC = new Token(ChainId.SMART_CHAIN, '0xB6D5487b00e53e7009E6560189EB8B8c22e11Bf3', 8, 'zBTC', 'zBTC')
export const bscUNI = new Token(ChainId.SMART_CHAIN, '0xA6b4a72a6f8116dab486fB88192450CF3ed4150C', 18, 'zUNI', 'zUNI')
export const bscSUSHI = new Token(ChainId.SMART_CHAIN, '0x2D6d5bc58adEDa28f62B0aBc3f53F5EAef497FCc', 18, 'zSUSHI', 'zSUSHI')
export const bscDAI = new Token(ChainId.SMART_CHAIN, '0x7e7bAFF135c42ed90C0EdAb16eAe48ecEa417018', 18, 'zDAI', 'zDAI')
export const bscETH = new Token(ChainId.SMART_CHAIN, '0x7c815BBc21FED2B97CA163552991A5C30d6a2336', 18, 'zETH', 'zETH');
export const bscINDA = new Token(ChainId.SMART_CHAIN, '0xc878a79b63a41a831e469ae1a830a765efd9d468', 2, 'INDA', 'INDA');
export const bscCHART = new Token(ChainId.SMART_CHAIN, '0xc33A42C9D19f944FA12ff46f27B3B85e18a13778', 18, 'CHART', 'ChartEx')
export const bscWISB = new Token(ChainId.SMART_CHAIN, '0x4f491d389A5bF7C56bd1e4d8aF2280fD217C8543', 18, 'WISB', 'Wise Token')
export const bscRELAY = new Token(ChainId.SMART_CHAIN, '0xE338D4250A4d959F88Ff8789EaaE8c32700BD175', 18, 'RELAY', 'RELAY in BSC')

export const WMATIC = new Token(ChainId.MATIC, '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', 18, 'WMATIC', 'Wrapped Matic (WMATIC)')
export const MZERO = new Token(ChainId.MATIC, '0xb67176655e7919a27aA34C279157124619aDFd4B', 18, 'MZERO', 'ZERO in Polygon')
// a test token, mintable by anyone
export const MINT = new Token(ChainId.MATIC, '0x08193764bd81a742c15125e48f41b1232068c912', 18, 'MINT', 'Mintable Token')
export const mRELAY = new Token(ChainId.MATIC, '0x904371845Bc56dCbBcf0225ef84a669b2fD6bd0d', 18, 'RELAY', 'RELAY in Polygon')

export const WHT = new Token(ChainId.HECO, '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f', 18, 'WHT', 'Wrapped HECO in HUOBI')
export const hINDA = new Token(ChainId.HECO, '0x4E76805F76c13BfaA1D6558596A12086e4bE3E2C', 2, 'HINDA', 'INDA in HUOBI');
export const hZERO = new Token(ChainId.HECO, '0x0E4564692B15Af6526b6910CFd9E1F4B6671CA1A', 18, 'HZERO', 'ZERO in HUOBI')

export const rinkebyZERO = new Token(ChainId.RINKEBY, '0x9EfCe00Be4E0c2D9aEF18aACe4e273D9ebcf574a', 18, 'ZERO', 'Zero Exchange')
export const rinkebyUSDC = new Token(ChainId.RINKEBY, '0xeb8f08a975Ab53E34D8a0330E0D34de942C95926', 6, 'USDC', 'USDC')
export const MOCK1 = new Token(ChainId.FUJI, '0xD752858feafADd6BD6B92e5bBDbb3DC8d40cD351', 18, 'MOCK1', 'MOCK1 in Avalanche')
export const MOCK2 = new Token(ChainId.FUJI, '0x5300A4834F1995828B99bE23bcD99C80002DE9c8', 18, 'MOCK2', 'MOCK2 in Avalanche')

// Block time here is slightly higher (~1s) than average in order to avoid ongoing proposals past the displayed time
export const AVERAGE_BLOCK_TIME_IN_SECS = 14
export const PROPOSAL_LENGTH_IN_BLOCKS = 40_320
export const PROPOSAL_LENGTH_IN_SECS = AVERAGE_BLOCK_TIME_IN_SECS * PROPOSAL_LENGTH_IN_BLOCKS

export const GOVERNANCE_ADDRESS = '0x5e4be8Bc9637f0EAA1A755019e06A68ce081D58F'

export const TIMELOCK_ADDRESS = '0x1a9C8182C09F50C8318d769245beA52c32BE35BC'

const UNI_ADDRESS = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
export const UNI: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, UNI_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, UNI_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, UNI_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, UNI_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, UNI_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.FUJI]: new Token(ChainId.FUJI, UNI_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, UNI_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.SMART_CHAIN]: new Token(ChainId.SMART_CHAIN, UNI_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.SMART_CHAIN_TEST]: new Token(ChainId.SMART_CHAIN_TEST, UNI_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.MOONBASE_ALPHA]: new Token(ChainId.MOONBASE_ALPHA, UNI_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, UNI_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.MATIC]: new Token(ChainId.MATIC, UNI_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.HECO]: new Token(ChainId.HECO, UNI_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.MOONRIVER]: new Token(ChainId.MOONRIVER, UNI_ADDRESS, 18, 'UNI', 'Uniswap'),
}

export const COMMON_CONTRACT_NAMES: { [address: string]: string } = {
  [UNI_ADDRESS]: 'UNI',
  [GOVERNANCE_ADDRESS]: 'Governance',
  [TIMELOCK_ADDRESS]: 'Timelock'
}

// TODO: specify merkle distributor for mainnet
export const MERKLE_DISTRIBUTOR_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: '0x090D4613473dEE047c3f2706764f49E0821D256e'
  // [ChainId.FUJI]: '0x4e32D543A77Ac8a6e46f0A3E3A2D475e6aE1816c'
}

const WETH_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [WETH[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [WETH[ChainId.RINKEBY]],
  [ChainId.GÖRLI]: [WETH[ChainId.GÖRLI]],
  [ChainId.KOVAN]: [WETH[ChainId.KOVAN]],
  [ChainId.FUJI]: [WETH[ChainId.FUJI]],
  [ChainId.AVALANCHE]: [WETH[ChainId.AVALANCHE]],
  [ChainId.SMART_CHAIN]: [WETH[ChainId.SMART_CHAIN]],
  [ChainId.SMART_CHAIN_TEST]: [WETH[ChainId.SMART_CHAIN_TEST]],
  [ChainId.MOONBASE_ALPHA]: [WETH[ChainId.MOONBASE_ALPHA]],
  [ChainId.MUMBAI]: [WETH[ChainId.MUMBAI]],
  [ChainId.MATIC]: [WETH[ChainId.MATIC]],
  [ChainId.HECO]: [WETH[ChainId.HECO]],
  [ChainId.MOONRIVER]: [WETH[ChainId.MOONRIVER]],
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT, ZERO, COMP, MKR],
  [ChainId.RINKEBY]: [...WETH_ONLY[ChainId.RINKEBY], rinkebyZERO, rinkebyUSDC],
  // [ChainId.FUJI]: [...WETH_ONLY[ChainId.FUJI], MOCK1, MOCK2],
  [ChainId.SMART_CHAIN]: [...WETH_ONLY[ChainId.SMART_CHAIN], WBNB, bscZERO, bscBUSD, bscUSDC],
  [ChainId.AVALANCHE]: [...WETH_ONLY[ChainId.AVALANCHE], WAVAX, zZERO, zUSDC],
  [ChainId.MATIC]: [...WETH_ONLY[ChainId.MATIC], WMATIC],
  [ChainId.HECO]: [...WETH_ONLY[ChainId.HECO], WHT]
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {
    [AMPL.address]: [DAI, WETH[ChainId.MAINNET]]
  }
  // [ChainId.FUJI]: {
  //   [AMPL.address]: [MOCK1, WETH[ChainId.FUJI]],
  //   [AMPL.address]: [MOCK2, WETH[ChainId.FUJI]]
  // }
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT],
  [ChainId.RINKEBY]: [],
  [ChainId.AVALANCHE]: [zZERO, AVAX as Token, zUSDC, zUSDT, zDAI, zETH],
  [ChainId.SMART_CHAIN]: [bscZERO, BNB as Token, bscBUSD, bscDAI, bscUSDC, bscUSDT, bscETH],
  [ChainId.SMART_CHAIN_TEST]: [],
  [ChainId.FUJI]: [],
  [ChainId.MOONBASE_ALPHA]: [],
  [ChainId.MUMBAI]: [],
  [ChainId.MATIC]: [],
  [ChainId.HECO]: []
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], ZERO, DAI, USDC, USDT, MOCK1, MOCK2]
  // [ChainId.FUJI]: [...WETH_ONLY[ChainId.FUJI], MOCK1, MOCK2]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [
      new Token(ChainId.MAINNET, '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', 8, 'cDAI', 'Compound Dai'),
      new Token(ChainId.MAINNET, '0x39AA39c021dfbaE8faC545936693aC917d5E7563', 8, 'cUSDC', 'Compound USD Coin')
    ],
    [MOCK1, MOCK2],
    [USDC, USDT],
    [DAI, USDT]
  ]
  // [ChainId.FUJI]: [
  //   [WETH[ChainId.FUJI], MOCK1],
  //   [WETH[ChainId.FUJI], MOCK2],
  //   [MOCK1, MOCK2]
  // ]
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5'
  },
  COINBASE_LINK: {
    name: 'Open in Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Open in Coinbase Wallet app.',
    href: 'https://go.cb-w.com/mtUDhEZPy1',
    color: '#315CF5',
    mobile: true,
    mobileOnly: true
  },
  FORTMATIC: {
    connector: fortmatic,
    name: 'Fortmatic',
    iconName: 'fortmaticIcon.png',
    description: 'Login using Fortmatic hosted wallet',
    href: null,
    color: '#6748FF',
    mobile: true
  },
  Portis: {
    connector: portis,
    name: 'Portis',
    iconName: 'portisIcon.png',
    description: 'Login using Portis hosted wallet',
    href: null,
    color: '#4A6C9B',
    mobile: true
  }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 300 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 300

// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7)

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
export const BETTER_TRADE_LINK_THRESHOLD = new Percent(JSBI.BigInt(75), JSBI.BigInt(10000))

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008'
]

export const CHAIN_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: 'Ethereum',
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.FUJI]: 'Avalanche',
  [ChainId.AVALANCHE]: 'Avalanche',
  [ChainId.SMART_CHAIN]: 'Smart Chain',
  [ChainId.SMART_CHAIN_TEST]: 'Smart Chain Testnet',
  [ChainId.MOONBASE_ALPHA]: 'Moonbeam',
  [ChainId.MUMBAI]: 'Mumbai',
  [ChainId.MATIC]: 'Polygon',
  [ChainId.HECO]: 'HECO',
  [ChainId.MOONRIVER]: 'Moonriver'
}

export const SUPPORTED_CHAINS = ['Ethereum', 'Avalanche', 'Smart Chain', 'Polkadot', 'Matic', 'HECO']

export const ETH_RPCS = ['Ethereum', 'Rinkeby']

export const NATIVE_CURRENCY = {
  [ChainId.MAINNET]: ETHER,
  [ChainId.RINKEBY]: ETHER,
  [ChainId.FUJI]: AVAX,
  [ChainId.AVALANCHE]: AVAX,
  [ChainId.SMART_CHAIN]: BNB,
  [ChainId.SMART_CHAIN_TEST]: BNB,
  [ChainId.MOONBASE_ALPHA]: DEV,
  [ChainId.MUMBAI]: MATIC,
  [ChainId.MATIC]: MATIC,
  [ChainId.HECO]: HECO
}