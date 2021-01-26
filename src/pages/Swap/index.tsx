import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import { ArrowWrapper, BottomGrouping, SwapCallbackError, Wrapper } from '../../components/swap/styleds'
import { AutoRow, RowBetween } from '../../components/Row'
import { BETTER_TRADE_LINK_THRESHOLD, INITIAL_ALLOWED_SLIPPAGE } from '../../constants'
import { ButtonConfirmed, ButtonError, ButtonLight, ButtonPrimary } from '../../components/Button'
import Card, { GreyCard } from '../../components/Card'
import { ChainId, Currency, CurrencyAmount, JSBI, Token, Trade } from '@zeroexchange/sdk'
import {
  ChainTransferState,
  CrosschainChain,
  setCurrentToken,
  setTargetChain,
  setTransferAmount
} from '../../state/crosschain/actions'
import Column, { AutoColumn } from '../../components/Column'
import { Field, selectCurrency } from '../../state/swap/actions'
import { LinkStyledButton, TYPE } from '../../theme'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import { getTradeVersion, isTradeBetter } from '../../data/V1'
import styled, { ThemeContext } from 'styled-components'
import { GetTokenByAddress, useCrossChain, useCrosschainHooks, useCrosschainState } from '../../state/crosschain/hooks'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState
} from '../../state/swap/hooks'
import { useExpertModeManager, useUserSlippageTolerance } from '../../state/user/hooks'
import { useToggleSettingsMenu, useWalletModalToggle } from '../../state/application/hooks'
import useToggledVersion, { DEFAULT_VERSION, Version } from '../../hooks/useToggledVersion'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'

import AddressInputPanel from '../../components/AddressInputPanel'
import AdvancedSwapDetailsDropdown from '../../components/swap/AdvancedSwapDetailsDropdown'
import AppBody from '../AppBody'
import { AppDispatch } from '../../state'
import { ArrowDown } from 'react-feather'
import BlockchainSelector from '../../components/BlockchainSelector'
import ChainBridgeModal from '../../components/ChainBridgeModal'
import Circle from '../../assets/images/circle-grey.svg'
import { ClickableText } from '../Pool/styleds'
import ConfirmSwapModal from '../../components/swap/ConfirmSwapModal'
import ConfirmTransferModal from '../../components/ConfirmTransferModal'
import CrossChainModal from '../../components/CrossChainModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { CustomLightSpinner } from '../../theme/components'
import Loader from '../../components/Loader'
import ProgressSteps from '../../components/ProgressSteps'
import ReactGA from 'react-ga'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import SwapsTabs from '../../components/SwapsTabs'
import { Text } from 'rebass'
import TokenWarningModal from '../../components/TokenWarningModal'
import TradePrice from '../../components/swap/TradePrice'
import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { useDispatch } from 'react-redux'
import useENSAddress from '../../hooks/useENSAddress'
import { useSwapCallback } from '../../hooks/useSwapCallback'

const CHAIN_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: 'Ethereum',
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.FUJI]: 'Avalanche',
}

const SUPPORTED_CHAINS = [
  'Ethereum',
  'Avalanche',
  'Polkadot'
]

const ETH_RPCS = [
  'Ethereum',
  'Rinkeby',
]

const CrossChainLabels = styled.div`
  p {
    display: flex;
    text-align: left;
    font-weight: normal;
    color: rgba(255,255,255,.5);
    margin-top: .5rem;
    margin-bottom: 0;
    font-size: .9rem;
    span {
      margin-left: auto;
      font-weight: bold;
    }
  }
`
const ChainBridgePending = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  min-height: 40px;
  padding: .25rem 1rem .25rem 1rem;
  background: #40444F;
  border-radius: 30px;
  margin-top: 2rem;
  color: rgba(255,255,255,.75);
  border: 1px solid rgba(255,255,255,.1);
  transition: all .2s ease-in-out;
  &:hover {
    cursor: pointer;
    background: lighten(#40444F, 5%);
  }
  p {
    font-size: .9rem;
    font-weight: bold;
  }
`


export default function Swap() {
  useCrossChain()

  const loadedUrlParams = useDefaultsFromURLSearch()

  const {
    currentRecipient,
    currentTxID,
    availableChains,
    availableTokens,
    currentChain,
    currentToken,
    currentBalance,
    transferAmount,
    crosschainFee,
    targetChain,
    targetTokens,
    crosschainTransferStatus,
  } = useCrosschainState()

  const {BreakCrosschainSwap} = useCrosschainHooks()

  const dispatch = useDispatch<AppDispatch>()

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId)
  ]
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])

  const { account, chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  // for expert mode
  const toggleSettings = useToggleSettingsMenu()
  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const {
    v1Trade,
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError
  } = useDerivedSwapInfo()
  const { wrapType, execute: onWrap, inputError: wrapInputError } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  )
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const { address: recipientAddress } = useENSAddress(recipient)
  const toggledVersion = useToggledVersion()
  const tradesByVersion = {
    [Version.v1]: v1Trade,
    [Version.v2]: v2Trade
  }
  const trade = showWrap ? undefined : tradesByVersion[toggledVersion]
  const defaultTrade = showWrap ? undefined : tradesByVersion[DEFAULT_VERSION]

  const betterTradeLinkVersion: Version | undefined =
    toggledVersion === Version.v2 && isTradeBetter(v2Trade, v1Trade, BETTER_TRADE_LINK_THRESHOLD)
      ? Version.v1
      : toggledVersion === Version.v1 && isTradeBetter(v1Trade, v2Trade)
        ? Version.v2
        : undefined

  const parsedAmounts = showWrap
    ? {
      [Field.INPUT]: parsedAmount,
      [Field.OUTPUT]: parsedAmount
    }
    : {
      [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
      [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount
    }

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  // track the input amount, on change, if crosschain, dispatch
  const [ inputAmountToTrack, setInputAmountToTrack ] = useState('');
  const handleInputAmountChange = (amount: string) => {
    setInputAmountToTrack(amount)
    dispatch(setTransferAmount({
      amount: amount
    }))
  }

  const handleTypeInput = useCallback(
    (value: string) => {
      handleInputAmountChange(value)
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )
  const noRoute = !route

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient)

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then(hash => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: hash })

        ReactGA.event({
          category: 'Swap',
          action:
            recipient === null
              ? 'Swap w/o Send'
              : (recipientAddress ?? recipient) === account
                ? 'Swap w/o Send + recipient'
                : 'Swap w/ Send',
          label: [
            trade?.inputAmount?.currency?.symbol,
            trade?.outputAmount?.currency?.symbol,
            getTradeVersion(trade)
          ].join('/')
        })
      })
      .catch(error => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined
        })
      })
  }, [tradeToConfirm, account, priceImpactWithoutFee, recipient, recipientAddress, showConfirm, swapCallback, trade])

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn, showConfirm })
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash])

  const handleInputSelect = useCallback(
    inputCurrency => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
      const newToken = GetTokenByAddress(inputCurrency.address)
      dispatch(setCurrentToken({
        token: {
          name: newToken.name || '',
          address: newToken.address,
        }
      }))
    },
    [onCurrencySelection]
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      handleInputAmountChange(maxAmountInput.toExact())
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  // not sure we need this
  // const handleMaxInputCrosschain = useCallback(() => {
  //   return currentBalance
  // }, [currentBalance, onUserInput])

  const handleOutputSelect = useCallback(
    outputCurrency => {
      onCurrencySelection(Field.OUTPUT, outputCurrency)
    }, [
    onCurrencySelection
  ])

  // swaps or cross chain
  const [isCrossChain, setIsCrossChain] = useState<boolean>(false)
  const handleSetIsCrossChain = (bool: boolean) => {

    setIsCrossChain(bool);

    dispatch(setTransferAmount({
      amount: inputAmountToTrack
    }))

    // if cross chain, choose first available token
    if (bool === true) {
      const currencyId = availableTokens[0].address;
      dispatch(
        selectCurrency({
          field: Field.INPUT,
          currencyId
        })
      )
    } else { // if back to swaps, set to ETH as default
      dispatch(
        selectCurrency({
          field: Field.INPUT,
          currencyId: 'ETH'
        })
      )
    }
  }

  const [transferTo, setTransferTo] = useState<string>('');
  useEffect(() => {
    // change logic when we add polka
    if (chainId) {
      if (ETH_RPCS.indexOf((CHAIN_LABELS[chainId] || 'Ethereum')) !== -1) {
        setTransferTo('Avalanche')
      } else {
        setTransferTo('Ethereum')
      }
    }
  }, [chainId, currentChain])

  const startNewSwap = () => {
    setTokenTransferState(ChainTransferState.NotStarted)
    BreakCrosschainSwap()
  }

  const [showChainBridgeModal, setShowChainBridgeModal] = useState(false);
  const hideChainBridgeModal = () => {
    setShowChainBridgeModal(false)
  }

  // test - get this from chainbridge state
  const pendingChainBridgeTransfers = [
    { state: 'WaitingRelayers', symbol: 'wETH', amount: '1.348', decimals: 18, name: 'Ethereum', address: '0xF0939011a9bb95c3B791f0cb546377Ed2693a574' },
    { state: 'MintingToken', symbol: 'wETH', amount: '7.02', decimals: 18, name: 'Ethereum', address: '0xF0939011a9bb95c3B791f0cb546377Ed2693a574' },
    { state: 'TokenMinted', symbol: 'wETH', amount: '993.23', decimals: 18, name: 'Ethereum', address: '0xF0939011a9bb95c3B791f0cb546377Ed2693a574' },
    { state: 'Cancelled', symbol: 'wETH', amount: '443.21', decimals: 18, name: 'Ethereum', address: '0xF0939011a9bb95c3B791f0cb546377Ed2693a574' },
  ]

  const [crossChainModalOpen, setShowCrossChainModal] = useState(false);
  const hideCrossChainModal = () => {
    setShowCrossChainModal(false)
    startNewSwap()
  }
  const showCrossChainModal = () => {
    setShowCrossChainModal(true)
  }

  const [transferChainModalOpen, setShowTransferChainModal] = useState(false);
  const hideTransferChainModal = () => {
    setShowTransferChainModal(false)
    startNewSwap()
  }
  const showTransferChainModal = () => {
    setShowTransferChainModal(true)
  }
  const onSelectTransferChain = (chain: CrosschainChain) => {
    dispatch(setTargetChain({
      chain
    }))
  }

  const [confirmTransferModalOpen, setConfirmTransferModalOpen] = useState(false);
  const hideConfirmTransferModal = () => {
    setConfirmTransferModalOpen(false)
    startNewSwap()
  }
  const showConfirmTransferModal = () => {
    setConfirmTransferModalOpen(true)
  }

  // token transfer state
  const [ tokenTransferState, setTokenTransferState ] = useState(ChainTransferState.NotStarted);

  const onChangeTransferState = (state: ChainTransferState) => {
    setTokenTransferState(state);
    if (state === ChainTransferState.NotStarted && currentTxID.length) {
      BreakCrosschainSwap()
    }
  }
  // token transfer modals & handlers
  const handleTokenTransfer = () => {
    hideConfirmTransferModal();
  }

  const getChainName = (): string => {
    if (!!chainId && chainId in CHAIN_LABELS) {
      return CHAIN_LABELS[chainId] || ''
    }
    return ''
  }

  return (
    <>

      <TokenWarningModal
        isOpen={urlLoadedTokens.length > 0 && !dismissTokenWarning}
        tokens={urlLoadedTokens}
        onConfirm={handleConfirmTokenWarning}
      />

      <AppBody>
        <SwapPoolTabs active={'swap'} />
        <Wrapper id="swap-page">
          <CrossChainModal
            isOpen={crossChainModalOpen}
            onDismiss={hideCrossChainModal}
            supportedChains={availableChains}
            selectTransferChain={() => ''}
            activeChain={chainId ? CHAIN_LABELS[chainId] : 'Ethereum'}
          />
          <CrossChainModal
            isOpen={transferChainModalOpen}
            onDismiss={hideTransferChainModal}
            supportedChains={availableChains}
            isTransfer={true}
            selectTransferChain={onSelectTransferChain}
            activeChain={chainId ? CHAIN_LABELS[chainId] : 'Ethereum'}
          />
          <ConfirmTransferModal
            isOpen={confirmTransferModalOpen}
            onDismiss={hideConfirmTransferModal}
            transferTo={transferTo}
            activeChain={chainId ? CHAIN_LABELS[chainId] : 'Ethereum'}
            changeTransferState={onChangeTransferState}
            tokenTransferState={tokenTransferState}
            value={formattedAmounts[Field.INPUT]}
            currency={currencies[Field.INPUT]}
            trade={trade}
          />
          <ChainBridgeModal
            isOpen={showChainBridgeModal}
            onDismiss={hideChainBridgeModal}
            pendingTransfers={pendingChainBridgeTransfers}
          />
          <ConfirmSwapModal
            isOpen={showConfirm}
            trade={trade}
            originalTrade={tradeToConfirm}
            onAcceptChanges={handleAcceptChanges}
            attemptingTxn={attemptingTxn}
            txHash={txHash}
            recipient={recipient}
            allowedSlippage={allowedSlippage}
            onConfirm={handleSwap}
            swapErrorMessage={swapErrorMessage}
            onDismiss={handleConfirmDismiss}
          />

          <SwapsTabs isCrossChain={isCrossChain} onSetIsCrossChain={handleSetIsCrossChain} />
          <BlockchainSelector
            isCrossChain={isCrossChain}
            supportedChains={SUPPORTED_CHAINS}
            blockchain={chainId ? CHAIN_LABELS[chainId] : 'Ethereum'}
            transferTo={isCrossChain? targetChain : transferTo}
            onShowCrossChainModal={showCrossChainModal}
            onShowTransferChainModal={showTransferChainModal}
          />

          <AutoColumn gap={'md'}>
            <CurrencyInputPanel
              blockchain={isCrossChain ? currentChain.name : getChainName()}
              label={'From'}
              value={formattedAmounts[Field.INPUT]}
              showMaxButton={!atMaxAmountInput}
              currency={currencies[Field.INPUT]}
              onUserInput={handleTypeInput}
              onMax={handleMaxInput}
              onCurrencySelect={handleInputSelect}
              otherCurrency={currencies[Field.OUTPUT]}
              isCrossChain={isCrossChain}
              id="swap-currency-input"
            />
            <AutoColumn justify="space-between">
              <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '0 1rem' }}>
                <ArrowWrapper clickable>
                  <ArrowDown
                    size="24"
                    onClick={() => {
                      if (!isCrossChain) {
                        setApprovalSubmitted(false) // reset 2 step UI for approvals
                        onSwitchTokens()
                      }
                    }}
                    color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? theme.primary1 : theme.text2}
                  />
                </ArrowWrapper>
                {recipient === null && !showWrap && isExpertMode ? (
                  <LinkStyledButton id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                    + Add a send (optional)
                  </LinkStyledButton>
                ) : null}
              </AutoRow>
            </AutoColumn>
            <CurrencyInputPanel
              blockchain={isCrossChain ? currentChain.name : getChainName()}
              value={isCrossChain ? formattedAmounts[Field.INPUT] : formattedAmounts[Field.OUTPUT]}
              onUserInput={handleTypeOutput}
              label={'To'}
              showMaxButton={false}
              currency={isCrossChain ? currencies[Field.INPUT] : currencies[Field.OUTPUT]}
              onCurrencySelect={handleOutputSelect}
              otherCurrency={currencies[Field.INPUT]}
              isCrossChain={isCrossChain}
              disableCurrencySelect={isCrossChain ? true : false}
              hideBalance={isCrossChain}
              id="swap-currency-output"
            />

            {recipient !== null && !showWrap ? (
              <>
                <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                  <ArrowWrapper clickable={false}>
                    <ArrowDown size="16" color={theme.text2} />
                  </ArrowWrapper>
                  <LinkStyledButton id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                    - Remove send
                  </LinkStyledButton>
                </AutoRow>
                <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
              </>
            ) : null}

            {
              isCrossChain && <>
                <CrossChainLabels>
                  <p>Fee: <span>{crosschainFee} {currentChain?.symbol}</span></p>
                </CrossChainLabels>
              </>
            }

            {showWrap ? null : (
              <Card padding={'.25rem .75rem 0 .75rem'} borderRadius={'20px'}>
                { !isCrossChain &&
                  <AutoColumn gap="4px">
                    {Boolean(trade) && (
                      <RowBetween align="center">
                        <Text fontWeight={500} fontSize={14} color={theme.text2}>
                          Price
                      </Text>
                        <TradePrice
                          price={trade?.executionPrice}
                          showInverted={showInverted}
                          setShowInverted={setShowInverted}
                        />
                      </RowBetween>
                    )}
                    {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
                      <RowBetween align="center">
                        <ClickableText fontWeight={500} fontSize={14} color={theme.text2} onClick={toggleSettings}>
                          Slippage Tolerance
                      </ClickableText>
                        <ClickableText fontWeight={500} fontSize={14} color={theme.text2} onClick={toggleSettings}>
                          {allowedSlippage / 100}%
                      </ClickableText>
                      </RowBetween>
                    )}
                  </AutoColumn>
                }
              </Card>
            )}
          </AutoColumn>
          <BottomGrouping>
            {isCrossChain && transferAmount.length && transferAmount !== '0' ? (
              <>
                <ButtonPrimary onClick={showConfirmTransferModal}>
                  Transfer {currencies[Field.INPUT]?.symbol} Tokens to {transferTo}
                </ButtonPrimary>
              </>
            ) : !account ? (
              <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
            ) : showWrap ? (
              <ButtonPrimary disabled={Boolean(wrapInputError)} onClick={onWrap}>
                {wrapInputError ??
                  (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
              </ButtonPrimary>
            ) : noRoute && userHasSpecifiedInputOutput ? (
              <GreyCard style={{ textAlign: 'center' }}>
                <TYPE.main mb="4px">Insufficient liquidity for this trade.</TYPE.main>
              </GreyCard>
            ) : showApproveFlow ? (
              <RowBetween>
                <ButtonConfirmed
                  onClick={approveCallback}
                  disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                  width="48%"
                  altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
                  confirmed={approval === ApprovalState.APPROVED}
                >
                  {approval === ApprovalState.PENDING ? (
                    <AutoRow gap="6px" justify="center">
                      Approving <Loader stroke="white" />
                    </AutoRow>
                  ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                    'Approved'
                  ) : (
                        'Approve ' + currencies[Field.INPUT]?.symbol
                      )}
                </ButtonConfirmed>
                <ButtonError
                  onClick={() => {
                    if (isExpertMode) {
                      handleSwap()
                    } else {
                      setSwapState({
                        tradeToConfirm: trade,
                        attemptingTxn: false,
                        swapErrorMessage: undefined,
                        showConfirm: true,
                        txHash: undefined
                      })
                    }
                  }}
                  width="48%"
                  id="swap-button"
                  disabled={
                    !isValid || approval !== ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode)
                  }
                  error={isValid && priceImpactSeverity > 2}
                >
                  <Text fontSize={16} fontWeight={500}>
                    {priceImpactSeverity > 3 && !isExpertMode
                      ? `Price Impact High`
                      : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
                  </Text>
                </ButtonError>
              </RowBetween>
            ) : (
                        <ButtonError
                          onClick={() => {
                            if (isExpertMode) {
                              handleSwap()
                            } else {
                              setSwapState({
                                tradeToConfirm: trade,
                                attemptingTxn: false,
                                swapErrorMessage: undefined,
                                showConfirm: true,
                                txHash: undefined
                              })
                            }
                          }}
                          id="swap-button"
                          disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                          error={isValid && priceImpactSeverity > 2 && !swapCallbackError}
                        >
                          <Text fontSize={20} fontWeight={500}>
                            {swapInputError
                              ? swapInputError
                              : priceImpactSeverity > 3 && !isExpertMode
                                ? `Price Impact Too High`
                                : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
                          </Text>
                        </ButtonError>
                      )}
            {showApproveFlow && (
              <Column style={{ marginTop: '1rem' }}>
                <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
              </Column>
            )}
            {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
          </BottomGrouping>
        </Wrapper>
      </AppBody>

      <ChainBridgePending onClick={() => setShowChainBridgeModal(true)}>
        <p>
          {`You have ${pendingChainBridgeTransfers?.length} cross-chain transfers`}
        </p>
        <CustomLightSpinner src={Circle} alt="loader" size={'20px'} style={{ marginLeft: '10px'}} />
      </ChainBridgePending>

      { !isCrossChain && <AdvancedSwapDetailsDropdown trade={trade} />}

    </>
  )
}
