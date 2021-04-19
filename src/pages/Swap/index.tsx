import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import { ArrowWrapper, BottomGrouping, SwapCallbackError, Wrapper } from '../../components/swap/styleds'
import { AutoRow, RowBetween } from '../../components/Row'
import { ButtonConfirmed, ButtonError, ButtonLight, ButtonPrimary } from '../../components/Button'
import { CHAIN_LABELS, ETH_RPCS, SUPPORTED_CHAINS } from '../../constants'
import Card, { GreyCard } from '../../components/Card'
import { ChainId, CurrencyAmount, JSBI, Token, Trade } from '@zeroexchange/sdk'
import {
  ChainTransferState,
  CrosschainChain,
  setCrosschainLastTimeSwitched,
  setCrosschainTransferStatus,
  setCurrentToken,
  setTargetChain,
  setTransferAmount
} from '../../state/crosschain/actions'
import Column, { AutoColumn } from '../../components/Column'
import { Field, selectCurrency } from '../../state/swap/actions'
import { GetTokenByAddress, useCrossChain, useCrosschainHooks, useCrosschainState } from '../../state/crosschain/hooks'
import { LinkStyledButton, TYPE } from '../../theme'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import styled, { ThemeContext } from 'styled-components'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState
} from '../../state/swap/hooks'
import { useExpertModeManager, useUserSlippageTolerance } from '../../state/user/hooks'
import { useToggleSettingsMenu, useWalletModalToggle } from '../../state/application/hooks'
import useToggledVersion, { Version } from '../../hooks/useToggledVersion'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'

import AddressInputPanel from '../../components/AddressInputPanel'
import AdvancedSwapDetailsDropdown from '../../components/swap/AdvancedSwapDetailsDropdown'
import AppBody from '../AppBody'
import { AppDispatch } from '../../state'
import { ArrowDown } from 'react-feather'
import BlockchainSelector from '../../components/BlockchainSelector'
import BubbleBase from '../../components/BubbleBase'
import ChainBridgeModal from '../../components/ChainBridgeModal'
import Circle from '../../assets/images/circle-grey.svg'
import Circle2 from '../../assets/images/circle.svg'
import { ClickableText } from '../Legacy_Pool/styleds'
import ConfirmSwapModal from '../../components/swap/ConfirmSwapModal'
import ConfirmTransferModal from '../../components/ConfirmTransferModal'
import CrossChainModal from '../../components/CrossChainModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import CustomArrowDown from '../../components/ArrowDown'
import { CustomLightSpinner } from '../../theme/components'
import EthereumLogo from '../../assets/images/ethereum-logo.png'
import { INITIAL_ALLOWED_SLIPPAGE } from '../../constants'
import Icon from '../../components/Icon'
import Loader from '../../components/Loader'
import PageContainer from './../../components/PageContainer'
import PlainPopup from 'components/Popups/PlainPopup'
import { PopupContent } from 'state/application/actions'
import ProgressSteps from '../../components/ProgressSteps'
import { ProposalStatus } from '../../state/crosschain/actions'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import SwapsTabs from '../../components/SwapsTabs'
import { Text } from 'rebass'
import TokenWarningModal from '../../components/TokenWarningModal'
import TradePrice from '../../components/swap/TradePrice'
import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee'
import { getTradeVersion } from '../../data/V1'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import toEllipsis from '../../utils/toEllipsis'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { useDispatch } from 'react-redux'
import useENSAddress from '../../hooks/useENSAddress'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import useWindowDimensions from './../../hooks/useWindowDimensions'

const CrossChainLabels = styled.div`
  p {
    display: flex;
    text-align: left;
    font-weight: normal;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 0.5rem;
    margin-bottom: 0;
    font-size: 0.9rem;
    span {
      margin-left: auto;
      font-weight: bold;
    }
  }
`
const StyledEthereumLogo = styled.img`
  width: 48px;
  height: 48px;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const SwapOuterWrap = styled.div`
  width: 100%;
  ${({ theme }) => theme.mediaWidth.upToSmall`
padding: 0;
`};
`
const Title = styled.h1`
  width: 100%;
  padding: 0px 64px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding: 0;
  text-align: center;
  font-size: 49px;
  margin-top: 40px;
  margin-bottom: 0px;
`};
`
const SubTitle = styled.h2`
  font-size: 32px;
  margin-bottom: 45px;
`
const SwapFlexRow = styled.div`
  flex: 1;
  width: 100%;
`
const SwapWrap = styled.div`
  font-family: Poppins;
  position: relative;
  width: 534px;
  padding: 48px 34px 44px;
  margin-left: auto;
  margin-right: auto;
  min-height: 587px;
  background: rgba(47, 53, 115, 0.32);
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.095);
  backdrop-filter: blur(28px);
  border-radius: 44px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  margin-top: 20px
`};
  ${({ theme }) => theme.mediaWidth.upToSmall`
width: 100%;
`};
`
const SwapFlex = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
  gap: 1rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  flex-direction: column;
  align-items: center;
`};
`
const TextBalance = styled.h3`
  font-size: 32px;
  white-space: nowrap;
  margin-bottom: 40px;
`
const BalanceRow = styled.div<{ isColumn?: boolean }>`
  flex: 1;
  width: 100%;
  display: ${({ isColumn }) => (isColumn ? 'flex' : 'block')};
  flex-direction: ${({ isColumn }) => (isColumn ? 'column' : 'row')};
  align-items: ${({ isColumn }) => (isColumn ? 'center' : '')};
`
const ChainBridgePending = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  min-height: 40px;
  padding: 0.25rem 1rem 0.25rem 1rem;
  border-radius: 12px;
  margin-top: 2rem;
  color: rgba(255, 255, 255, 0.75);
  transition: all 0.2s ease-in-out;
  background: linear-gradient(45deg, #5496ff, #8739e5);
  position: fixed;
  top: 68px;
  right: 1rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    position: relative;
    top: auto; right: auto;
  `};
  &:hover {
    cursor: pointer;
    filter: brightness(1.2);
  }
  p {
    font-size: 0.9rem;
    font-weight: bold;
  }
`
const BottomGroupingSwap = styled(BottomGrouping)`
  padding: 14px, 30px, 14px, 30px;
  width: 100%;
  cursor: pointer;
  margin-top: 0;
  ${({ theme }) => theme.mediaWidth.upToSmall`

margin-top: 20px;
`};
`
const SwapText = styled.h3`
  font-size: 17px;
  color: #a7b1f4;
  opacity: 0.88;
`
const Flex = styled(RowBetween)`
  align-items: center;
  margin-top: 1rem;
`
const IconWrap = styled.div`
  margin-left: 1.5rem;
  margin-top: 8px;
`
const BalanceCard = styled.div`
  margin-bottom: 20px;
  position: relative;
  height: 118px;
  width: 500px;
  background: rgba(47, 53, 115, 0.32);
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.095);
  backdrop-filter: blur(28px);
  border-radius: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 34px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  width: 100%;
  `};
`
const Box = styled.div`
  margin-left: 24px;
`

const CrossChain = styled.div`
  font-weight: 600;
  font-size: 13px;

  span {
    margin-left: 10px;
    color: #929ad6;
    opacity: 0.8;
  }
`
const AdressWallet = styled.div`
  font-size: 17px;
  color: #b97cd6;
  opacity: 0.88;
`
const BoxFlex = styled.div`
  display: flex;
`
const CopyImage = styled.div`
  cursor: pointer;
`
export default function Swap() {
  useCrossChain()

  const loadedUrlParams = useDefaultsFromURLSearch()

  const {
    currentTxID,
    availableChains: allChains,
    availableTokens,
    currentChain,
    currentToken,
    transferAmount,
    crosschainFee,
    targetChain,
    targetTokens,
    crosschainTransferStatus,
    swapDetails,
    lastTimeSwitched
  } = useCrosschainState()

  const { width } = useWindowDimensions()

  let isColumn = false
  if (width < 1350) {
    isColumn = true
  }

  const currentTargetToken = targetTokens.find(x => x.assetBase === currentToken.assetBase)

  const { BreakCrosschainSwap, GetAllowance } = useCrosschainHooks()

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

  const availableChains = useMemo(() => {
    return allChains.filter(i => i.name !== (chainId ? CHAIN_LABELS[chainId] : 'Ethereum'))
  }, [allChains])

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
  const { v2Trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo()

  const { wrapType, execute: onWrap, inputError: wrapInputError } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  )

  // const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const { address: recipientAddress } = useENSAddress(recipient)
  // const toggledVersion = useToggledVersion()
  // const tradesByVersion = {
  //   [Version.v1]: v1Trade,
  //   [Version.v2]: v2Trade
  // }
  const trade = showWrap ? undefined : v2Trade

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
  const [inputAmountToTrack, setInputAmountToTrack] = useState('')
  const handleInputAmountChange = useCallback(
    (amount: string) => {
      setInputAmountToTrack(amount)
      dispatch(
        setTransferAmount({
          amount: amount
        })
      )
    },
    [setInputAmountToTrack, dispatch]
  )

  const handleTypeInput = useCallback(
    (value: string) => {
      handleInputAmountChange(value)
      onUserInput(Field.INPUT, value)
    },
    [onUserInput, handleInputAmountChange]
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

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade, chainId)

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
      if (inputCurrency?.address) {
        const newToken = GetTokenByAddress(inputCurrency.address)
        dispatch(
          setCurrentToken({
            token: {
              name: newToken?.name || '',
              address: newToken?.address || '',
              assetBase: newToken?.assetBase || '',
              symbol: newToken?.symbol || '',
              decimals: newToken?.decimals || 18
            }
          })
        )
      }
    },
    [onCurrencySelection, dispatch]
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      handleInputAmountChange(maxAmountInput.toExact())
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput, handleInputAmountChange])

  // not sure we need this
  // const handleMaxInputCrosschain = useCallback(() => {
  //   return currentBalance
  // }, [currentBalance, onUserInput])

  const handleOutputSelect = useCallback(
    outputCurrency => {
      onCurrencySelection(Field.OUTPUT, outputCurrency)
    },
    [onCurrencySelection]
  )

  // swaps or cross chain
  const [isCrossChain, setIsCrossChain] = useState<boolean>(false)
  const handleSetIsCrossChain = (bool: boolean) => {
    setIsCrossChain(bool)

    dispatch(
      setTransferAmount({
        amount: inputAmountToTrack
      })
    )
  }

  const [transferTo, setTransferTo] = useState<string>('')
  useEffect(() => {
    // change logic when we add polka
    if (chainId) {
      if (ETH_RPCS.indexOf(CHAIN_LABELS[chainId] || 'Ethereum') !== -1) {
        setTransferTo('Avalanche')
      } else {
        setTransferTo('Ethereum')
      }
    }
  }, [chainId, currentChain])

  const startNewSwap = () => {
    BreakCrosschainSwap()
  }

  const [showChainBridgeModal, setShowChainBridgeModal] = useState(false)
  const hideChainBridgeModal = () => {
    if (swapDetails?.status === ProposalStatus.EXECUTED || swapDetails?.status === ProposalStatus.CANCELLED) {
      startNewSwap()
    }
    setShowChainBridgeModal(false)
  }

  const [transferChainModalOpen, setShowTransferChainModal] = useState(false)
  const hideTransferChainModal = () => {
    setShowTransferChainModal(false)
    // startNewSwap()
  }
  const showTransferChainModal = () => {
    setShowTransferChainModal(true)
  }
  const onSelectTransferChain = (chain: CrosschainChain) => {
    dispatch(
      setTargetChain({
        chain
      })
    )
  }

  const [confirmTransferModalOpen, setConfirmTransferModalOpen] = useState(false)
  const hideConfirmTransferModal = () => {
    startNewSwap()
    setConfirmTransferModalOpen(false)
  }
  const showConfirmTransferModal = () => {
    GetAllowance()
    setConfirmTransferModalOpen(true)
  }

  // token transfer state
  const onChangeTransferState = (state: ChainTransferState) => {
    dispatch(
      setCrosschainTransferStatus({
        status: state
      })
    )
    if (state === ChainTransferState.NotStarted && currentTxID.length) {
      BreakCrosschainSwap()
    }
  }

  const getChainName = (): string => {
    if (!!chainId && chainId in CHAIN_LABELS) {
      return CHAIN_LABELS[chainId] || ''
    }
    return ''
  }

  const handleChainBridgeButtonClick = () => {
    if (crosschainTransferStatus === ChainTransferState.TransferComplete) {
      setShowChainBridgeModal(true)
    } else {
      showConfirmTransferModal()
    }
  }

  return (
    <>
      <Title>Trade</Title>
      <PageContainer>
        <SwapOuterWrap>
          <TokenWarningModal
            isOpen={urlLoadedTokens.length > 0 && !dismissTokenWarning}
            tokens={urlLoadedTokens}
            onConfirm={handleConfirmTokenWarning}
          />

          <SwapFlex>
            <SwapFlexRow>
              <SwapWrap>
                <BubbleBase />

                <Wrapper id="swap-page">
                  <ConfirmTransferModal
                    isOpen={confirmTransferModalOpen}
                    onDismiss={hideConfirmTransferModal}
                    transferTo={transferTo}
                    activeChain={chainId ? CHAIN_LABELS[chainId] : 'Ethereum'}
                    changeTransferState={onChangeTransferState}
                    tokenTransferState={crosschainTransferStatus}
                    value={formattedAmounts[Field.INPUT]}
                    currency={currencies[Field.INPUT]}
                    trade={trade}
                  />
                  <ChainBridgeModal isOpen={showChainBridgeModal} onDismiss={hideChainBridgeModal} />
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
                    chainId={chainId}
                  />
                  <SubTitle>Swap</SubTitle>
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
                        <ArrowWrapper
                          clickable
                          onClick={() => {
                            if (!isCrossChain) {
                              setApprovalSubmitted(false) // reset 2 step UI for approvals
                              onSwitchTokens()
                            }
                          }}
                        >
                          <CustomArrowDown
                            conditionInput={currencies[Field.INPUT]}
                            conditionOutput={currencies[Field.OUTPUT]}
                            defaultColor={theme.primary1}
                            activeColor={theme.text2}
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
                      disableCurrencySelect={isCrossChain}
                      hideBalance={isCrossChain}
                      currentTargetToken={currentTargetToken}
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

                    {isCrossChain && (
                      <>
                        <CrossChainLabels>
                          <p>
                            Fee:{' '}
                            <span>
                              {crosschainFee} {currentChain?.symbol}
                            </span>
                          </p>
                        </CrossChainLabels>
                      </>
                    )}

                    {showWrap ? null : (
                      <Card padding={'.25rem .75rem 0 .75rem'} borderRadius={'20px'}>
                        {!isCrossChain && (
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
                                <ClickableText
                                  fontWeight={500}
                                  fontSize={14}
                                  color={theme.text2}
                                  onClick={toggleSettings}
                                >
                                  Slippage Tolerance
                                </ClickableText>
                                <ClickableText
                                  fontWeight={500}
                                  fontSize={14}
                                  color={theme.text2}
                                  onClick={toggleSettings}
                                >
                                  {allowedSlippage / 100}%
                                </ClickableText>
                              </RowBetween>
                            )}
                          </AutoColumn>
                        )}
                      </Card>
                    )}
                  </AutoColumn>
                  <Flex>
                    <BottomGroupingSwap>
                      { !account ? (
                        <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
                      ) : !trade ? (
                        <GreyCard
                          style={{
                            textAlign: 'center',
                            minWidth: '230px',
                            borderRadius: '100px',
                            height: '58px',
                            paddingTop: 0,
                            paddingBottom: 0
                          }}
                        >
                          <TYPE.main mb="4px" style={{ lineHeight: '58px' }}>
                            Enter A Trade
                          </TYPE.main>
                        </GreyCard>
                      ): showWrap ? (
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
                              !isValid ||
                              approval !== ApprovalState.APPROVED ||
                              (priceImpactSeverity > 3 && !isExpertMode)
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
                          isPointer
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
                          <Text fontSize={18} fontWeight={600}>
                            {swapInputError
                              ? swapInputError
                              : priceImpactSeverity > 3 && !isExpertMode
                              ? `Price Impact Too High`
                              : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
                          </Text>
                          <IconWrap>
                            <Icon icon="swap" color="white" />
                          </IconWrap>
                        </ButtonError>
                      )}
                      {showApproveFlow && (
                        <Column style={{ marginTop: '1rem' }}>
                          <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
                        </Column>
                      )}
                      {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
                    </BottomGroupingSwap>
                  </Flex>
                </Wrapper>
              </SwapWrap>
            </SwapFlexRow>
            <BalanceRow isColumn={isColumn}>
              <TextBalance>Your Balances</TextBalance>
              <BalanceCard>
                <BubbleBase />
                <BoxFlex>
                  <StyledEthereumLogo src={EthereumLogo} />
                  <Box>
                    <CrossChain>
                      ETH
                      <span>Ether</span>
                    </CrossChain>
                    <AdressWallet>30.662</AdressWallet>
                  </Box>
                </BoxFlex>
                <CopyImage>
                  <Icon icon="copyClipboard" />
                </CopyImage>
              </BalanceCard>
            </BalanceRow>
          </SwapFlex>
          {(chainId === undefined || account === undefined) && (
            <CustomLightSpinner
              src={Circle2}
              alt="loader"
              size={'60px'}
              style={{
                position: 'fixed',
                left: '0',
                right: '0',
                margin: 'auto',
                top: '45%'
              }}
            />
          )}
          {crosschainTransferStatus !== ChainTransferState.NotStarted ? (
            <ChainBridgePending onClick={handleChainBridgeButtonClick}>
              <p>{`Cross-chain transfer pending`}</p>
              <CustomLightSpinner src={Circle} alt="loader" size={'20px'} style={{ marginLeft: '10px' }} />
            </ChainBridgePending>
          ) : (
            ''
          )}

          {/* {!isCrossChain && <AdvancedSwapDetailsDropdown trade={trade} chainId={chainId} />} */}
        </SwapOuterWrap>
      </PageContainer>
    </>
  )
}
