import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { BarChart, Book, CreditCard, DollarSign, RefreshCw, Home } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { ExternalLink } from '../../theme'
import useWindowDimensions from '../../hooks/useWindowDimensions'

const SideMenuWrapper = styled.div<{ open?: boolean }>`
  height: 100%;
  width: 260px;
  z-index: 10;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  width: 100%;
  z-index: 100;
  background-color: rgba(0,0,0);
  align-items: center;
`};
`
const HeaderLinks = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-left: 35px;
  height: 34%;
  font-weight: 600;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding-left: 0px;
`};
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
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  font-family: 'Poppins', sans-serif;
  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.white};
  }

  :hover,
  :focus {
    color: ${({ theme }) => theme.white};
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
      font-size: .85rem;
      margin: 0 6px;
  `};
`

const HeaderExternalLink = styled(ExternalLink)`
  margin: 0 16px;
  color: #c3c5cb;
  transition: all 0.2s ease-in-out;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin: 0 6px;
    font-size: .85rem;
  `};
  :hover,
  :focus {
    color: ${({ theme }) => theme.white};
    text-decoration: none;
  }
`

export interface SideMenuProps {
  open: boolean
  setOpen: () => void
}

export default function SideMenu({ open, setOpen }: SideMenuProps) {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()

  const hanldeSidemenuOpen = () => {
    if (width < 961) {
      setOpen()
    }
  }
  if (width < 961 && !open) return null
  return (
    <SideMenuWrapper>
      <HeaderLinks>
        <StyledNavLink id={`swap-nav-link`} to={'/home'} onClick={hanldeSidemenuOpen}>
          <Home size={16} style={{ marginRight: '20px', marginTop: '2px' }} />
          {t('home')}
        </StyledNavLink>
        <StyledNavLink id={`swap-nav-link`} to={'/swap'} onClick={hanldeSidemenuOpen}>
          <RefreshCw size={16} style={{ marginRight: '20px', marginTop: '2px' }} />
          {t('swap')}
        </StyledNavLink>
        <StyledNavLink id={`earn-nav-link`} to={'/earn'} onClick={hanldeSidemenuOpen}>
          <DollarSign size={16} style={{ marginRight: '20px', marginTop: '2px' }} />
          {t('Earn')}
        </StyledNavLink>
        <span onClick={hanldeSidemenuOpen}>
          <HeaderExternalLink href={`https://buy.0.exchange`}>
            <CreditCard size={16} style={{ marginRight: '20px', marginTop: '2px', marginBottom: '-3px' }} />
            Buy
          </HeaderExternalLink>
        </span>
        <span onClick={hanldeSidemenuOpen}>
          <HeaderExternalLink href={`https://charts.0.exchange`}>
            <BarChart size={16} style={{ marginRight: '20px', marginTop: '2px', marginBottom: '-3px' }} />
            Charts
          </HeaderExternalLink>
        </span>
        <span onClick={hanldeSidemenuOpen}>
          <HeaderExternalLink href={`https://zero-exchange.gitbook.io/zero-exchange-docs/`}>
            <Book size={16} style={{ marginRight: '20px', marginTop: '2px', marginBottom: '-2px' }} />
            Guides
          </HeaderExternalLink>
        </span>
      </HeaderLinks>
    </SideMenuWrapper>
  )
}
