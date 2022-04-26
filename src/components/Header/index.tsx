import { NavLink, useLocation } from 'react-router-dom'
import React, { useState } from 'react'

import ClaimModal from '../claim/ClaimModal'
import MenuBurger from 'components/MenuBurger'
import ModalMenu from 'components/ModalMenu'
import ModalMore from './../ModalMore'
import Web3Status from '../Web3Status'
import styled from 'styled-components'
import { MobileResponsiveProps } from 'components/Interfaces/interface'

const HeaderFrame = styled.div<MobileResponsiveProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 60px;
  width: 100%;
  position: relative;
  z-index: 2;

  @media screen and (max-width: 640px) {
    padding: ${props => (props.widget ? '0px 15px' : '20px 15px')};
  }
  // ${({ theme }) => theme.mediaWidth.upToMedium`
  // padding: 20px 15px;
  // `};
`
const HideMedium = styled.span`
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`

const LogoContainer = styled.div`
  display: flex;
`

const MenuBar = styled.div<MobileResponsiveProps>`
  display: ${props => (props.widget ? 'none' : 'flex')};
  justify-content: flex-end;
  align-items: center;
  margin-right: 4rem;
  margin-left: auto;
`
const StyledNavLink = styled(NavLink)`
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 27px;
  text-decoration: none;
  color: #ffffff;
  padding: 0 15px;
`
const LogoNavLink = styled(NavLink)`
  display: flex;
  flex-direction: row;
`
const MenuBurgerStyled = styled(MenuBurger)`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: block;
`};
`

const Header = () => {
  const [open, setOpen] = useState<boolean>(false)
  const location = useLocation()
  const [pathname, setPathname] = useState(location.pathname)

  const toggleOpen = () => {
    setOpen(!open)
  }

  return (
    <HeaderFrame widget={location.search === '?widget' ? 'true' : ''}>
      <ClaimModal />
      <HideMedium>
        <LogoContainer>
          <LogoNavLink
            to={location.search ? location.pathname + location.search : '/cross-chain-bridge-transfer'}
            onClick={() =>
              setPathname(location.search ? location.pathname + location.search : '/cross-chain-bridge-transfer')
            }
          >
            <div className="relay-logo" style={{ cursor: 'pointer' }}></div>
            <div className="relay-name" style={{ cursor: 'pointer' }}></div>
          </LogoNavLink>
        </LogoContainer>
      </HideMedium>
      <MenuBar widget={location.search === '?widget' ? 'true' : ''}>
        <StyledNavLink
          id={`bridge-nav-link`}
          to={'/cross-chain-bridge-transfer'}
          onClick={() => setPathname('/cross-chain-bridge-transfer')}
          style={
            pathname === '/cross-chain-bridge-transfer' || pathname === '/' ? { fontWeight: 700 } : { fontWeight: 400 }
          }
        >
          Bridges
        </StyledNavLink>
        <StyledNavLink
          id={`stake-nav-link`}
          to={'/single-sided-staking'}
          onClick={() => setPathname('/single-sided-staking')}
          style={pathname === '/single-sided-staking' ? { fontWeight: 700 } : { fontWeight: 400 }}
        >
          Staking
        </StyledNavLink>
        <StyledNavLink
          id={`stats-nav-link`}
          to={'/stats'}
          onClick={() => setPathname('/stats')}
          style={pathname === '/stats' ? { fontWeight: 700 } : { fontWeight: 400 }}
        >
          Stats
        </StyledNavLink>
        <StyledNavLink
          id={`liquidity-staking-nav-link`}
          to={'/liquidity-staking'}
          onClick={() => setPathname('/liquidity-staking')}
          style={pathname === '/liquidity-staking' ? { fontWeight: 700 } : { fontWeight: 400 }}
        >
          LiquidityStaking
        </StyledNavLink>
        <MenuBurgerStyled open={open} setOpen={toggleOpen} showLogo={false} />
      </MenuBar>
      <Web3Status />
      <ModalMore isOpen={open} onDismiss={() => setOpen(false)} />
    </HeaderFrame>
  )
}

export default Header
