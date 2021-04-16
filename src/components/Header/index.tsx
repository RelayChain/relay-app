import { BarChart, Book, CreditCard, DollarSign, Menu as MenuIcon, RefreshCw } from 'react-feather'
import { ExternalLink, TYPE } from '../../theme'
import React, { useMemo, useState } from 'react'
import Row, { RowFixed } from '../Row'

import ArrowDropdown from './../../assets/svg/dropdown_arrow.svg'
import BlockchainLogo from '../BlockchainLogo'
import { CHAIN_LABELS } from '../../constants'
import { ChainId } from '@zeroexchange/sdk'
import ClaimModal from '../claim/ClaimModal'
import CrossChainModal from 'components/CrossChainModal'
import LogoDark from '../../assets/images/0-icon.png'
import Menu from '../Menu'
import Modal from 'components/Modal'
import { NavLink } from 'react-router-dom'
import PlainPopup from 'components/Popups/PlainPopup'
import { PopupContent } from 'state/application/actions'
import PopupItem from 'components/Popups/PopupItem'
import Settings from '../Settings'
import { Text } from 'rebass'
import Web3Status from '../Web3Status'
import { YellowCard } from '../Card'
// import EthereumLogo from '../../assets/images/ethereum-logo.png'
import ZeroLogo from '../../assets/images/zero-logo-text.png'
import { crosschainConfig } from '../../constants/CrosschainConfig'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { useCrosschainState } from 'state/crosschain/hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances } from '../../state/wallet/hooks'
import { useTranslation } from 'react-i18next'

// import AvaxLogo from '../../assets/images/avax-logo.png'

// import { darken } from 'polished'

const HeaderFrame = styled.div`
  display: grid;
  padding: 0px 64px;
  grid-template-columns: 1fr 0px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 25px;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    padding: 0;
    width: calc(100%);
    position: relative;
  `};
`
const LogoContainer = styled.div`
  display: flex;
  flex-grow: 1;
`
const HeaderControls = styled.div`
  padding: 22px 19px;
  display: flex;
  align-items: center;
  justify-self: flex-end;
  justify-content: space-between;
  background: rgba(47, 53, 115, 0.32);
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(28px);
  border-radius: 44px;
  height: 76px;
  min-width: 525px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    position: fixed;
    bottom: 0px;
    left: 0px;
    border-radius: 0;
    min-width: 0;
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
  transition: all 0.2s ease-in-out;
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
const HideMedium = styled.span`
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`
const NetworkCard = styled(YellowCard)`
  position: relative;
  padding-top: 10px;
  padding-left: 50px;
  width: 243px;
  height: 40px;
  letter-spacing: 0.05em;
  color: #ffffff;
  background: rgba(225, 248, 250, 0.12);
  border-radius: 54px;
  transition: all 0.2s ease-in-out;
  font-family: Poppins;
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  margin-right: 20px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
  &:hover {
    background: rgba(225, 248, 250, 0.16);
    cursor: pointer;
  }
`

const BalanceText = styled(Text)`
  font-family: Poppins;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 80%;
  letter-spacing: -0.01em;
  color: #ffffff;
  margin-bottom: 5px !important;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const BlockchainLogoWrap = styled.span`
  position: absolute;
  left: 5px;
  top: 5px;
`

const ArrowDropWrap = styled.span`
  position: absolute;
  right: 5px;
  top: 5px;
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
const popupContent: PopupContent = {
  simpleAnnounce: {
    message: 'Please wait 10 seconds to change RPCs again.'
  },
}
function NetworkSwitcher() {
  const { chainId } = useActiveWeb3React()
  const { availableChains: allChains, lastTimeSwitched } = useCrosschainState()
  const availableChains = useMemo(() => {
    return allChains.filter(i => i.name !== (chainId ? CHAIN_LABELS[chainId] : 'Ethereum'))
  }, [allChains])

  const [crossChainModalOpen, setShowCrossChainModal] = useState(false)
  const [crossPopupOpen, setShowPopupModal] = useState(false)
  const hideCrossChainModal = () => {
    setShowCrossChainModal(false)
  }

  const hidePopupModal = () => {
    setShowPopupModal(false)
  }

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
    <>
      <div onClick={showCrossChainModal}>

        <HideSmall>
          {chainId && NETWORK_LABELS[chainId] && (
            <NetworkCard title={NETWORK_LABELS[chainId]}>
              <BlockchainLogoWrap>
                <BlockchainLogo size="28px" blockchain={chainId ? NETWORK_LABELS[chainId] : 'Ethereum'} />
              </BlockchainLogoWrap>
              <span>{NETWORK_LABELS[chainId]}</span>
              <ArrowDropWrap>
                <img src={ArrowDropdown} alt="ArrowDropdown" />
              </ArrowDropWrap>
            </NetworkCard>
          )}
        </HideSmall>
        <CrossChainModal
          isOpen={crossChainModalOpen}
          isTransfer={false}
          onDismiss={hideCrossChainModal}
          supportedChains={availableChains}
          selectTransferChain={() => {}}
          activeChain={chainId ? NETWORK_LABELS[chainId] : 'Ethereum'}
        />
        <PlainPopup isOpen={crossPopupOpen} onDismiss={hidePopupModal} content={popupContent} removeAfterMs={2000} />
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
      <HideMedium>
        <LogoContainer>
          <img src={ZeroLogo} />
        </LogoContainer>
      </HideMedium>

      <HeaderControls>

        <HeaderElement>

          <NetworkSwitcher />
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            {account && userEthBalance ? (
              <BalanceText>
                {userEthBalance?.toSignificant(4)} {symbol}
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
        </HeaderElement>
        <HeaderElementWrap>
          <Settings />
        </HeaderElementWrap>
      </HeaderControls>
    </HeaderFrame>
  )
}
