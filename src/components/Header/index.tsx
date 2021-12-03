import { NETWORK_LABELS } from '@zeroexchange/sdk'
import CrossChainModal from 'components/CrossChainModal'
import MenuBurger from 'components/MenuBurger'
import ModalMenu from 'components/ModalMenu'
import PlainPopup from 'components/Popups/PlainPopup'
import React, { useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { PopupContent } from 'state/application/actions'
import { useCrosschainState } from 'state/crosschain/hooks'
import styled from 'styled-components'
import { CHAIN_LABELS } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import BlockchainLogo from '../BlockchainLogo'
import { YellowCard } from '../Card'
import ClaimModal from '../claim/ClaimModal'
import Web3Status from '../Web3Status'
import ArrowDropdown from './../../assets/svg/dropdown_arrow.svg'

const HeaderFrame = styled.div`
  display: grid;
  padding: 0px 64px;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  width: 100%;
  top: 25px;
  position: relative;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    top: 0px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    grid-template-columns: 1fr;
    padding: 0;
    width: calc(100%);
  `};
`
const HideMedium = styled.span`
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`
const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`
const LogoContainer = styled.div`
  display: flex;
  flex-grow: 1;
`
const SupTitle = styled.h1`
  font-size: 40px;
`
const HeaderControls = styled.div`
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-self: flex-end;
  justify-content: space-between;
  background: linear-gradient(4.66deg, rgba(102, 102, 102, 0.2) 3.92%, rgba(255, 255, 255, 0) 96.38%);
  border-radius: 50px;
  border: 2px solid;
  border-image-source: linear-gradient(180deg, rgba(254, 254, 254, 0.02) 0%, rgba(254, 254, 254, 0.16) 100%);
  min-width: 525px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    background: rgba(47, 53, 115);
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
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row-reverse;
  `};
`

const NetworkCard = styled(YellowCard)`
  width: 243px;
  padding: 9px;
  display: flex;
  align-items: center;
  letter-spacing: 0.05em;
  color: #ffffff;
  background: linear-gradient(180deg, rgba(173, 0, 255, 0.25) 0%, rgba(97, 0, 143, 0.25) 100%);
  border-radius: 54px;
  transition: all 0.2s ease-in-out;
  font-family: Poppins;
  font-weight: 300;
  font-size: 15px;
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
    filter: brightness(1.3);
    cursor: pointer;
  }
`

const NotConnectedWrap = styled.div`
  padding: 22px 19px;
  display: flex;
  align-items: center;
  justify-self: flex-end;
  justify-content: space-between;
  min-width: 0px;
  height: 0px;
  &.no-point {
    pointer-events: none;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    position: relative;
    margin: 0 auto;
  `};
`

const LogoBox = styled.div`
  heigth: 30px;
`
const popupContent: PopupContent = {
  simpleAnnounce: {
    message: 'Please wait 5 seconds to change RPCs again.'
  }
}

const MenuBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 50px;
  }
`
const StyledNavLink = styled(NavLink)`
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 27px;
  color: #ffffff;
  :first-child {
    margin-right: 20px;
  }
`
const MenuBurgerStyled = styled(MenuBurger)``
const NetworkSwitcher = () => {
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
      <HideSmall>
        {chainId && NETWORK_LABELS[chainId] && (
          <NetworkCard title={NETWORK_LABELS[chainId]}>
            <BlockchainLogo size="28px" blockchain={chainId ? NETWORK_LABELS[chainId] : 'Ethereum'} />

            <span style={{ paddingLeft: '5px' }}>{NETWORK_LABELS[chainId]}</span>

            <img src={ArrowDropdown} alt="ArrowDropdown" style={{ marginLeft: 'auto' }} />
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
  )
}
const Header = () => {
  const { account, chainId } = useActiveWeb3React()
  const [open, setOpen] = useState<boolean>(false)
  const location = useLocation()
  const [pathname, setPathname] = useState(location.pathname)
  const [isOpenModal, setIsOpenModal] = useState(false)

  const toggleOpen = () => {
    setOpen(!open)
  }

  return (
    <HeaderFrame>
      <ClaimModal />
      <HideMedium>
        <LogoContainer>
          <LogoBox className="relay-logo"></LogoBox>
          <LogoBox className="relay-name"></LogoBox>
        </LogoContainer>
      </HideMedium>
      <MenuBar>
        <StyledNavLink
          id={`bridge-nav-link`}
          to={'/cross-chain-bridge-transfer'}
          onClick={() => setPathname('/cross-chain-bridge-transfer')}
        >
          <span style={pathname === '/cross-chain-bridge-transfer' ? { fontWeight: 700 } : { fontWeight: 500 }}>
            Bridge
          </span>
        </StyledNavLink>
        <StyledNavLink
          id={`stake-nav-link`}
          to={'/single-sided-staking'}
          onClick={() => setPathname('/single-sided-staking')}
        >
          <span style={pathname === '/single-sided-staking' ? { fontWeight: 700 } : { fontWeight: 500 }}>Staking</span>
        </StyledNavLink>
        <MenuBurgerStyled open={open} setOpen={toggleOpen} showLogo={false} />
      </MenuBar>
      {account ? (
        <HeaderControls>
          <HeaderElement>
            <NetworkSwitcher />
            <Web3Status />
          </HeaderElement>
        </HeaderControls>
      ) : (
        <NotConnectedWrap>
          <Web3Status />
        </NotConnectedWrap>
      )}
      <ModalMenu isOpen={open} onDismiss={() => setOpen(false)} />
    </HeaderFrame>
  )
}

export default Header
