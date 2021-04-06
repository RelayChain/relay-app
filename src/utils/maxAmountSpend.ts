import { AVAX, BNB, ChainId, CurrencyAmount, ETHER, JSBI } from '@zeroexchange/sdk'

import { MIN_ETH } from '../constants'

/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 */
export function maxAmountSpend(currencyAmount?: CurrencyAmount): CurrencyAmount | undefined {
  if (!currencyAmount) return undefined
  if (currencyAmount.currency === ETHER || currencyAmount.currency === AVAX || currencyAmount.currency === BNB) {
    //mainnet
    // const chainId =
    //   currencyAmount?.currency === ETHER
    //     ? ChainId.MAINNET
    //     : currencyAmount?.currency === BNB
    //     ? ChainId.SMART_CHAIN
    //     : ChainId.AVALANCHE
    //testnet
    const chainId =
      currencyAmount?.currency === ETHER
        ? ChainId.RINKEBY
        : currencyAmount?.currency === BNB
        ? ChainId.SMART_CHAIN_TEST
        : ChainId.FUJI
    if (JSBI.greaterThan(currencyAmount.raw, MIN_ETH)) {
      return CurrencyAmount.ether(JSBI.subtract(currencyAmount.raw, MIN_ETH), chainId)
    } else {
      return CurrencyAmount.ether(JSBI.BigInt(0), chainId)
    }
  }
  return currencyAmount
}
