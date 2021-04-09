import React, { useState } from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ExternalLink } from '../../theme'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import Icon from '../Icon'
import { useHistory, useLocation } from 'react-router-dom'

const SideMenuWrapper = styled.div<{ open?: boolean }>`
  height: 100%;
  width: 260px;
  z-index: 10;
  position: fixed;
  left: 0;
  top: 0;
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
  padding-left: 45px;
  height: 34%;
  margin-bottom: 10px;
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
  outline: none;
  cursor: pointer;
  text-transform: uppercase;
  font-size: 13px;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  width: fit-content;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  font-family: 'Poppins', sans-serif;
  &.${activeClassName} {
    color: ${({ theme }) => theme.white};
  }
`
const HeaderExternalLink = styled(ExternalLink)`
  color: ${({ theme }) => theme.text2};
  transition: all 0.2s ease-in-out;
  text-transform: uppercase;
  font-size: 13px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  :hover,
  :focus {
    text-decoration: none;
  }
`

const IconLink = styled.span`
  display: inline-block;
  margin-right: 20px;
`
export interface SideMenuProps {
  open: boolean
  setOpen: () => void
}

export default function SideMenu({ open, setOpen }: SideMenuProps) {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()
  const history = useHistory()
  const location = useLocation()
  const [pathname, setPathname] = useState(location.pathname)

  history.listen(location => setPathname(location.pathname))
  const hanldeSidemenuOpen = () => width < 961 && setOpen()

  if (width < 961 && !open) return null

  return (
    <SideMenuWrapper>
      <HeaderLinks>
        <StyledNavLink id={`swap-nav-link`} to={'/home'} onClick={hanldeSidemenuOpen}>
          <IconLink>
            <Icon icon="home" active={pathname == '/home'} />
          </IconLink>
          {t('Home')}
        </StyledNavLink>
        <StyledNavLink id={`swap-nav-link`} to={'/swap'} onClick={hanldeSidemenuOpen}>
          <IconLink>
            <Icon icon="swap" active={pathname == '/swap'} />
          </IconLink>
          {t('Swap')}
        </StyledNavLink>
        <StyledNavLink id={`earn-nav-link`} to={'/earn'} onClick={hanldeSidemenuOpen}>
          <IconLink>
            <Icon icon="earn" active={pathname == '/earn'} />
          </IconLink>
          {t('Earn')}
        </StyledNavLink>
        <span onClick={hanldeSidemenuOpen}>
          <HeaderExternalLink href={`https://buy.0.exchange`}>
            <IconLink>
              <Icon icon="market" />
            </IconLink>
            Buy
          </HeaderExternalLink>
        </span>
        <span onClick={hanldeSidemenuOpen}>
          <HeaderExternalLink href={`https://charts.0.exchange`}>
            <IconLink>
              <Icon icon="charts" />
            </IconLink>
            Charts
          </HeaderExternalLink>
        </span>
        <span onClick={hanldeSidemenuOpen}>
          <HeaderExternalLink href={`https://zero-exchange.gitbook.io/zero-exchange-docs/`}>
            <IconLink>
              <Icon icon="planet" />
            </IconLink>
            Guides
          </HeaderExternalLink>
        </span>
      </HeaderLinks>
    </SideMenuWrapper>
  )
}
