import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import ArrowDropdown from './../../assets/svg/dropdown_arrow.svg'
import BlockchainLogo from '../BlockchainLogo'
import { CHAIN_LABELS } from '../../constants'
import { NETWORK_LABELS, NETWORK_SYMBOLS } from '@zeroexchange/sdk'
import ClaimModal from '../claim/ClaimModal'
import CrossChainModal from 'components/CrossChainModal'
import PlainPopup from 'components/Popups/PlainPopup'
import { PopupContent } from 'state/application/actions'
import { Text } from 'rebass'
import Web3Status from '../Web3Status'
import { YellowCard } from '../Card'
import { useActiveWeb3React, useEagerConnect } from '../../hooks'
import { useCrosschainState } from 'state/crosschain/hooks'

const HeaderFrame = styled.div`
  display: grid;
  padding: 0px 64px;
  grid-template-columns: 1fr 0px;
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
  padding: 22px 19px;
  display: flex;
  align-items: center;
  justify-self: flex-end;
  justify-content: space-between;
  background: rgba(47, 53, 115, 0.32);
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.095);
  backdrop-filter: blur(28px);
  border-radius: 44px;
  height: 76px;
  min-width: 525px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
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
  `};
`
const AccountElement = styled.div<{ active: boolean }>`
  width: 100%;
  white-space: nowrap;
  cursor: pointer;
  :focus {
    border: 1px solid blue;
  }
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
        selectTransferChain={() => { }}
        activeChain={chainId ? NETWORK_LABELS[chainId] : 'Ethereum'}
      />
      <PlainPopup isOpen={crossPopupOpen} onDismiss={hidePopupModal} content={popupContent} removeAfterMs={2000} />
    </div>
  )
}
const Header = () => {
  const { account, chainId } = useActiveWeb3React()
  // eslint-disable-next-line
  const [isSuccessAuth, userEthBalance] = useEagerConnect()
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
          <LogoBox className="relay-logo"></LogoBox>
          <LogoBox className="relay-name"></LogoBox>       
        </LogoContainer> 
      </HideMedium>
      {account ? (
        <HeaderControls>
          <HeaderElement>
            <NetworkSwitcher />
            <AccountElement active={!!account}>
              <BalanceText>
                {userEthBalance} {symbol}
              </BalanceText>
              <Web3Status />
            </AccountElement>
          </HeaderElement>
        </HeaderControls>
      ) : (
        <NotConnectedWrap>
          <Web3Status />
        </NotConnectedWrap>
      )}
    </HeaderFrame>
  )
}

export default Header
