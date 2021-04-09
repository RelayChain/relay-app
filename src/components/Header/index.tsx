import { BarChart, Book, CreditCard, DollarSign, Menu as MenuIcon, RefreshCw } from 'react-feather'
import { ExternalLink, TYPE } from '../../theme'
import React, { useMemo, useState } from 'react'
import Row, { RowFixed } from '../Row'

import { CHAIN_LABELS } from '../../constants'
import { ChainId } from '@zeroexchange/sdk'
import ClaimModal from '../claim/ClaimModal'
// import EthereumLogo from '../../assets/images/ethereum-logo.png'
import Logo from '../../assets/svg/logo.svg'
import LogoDark from '../../assets/images/0-icon.png'
import Menu from '../Menu'
import Modal from 'components/Modal'
import { NavLink } from 'react-router-dom'
import Settings from '../Settings'
import { Text } from 'rebass'
import Web3Status from '../Web3Status'
import { YellowCard } from '../Card'
import { crosschainConfig } from '../../constants/CrosschainConfig';
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { useCrosschainState } from 'state/crosschain/hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances } from '../../state/wallet/hooks'
import { useTranslation } from 'react-i18next'
import CrossChainModal from 'components/CrossChainModal'

// import AvaxLogo from '../../assets/images/avax-logo.png'



// import { darken } from 'polished'


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
  transition: all .2s ease-in-out;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
  &:hover {
    filter: brightness(1.2);
    cursor: pointer;
  }
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
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

function NetworkSwitcher() {
  const { chainId } = useActiveWeb3React()
  const {
    availableChains: allChains,
    lastTimeSwitched
  } = useCrosschainState()
  const availableChains = useMemo(() => {
    return allChains.filter(i => i.name !== (chainId ? CHAIN_LABELS[chainId] : 'Ethereum'))
  }, [allChains])

  const [crossChainModalOpen, setShowCrossChainModal] = useState(false)
  const hideCrossChainModal = () => {
    setShowCrossChainModal(false)
  }
  const showCrossChainModal = () => {
    const currentTime = ~~(Date.now() / 1000)
    if(lastTimeSwitched < currentTime) {
      setShowCrossChainModal(true)
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
        <CrossChainModal
          isOpen={crossChainModalOpen}
          isTransfer={false}
          onDismiss={hideCrossChainModal}
          supportedChains={availableChains}
          selectTransferChain={() => { }}
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
