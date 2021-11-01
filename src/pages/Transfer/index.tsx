import { ButtonLight, ButtonPrimary } from '../../components/Button'
import { CHAIN_LABELS, SUPPORTED_CHAINS } from '../../constants'
import {
  ChainTransferState,
  CrosschainChain,
  setCrosschainTransferStatus,
  setCurrentToken,
  setTargetChain,
  setTransferAmount
} from '../../state/crosschain/actions'
import { CurrencyAmount, Token } from '@zeroexchange/sdk'
import { GetTokenByAddrAndChainId, useCrossChain, useCrosschainHooks, useCrosschainState } from '../../state/crosschain/hooks'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { TYPE, Title } from '../../theme'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState
} from '../../state/swap/hooks'

import AdvancedSwapDetailsDropdown from '../../components/swap/AdvancedSwapDetailsDropdown'
import { AppDispatch } from '../../state'
import { AutoColumn } from '../../components/Column'
import BlockchainSelector from '../../components/BlockchainSelector'
import { BottomGrouping } from '../../components/swap/styleds'
import BubbleBase from '../../components/BubbleBase'
import ChainBridgeModal from '../../components/ChainBridgeModal'
import Circle from '../../assets/images/circle-grey.svg'
import Circle2 from '../../assets/images/circle.svg'
import ConfirmTransferModal from '../../components/ConfirmTransferModal'
import CrossChainModal from '../../components/CrossChainModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { CustomLightSpinner } from '../../theme/components'
import { Field } from '../../state/swap/actions'
import { GreyCard } from '../../components/Card'
import { ProposalStatus } from '../../state/crosschain/actions'
import { RowBetween } from '../../components/Row'
import TokenWarningModal from '../../components/TokenWarningModal'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { useDispatch } from 'react-redux'
import useStats from 'hooks/useStats'
import useTvl from 'hooks/useTvl'
import { useWalletModalToggle } from '../../state/application/hooks'

const numeral = require('numeral')

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
  ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size: 24px;
`};
`

const Description = styled.p`
  text-align: center;
  margin-top: 0.25rem;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.1em;
`
const SideCard = styled.div`
  width: 100%;
  max-width: 360px;
  position: relative;
  padding: 2rem;
  margin-bottom: 1rem;
  span {
    font-size: 1.5rem;
    font-weight: bold;
    color: #6752F7;
  }
`

const SideCardHolder = styled.div`
  margin-right: auto;
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 2rem;
  `};
`
const TransferBodyWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  position: relative;
  padding: 2rem;
  margin-left: auto;
  margin-right: 2rem;
  &.offline {
    opacity: .25;
    pointer-events: none;
    * {
      pointer-events: none;
    }
  }
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
  margin-top: 0;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  width: 100%;
`};
`
const SpanAmount = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
  text-align: center;
  `};
`
const TransferButton = styled(GreyCard)`
  text-align: center;
  min-width: 180px;
  border-radius: 100px;
  height: 58px;
  padding-top: 0;
  padding-bottom: 0;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  min-width: 0;
  `};
`

const FlexContainer = styled.div`
  max-width: 1240px;
  width: 100%;
  padding: 0 24px;
  margin: 0 auto;
  margin-top: 1rem;
  margin-bottom: 3rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: column;
  `};
`

const TextBottom = styled.div`
  max-width: 260px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  text-align: center;
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
    crosschainTransferStatus,
    swapDetails
  } = useCrosschainState()

  const { BreakCrosschainSwap, GetAllowance } = useCrosschainHooks()

  const dispatch = useDispatch<AppDispatch>()

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId)
  ]
  const [isTransferToken, setIsTransferToken] = useState(false)
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
  }, [allChains, chainId])

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()
  const [totalTx, setTotalTx] = useState('')
  const [totalFee, setTotalFee] = useState(0)
  const [totalTvl, setTotalTvl] = useState(1)
  const stats = useStats(chainId || 2)
  const tvl = useTvl()

  useEffect(() => {
    const keys = Object.keys(stats)
    if (keys.length > 0) {
      setTotalFee(Number(stats['fee_usd'].toFixed(2)))
      setTotalTx(stats['n_txs'])
    }
  }, [stats])

  useEffect(() => {
    setTotalTvl(Math.round(tvl))

  }, [tvl])
  const { independentField, typedValue } = useSwapState()
  const { v2Trade, currencyBalances, parsedAmount, currencies } = useDerivedSwapInfo()

  const trade = v2Trade

  const parsedAmounts = {
    [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount
  }

  const { onCurrencySelection, onUserInput } = useSwapActionHandlers()

  // track the input amount, on change, if crosschain, dispatch
  // eslint-disable-next-line
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
  // eslint-disable-next-line
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )

  const formattedAmounts = {
    [independentField]: typedValue
  }

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  const handleInputSelect = useCallback(
    inputCurrency => {
      onCurrencySelection(Field.INPUT, inputCurrency)
      if (inputCurrency?.address) {
        const newToken = GetTokenByAddrAndChainId(inputCurrency.address, currentChain.chainID)
        dispatch(
          setCurrentToken({
            token: {
              name: newToken?.name || '',
              address: newToken?.address || '',
              assetBase: newToken?.assetBase || '',
              symbol: newToken?.symbol || '',
              decimals: newToken?.decimals || 18,
              resourceId: newToken?.resourceId || '',
              allowedChainsToTransfer: newToken?.allowedChainsToTransfer || []
            }
          })
        )
      }
    },
    // eslint-disable-next-line
    [onCurrencySelection, dispatch, currentChain, currentToken]
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      handleInputAmountChange(maxAmountInput.toExact())
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput, handleInputAmountChange])

  // eslint-disable-next-line
  const [isCrossChain, setIsCrossChain] = useState<boolean>(true)

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

  // eslint-disable-next-line
  const [crossChainModalOpen, setShowCrossChainModal] = useState(false)
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
    if (currentToken.address) {
      GetAllowance()
      setConfirmTransferModalOpen(true)
    }
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

  useEffect(() => {
    if (targetChain && currentToken) {
      const hasTargetChainToTransferToken = currentToken?.allowedChainsToTransfer?.some(chain => chain === +targetChain.chainID)
      setIsTransferToken(!!hasTargetChainToTransferToken)
    }
  }, [targetChain, currentToken])

  // quick enable or disable of bridge
  const bridgeEnabled = true;

  return (
    <>
      <Title>Transfer</Title>
      <FlexContainer>
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
          activeChain={chainId ? CHAIN_LABELS[chainId] : undefined}
        />
        <ConfirmTransferModal
          isOpen={confirmTransferModalOpen}
          onDismiss={hideConfirmTransferModal}
          transferTo={targetChain}
          activeChain={chainId ? CHAIN_LABELS[chainId] : undefined}
          changeTransferState={onChangeTransferState}
          tokenTransferState={crosschainTransferStatus}
          value={formattedAmounts[Field.INPUT]}
          currency={currencies[Field.INPUT]}
          trade={trade}
        />

        <ChainBridgeModal isOpen={showChainBridgeModal} onDismiss={hideChainBridgeModal} />

        {!bridgeEnabled && <h3 style={{ display: 'block', textAlign: 'center', marginBottom: '2rem' }}>Bridge is currently offline</h3>}
        <TransferBodyWrapper className={!bridgeEnabled ? 'offline' : ''}>
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
          { targetChain.name !== '' && <CurrencyInputPanel
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
              }

              <BlockchainSelector
                isCrossChain={isCrossChain}
                supportedChains={SUPPORTED_CHAINS}
                blockchain={chainId ? CHAIN_LABELS[chainId] : undefined}
                transferTo={targetChain}
                onShowCrossChainModal={showCrossChainModal}
                onShowTransferChainModal={showTransferChainModal}
              />
              <RowBetweenTransfer style={{ marginBottom: '1rem', marginTop: '-1.5rem' }}>
                <TextBottom style={{ marginLeft: 'auto', marginRight: '10px', opacity: '.65', color: '#a7b1f4' }}>Fee: <SpanAmount>{crosschainFee} {currentChain?.symbol}</SpanAmount></TextBottom>
              </RowBetweenTransfer>
              <RowBetweenTransfer>
                <TextBottom>
                  {isTransferToken && transferAmount.length && transferAmount !== '0' && currentToken && currencies[Field.INPUT] ? (
                    <SpanAmount>
                      You will receive {formattedAmounts[Field.INPUT]} {currentToken.symbol} on {targetChain.name.length > 0 ? targetChain.name : '...'}
                    </SpanAmount>
                  ) : ('')}
                </TextBottom>
                {(currentToken.name !== '' &&
                  !isTransferToken &&
                  targetChain.chainID !== "") ? (
                  <SpanAmount>
                    The transfer {formattedAmounts[Field.INPUT]} {currentToken.symbol} to {targetChain.name.length > 0 ? targetChain.name : '...'} is not available 
                  </SpanAmount>
                ) : ('')}
                <BottomGroupingTransfer>
                  {isCrossChain &&
                    transferAmount.length &&
                    transferAmount !== '0' &&
                    currentToken &&
                    isTransferToken &&
                    targetChain.chainID !== "" &&
                    targetChain.name.length > 0 &&
                    currencies[Field.INPUT] ? (
                    <>
                      <ButtonPrimary onClick={showConfirmTransferModal} style={{ minWidth: '180px' }}>
                        <TYPE.white>Transfer</TYPE.white>
                      </ButtonPrimary>
                    </>
                  ) : !account ? (
                    <ButtonLight onClick={toggleWalletModal} style={{ minWidth: '180px' }}>Connect Wallet</ButtonLight>
                  ) : (
                    <TransferButton>
                      <TYPE.main mb="4px" style={{ lineHeight: '58px' }}>
                        Transfer
                      </TYPE.main>
                    </TransferButton>
                  )}
                </BottomGroupingTransfer>
              </RowBetweenTransfer>
            </AutoColumn>
          </div>
        </TransferBodyWrapper>

        <SideCardHolder>
          <SideCard>
            <BubbleBase />
            <h3>Total TVL:</h3>
            <span>${numeral(totalTvl).format('0,0')}</span>
          </SideCard>
          <SideCard>
            <BubbleBase />
            <h3>Total Txns:</h3>
            <span>{numeral(totalTx).format('0,0')}</span>
          </SideCard>
          <SideCard>
            <BubbleBase />
            <h3>Total Fees:</h3>
            <span>${numeral(totalFee).format('0,0')}</span>
          </SideCard>
        </SideCardHolder>

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
      </FlexContainer>
    </>
  )
}
