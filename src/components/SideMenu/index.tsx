import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

// import { DollarSign } from 'react-feather'
import { ExternalLink } from '../../theme'
import Icon from '../Icon'
import LogoDark from './../../assets/images/relay-icon.png'
import MenuBurger from './../MenuBurger'
import ModalMore from './../ModalMore'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import { useCrosschainState } from 'state/crosschain/hooks'

const SideMenuWrapper = styled.div<{ open?: boolean }>`
  height: 100%;
  width: 260px;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.35);
  justify-content: center;

  ${({ theme }) => theme.mediaWidth.upToMedium<{ open?: boolean }>`
    display: ${({ open }) => {
      return open ? 'flex' : 'none'
    }};
    position: fixed;
    background: rgba(0,0,0,.95);
    left: 0;
    top: 0;
    width: 100%;
    z-index: 1000000;
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
  span {
    &.active {
      color: ${({ theme }) => theme.white};
    }
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
const MoreLink = styled.span`
  display: flex;
  cursor: pointer;
  color: ${({ theme }) => theme.text2};
`
const Title = styled.a`
  position: absolute;
  top: 32px;
  left: 97px;
  width: 66px;
  height: 66px;
  cursor: pointer;
  z-index: 999;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  display: none;
  `};
`

export default function SideMenu() {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()
  const {currentChain} = useCrosschainState()

  const history = useHistory()
  const location = useLocation()
  const [pathname, setPathname] = useState(location.pathname)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [open, setOpen] = useState<boolean>(false)

  history.listen((location) => setPathname(location.pathname))
  const toggleOpen = () => {
    setOpen(!open)
  }
  const handleSideMenuOpen = () => width < 961 && setOpen(!open)

  return (
    <>
      <MenuBurger open={open} setOpen={toggleOpen} />

      <ModalMore isOpen={isOpenModal} onDismiss={() => setIsOpenModal(false)} />
      <SideMenuWrapper open={open}>
        <Title href="/">
          <img width={'100%'} src={LogoDark} alt="logo" />
        </Title>
        <HeaderLinks>
          {/*<StyledNavLink id={`swap-nav-link`} to={'/home'} onClick={handleSideMenuOpen}>
            <IconLink>
              <Icon icon="home" active={pathname === '/home'} />
            </IconLink>
            <span className={pathname === '/home' ? 'active' : ''}>{t('Home')}</span>
          </StyledNavLink> */}
          <StyledNavLink id={`transfer-nav-link`} to={'/transfer'} onClick={handleSideMenuOpen}>
            <IconLink>
              <Icon icon="bridges" active={pathname === '/transfer'} />
            </IconLink>
            <span className={pathname === '/transfer' ? 'active' : ''}>{t('Transfer')}</span>
          </StyledNavLink>
          <HeaderExternalLink href={`${currentChain.marketPlace !== undefined ? currentChain.marketPlace : 'https://app.pangolin.exchange/'}`}>
          
            <IconLink>
              <Icon icon="swap" />
            </IconLink>
            {t('Swap')}
          </HeaderExternalLink>
          <StyledNavLink id={`pools-nav-link`} to={'/pools'} onClick={handleSideMenuOpen}>
            <IconLink>
              <Icon icon="earn" active={pathname === '/pools'} />
            </IconLink>
            <span className={pathname === '/pools' ? 'active' : ''}>{t('Pools')}</span>
          </StyledNavLink>
          {/*
            <HeaderExternalLink href={`https://charts.0.exchange`}>
              <IconLink>
                <Icon icon="charts" />
              </IconLink>
              {t('Charts')}
            </HeaderExternalLink>
          */}
          {/*
            <StyledNavLink id={`pools-nav-link`} to={'/zero-gravity'} onClick={handleSideMenuOpen}>
              <IconLink>
                <Icon icon="trade" active={pathname.includes('zero-gravity')} />
              </IconLink>
              <span className={pathname.includes('zero-gravity') ? 'active' : ''}>{t('Zero Gravity')}</span>
            </StyledNavLink>
          */}
          {/* <StyledNavLink id={`staking-nav-link`} to={'/staking'} onClick={hanldeSidemenuOpen}>
            <IconLink>
              <Icon icon="market" active={pathname === '/staking'} />
            </IconLink>

            <span className={pathname === '/staking' ? 'active' : ''}>{t('Staking')}</span>
          </StyledNavLink> */}
          {/*<HeaderExternalLink href={`https://buy.0.exchange`} style={{ marginTop: '3rem' }}>
            <IconLink>
              <DollarSign size={20} />
            </IconLink>
            Buy ZERO
          </HeaderExternalLink>
          */}
          <StyledNavLink id={`pools-nav-link`} to={'/relay-sale'} onClick={handleSideMenuOpen}>
            <IconLink>
              <Icon icon="planet" active={pathname.includes('relay-sale')} />
            </IconLink>
            <span className={pathname.includes('relay-sale') ? 'active' : ''}>{t('Zero to Relay')}</span>
          </StyledNavLink>
          <MoreLink onClick={() => setIsOpenModal(true)}>
            <IconLink style={{ paddingTop: '4px' }}>
              <Icon icon="more" />
            </IconLink>
            {t('More ...')}
          </MoreLink>
        </HeaderLinks>
      </SideMenuWrapper>
    </>
  )
}
