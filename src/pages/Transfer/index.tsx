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
import { AppDispatch } from '../../state'
import { ArrowDown } from 'react-feather'
import BlockchainSelector from '../../components/BlockchainSelector'
import BubbleBase from '../../components/BubbleBase'
import ChainBridgeModal from '../../components/ChainBridgeModal'
import Circle from '../../assets/images/circle-grey.svg'
import Circle2 from '../../assets/images/circle.svg'
import { ClickableText } from '../Legacy_Pool/styleds'
import ConfirmTransferModal from '../../components/ConfirmTransferModal'
import CrossChainModal from '../../components/CrossChainModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { CustomLightSpinner } from '../../theme/components'
import { INITIAL_ALLOWED_SLIPPAGE } from '../../constants'
import Loader from '../../components/Loader'
import PageContainer from './../../components/PageContainer'
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
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { useDispatch } from 'react-redux'
import useENSAddress from '../../hooks/useENSAddress'
import { useSwapCallback } from '../../hooks/useSwapCallback'

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

const Heading = styled.h2`
  text-align: center;
  font-size: 32px;
`

const Description = styled.p`
  text-align: center;
  margin-top: 0.25rem;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.1em;
`

const Title = styled.h1`
  padding: 0 64px;
  width: 100%;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding: 0;
  text-align: center;
  font-size: 49px;
  margin-top: 40px;
  margin-bottom: 0px;
`};
`
const TransferBodyWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  position: relative;
  padding: 2rem;
  margin-left: auto;
  margin-right: auto;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin-bottom: 50px;
`};
`
const RowBetweenTransfer = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
  align-items: center;
  position: relative;
  top: -10px;
`};
`
const BottomGroupingTransfer = styled(BottomGrouping)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
width: 100%;
`};
`

export default function Transfer() {
  useCrossChain()

  const loadedUrlParams = useDefaultsFromURLSearch()

  const {
    currentTxID,
    availableChains: allChains,
    currentChain,
    currentToken,
    transferAmount,
    crosschainFee,
    targetChain,
    targetTokens,
    crosschainTransferStatus,
    swapDetails
  } = useCrosschainState()

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

  // swap state
  const { independentField, typedValue } = useSwapState()
  const { v2Trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo()

  const trade = v2Trade

  const parsedAmounts = {
    [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount
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

  const formattedAmounts = {
    [independentField]: typedValue
  }

  const route = trade?.route

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  const handleInputSelect = useCallback(
    inputCurrency => {
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

  // swaps or cross chain
  const [isCrossChain, setIsCrossChain] = useState<boolean>(true)
  const handleSetIsCrossChain = (bool: boolean) => {
    setIsCrossChain(bool)

    dispatch(
      setTransferAmount({
        amount: inputAmountToTrack
      })
    )
  }

  useEffect(() => {
    // change logic when we add polka
    if (chainId) {
      const label = SUPPORTED_CHAINS.find(x => x !== CHAIN_LABELS[chainId]) || 'Ethereum'
      onSelectTransferChain({
        name: label,
        chainID: chainId.toString()
      })
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

  const [crossChainModalOpen, setShowCrossChainModal] = useState(false)
  const hideCrossChainModal = () => {
    setShowCrossChainModal(false)
    // startNewSwap()
  }
  const showCrossChainModal = () => {
    setShowCrossChainModal(true)
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

  console.log("CURRENT TOKEN ========== ", currentToken);
  return (
    <>
      <Title>Transfer</Title>
      <PageContainer>
        <TokenWarningModal
          isOpen={urlLoadedTokens.length > 0 && !dismissTokenWarning}
          tokens={urlLoadedTokens}
          onConfirm={handleConfirmTokenWarning}
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
          transferTo={targetChain.name}
          activeChain={chainId ? CHAIN_LABELS[chainId] : 'Ethereum'}
          changeTransferState={onChangeTransferState}
          tokenTransferState={crosschainTransferStatus}
          value={formattedAmounts[Field.INPUT]}
          currency={currencies[Field.INPUT]}
          trade={trade}
        />

        <ChainBridgeModal isOpen={showChainBridgeModal} onDismiss={hideChainBridgeModal} />

        <TransferBodyWrapper>
          <BubbleBase />
          <Heading>Cross-Chain Bridge</Heading>
          <Description>Transfer your tokens from one blockchain to another</Description>
          <div
            style={{
              opacity: !isCrossChain || crosschainTransferStatus === ChainTransferState.NotStarted ? '1' : '.5',
              pointerEvents:
                !isCrossChain || crosschainTransferStatus === ChainTransferState.NotStarted ? 'auto' : 'none',
              filter: !isCrossChain || crosschainTransferStatus === ChainTransferState.NotStarted ? '' : 'blur(3px)'
            }}
          >
            <AutoColumn gap={'md'}>
              <CurrencyInputPanel
                blockchain={isCrossChain ? currentChain.name : getChainName()}
                label={'Choose your asset:'}
                value={formattedAmounts[Field.INPUT]}
                showMaxButton={!atMaxAmountInput}
                currency={currencies[Field.INPUT]}
                onUserInput={handleTypeInput}
                onMax={handleMaxInput}
                onCurrencySelect={handleInputSelect}
                otherCurrency={currencies[Field.OUTPUT]}
                isCrossChain={isCrossChain}
                transferPage
                id="swap-currency-input"
              />

              <BlockchainSelector
                isCrossChain={isCrossChain}
                supportedChains={SUPPORTED_CHAINS}
                blockchain={chainId ? CHAIN_LABELS[chainId] : 'Ethereum'}
                transferTo={targetChain}
                onShowCrossChainModal={showCrossChainModal}
                onShowTransferChainModal={showTransferChainModal}
              />
              <RowBetweenTransfer>
                <span>You will receive ≈ </span>
                <BottomGroupingTransfer>
                  {isCrossChain && transferAmount.length && transferAmount !== '0' && currentToken ? (
                    <>
                      <GreyCard
                        onClick={showConfirmTransferModal}
                        style={{
                          backgroundColor: '#6752F7',
                          textAlign: 'center',
                          minWidth: '230px',
                          borderRadius: '100px',
                          height: '58px',
                          color: '#fff',
                          paddingTop: 0,
                          paddingBottom: 0
                        }}
                      >
                        <TYPE.white mb="4px" style={{ lineHeight: '58px' }}>
                          Transfer
                        </TYPE.white>
                      </GreyCard>
                    </>
                  ) : !account ? (
                    <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
                  ) : (
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
                        Transfer
                      </TYPE.main>
                    </GreyCard>
                  )}
                </BottomGroupingTransfer>
              </RowBetweenTransfer>
            </AutoColumn>
          </div>
        </TransferBodyWrapper>
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

        {!isCrossChain && <AdvancedSwapDetailsDropdown trade={trade} chainId={chainId} />}
      </PageContainer>
    </>
  )
}
