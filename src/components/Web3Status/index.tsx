import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { NETWORK_LABELS, NETWORK_SYMBOLS } from '@zeroexchange/sdk'
import CrossChainModal from 'components/CrossChainModal'
import PlainPopup from 'components/Popups/PlainPopup'
import ChainSwitcherContent from 'components/WalletModal/ChainSwitcherContent'
import { useActiveWeb3React, useEagerConnect } from 'hooks'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Text } from 'rebass'
import { AppDispatch } from 'state'
import { PopupContent } from 'state/application/actions'
import { CrosschainChain, setTargetChain } from 'state/crosschain/actions'
import { useCrossChain, useCrosschainState } from 'state/crosschain/hooks'
import styled, { css } from 'styled-components'
import CoinbaseWalletIcon from '../../assets/images/coinbaseWalletIcon.svg'
import FortmaticIcon from '../../assets/images/fortmaticIcon.png'
import PortisIcon from '../../assets/images/portisIcon.png'
import SmallDropDown from '../../assets/images/small-dropdown-white-select.svg'
import WalletConnectIcon from '../../assets/images/walletConnectIcon.svg'
import { fortmatic, injected, portis, walletconnect, walletlink } from '../../connectors'
import { CHAIN_LABELS, NetworkContextName } from '../../constants'
import useENSName from '../../hooks/useENSName'
import { useHasSocks } from '../../hooks/useSocksBalance'
import { useWalletModalToggle } from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { shortenAddress } from '../../utils'
import BlockchainLogo from '../BlockchainLogo'
import { ButtonGradient, ButtonSecondary } from '../Button'
import { YellowCard } from '../Card'
import Identicon from '../Identicon'
import Loader from '../Loader'
import { RowBetween } from '../Row'
import WalletModal from '../WalletModal'

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > * {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
`

const Web3StatusGeneric = styled(ButtonSecondary)`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  align-items: center;
  padding: 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  :focus {
    outline: none;
  }
`

const BalanceText = styled(Text)`
  font-family: Poppins;
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
  letter-spacing: -0.01em;
  color: #ffffff;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

// const Web3StatusError = styled(Web3StatusGeneric)`
//   background-color: ${({ theme }) => theme.red1};
//   border: 1px solid ${({ theme }) => theme.red1};
//   color: ${({ theme }) => theme.white};
//   font-weight: 500;
//   :hover,
//   :focus {
//     background-color: ${({ theme }) => darken(0.1, theme.red1)};
//   }
// `

const Web3StatusConnect = styled(Web3StatusGeneric) <{ faded?: boolean }>`
  background-color: ${({ theme }) => theme.primary4};
  border: none;
  color: ${({ theme }) => theme.primaryText1};
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 12px;
  `};
  :hover,
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1} !important;
    filter: brightness(1.3) !important;
  }

  ${({ faded }) =>
    faded &&
    css`
      background: rgba(103, 82, 247, 0.18);
      border: 1px solid #6752f7;
      box-sizing: border-box;
      backdrop-filter: blur(7px);
      border-radius: 54px;
      min-width: 189px;
      height: 56px;
      padding: 18px 39px;
      font-weight: 600;
      font-size: 13px;
      color: #fff;
      :hover,
      :focus {
        border-color: #fff;
        color: #fff;
      }
    `}
`

const Web3StatusConnected = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-family: Poppins;
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 19px;
  letter-spacing: 0.05em;
  color: #a7b1f4;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  :focus {
    border: 1px solid blue;
  }
`

const Paragraph = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
`
const HeaderRowBetween = styled(RowBetween)`
  align-items: center;
`
const LoaderWrap = styled.div`
  display: flex;
  margin-left: 10px;
`

const HideMedium = styled.span`
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`

const AccountConnectedCard = styled.div`
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgb(18, 26, 56);
  border-radius: 50px;
  min-width: 525px;
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
    border-radius: 50px;
    background: linear-gradient(4.66deg, rgba(255, 255, 255, 0.2) 3.92%, rgba(255, 255, 255, 0) 96.38%);
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding:0;
    background: none;
    width: 100%;
    border-radius: 0;
    min-width: 0;
    flex-direction: row-reverse;
    :after{
      position:relative;
    }
  `};
`

const Layout = styled.div`
  ${({ theme }) => theme.mediaWidth.upToMedium`
  background: rgb(18, 26, 56);

    padding: 15px 20px;
    width: 100%;
    position: fixed;
    bottom: 0px;
    left: 0px;
  `};
`

const NetworkCard = styled(YellowCard) <{ isBridge: boolean }>`
  width: ${({ isBridge }) => (isBridge ? '170px' : '243px')};
  height: ${({ isBridge }) => (isBridge ? '35px' : '60px')};
  padding: 7px;
  display: flex;
  align-items: center;
  letter-spacing: 0.05em;
  color: #ffffff;
  background:  ${({ isBridge }) => (isBridge ? '#211A4A' : 'linear-gradient(180deg, rgba(173, 0, 255, 0.25) 0%, rgba(97, 0, 143, 0.25) 100%)')}; 
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
  border-radius:  ${({ isBridge }) => (isBridge ? '58px' : '54px')};
  transition: all 0.2s ease-in-out;
  font-family: ${({ isBridge }) => (isBridge ? 'Montserrat' : 'Poppins')};
  font-weight: 300;
  font-size: 17px;
  margin-right: 20px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  margin-right: 0px;

  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
  &:hover {
    filter: brightness(1.1);
    cursor: pointer;
  }
`
const ArrowDownIcon = styled.img<{ isBridge: boolean }>`
  margin-left: auto;
  margin-right: 5px;
  width: ${({ isBridge }) => (isBridge ? '12px' : '16px')};
  height: ${({ isBridge }) => (isBridge ? '6px' : '16px')};
`
const popupContent: PopupContent = {
  simpleAnnounce: {
    message: 'Please wait 5 seconds to change RPCs again.'
  }
}

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

const SOCK = (
  <span role="img" aria-label="has socks emoji" style={{ marginTop: -4, marginBottom: -4 }}>
    🧦
  </span>
)

// eslint-disable-next-line react/prop-types
function StatusIcon({ connector }: { connector: AbstractConnector }) {
  if (connector === injected) {
    return <Identicon />
  } else if (connector === walletconnect) {
    return (
      <IconWrapper size={16}>
        <img src={WalletConnectIcon} alt={''} />
      </IconWrapper>
    )
  } else if (connector === walletlink) {
    return (
      <IconWrapper size={16}>
        <img src={CoinbaseWalletIcon} alt={''} />
      </IconWrapper>
    )
  } else if (connector === fortmatic) {
    return (
      <IconWrapper size={16}>
        <img src={FortmaticIcon} alt={''} />
      </IconWrapper>
    )
  } else if (connector === portis) {
    return (
      <IconWrapper size={16}>
        <img src={PortisIcon} alt={''} />
      </IconWrapper>
    )
  }
  return null
}
type NetworkSwitcherProps = {
  bridge?: boolean
}
export const NetworkSwitcher = ({ bridge = false }: NetworkSwitcherProps) => {
  const { chainId } = useActiveWeb3React()
  const { availableChains: allChains, lastTimeSwitched } = useCrosschainState()

  const availableChains = useMemo(() => {
    return allChains.filter(i => i.name !== (chainId ? CHAIN_LABELS[chainId] : 'Ethereum'))
  }, [allChains, chainId])

  const [crossChainModalOpen, setShowCrossChainModal] = useState(false)
  const [crossPopupOpen, setShowPopupModal] = useState(false)

  const hidePopupModal = () => setShowPopupModal(false)
  const hideCrossChainModal = () => setShowCrossChainModal(false)

  const showCrossChainModal = () => {
    const currentTime = ~~(Date.now() / 1000)
    if (lastTimeSwitched < currentTime) {
      setShowCrossChainModal(true)
    } else {
      setShowPopupModal(true)
      setTimeout(() => {
        hidePopupModal()
      }, 2000)
    }
  }

  return (
    <div onClick={showCrossChainModal}>
      {chainId && NETWORK_LABELS[chainId] && (
        <NetworkCard title={NETWORK_LABELS[chainId]} isBridge={bridge}>
          <BlockchainLogo
            size={bridge ? '25px' : '34px'}
            blockchain={chainId ? NETWORK_LABELS[chainId] : 'Ethereum'}
            style={{}}
          />

          <span style={{ paddingLeft: '5px' }}>{NETWORK_LABELS[chainId]}</span>

          <ArrowDownIcon src={SmallDropDown} alt="SmallDropDown" isBridge={bridge} />
        </NetworkCard>
      )}
      <CrossChainModal
        isOpen={crossChainModalOpen}
        isTransfer={false}
        onDismiss={hideCrossChainModal}
        supportedChains={availableChains}
        selectTransferChain={() => { }}
        activeChain={chainId ? NETWORK_LABELS[chainId] : 'Ethereum'}
      />
      <PlainPopup isOpen={crossPopupOpen} onDismiss={hidePopupModal} content={popupContent} removeAfterMs={2000} />
    </div>
  )
}

function Web3StatusInner() {
  useCrossChain()
  const { availableChains: allChains } = useCrosschainState()
  const dispatch = useDispatch<AppDispatch>()
  const { t } = useTranslation()
  const { account, connector, error } = useWeb3React()
  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()
  const { chainId } = useActiveWeb3React()

  const availableChains = useMemo(() => {
    return allChains.filter(i => i.name !== (chainId ? CHAIN_LABELS[chainId] : 'Ethereum'))
  }, [allChains, chainId])

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)

  const hasPendingTransactions = !!pending.length
  const hasSocks = useHasSocks()
  const toggleWalletModal = useWalletModalToggle()
  const [crossChainModalOpen, setShowCrossChainModal] = useState(false)
  const hideCrossChainModal = () => {
    setShowCrossChainModal(false)
  }

  const [chainIdError] = useState({} as UnsupportedChainIdError)
  const chainIdErrorPrev = useRef({} as UnsupportedChainIdError)
  const [isSuccessAuth, userEthBalance] = useEagerConnect()

  let label,
    symbol = ''

  if (chainId) {
    label = NETWORK_LABELS[chainId]
    symbol = NETWORK_SYMBOLS[label || 'Ethereum']
  }

  useEffect(() => {
    chainIdErrorPrev.current =
      chainIdErrorPrev.current !== chainIdError && chainIdError.toString() !== '{}'
        ? (chainIdErrorPrev.current = chainIdError)
        : chainIdErrorPrev.current
  }, [chainIdError])

  const onSelectTransferChain = (chain: CrosschainChain) => {
    dispatch(
      setTargetChain({
        chain
      })
    )
  }

  // eslint-disable-next-line
  const checkCrossChainId = useCallback(() => {
    if (chainIdErrorPrev.current !== chainIdError) {
      setShowCrossChainModal(true)
      chainIdErrorPrev.current = chainIdError

      return (
        <CrossChainModal
          isOpen={crossChainModalOpen}
          onDismiss={hideCrossChainModal}
          supportedChains={availableChains}
          selectTransferChain={onSelectTransferChain}
          activeChain={chainId ? CHAIN_LABELS[chainId] : 'Ethereum'}
        />
      )
    } else {
      return (
        <CrossChainModal
          isOpen={crossChainModalOpen}
          onDismiss={hideCrossChainModal}
          supportedChains={availableChains}
          selectTransferChain={onSelectTransferChain}
          activeChain={chainId ? CHAIN_LABELS[chainId] : 'Ethereum'}
        />
      )
    }

    // eslint-disable-next-line
  }, [chainIdErrorPrev])

  if (account) {
    return (
      <AccountConnectedCard>
        <NetworkSwitcher />
        <Web3StatusConnected id="web3-status-connected" onClick={toggleWalletModal}>
          <div>
            <BalanceText>
              {userEthBalance} {symbol}
            </BalanceText>
            {hasPendingTransactions ? (
              <HeaderRowBetween>
                <Paragraph>{pending?.length} Pending</Paragraph>
                <LoaderWrap>
                  <Loader stroke="#6752F7" />
                </LoaderWrap>
              </HeaderRowBetween>
            ) : (
              <>
                {hasSocks ? SOCK : null}
                <Paragraph>{ENSName || shortenAddress(account)}</Paragraph>
              </>
            )}
          </div>
          <HideMedium>{!hasPendingTransactions && connector && <StatusIcon connector={connector} />}</HideMedium>
        </Web3StatusConnected>
      </AccountConnectedCard>
    )
  } else if (error instanceof UnsupportedChainIdError) {
    return <ChainSwitcherContent />
  } else {
    return (
      <ButtonGradient id="connect-wallet" onClick={toggleWalletModal} style={{ maxWidth: '300px', margin: '0 auto' }}>
        {t('Connect Wallet')}
      </ButtonGradient>
    )
  }
}

export default function Web3Status() {
  const { active, account } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)
  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)

  if (!contextNetwork.active && !active) {
    return null
  }

  return (
    <>
      <Layout>
        <Web3StatusInner />
      </Layout>
      <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
    </>
  )
}
