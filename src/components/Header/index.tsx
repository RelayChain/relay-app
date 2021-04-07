import React, { useMemo, useState } from 'react'
import { BarChart, Book, CreditCard, DollarSign, Menu as MenuIcon, RefreshCw } from 'react-feather'
import { NavLink } from 'react-router-dom'
import { ChainId } from '@zeroexchange/sdk'
import { Text } from 'rebass'
import styled from 'styled-components'

import { ExternalLink, TYPE } from '../../theme'
import Row, { RowFixed } from '../Row'

// import AvaxLogo from '../../assets/images/avax-logo.png'

import ClaimModal from '../claim/ClaimModal'
// import EthereumLogo from '../../assets/images/ethereum-logo.png'
import Logo from '../../assets/svg/logo.svg'
import LogoDark from '../../assets/images/0-icon.png'
import Menu from '../Menu'

import Settings from '../Settings'

import Web3Status from '../Web3Status'
import { YellowCard } from '../Card'
// import { darken } from 'polished'

import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances } from '../../state/wallet/hooks'
import { useTranslation } from 'react-i18next'
import { CrosschainChain } from 'state/crosschain/actions'
import { crosschainConfig } from '../../constants/CrosschainConfig';
import Modal from 'components/Modal'
import { CHAIN_LABELS } from '../../constants'
import BlockchainLogo from 'components/BlockchainLogo'
import { useCrosschainState } from 'state/crosschain/hooks'

const HeaderFrame = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    padding: 0 1rem;
    width: calc(100%);
    position: relative;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0.5rem 1rem;
  `}
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    max-width: 960px;
    padding: 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    height: 72px;
    border-radius: 12px 12px 0 0;
    background-color: ${({ theme }) => theme.bg1};
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`

const HeaderRow = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
   width: 100%;
  `};
`

const HeaderExternalLink = styled(ExternalLink)`
  margin: 0 16px;
  font-size: 1rem;
  color: #c3c5cb;
  transition: all .2s ease-in-out;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin: 0 6px;
    font-size: .85rem;
  `};
  :hover,
  :focus {
    color: ${({ theme }) => theme.primary1};
    text-decoration: none;
  }
`

const HeaderLinks = styled(Row)`
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: .5rem 0 .5rem .5rem;
    justify-content: flex-end;
    svg {
      display: none;
    }
`};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
`

const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const NetworkCard = styled(YellowCard)`
  border-radius: 12px;
  padding: 8px 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`

// const CurrentChain = styled.div`
//   position: fixed;
//   left: 0; right: 0; top: 0;
//   margin: auto;
//   width: 300px;
//   background: #212429;
//   border-bottom-right-radius: 24px;
//   border-bottom-left-radius: 24px;
//   text-align: center;
//   display: flex;
//   flex-direction: row;
//   justify-content: center;
//   align-items: center;
//   height: 50px;
//   padding-left: 1.5rem;
//   padding-right: 1.5rem;
//   transition: all .2s ease-in-out;
//   ${({ theme }) => theme.mediaWidth.upToMedium`
//     bottom: 100px;
//     top: auto;
//     border-radius: 24px;
//   `};
//   :hover {
//     cursor: pointer;
//     filter: brightness(1.1);
//   }
//   p {
//     margin-right: auto;
//   }
// `

const UniIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 16px;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.primary1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => theme.primary1};
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: .85rem;
    margin: 0 6px;
`};
`

const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan',
  [ChainId.FUJI]: 'Avalanche',
  [ChainId.AVALANCHE]: 'Avalanche',
  [ChainId.SMART_CHAIN]: 'SmartChain',
  [ChainId.SMART_CHAIN_TEST]: 'SmartChain',
  [ChainId.MAINNET]: 'Ethereum'
}

const NETWORK_SYMBOLS: any = {
  Ethereum: 'ETH',
  Rinkeby: 'ETH',
  Ropsten: 'ETH',
  Görli: 'ETH',
  Kovan: 'ETH',
  Avalanche: 'AVAX',
  SmartChain: 'BNB'
}

interface StyledCrossChainModalProps {
  isOpen: boolean
  onDismiss: () => void
  supportedChains: Array<CrosschainChain>
  activeChain?: string
  isTransfer?: boolean
  selectTransferChain: (str: CrosschainChain) => void
}
const ModalContainer = styled.div`
  padding: 1.5rem;
  width: 100%;
  h5 {
    font-weight: bold;
    margin-bottom: 1rem;
  }
  p {
    font-size: 0.85rem;
    margin-top: 1rem;
    line-height: 20px;
    color: #ced0d9;
    a {
      font-weight: bold;
      color: ${({ theme }) => theme.primary1};
      cursor: pointer;
      outline: none;
      text-decoration: none;
      margin-left: 4px;
      margin-right: 4px;
    }
  }
  ul {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-left: 0;
    padding-right: 0;
    li {
      display: flex;
      flex-direction: row;
      margin-bottom: .5rem;
      position: relative;
      padding: 12px;
      transition: all 0.2s ease-in-out;
      border-radius: 12px;
      align-items: center;
      &.active {
        background: rgba(255, 255, 255, 0.1);
        &:before {
          position: absolute;
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 100%;
          background: ${({ theme }) => theme.primary1};
          top: 8px;
          right: 8px;
        }
      }
      &.disabled {
        opacity: 0.35;
        pointer-events: none;
        user-select: none;
      }
      &.selectable {
        cursor: pointer;
        &:hover {
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.1);
        }
      }
      &:hover {
        background-color: blue;
      }
      img {
        margin-right: 0.5rem;
      }
      span {
      }
    }
  }
`

function StyledCrossChainModal({
  isOpen,
  onDismiss,
  supportedChains,
  activeChain,
  isTransfer,
  selectTransferChain
}: StyledCrossChainModalProps) {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ModalContainer>
        {<h5>Supported Blockchains:</h5>}
        <ul>
          <li className={'active'}>
            <BlockchainLogo size="28px" blockchain={activeChain} />
            <span>{activeChain}</span>
          </li>
          {supportedChains.map((chain: CrosschainChain) => (
            <li
              key={chain.chainID}
              onClick={() => {
                selectTransferChain(chain)
                onDismiss()

              }}
              className={`
              ${activeChain === chain.name && !isTransfer ? 'active' : ''}
              ${(activeChain === chain.name && isTransfer) || chain.name === 'Polkadot' ? 'disabled' : ''}
              ${isTransfer && activeChain !== chain.name ? 'selectable' : ''}
            `}
            >
              <BlockchainLogo size="28px" blockchain={chain.name} />
              <span>{chain.name}</span>
            </li>
          ))}
        </ul>
      </ModalContainer>
    </Modal>
  )
}


function NetworkSwitcher() {
  const { chainId } = useActiveWeb3React()
  const {
    availableChains: allChains,
  } = useCrosschainState()
  const availableChains = useMemo(() => {
    return allChains.filter(i => i.name !== (chainId ? CHAIN_LABELS[chainId] : 'Ethereum'))
  }, [allChains])

  const [crossChainModalOpen, setShowCrossChainModal] = useState(false)
  const hideCrossChainModal = () => {
    setShowCrossChainModal(false)
    // startNewSwap()
  }
  const showCrossChainModal = () => {
    setShowCrossChainModal(true)
  }

  const onSelectTransferChain = async (chain: CrosschainChain) => {
    let { ethereum } = window;
    if (ethereum) {
      let chainsConfig = null;
      for (const item of crosschainConfig.chains) {
        if (item.chainId === +chain.chainID) {
          chainsConfig = item
        }
      }
      if (chainsConfig) {
        const hexChainId = "0x" + Number(chainsConfig.networkId).toString(16);
        const data = [{
          chainId: hexChainId,
          chainName: chainsConfig.name,
          nativeCurrency:
          {
            name: chainsConfig.nativeTokenSymbol,
            symbol: chainsConfig.nativeTokenSymbol,
            decimals: 18
          },
          rpcUrls: [chainsConfig.rpcUrl],
          blockExplorerUrls: [chainsConfig.blockExplorer],
        }]
        /* eslint-disable */
        const tx = (ethereum && ethereum.request) ? await ethereum['request']({ method: 'wallet_addEthereumChain', params: data }).catch() : ''

        if (tx) {
          console.log(tx)
        }
      }
    }

  }
  return (
    <>
      <div onClick={showCrossChainModal}>
        <HideSmall>
          {chainId && NETWORK_LABELS[chainId] && (
            <NetworkCard title={NETWORK_LABELS[chainId]}>{NETWORK_LABELS[chainId]}</NetworkCard>
          )}
        </HideSmall>
        <StyledCrossChainModal
          isOpen={crossChainModalOpen}
          onDismiss={hideCrossChainModal}
          supportedChains={availableChains}
          selectTransferChain={onSelectTransferChain}
          activeChain={chainId ? NETWORK_LABELS[chainId] : 'Ethereum'}
        />
      </div>
    </>
  )
}

export default function Header() {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  const userEthBalance = useETHBalances(account ? [account] : [], chainId)?.[account ?? '']
  const [isDark] = useDarkModeManager()

  let label,
    symbol = ''
  if (chainId) {
    label = NETWORK_LABELS[chainId]
    symbol = NETWORK_SYMBOLS[label || 'Ethereum']
  }

  return (
    <HeaderFrame>
      <ClaimModal />
      <HeaderRow>
        <Title href=".">
          <UniIcon>
            <img width={'54px'} style={{ marginLeft: '1.5rem', marginRight: '1.5rem' }} src={isDark ? LogoDark : Logo} alt="logo" />
          </UniIcon>
        </Title>
        <HeaderLinks>
          <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
            <RefreshCw size={16} style={{ marginRight: '4px', marginTop: '2px' }} />
            {t('Swap')}
          </StyledNavLink>
          <StyledNavLink id={`earn-nav-link`} to={'/earn'}>
            <DollarSign size={16} style={{ marginRight: '4px', marginTop: '2px' }} />
            {t('Earn')}
          </StyledNavLink>
          <HeaderExternalLink href={`https://buy.0.exchange`}>
            <CreditCard size={16} style={{ marginRight: '4px', marginTop: '2px', marginBottom: '-3px' }} />
            Buy
          </HeaderExternalLink>
          <HeaderExternalLink href={`https://charts.0.exchange`}>
            <BarChart size={16} style={{ marginRight: '4px', marginTop: '2px', marginBottom: '-3px' }} />
            Charts
          </HeaderExternalLink>
          <HeaderExternalLink href={`https://zero-exchange.gitbook.io/zero-exchange-docs/`}>
            <Book size={16} style={{ marginRight: '4px', marginTop: '2px', marginBottom: '-2px' }} />
            Guides
          </HeaderExternalLink>
        </HeaderLinks>
      </HeaderRow>
      <HeaderControls>
        <HeaderElement>
          <NetworkSwitcher />
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            {account && userEthBalance ? (
              <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                {userEthBalance?.toSignificant(4)} {symbol}
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
        </HeaderElement>
        <HeaderElementWrap>
          <Settings />
          <Menu />
        </HeaderElementWrap>
      </HeaderControls>
    </HeaderFrame>
  )
}
