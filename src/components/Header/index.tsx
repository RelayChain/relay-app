import { NavLink, useLocation } from 'react-router-dom'
import React, { useState } from 'react'

import ClaimModal from '../claim/ClaimModal'
import MenuBurger from 'components/MenuBurger'
import ModalMenu from 'components/ModalMenu'
import Web3Status from '../Web3Status'
import styled from 'styled-components'

const HeaderFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 60px;
  width: 100%;
  position: relative;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding: 20px 15px;

  `};
`
const HideMedium = styled.span`
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`

const LogoContainer = styled.div`
  display: flex;
`

const MenuBar = styled.div`
  display: flex;
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
    <HeaderFrame>
      <ClaimModal />
      <HideMedium>
        <LogoContainer>
          <div className="relay-logo"></div>
          <div className="relay-name"></div>
        </LogoContainer>
      </HideMedium>
      <MenuBar>
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
        <MenuBurgerStyled open={open} setOpen={toggleOpen} showLogo={false} />
      </MenuBar>
      <Web3Status />
      <ModalMenu isOpen={open} onDismiss={() => setOpen(false)} />
    </HeaderFrame>
  )
}

export default Header
