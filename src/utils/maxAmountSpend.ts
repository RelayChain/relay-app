import { AVAX, BNB, DEV, MATIC, ChainId, CurrencyAmount, ETHER, JSBI } from '@zeroexchange/sdk'

import { MIN_ETH } from '../constants'

/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 */
export function maxAmountSpend(currencyAmount?: CurrencyAmount): CurrencyAmount | undefined {
  if (!currencyAmount) return undefined
  if (
    currencyAmount.currency === ETHER ||
    currencyAmount.currency === AVAX ||
    currencyAmount.currency === BNB ||
    currencyAmount.currency === DEV ||
    currencyAmount.currency === MATIC
  ) {
    const chainId = process.env.REACT_APP_TESTNET
      ? currencyAmount?.currency === ETHER
        ? ChainId.RINKEBY
        : currencyAmount?.currency === BNB
        ? ChainId.SMART_CHAIN_TEST
        : currencyAmount?.currency === DEV
        ? ChainId.MOONBASE_ALPHA
        : currencyAmount?.currency === MATIC
        ? ChainId.MUMBAI
        : ChainId.FUJI
      : currencyAmount?.currency === ETHER
      ? ChainId.MAINNET
      : currencyAmount?.currency === BNB
      ? ChainId.SMART_CHAIN
      : ChainId.AVALANCHE

    if (JSBI.greaterThan(currencyAmount.raw, MIN_ETH)) {
      return CurrencyAmount.ether(JSBI.subtract(currencyAmount.raw, MIN_ETH), chainId)
    } else {
      return CurrencyAmount.ether(JSBI.BigInt(0), chainId)
    }
  }
  return currencyAmount
}
