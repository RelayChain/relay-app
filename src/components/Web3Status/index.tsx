import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { NETWORK_LABELS, NETWORK_SYMBOLS } from '@zeroexchange/sdk'
import CrossChainModal from 'components/CrossChainModal'
import ChainSwitcherContent from 'components/WalletModal/ChainSwitcherContent'
import { useActiveWeb3React, useEagerConnect } from 'hooks'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Text } from 'rebass'
import { AppDispatch } from 'state'
import { CrosschainChain, setTargetChain } from 'state/crosschain/actions'
import { useCrossChain, useCrosschainState } from 'state/crosschain/hooks'
import styled, { css } from 'styled-components'
import CoinbaseWalletIcon from '../../assets/images/coinbaseWalletIcon.svg'
import FortmaticIcon from '../../assets/images/fortmaticIcon.png'
import PortisIcon from '../../assets/images/portisIcon.png'
import WalletConnectIcon from '../../assets/images/walletConnectIcon.svg'
import { fortmatic, injected, portis, walletconnect, walletlink } from '../../connectors'
import { CHAIN_LABELS, NetworkContextName } from '../../constants'
import useENSName from '../../hooks/useENSName'
import { useHasSocks } from '../../hooks/useSocksBalance'
import { useWalletModalToggle } from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { shortenAddress } from '../../utils'
import { ButtonSecondary } from '../Button'
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

const Web3StatusConnect = styled(Web3StatusGeneric)<{ faded?: boolean }>`
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
        {!hasPendingTransactions && connector && <StatusIcon connector={connector} />}
      </Web3StatusConnected>
    )
  } else if (error instanceof UnsupportedChainIdError) {
    return <ChainSwitcherContent />
  } else {
    return (
      <Web3StatusConnect id="connect-wallet" onClick={toggleWalletModal} faded={!account}>
        <Paragraph>{t('Connect Wallet')}</Paragraph>
      </Web3StatusConnect>
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
      <Web3StatusInner />
      <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
    </>
  )
}
