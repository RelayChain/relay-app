import { ethers } from 'ethers'
import { CHAIN_LABELS, SUPPORTED_CHAINS } from '../../constants'
import {
  ChainTransferState,
  CrosschainChain,
  CrosschainToken,
  ProposalStatus,
  setCrosschainTransferStatus,
  setCurrentToken,
  setCurrentTokenImage,
  setTargetChain,
  setTransferAmount
} from '../../state/crosschain/actions'
import { CurrencyAmount, Token } from '@zeroexchange/sdk'
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
import PlainPopup from 'components/Popups/PlainPopup'
import { PopupContent } from 'state/application/actions'
import { getCurrencyLogoImage, getLogoByName, getTokenLogoURL } from 'components/CurrencyLogo'
import ChainSwitcherContent from 'components/WalletModal/ChainSwitcherContent'
import { NetworkSwitcher } from 'components/Web3Status'
import { TokenConfig } from 'constants/CrosschainConfig'

const numeral = require('numeral')

const BelowInfo = styled.div`
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #ffffff;
`
const StyledCopy = styled(Copy)` 
  margin-top: 5px;
  flex-direction: row-reverse;
`
const StyledTitle = styled.h1`
  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: 60px;
  line-height: 55px;
  text-align: center;
  color: #FFFFFF;
  margin-bottom: 30px;
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
  align-items: center;
  flex-direction: column;
  justify-content: flex-end;
  align-items: start;
  ${({ theme }) => theme.mediaWidth.upToSmall`  
  font-size: 24px;
`};
`
const ChainBlock = styled.div`
  display: flex;
  align-items: center;
`
const Description = styled.p`
  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;

  color: #FFFFFF;
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
  border-radius: 20px;
  width: 450px;
  height: 280px;   
  background: #2E2757;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 20px 10px;
`
const InfoWrapper = styled.div`
  border-radius: 20px;
  width: 450px;
  height: 250px;
  background: #2E2757;
  display: flex;
  flex-direction: column; 
  justify-content: space-between;
  padding: 20px 10px;

`
const TokenAmountBlock = styled.div`   
  display: flex;
  flex-direction: column;  
`

const ChainsBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
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
  &.disabled {
    opacity: .25;
  }
`

const FlexContainer = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center
  align-items: center; 
  box-shadow: 11px 10px 20px rgba(0, 0, 0, 0.25);
  border-radius: 24px;
  width: 487px;
  height: 610px;
  padding: 20px 10px 14px 14px;
  background: linear-gradient(180deg, #211A49 0%, #211A49 100%);
  box-shadow: 11px 10px 20px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: column;
  `};
`

const CenteredInfo = styled.div` 
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
`
const TextBottom = styled.div`
  max-width: 260px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  text-align: center;
  `};
`
const FrameBlock = styled.img`
  width: 30px;
  height: 30px; 
  &.disabled {
    opacity: .25;
  }
`
const ButtonTranfserLight = styled(ButtonPink)`
  width: 487px;
  height: 60px;
  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 61px;
  text-align: center;  
  color: #FFFFFF;
  border-radius: 51px
  margin-top: 25px;  
}
`
const InsufficientBlock = styled.div`
  position: relative; 
  width: 25%;
  top: 25px;
  padding-top: 50px;
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  color: #FFFFFF;
`

const ContentBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between; 
`
const ContentTimeBlock = styled(ContentBlock)`
  color: #38E4DE;
`
const NameBlock = styled.div` 
  width: 150px;
  &:before { 
    content: '?';
    display: inline-block;
    width: 9px;
    height: 8px;
    -moz-border-radius: 2px;
    -webkit-border-radius: 2px;
    border-radius: 7px;
    background-color: #5A3C97;
    margin-right: 7px;
    padding-top: 2px;
    padding-bottom: 4px;
    font-size: 8px;
    padding-left: 5px;
    vertical-align: baseline;
  }
`
const ConnectBlock = styled.div`
  display: flex;
  flex-direction: row;
`
const EmptyLeft = styled.div`
   
`
const MiddleBlock = styled.div`
  width: 160px;
  height: 16px;
  background: #2E2757;
  margin: 0 auto;
  position: relative; 
  &::before {
    background: linear-gradient(180deg, #211A49 0%, #211A49 100%);
    box-shadow: 11px 10px 20px rgba(0, 0, 0, 0.25);
    height: 16px;
    width: 15px;
    border-radius: 0 40% 50% 0;
    content: '';
    position: absolute;
    top: 0px;
    left: 0px;
  }
  &::after{
      background: linear-gradient(180deg, #211A49 0%, #211A49 100%);
      box-shadow: 11px 10px 20px rgba(0, 0, 0, 0.25);
      height: 16px;
      width: 15px;
      border-radius: 40% 0 0 50%;
      content: '';
      position: absolute;
      top: 0px;
      right: 0px;
  }
`
const EmptyRight = styled.div`
  
`
const LogoToken = styled.img`
  width: 10px;
  height: 10px;
  margin: 0 2px;
  `
const ValueBlock = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px; 
  text-align: right;
  color: #FFFFFF;
`
const ValueTimeBlock = styled(ValueBlock)`
  color: #38E4DE;
`
const ShortAddress = styled.span`
  font-family: Montserrat;
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  line-height: 12px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
`
const StyledNetworkSwitcher = styled(NetworkSwitcher)`

`

export default function Bridge() {
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
    allCrosschainData,
    currentTokenImage
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
  const [handlerHasZeroBalance, setHandlerZeroBalance] = useState(false)
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
  const [shortAddress, setShortTokenAddress] = useState('')
  const [isMaxAmount, setIsMaxAmount] = useState(false)
  const [isTransferToHandler, setIsTransferToHandler] = useState(false)
  const [balanceOnHandler, setBalanceOnHandler] = useState('0')
  const [tokenForHandlerTransfer, setTokenForHandlerTransfer] = useState(['USDC', 'WETH'])


  useEffect(() => {
    const chaindata = allCrosschainData.chains.find(chaindata => chaindata.name === targetChain?.name)
    chaindata?.tokens.map(token => {
      if (token.resourceId === currentToken.resourceId) {
        setTargetTokenAddress(token.address)
        setShortTokenAddress(`${token.address.slice(0, 6)}..${token.address.slice(-6)}`)
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
  useEffect(() => {
    if (isMaxAmount) {
      const maxAmountToTransfer = compareAmountWithBalanceHandler(transferAmount)
      handleInputAmountChange(maxAmountToTransfer)
      onUserInput(Field.INPUT, maxAmountToTransfer)
    }
  }, [isMaxAmount, transferAmount, dispatch])

  const handleTypeInput = useCallback(
    (value: string) => {
      const comparedValue = compareAmountWithBalanceHandler(value)
      handleInputAmountChange(comparedValue)
      onUserInput(Field.INPUT, comparedValue)
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
  const cutAfterCommma = (value: string) => {
    const splitValue = value.split('.')
    return splitValue.length < 2 || splitValue[1].length < 6 ?
      value :
      `${splitValue[0]}.${splitValue[1].slice(0, 6)}`
  }
  const formattedAmounts = {
    [independentField]: cutAfterCommma(typedValue)
  }

  const popupContent: PopupContent = {
    simpleAnnounce: {
      message: 'Insufficient balance for this transaction.'
    }
  }
  const [crossPopupOpen, setShowPopupModal] = useState(false)
  const hidePopupModal = () => setShowPopupModal(false)

  const showPopupModal = () => {
    setShowPopupModal(true)
    setTimeout(() => {
      hidePopupModal()
      startNewSwap()
    }, 3000)
  }

  useEffect(() => {
    if (crosschainTransferStatus === ChainTransferState.Insufficient) {
      showPopupModal()
    }
  }, [ChainTransferState, crosschainTransferStatus])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))
  const getImage = (token: TokenConfig) => {
    const localImage = getCurrencyLogoImage(token?.name)
    return localImage ? getLogoByName(localImage) : getTokenLogoURL((currentChain?.name).toLowerCase(), token?.address)
  }
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
          }))

        if (newToken?.address) {
          dispatch(
            setCurrentTokenImage({
              tokenImage: getImage(newToken)
            })
          )
        }
      }

    },
    // eslint-disable-next-line
    [onCurrencySelection, dispatch, currentChain, currentToken]
  )

  const compareAmountWithBalanceHandler = (amount: string) => {
    return (tokenForHandlerTransfer.includes(currentToken.name) && +balanceOnHandler > 0) ?
      `${Math.min(+amount, +balanceOnHandler)}` :
      amount
  }

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      let maxAmountToSend = maxAmountInput?.toExact()
      maxAmountToSend = compareAmountWithBalanceHandler(maxAmountToSend)
      handleInputAmountChange(maxAmountToSend)
      onUserInput(Field.INPUT, maxAmountToSend)
    }
  }, [maxAmountInput, onUserInput, handleInputAmountChange, balanceOnHandler])

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
      dispatch(
        setCrosschainTransferStatus({
          status: ChainTransferState.Confirm
        })
      )
      setTransferModalLoading(true)
      try {

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
    if (targetChain.chainID && currentToken.resourceId && tokenForHandlerTransfer.includes(currentToken.name)) {
      getBalanceOnHandler(targetChain.chainID, currentToken.resourceId)
        .then(res => {
          const amountHandler = !!res?.result ? res?.result : '0'
          if (amountHandler === '0') {
            setHandlerZeroBalance(true)
          }
          setBalanceOnHandler(amountHandler)
          setIsTransferToHandler(!!amountHandler)
        })
    } else {
      setHandlerZeroBalance(false)
    }
  }, [currentToken, targetChain])

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
      <FlexContainer>
        <StyledTitle>Bridge</StyledTitle>
        <TransferBodyWrapper className={!bridgeEnabled || !account ? 'offline' : targetChain?.chainID?.length === 0 ? 'highlight' : ''}>
          <TokenAmountBlock>
            <Description>Asset / Token</Description>
            <CurrencyInputPanel
              // blurInput={(event) => onBlurInput(event)}
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
              style={{ width: '100%' }}
            />
          </TokenAmountBlock>
          {currentToken?.address &&
            <StyledCopy toCopy={targetTokenAddress} >
              <ShortAddress style={{ marginLeft: '4px' }}>{shortAddress}</ShortAddress>
            </StyledCopy>

          }
          <ChainsBlock>
            <Heading>
              <Description>Origin Network</Description>
              <StyledNetworkSwitcher bridge={true} />
            </Heading>

            <InsufficientBlock>
              <FrameBlock src={require('../../assets/images/new-design/Frame.svg')} className={!account ? 'disabled' : ''} />
              <div>Switch</div>
            </InsufficientBlock>

            <Heading>
              <Description>Destination Network</Description>
              <BlockchainSelector
                isCrossChain={isCrossChain}
                supportedChains={SUPPORTED_CHAINS}
                blockchain={chainId ? CHAIN_LABELS[chainId] : undefined}
                transferTo={targetChain}
                onShowCrossChainModal={showCrossChainModal}
                onShowTransferChainModal={showTransferChainModal}
              />
            </Heading>
          </ChainsBlock>


        </TransferBodyWrapper>
        <ConnectBlock>
          <EmptyLeft></EmptyLeft>
          <MiddleBlock></MiddleBlock>
          <EmptyRight></EmptyRight>
        </ConnectBlock>
        <InfoWrapper className={!bridgeEnabled || targetChain?.chainID?.length === 0 ? 'offline' : currentToken?.name?.length === 0 ? 'highlight' : ''}>


          {isTransferToHandler && +balanceOnHandler > 0 &&
            tokenForHandlerTransfer.includes(currentToken.name) &&
            <ContentBlock>
              <NameBlock >{`Available`}</NameBlock>
              <ValueBlock > {balanceOnHandler} {currentToken.name}</ValueBlock>
            </ContentBlock>
          }


          <ContentBlock>
            <NameBlock>{`Balance`}</NameBlock>
            <ValueBlock>  {Number(currentBalance).toFixed(4)}
              {currentToken?.address && <LogoToken src={currentTokenImage} />}
              {currentToken.symbol}</ValueBlock>
          </ContentBlock>

          <ContentBlock>
            <NameBlock  >{`Estimate Fee`}</NameBlock>
            <ValueBlock  > {crosschainFee}
              <LogoToken src={getLogoByName(currentChain?.symbol || 'ETH')} />
              {currentChain?.symbol}</ValueBlock>
          </ContentBlock>
          <ContentTimeBlock>
            <NameBlock  >{`Estimated Transaction Time`}</NameBlock>
            <ValueTimeBlock  > {'82 s'}</ValueTimeBlock>
          </ContentTimeBlock>

        </InfoWrapper>

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

        <PlainPopup isOpen={crossPopupOpen} onDismiss={hidePopupModal} content={popupContent} removeAfterMs={2000} />

        {/* {(tokenForHandlerTransfer.includes(currentToken.name) && isMaxAmount) || handlerHasZeroBalance && <BelowForm style={{ color: 'red' }}>{`WARNING: this transfer can take up to 48 hours to process.`}</BelowForm>} */}

        <ButtonTranfserLight onClick={showConfirmTransferModal} disabled={!isNotBridgeable()}>
          TRANSFER
        </ButtonTranfserLight>
      </CenteredInfo>
      <RowFixed style={{ margin: '1rem' }}>
      </RowFixed>
    </PageContainer >
  )
}
