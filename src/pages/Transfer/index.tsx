import { CurrencyAmount, Token } from '@zeroexchange/sdk'
import BlockchainLogo from 'components/BlockchainLogo'
import { ChartWidget } from 'components/ChartWidget'
import PageContainer from 'components/PageContainer'
import { tickerTocCoinbaseName } from 'constants/lists'
import { useCoinGeckoPrice } from 'hooks/useCoinGeckoPrice'
import useStats from 'hooks/useStats'
import useTvl from 'hooks/useTvl'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import Circle2 from '../../assets/images/circle.svg'
import BlockchainSelector from '../../components/BlockchainSelector'
import BubbleBase from '../../components/BubbleBase'
import { ButtonPink } from '../../components/Button'
import { GreyCard } from '../../components/Card'
import ChainBridgeModal from '../../components/ChainBridgeModal'
import ConfirmTransferModal from '../../components/ConfirmTransferModal'
import CrossChainModal from '../../components/CrossChainModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { RowBetween } from '../../components/Row'
import AdvancedSwapDetailsDropdown from '../../components/swap/AdvancedSwapDetailsDropdown'
import { BottomGrouping } from '../../components/swap/styleds'
import TokenWarningModal from '../../components/TokenWarningModal'
import { CHAIN_LABELS, SUPPORTED_CHAINS } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { AppDispatch } from '../../state'
import { useWalletModalToggle } from '../../state/application/hooks'
import {
  ChainTransferState,
  CrosschainChain,
  ProposalStatus,
  setCrosschainTransferStatus,
  setCurrentToken,
  setTargetChain,
  setTransferAmount
} from '../../state/crosschain/actions'
import {
  GetTokenByAddrAndChainId,
  useCrossChain,
  useCrosschainHooks,
  useCrosschainState
} from '../../state/crosschain/hooks'
import { Field } from '../../state/swap/actions'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState
} from '../../state/swap/hooks'
import { CustomLightSpinner } from '../../theme/components'
import { maxAmountSpend } from '../../utils/maxAmountSpend'

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
const StyledTitle = styled.h1`
  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: 60px;
  color: #7f46f0;
  margin-top: 50px;
  margin-bottom: 20px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin: 20px auto;  
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
`};
`
const Heading = styled.div`
  display: flex;
  text-align: center;
  font-size: 32px;
  justify-content: space-between;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size: 24px;
`};
`
const FlexBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;

`};
`

const ChainBlock = styled.div`
  display: flex;
  align-items: center;
`
const Description = styled.p`
  text-align: center;
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 29px;
  color: #ffffff;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  font-size: 20px;
`};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size: 18px;

`};
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
    color: #6752f7;
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
  border-radius: 30px;
  background: rgb(18, 26, 56);
  width: 100%;
  max-width: 585px;
  padding: 2rem;
  position: relative;
  border: 2px solid transparent;
  background-clip: padding-box;
  &::after {
    position: absolute;
    top: -2px;
    bottom: -2px;
    left: -2px;
    right: -2px;
    content: '';
    z-index: -1;
    border-radius: 30px;
    background: linear-gradient(4.66deg, rgba(255, 255, 255, 0.2) 3.92%, rgba(255, 255, 255, 0) 96.38%);
  }
  &.offline {
    opacity: 0.25;
    pointer-events: none;
    * {
      pointer-events: none;
    }
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding: 1.5rem;
 
  `}
`
const ChartLiquidityWrapper = styled.div`
  position: relative;
  padding: 2rem;
  margin-right: 130px;
  width: 585px;
  height: 292px;
  background: rgba(70, 70, 70, 0.25);
  mix-blend-mode: normal;
  backdrop-filter: blur(100px);
  border-radius: 30px;
`
const ChartTransferWrapper = styled.div`
  position: relative;
  padding: 2rem;
  margin-left: 50px;
  width: 585px;
  height: 292px;
  background: rgba(70, 70, 70, 0.25);
  mix-blend-mode: normal;
  backdrop-filter: blur(100px);

  border-radius: 30px;
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
const BelowForm = styled.div`
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #ffffff;
  padding-top: 25px;
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
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: column;
  `};
`

const CenteredInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`

const TextBottom = styled.div`
  max-width: 260px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  text-align: center;
  `};
`
const FrameBlock = styled.img`
  width: 90px;
  height: 90px;
  margin 10px;
`
const ButtonTranfserLight = styled(ButtonPink)`
  width: 220px;
  height: 60px;
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 36px;
  line-height: 44px;
  text-align: center;
  color: #ffffff;
  margin-top: 20px;
  background: linear-gradient(90deg, #ad00ff 0%, #7000ff 100%);
  border-radius: 100px;
`
const ChartContainer = styled(ChartWidget)`
  width: 604px;
  height: 230px;
  background: rgba(70, 70, 70, 0.25);
  mix-blend-mode: normal;
  backdrop-filter: blur(100px);
  border-radius: 30px;
`
const UnciffientBlock = styled.div`
  position: relative;
  width: 516px;
  height: 119px;
  background: linear-gradient(90deg, #ad00ff 0%, #7000ff 100%);
  border-radius: 100px;
  margin-bottom: 24px;
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 36px;
  line-height: 44px;
  text-align: center;
  color: #ffffff;
  padding-left: 40px;
  padding-top: 35px;
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
    swapDetails,
    currentBalance
  } = useCrosschainState()

  const { BreakCrosschainSwap, GetAllowance } = useCrosschainHooks()

  const dispatch = useDispatch<AppDispatch>()

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId)
  ]

  const [isInsufficient, setIsInsufficient] = useState(false)
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
  const [priceTokenInUsd, setPriceTokenInUsd] = useState(0)
  const [transferModalLoading, setTransferModalLoading] = useState(false)
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
  const priceInUsd = useCoinGeckoPrice

  useEffect(() => {
    if (currentToken.assetBase) {
      priceInUsd(tickerTocCoinbaseName[currentToken.assetBase]).then(data => {
        const usd = Object.values(data)[0]
        setPriceTokenInUsd(usd?.usd ? +usd?.usd : 0)
        console.log('priceTokenInUsd :>> ', priceTokenInUsd)
      })
    }
  }, [priceInUsd, currentToken])
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
    if (crosschainTransferStatus !== ChainTransferState.ApprovalSubmitted) {
      startNewSwap()
      handleTypeInput('')
    }
    setConfirmTransferModalOpen(false)
  }
  const showConfirmTransferModal = async () => {
    if (transferModalLoading) {
      return
    }
    if (currentToken.address) {
      setTransferModalLoading(true)
      try {
        await GetAllowance()
        setTransferModalLoading(false)
        setConfirmTransferModalOpen(true)
      } catch (err) {
        console.log('get allowance error', err)
        setTransferModalLoading(false)
      }
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

  useEffect(() => {
    if (targetChain && currentToken) {
      const hasTargetChainToTransferToken = currentToken?.allowedChainsToTransfer?.some(
        chain => chain === +targetChain.chainID
      )
      setIsTransferToken(!!hasTargetChainToTransferToken)
    }
  }, [targetChain, currentToken])

  // quick enable or disable of bridge
  const bridgeEnabled = true
  const isNotBridgeable = () => {
    return (
      isCrossChain &&
      !!transferAmount.length &&
      transferAmount !== '0' &&
      !!currentToken &&
      isTransferToken &&
      targetChain.chainID !== '' &&
      targetChain.name.length > 0 &&
      !!currencies[Field.INPUT]
    )
  }

  return (
    <PageContainer>
      <StyledTitle>Bridges</StyledTitle>
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

        {!bridgeEnabled && (
          <h3 style={{ display: 'block', textAlign: 'center', marginBottom: '2rem' }}>Bridge is currently offline</h3>
        )}
        <TransferBodyWrapper className={!bridgeEnabled ? 'offline' : ''}>
          <Heading>
            <Description>You'll send</Description>
            <ChainBlock>
              <BlockchainLogo
                size="60px"
                blockchain={CHAIN_LABELS[chainId ?? 1]}
                style={{ marginLeft: '0px', marginRight: '1rem' }}
              />
              <Description>{currentChain.name}</Description>
            </ChainBlock>
          </Heading>

          <CurrencyInputPanel
            blockchain={isCrossChain ? currentChain.name : getChainName()}
            label={''}
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
            style={{ padding: '25px 0' }}
          />

          <FlexBlock>
            <BelowForm>{`Estimated Value - $ ${(Number(formattedAmounts[Field.INPUT]) * priceTokenInUsd).toFixed(
              4
            )}`}</BelowForm>
            <BelowForm>{`Available Balance ${Number(currentBalance).toFixed(4)} ${currentToken.symbol}`}</BelowForm>
          </FlexBlock>
          {/* <RowBetweenTransfer style={{ marginBottom: '1rem' }}>
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
                        { transferModalLoading === false &&
                          <TYPE.white>
                            Transfer
                          </TYPE.white>
                        }
                        { transferModalLoading === true &&
                          <CustomLightSpinner
                            src={Circle}
                            alt="loader"
                            size={'26px'}
                          />
                        }
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
              </RowBetweenTransfer> */}
        </TransferBodyWrapper>
        <FrameBlock src={require('../../assets/images/new-design/Frame.svg')} />
        {/* // second form */}
        <TransferBodyWrapper className={!bridgeEnabled ? 'offline' : ''}>
          <BubbleBase />
          {/* <Heading>Cross-Chain Bridge*/}
          <Heading>
            <Description>You'll receive</Description>
          </Heading>

          <FlexBlock style={{ padding: '20px 0' }}>
            <BlockchainSelector
              isCrossChain={isCrossChain}
              supportedChains={SUPPORTED_CHAINS}
              blockchain={chainId ? CHAIN_LABELS[chainId] : undefined}
              transferTo={targetChain}
              onShowCrossChainModal={showCrossChainModal}
              onShowTransferChainModal={showTransferChainModal}
            />

            <CurrencyInputPanel
              blockchain={isCrossChain ? currentChain.name : getChainName()}
              label={''}
              value={formattedAmounts[Field.INPUT]}
              showMaxButton={!atMaxAmountInput}
              currency={currencies[Field.INPUT]}
              onUserInput={handleTypeInput}
              onMax={handleMaxInput}
              onCurrencySelect={handleInputSelect}
              otherCurrency={currencies[Field.OUTPUT]}
              isCrossChain={isCrossChain}
              transferPage
              hideCurrencySelect={true}
              id="swap-currency-input"
            />
          </FlexBlock>

          <BelowForm style={{ textAlign: 'end' }}>{`Available Balance ${Number(currentBalance).toFixed(4)}  ${
            currentToken.symbol
          }`}</BelowForm>
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

        {!isCrossChain && <AdvancedSwapDetailsDropdown trade={trade} chainId={chainId} />}
      </FlexContainer>
      <CenteredInfo>
        {' '}
        {isInsufficient && (
          <UnciffientBlock>
            <img
              src={require('../../assets/images/new-design/warning.svg')}
              style={{ position: 'absolute', left: '30px', top: '30px' }}
            />
            <div>Insufficient balance!</div>
          </UnciffientBlock>
        )}
        <BelowForm>{`Estimated Transfer Fee: ${crosschainFee} ${currentChain?.symbol}`}</BelowForm>
        <ButtonTranfserLight onClick={showConfirmTransferModal} disabled={!isNotBridgeable()}>
          Transfer
        </ButtonTranfserLight>
      </CenteredInfo>
    </PageContainer>
  )
}
