import { AVAX, BNB, Currency, ETHER, WETH, currencyEquals } from '@zeroexchange/sdk'

import { tryParseAmount } from '../state/swap/hooks'
import { useActiveWeb3React } from './index'
import { useCurrencyBalance } from '../state/wallet/hooks'
import { useMemo } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useWETHContract } from './useContract'

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE }
/**
 * Given the selected input and output currency, return a wrap callback
 * @param inputCurrency the selected input currency
 * @param outputCurrency the selected output currency
 * @param typedValue the user input value
 */
export default function useWrapCallback(
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  typedValue: string | undefined
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { chainId, account } = useActiveWeb3React()
  const wethContract = useWETHContract()
  const balance = useCurrencyBalance(account ?? undefined, inputCurrency, chainId)
  // we can always parse the amount typed as the input currency, since wrapping is 1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()

  return useMemo(() => {
    if (!wethContract || !chainId || !inputCurrency || !outputCurrency) return NOT_APPLICABLE
    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)
    // console.log('WETH[chainId]', WETH[chainId])
    // console.log('outputCurrency', outputCurrency)
    // console.log('outputCurrency', inputCurrency)
    // console.log('currencyEquals outputCurrency=', currencyEquals(WETH[chainId], outputCurrency))
    // console.log('currencyEquals inputCurrency=', currencyEquals(WETH[chainId], inputCurrency))
    // console.log('asdasdasd=', inputCurrency === ETHER || inputCurrency === AVAX || inputCurrency === BNB)
    if (
      (inputCurrency === ETHER || inputCurrency === AVAX || inputCurrency === BNB) &&
      currencyEquals(WETH[chainId], outputCurrency)
    ) {
      return {
        wrapType: WrapType.WRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  const txReceipt = await wethContract.deposit({ value: `0x${inputAmount.raw.toString(16)}` })
                  addTransaction(txReceipt, { summary: `Wrap ${inputAmount.toSignificant(6)} ETH to WETH` })
                } catch (error) {
                  console.error('Could not deposit', error)
                }
              }
            : undefined,
        inputError: sufficientBalance ? undefined : 'Insufficient balance'
      }
    } else if (
      currencyEquals(WETH[chainId], inputCurrency) &&
      (outputCurrency === ETHER || outputCurrency === AVAX || outputCurrency === BNB)
    ) {
      return {
        wrapType: WrapType.UNWRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  const txReceipt = await wethContract.withdraw(`0x${inputAmount.raw.toString(16)}`)
                  addTransaction(txReceipt, { summary: `Unwrap ${inputAmount.toSignificant(6)} WETH to ETH` })
                } catch (error) {
                  console.error('Could not withdraw', error)
                }
              }
            : undefined,
        inputError: sufficientBalance ? undefined : 'Insufficient balance'
      }
    } else {
      return NOT_APPLICABLE
    }
  }, [wethContract, chainId, inputCurrency, outputCurrency, inputAmount, balance, addTransaction])
}
