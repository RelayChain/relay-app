import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import { ArrowWrapper, BottomGrouping, SwapCallbackError, Wrapper } from '../../components/swap/styleds'
import { AutoRow, RowBetween } from '../../components/Row'
import { ButtonConfirmed, ButtonError, ButtonLight, ButtonPrimary } from '../../components/Button'
import { CHAIN_LABELS, NATIVE_CURRENCY } from '../../constants'
import Card, { GreyCard } from '../../components/Card'
import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, Trade } from '@zeroexchange/sdk'
import Column, { AutoColumn } from '../../components/Column'
import { GetTokenByAddress, useCrossChain, useCrosschainHooks, useCrosschainState } from '../../state/crosschain/hooks'
import { LinkStyledButton, TYPE, Title } from '../../theme'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { STAKING_REWARDS_INFO, useStakingInfo } from '../../state/stake/hooks'
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
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'

import AddressInputPanel from '../../components/AddressInputPanel'
import AdvancedSwapDetailsDropdown from '../../components/swap/AdvancedSwapDetailsDropdown'
import { AppDispatch } from '../../state'
import { ArrowDown } from 'react-feather'
import BalanceItem from '../../components/BalanceItem'
import BubbleBase from '../../components/BubbleBase'
import Circle from '../../assets/images/circle-grey.svg'
import Circle2 from '../../assets/images/circle.svg'
import { ClickableText } from '../Legacy_Pool/styleds'
import ConfirmSwapModal from '../../components/swap/ConfirmSwapModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { ArrowDown as CustomArrowDown } from '../../components/Arrows'
import { CustomLightSpinner } from '../../theme/components'
import { Field } from '../../state/swap/actions'
import { INITIAL_ALLOWED_SLIPPAGE } from '../../constants'
import Icon from '../../components/Icon'
import Loader from '../../components/Loader'
import PageContainer from './../../components/PageContainer'
import ProgressSteps from '../../components/ProgressSteps'
import { ProposalStatus } from '../../state/crosschain/actions'
import { RouteComponentProps } from 'react-router-dom'
import Settings from '../../components/Settings'
import { Text } from 'rebass'
import TokenWarningModal from '../../components/TokenWarningModal'
import TradePrice from '../../components/swap/TradePrice'
import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { setCurrentToken } from '../../state/crosschain/actions'
import { setTokenBalances } from '../../state/user/actions'
import { toCheckSumAddress } from '../../state/crosschain/hooks'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { useDispatch } from 'react-redux'
import useENSAddress from '../../hooks/useENSAddress'
import { useETHBalances } from '../../state/wallet/hooks'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import { useUserAddedTokens } from '../../state/user/hooks'
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

const SwapOuterWrap = styled.div`
  width: 100%;
  ${({ theme }) => theme.mediaWidth.upToSmall`
padding: 0;
`};
`

const SubTitle = styled.h2`
  font-size: 32px;
`
const SwapFlexRow = styled.div`
  flex: 1;
  width: 100%;
`
const SwapWrap = styled.div`
  font-family: Poppins;
  position: relative;
  width: 620px;
  max-width: 100%;
  padding: 28px 34px;
  min-height: 570px;
  background: rgba(47, 53, 115, 0.32);
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.095);
  backdrop-filter: blur(28px);
  border-radius: 44px;
  margin-right: 2rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-top: 20px
    margin-right: auto;
    margin-left: auto;
  `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin-top: 10px
  width: 100%;
  `};
  position: sticky;
  top: 4rem;
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
  margin-bottom: 1rem;
  text-align: center;
  margin-bottom: -4px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size: 24px;
`};
`
const BalanceRow = styled.div<{ isColumn?: boolean }>`
  flex: 1;
  width: 100%;
  display: ${({ isColumn }) => (isColumn ? 'flex' : 'block')};
  flex-direction: ${({ isColumn }) => (isColumn ? 'column' : 'row')};
  align-items: ${({ isColumn }) => (isColumn ? 'center' : '')};
  min-width: 300px;
  max-height: 570px;
  border-radius: 44px;
  overflow-y: scroll;
  padding-right: 1rem;
  padding-left: 1rem;
  #style-7::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
  }

  &::-webkit-scrollbar {
    width: 10px;
    background-color: rgba(0, 0, 0, 0.5);
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-image: -webkit-gradient(
      linear,
      left bottom,
      left top,
      color-stop(0.44, rgb(41, 32, 98)),
      color-stop(0.72, rgb(51, 40, 123)),
      color-stop(0.86, rgb(61, 49, 148))
    );
  }
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

const Flex = styled(RowBetween)`
  align-items: center;
  margin-top: 1rem;
`
const IconWrap = styled.div`
  margin-left: 1.5rem;
  margin-top: 8px;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`

export default function Swap({
  ...props
}: RouteComponentProps<{ currencyIdA: string; currencyIdB: string }>) {
  useCrossChain()

  const loadedUrlParams = useDefaultsFromURLSearch()

  const {
    currentTxID,
    availableChains: allChains,
    availableTokens,
    currentChain,
    currentToken,
    crosschainFee,
    targetTokens,
    crosschainTransferStatus,
    swapDetails
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
  const userEthBalance = useETHBalances(account ? [account] : [], chainId)?.[account ?? '']

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

  const handleTypeInput = useCallback(
    (value: string) => {
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
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(
    outputCurrency => {
      onCurrencySelection(Field.OUTPUT, outputCurrency)
    },
    [onCurrencySelection]
  )

  // for navigating from pools Manage page via trade button
  const propsState: any = props?.location?.state
  const token0: any = propsState?.token0 ? propsState?.token0 : null
  const token1: any = propsState?.token1 ? propsState?.token1 : null
  const curA = useCurrency(token0);
  const curB = useCurrency(token1);

  useEffect(() => {
    if (token0 && token1) {
      handleInputSelect(curA)
      handleOutputSelect(curB)
    }
  }, [token0, token1, curA, curB])


  // swaps or cross chain
  const [isCrossChain, setIsCrossChain] = useState<boolean>(false)

  const getChainName = (): string => {
    if (!!chainId && chainId in CHAIN_LABELS) {
      return CHAIN_LABELS[chainId] || ''
    }
    return ''
  }

  const nativeCurrency = NATIVE_CURRENCY[chainId ? chainId : ChainId.MAINNET]
  const onSelectBalance = (isNative: boolean, token?: any) => {
    // clear inputs before changing tokens
    onUserInput(Field.INPUT, '')
    onUserInput(Field.OUTPUT, '')
    if (!currencies[Field.INPUT]) {
      handleInputSelect(isNative ? nativeCurrency : token)
    } else if (!currencies[Field.OUTPUT]) {
      handleOutputSelect(isNative ? nativeCurrency : token)
    } else {
      handleInputSelect(isNative ? nativeCurrency : token)
    }
  }
  
  const [stakedTokens, setStakedTokens] = useState<Token[]>([])
  const stakingInfos = useStakingInfo()

  const handleStakedTokens = useCallback(() => {
    const stakedPools = stakingInfos.filter(
      item => parseFloat(item?.earnedAmount?.toFixed(Math.min(6, item?.earnedAmount?.currency.decimals))) > 0
    )
    // use set to avoid duplicates
    // reset array to [] each time
    const arr: any = new Set()
    for (let st of stakedPools) {
      arr.add(st?.tokens[0])
      arr.add(st?.tokens[1])
    }
    setStakedTokens([...arr])
  }, [stakingInfos])

  useEffect(() => {
    if (stakingInfos?.length > 0) {
      handleStakedTokens()
    }
  }, [stakingInfos])

  const userTokens = useUserAddedTokens()
    ?.filter((x: any) => x.chainId === chainId)
    ?.map((x: any) => {
      return new Token(x.chainId, x.address, x.decimals, x.symbol, x.name)
    })

  const tokenBalances = useMemo(() => {
    const arr = availableTokens
      .map((x: any) => {
        const address = toCheckSumAddress(x?.address)
        const tokenData = { ...x, address }
        return new Token(
          tokenData?.chainId,
          tokenData?.address,
          tokenData?.decimals,
          tokenData?.symbol,
          tokenData?.name
        )
      })
      .concat(userTokens)
    return [...new Set(arr)]
  }, [availableTokens, userTokens])

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
                  <Header>
                    <SubTitle>Swap</SubTitle>
                    <Settings />
                  </Header>
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
                      {!account ? (
                        <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
                      ) : !(formattedAmounts[Field.INPUT] || formattedAmounts[Field.OUTPUT]) ? (
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
                {!isCrossChain && +formattedAmounts[Field.INPUT] > 0 && +formattedAmounts[Field.OUTPUT] > 0 && (
                  <AdvancedSwapDetailsDropdown trade={trade} chainId={chainId} />
                )}
              </SwapWrap>
            </SwapFlexRow>
            {account && userEthBalance && tokenBalances && (
              <BalanceRow isColumn={isColumn}>
                <TextBalance>{currentChain.name} Balances</TextBalance>
                <BalanceItem
                  currentChain={currentChain}
                  chainId={chainId}
                  isNative={true}
                  userEthBalance={userEthBalance}
                  selectBalance={() => onSelectBalance(true, currentChain)}
                ></BalanceItem>
                {tokenBalances?.map((token: any, index) => {
                  return (
                    <BalanceItem
                      key={index}
                      token={token}
                      chainId={chainId}
                      account={account}
                      selectBalance={() => onSelectBalance(false, token)}
                      isLast={index === tokenBalances.length - 1}
                    ></BalanceItem>
                  )
                })}
                {stakedTokens
                  ?.filter((x: any) => x.chainId === chainId)
                  .map((token: any, index: any) => {
                    return (
                      <BalanceItem
                        key={index}
                        token={token}
                        chainId={chainId}
                        account={account}
                        isStaked={true}
                        tokenBalances={tokenBalances.map(item => item?.address)}
                        selectBalance={() => onSelectBalance(false, token)}
                        isLast={index === stakedTokens.length - 1}
                        isFirst={index === 0 && tokenBalances?.length === 0}
                      ></BalanceItem>
                    )
                  })}
              </BalanceRow>
            )}
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
        </SwapOuterWrap>
      </PageContainer>
    </>
  )
}
