import { ChainId, Trade, currencyEquals, Token } from '@zeroexchange/sdk'
import { getCurrencyLogoImage } from 'components/CurrencyLogo'
import React, { useCallback, useMemo, useState } from 'react'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent
} from '../TransactionConfirmationModal'

import SwapModalFooter from './SwapModalFooter'
import SwapModalHeader from './SwapModalHeader'

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param tradeA trade A
 * @param tradeB trade B
 */
function tradeMeaningfullyDiffers(tradeA: Trade, tradeB: Trade): boolean {
  return (
    tradeA.tradeType !== tradeB.tradeType ||
    !currencyEquals(tradeA.inputAmount.currency, tradeB.inputAmount.currency) ||
    !tradeA.inputAmount.equalTo(tradeB.inputAmount) ||
    !currencyEquals(tradeA.outputAmount.currency, tradeB.outputAmount.currency) ||
    !tradeA.outputAmount.equalTo(tradeB.outputAmount)
  )
}

export default function ConfirmSwapModal({
  trade,
  originalTrade,
  onAcceptChanges,
  allowedSlippage,
  onConfirm,
  onDismiss,
  recipient,
  swapErrorMessage,
  isOpen,
  attemptingTxn,
  txHash,
  chainId
}: {
  isOpen: boolean
  trade: Trade | undefined
  originalTrade: Trade | undefined
  attemptingTxn: boolean
  txHash: string | undefined
  recipient: string | null
  allowedSlippage: number
  onAcceptChanges: () => void
  onConfirm: () => void
  swapErrorMessage: string | undefined
  onDismiss: () => void
  chainId: ChainId | undefined
}) {
  const showAcceptChanges = useMemo(
    () => Boolean(trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)),
    [originalTrade, trade]
  )

  const modalHeader = useCallback(() => {
    return trade ? (
      <SwapModalHeader
        trade={trade}
        allowedSlippage={allowedSlippage}
        recipient={recipient}
        showAcceptChanges={showAcceptChanges}
        onAcceptChanges={onAcceptChanges}
        chainId={chainId}
      />
    ) : null
  }, [allowedSlippage, onAcceptChanges, recipient, showAcceptChanges, trade, chainId])

  const modalBottom = useCallback(() => {
    return trade ? (
      <SwapModalFooter
        onConfirm={onConfirm}
        trade={trade}
        disabledConfirm={showAcceptChanges}
        swapErrorMessage={swapErrorMessage}
        allowedSlippage={allowedSlippage}
        chainId={chainId}
      />
    ) : null
  }, [allowedSlippage, onConfirm, showAcceptChanges, swapErrorMessage, trade, chainId])

  // text to show while loading
  const pendingText = `Swapping ${trade?.inputAmount?.toSignificant(6)} ${
    trade?.inputAmount?.currency?.symbol
  } for ${trade?.outputAmount?.toSignificant(6)} ${trade?.outputAmount?.currency?.symbol}`

  const confirmationContent = useCallback(
    () =>
      swapErrorMessage ? (
        <TransactionErrorContent onDismiss={onDismiss} message={swapErrorMessage} />
      ) : (
        <ConfirmationModalContent
          title="Confirm Swap"
          onDismiss={onDismiss}
          topContent={modalHeader}
          bottomContent={modalBottom}
        />
      ),
    [onDismiss, modalBottom, modalHeader, swapErrorMessage]
  )

  const outputToken = wrappedCurrency(trade?.outputAmount?.currency ?? undefined, chainId)
  const url = process.env.REACT_APP_URL
  // eslint-disable-next-line 
  const [isMetamaskError, setMetamaskError] = useState(false)
  const onClickAddToken = async (outputToken: Token) => {
    let { ethereum } = window

    if (ethereum) {
      const data = {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address: outputToken?.address, // The address that the token is at.
          symbol: outputToken?.symbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: outputToken?.decimals, // The number of decimals in the token
          image: `${url}${getCurrencyLogoImage(outputToken?.symbol)}` // '' A string url of the token logo
        }
      }
      /* eslint-disable */
      const request =
        ethereum && ethereum.request ? ethereum['request']({ method: 'wallet_watchAsset', params: data }).catch() : ''

      if (request !== '') {
        request.then(t => {
          console.log(t)
        })
      } else {
        setMetamaskError(true)
      }
    }
  }

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={pendingText}
      outputToken={outputToken}
      handleClickAddToken={onClickAddToken}
    />
  )
}
