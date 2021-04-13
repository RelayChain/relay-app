import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import ModalMore from './../ModalMore'
import { ExternalLink } from '../../theme'
import Icon from '../Icon'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import useWindowDimensions from '../../hooks/useWindowDimensions'

const SideMenuWrapper = styled.div<{ open?: boolean }>`
  height: 100%;
  width: 260px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-right: 1px solid rgba(103, 82, 247, 0.25);
  ${({ theme }) => theme.mediaWidth.upToMedium`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 100;
  background: #000;
  border-right: 0;
  align-items: center;
  z-index: 2
`};
`
const HeaderLinks = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-left: 45px;
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
  margin-bottom: 1.5rem;
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
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
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
  const [isOpenModal, setIsOpenModal] = useState(false)

  history.listen(location => setPathname(location.pathname))

  const hanldeSidemenuOpen = () => width < 961 && setOpen()

  if (width < 961 && !open) return <ModalMore isOpen={isOpenModal} onDismiss={() => setIsOpenModal(false)} />

  return (
    <>
      <ModalMore isOpen={isOpenModal} onDismiss={() => setIsOpenModal(false)} />
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
          <StyledNavLink id={`transfer-nav-link`} to={'/transfer'} onClick={hanldeSidemenuOpen}>
            <IconLink>
              <Icon icon="bridges" active={pathname == '/transfer'} />
            </IconLink>
            Transfer
          </StyledNavLink>
          <StyledNavLink id={`pools-nav-link`} to={'/pools'} onClick={hanldeSidemenuOpen}>
            <IconLink>
              <Icon icon="earn" active={pathname == '/pools'} />
            </IconLink>
            {t('Pools')}
          </StyledNavLink>
          <HeaderExternalLink href={`https://charts.0.exchange`}>
            <IconLink>
              <Icon icon="charts" />
            </IconLink>
            Charts
          </HeaderExternalLink>
          <StyledNavLink to={'/more'} onClick={() => setIsOpenModal(true)}>
            <IconLink>
              <Icon icon="planet" />
            </IconLink>
            {t('More')}
          </StyledNavLink>
        </HeaderLinks>
      </SideMenuWrapper>
    </>
  )
}
