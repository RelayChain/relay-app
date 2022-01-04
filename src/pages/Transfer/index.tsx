import { ethers } from 'ethers'
import { CHAIN_LABELS, SUPPORTED_CHAINS } from '../../constants'
import {
  ChainTransferState,
  CrosschainChain,
  ProposalStatus,
  setCrosschainTransferStatus,
  setCurrentToken,
  setTargetChain,
  setTransferAmount
} from '../../state/crosschain/actions'
import { CurrencyAmount, ETHERSCAN_PREFIXES, Token } from '@zeroexchange/sdk'
import {
  GetTokenByAddrAndChainId,
  useCrossChain,
  useCrosschainHooks,
  useCrosschainState
} from '../../state/crosschain/hooks'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { RowBetween, RowFixed } from '../../components/Row'
import styled, { ThemeContext } from 'styled-components'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState
} from '../../state/swap/hooks'

import AdvancedSwapDetailsDropdown from '../../components/swap/AdvancedSwapDetailsDropdown'
import { AppDispatch } from '../../state'
import { ArrowDown } from 'react-feather'
import BlockchainLogo from 'components/BlockchainLogo'
import BlockchainSelector from '../../components/BlockchainSelector'
import { BottomGrouping } from '../../components/swap/styleds'
import BubbleBase from '../../components/BubbleBase'
import { ButtonPink } from '../../components/Button'
import ChainBridgeModal from '../../components/ChainBridgeModal'
import { ChartWidget } from 'components/ChartWidget'
import Circle2 from '../../assets/images/circle.svg'
import ConfirmTransferModal from '../../components/ConfirmTransferModal'
import CrossChainModal from '../../components/CrossChainModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { CustomLightSpinner } from '../../theme/components'
import { Field } from '../../state/swap/actions'
import { GreyCard } from '../../components/Card'
import PageContainer from 'components/PageContainer'
import TokenWarningModal from '../../components/TokenWarningModal'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { tickerTocCoinbaseName } from 'constants/lists'
import { useActiveWeb3React } from '../../hooks'
import { useCoinGeckoPrice } from 'hooks/useCoinGeckoPrice'
import { useCurrency } from '../../hooks/Tokens'
import { useDispatch } from 'react-redux'
import useStats from 'hooks/useStats'
import useTvl from 'hooks/useTvl'
import { useWalletModalToggle } from '../../state/application/hooks'
import Copy from '../../components/AccountDetails/Copy'
import { getBalanceOnHandler, getFundsOnHandler } from 'api'

const numeral = require('numeral')

const BelowInfo = styled.div`
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #ffffff;  
  margin-left: 270px;
`
const StyledCopy = styled(Copy)` 
  grid-area: copy;
`
const StyledTitle = styled.h1`
  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: 60px;
  color: #7f46f0;
  margin-top: 50px;
  margin-bottom: 40px;
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
  flex-direction: column;
  font-size: 24px;
`};
`
const FlexBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-grow: 1;
  justify-content: space-between;
  width: 100%;
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
  position: relative;
  padding: 1rem;
  span {
    font-size: 1.1rem;
    font-weight: bold;
    color: #B368FC;
    &.white {
      color: #fff;
      margin-right: 6px;
    }
  }
`
const RowBetweenSidecard = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
  flex-direction: column;
  align-items: center;
  position: relative;
`};
`

const SideCardHolder = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: row;
  background: rgb(18,26,56);
  border-radius: 24px;
  padding: 1rem 1.5rem;
  border: 2px solid #B368FC;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 2rem;
    flex-direction: column;
    width: 100%;
  `};
`
const TransferBodyWrapper = styled.div`
  border-radius: 30px;
  background: rgb(18, 26, 56);
  width: 100%;
  max-width: 585px;
  min-height: 316px;
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
  &.highlight {
    border: 2px solid #B368FC;
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
  margin-top: .5rem;
  margin-bottom: .5rem;
  grid-area: balance;
  &.disabled {
    opacity: .25;
  }
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
  &.disabled {
    opacity: .25;
  }
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
    currentBalance,
    allCrosschainData
  } = useCrosschainState()

  const { BreakCrosschainSwap, GetAllowance } = useCrosschainHooks()
  const theme = useContext(ThemeContext)

  const dispatch = useDispatch<AppDispatch>()

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId, currentToken.name),
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
  const [targetTokenAddress, setTargetTokenAddress] = useState('')
  const [isMaxAmount, setIsMaxAmount] = useState(false)
  const [isTransferToHandler, setIsTransferToHandler] = useState(false)
  const [balanceOnHandler, setBalanceOnHandler] = useState('0')
  const [tokenForHandlerTransfer, setTokenForHandlerTransfer] = useState(['USDC'])


  useEffect(() => {
    const chaindata = allCrosschainData.chains.find(chaindata => chaindata.name === targetChain?.name)
    chaindata?.tokens.map(token => {
      if (token.resourceId === currentToken.resourceId) {
        setTargetTokenAddress(token.address)
      }
    })
  }, [currentToken, targetChain])

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
  useEffect(() => {


  }, [targetChain, currentToken, transferAmount])

  const formattedAmounts = {
    [independentField]: typedValue
  }

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  const handleInputSelect = useCallback(
    inputCurrency => {
      onCurrencySelection(Field.INPUT, inputCurrency)
      if (inputCurrency?.address) {
        const newToken = GetTokenByAddrAndChainId(inputCurrency.address, currentChain.chainID, inputCurrency.resourceId, inputCurrency.name)
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

  const onBlurInput = (event: any) => {
    if (event && targetChain.chainID && currentToken.resourceId && +transferAmount > 0 && tokenForHandlerTransfer.includes(currentToken.name)) { // TODO: list of names of tokens from API or config
      getBalanceOnHandler(targetChain.chainID, currentToken.resourceId)
        .then(res => {
          const bigNumAvailableAmount = ethers.utils.formatUnits(res?.result, currentToken.decimals)
          const amountHandler = !!res?.result ? bigNumAvailableAmount.toString() : '0'
          setBalanceOnHandler(amountHandler)
          setIsTransferToHandler(!!amountHandler)
        })
    }
  }

  useEffect(() => {
    setIsMaxAmount(+transferAmount > 0 && +balanceOnHandler > 0 && +transferAmount >= +balanceOnHandler)
  }, [transferAmount, balanceOnHandler])

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
      <RowBetweenSidecard>
        <StyledTitle>Bridge</StyledTitle>
        <SideCardHolder>
          <SideCard>
            <span className="white">${numeral(totalTvl).format('0,0')}</span>
            <span> TVL</span>
          </SideCard>
          <SideCard>
            <span className="white">{numeral(totalTx).format('0,0')} </span>
            <span> Txns</span>
          </SideCard>
          <SideCard>
            <span className="white">${numeral(totalFee).format('0,0')} </span>
            <span> Fees</span>
          </SideCard>
        </SideCardHolder>
      </RowBetweenSidecard>
      <FlexContainer>
        <TokenWarningModal
          isOpen={urlLoadedTokens.length > 1 && !dismissTokenWarning}
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
        <TransferBodyWrapper className={!bridgeEnabled || !account ? 'offline' : targetChain?.chainID?.length === 0 ? 'highlight' : ''}>
          <Heading>
            <Description>Sending From: </Description>
            <ChainBlock>
              <BlockchainLogo
                size="60px"
                blockchain={CHAIN_LABELS[chainId ?? 1]}
                style={{ marginLeft: '0px', marginRight: '1rem' }}
              />
              <Description>{currentChain.name}</Description>
            </ChainBlock>
          </Heading>

          <RowFixed style={{ margin: '2rem auto 2rem auto' }}>
            <ArrowDown size="30" color={theme.text2} style={{ marginLeft: '4px', minWidth: '16px' }} />
          </RowFixed>

          <Heading>
            <Description>Sending To: </Description>
            <BlockchainSelector
              isCrossChain={isCrossChain}
              supportedChains={SUPPORTED_CHAINS}
              blockchain={chainId ? CHAIN_LABELS[chainId] : undefined}
              transferTo={targetChain}
              onShowCrossChainModal={showCrossChainModal}
              onShowTransferChainModal={showTransferChainModal}
            />
          </Heading>

        </TransferBodyWrapper>
        <FrameBlock src={require('../../assets/images/new-design/Frame.svg')} className={!account ? 'disabled' : ''} />
        {/* // second form */}
        <TransferBodyWrapper className={!bridgeEnabled || targetChain?.chainID?.length === 0 ? 'offline' : currentToken?.name?.length === 0 ? 'highlight' : ''}>
          <BubbleBase />
          {/* <Heading>Cross-Chain Bridge*/}
          <Heading>
            <Description>Enter token and amount:</Description>
          </Heading>

          <FlexBlock style={{ padding: '14px 0 0 0' }}>
            <CurrencyInputPanel
              blurInput={(event) => onBlurInput(event)}
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
              style={{ padding: '25px 0', width: '100%' }}
            />
          </FlexBlock>
          {<BelowInfo >
            {targetTokenAddress && <StyledCopy toCopy={targetTokenAddress} >
              <span style={{ marginLeft: '4px' }}>{`Copy the token address`}</span>
            </StyledCopy>}
            <BelowForm style={{ marginTop: '10px', marginBottom: '0', paddingTop: '0', paddingLeft: '10px' }}>
              {`Available Balance ${Number(currentBalance).toFixed(4)}
                ${currentToken.symbol}`}</BelowForm>
          </BelowInfo>}

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
        {isTransferToHandler && +balanceOnHandler > 0 &&
          tokenForHandlerTransfer.includes(currentToken.name) && <BelowForm style={{ color: 'green' }}>{`Max amount to transfer ${balanceOnHandler} in ${currentToken.name}`}</BelowForm>}
        {tokenForHandlerTransfer.includes(currentToken.name) && isMaxAmount && <BelowForm style={{ color: 'red' }}>{`WARNING: this transfer can take up to 48 hours to process.`}</BelowForm>}
        <BelowForm className={!account ? 'disabled' : ''}>{`Estimated Transfer Fee: ${crosschainFee} ${currentChain?.symbol}`}</BelowForm>
        <ButtonTranfserLight onClick={showConfirmTransferModal} disabled={!isNotBridgeable()}>
          Transfer
        </ButtonTranfserLight>
      </CenteredInfo>
      <RowFixed style={{ margin: '1rem' }}>
      </RowFixed>
    </PageContainer>
  )
}
