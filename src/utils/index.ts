import { AVAX, BNB, DEV, MATIC, ChainId, Currency, CurrencyAmount, ETHER, JSBI, Percent, Token } from '@zeroexchange/sdk'
import {
  AVAX_ROUTER_ADDRESS, ETH_ROUTER_ADDRESS, SMART_CHAIN_ROUTER_ADDRESS,
  MOONBASE_ROUTER_ADDRESS, MUMBAI_ROUTER_ADDRESS, MATIC_ROUTER_ADDRESS
} from '../constants'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'

import { AddressZero } from '@ethersproject/constants'
import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { abi as IUniswapV2Router02ABI } from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'
import { TokenAddressMap } from '../state/lists/hooks'
import { getAddress } from '@ethersproject/address'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  if (value) {
    try {
      return getAddress(value)
    } catch (e) {
      return false
    }
  }
  return false
}

const ETHERSCAN_PREFIXES: { [chainId in ChainId]: string } = {
  1: '',
  3: 'ropsten.',
  4: 'rinkeby.',
  5: 'goerli.',
  42: 'kovan.',
  // TODO: are these needed at all?
  43113: 'FUJI',
  43114: 'AVALANCHE',
  97: 'SMART_CHAIN_TEST',
  56: 'SMART_CHAIN',
  1287: 'MOONBASE_ALPHA',
  80001: 'MUMBAI',
  137: 'MATIC',
  128: 'HECO',
}

export function getEtherscanLink(
  chainId: ChainId,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block'
): string {
  let prefix = `https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]}etherscan.io`
  if (chainId === ChainId.FUJI) {
    prefix = `https://cchain.explorer.avax-test.network`
  }
  if (chainId === ChainId.AVALANCHE) {
    prefix = `https://cchain.explorer.avax.network`
  }
  if (chainId === ChainId.SMART_CHAIN_TEST) {
    prefix = `https://testnet.bscscan.com`
  }
  if (chainId === ChainId.MUMBAI) {
    prefix = `https://explorer-mumbai.maticvigil.com`
  }
  if (chainId === ChainId.SMART_CHAIN) {
    prefix = `https://bscscan.com`
  }
  if (chainId === ChainId.MOONBASE_ALPHA) {
    prefix = `https://moonbase.subscan.io`
  }
  if (chainId === ChainId.MATIC) {
    prefix = `https://polygonscan.com`
  }
  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'token': {
      return `${prefix}/token/${data}`
    }
    case 'block': {
      return `${prefix}/block/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000))
}

export function calculateSlippageAmount(value: CurrencyAmount, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000))
  ]
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any)
}

// account is optional
export function getRouterContract(chainId: ChainId, library: Web3Provider, account?: string): Contract {
  return getContract(
    chainId === ChainId.MAINNET || chainId === ChainId.RINKEBY
      ? ETH_ROUTER_ADDRESS
      : chainId === ChainId.SMART_CHAIN || chainId === ChainId.SMART_CHAIN_TEST
        ? SMART_CHAIN_ROUTER_ADDRESS
        : chainId === ChainId.MOONBASE_ALPHA
          ? MOONBASE_ROUTER_ADDRESS
          : chainId === ChainId.MUMBAI
            ? MUMBAI_ROUTER_ADDRESS
            : chainId === ChainId.MATIC
              ? MATIC_ROUTER_ADDRESS
              : AVAX_ROUTER_ADDRESS,
    IUniswapV2Router02ABI,
    library,
    account
  )
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function isTokenOnList(defaultTokens: TokenAddressMap, currency?: Currency): boolean {
  if (currency === ETHER) return true
  if (currency === AVAX) return true
  if (currency === BNB) return true
  if (currency === DEV) return true
  if (currency === MATIC) return true
  return Boolean(currency instanceof Token && defaultTokens[currency.chainId]?.[currency.address])
}

export const copyToClipboard = (text: string) => {
  const textArea = document.createElement('textarea')
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.select()
  document.execCommand('copy')
  document.body.removeChild(textArea)
}

export const wait = (time: number) =>
  new Promise(resolve => {
    setTimeout(resolve, time * 1000)
  })
