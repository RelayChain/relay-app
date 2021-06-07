import React from 'react'
import styled from 'styled-components'

import {useApplicationState} from 'state/application/hooks'
import LogoGradient from './../../assets/svg/gradient-circle-logo-relay.svg'
import LogoLight from './../../assets/svg/white-circle-logo-relay.svg'

const Header = styled.div<{isLightMode: boolean}>`
  background: ${({ isLightMode }) => (isLightMode ? '' : '#fff')};
  display: none;
  backdrop-filter: blur(28px);
  align-items: center;
  justify-content: space-between;
  z-index: 10;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  display:flex;
  padding:16px;
`};
`
const Title = styled.a`
  width: 66px;
  height: 66px;
  cursor: pointer;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  width: 46px;
  height: 46px;
  left: 22px;
  z-index: 3;
  `};
`
const StyledBurger = styled.button<{ open?: boolean, isLightMode: boolean }>`
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 101;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: flex;
    overflow: hidden
    top: 42px;
    right: 22px;
  `};

  &:focus {
    outline: none;
  }

  div {
    width: 100%;
    height: 4px;
    background: ${({ isLightMode }) => (isLightMode ? '#effffa' : '#000')};
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;

    :first-child {
      transform: ${({ open }) =>
        open ? `rotate(45deg) scaleX(${Math.sqrt(2)})` : `rotate(0) scaleX(${Math.sqrt(2)})`};
    }

    :nth-child(2) {
      opacity: ${({ open }) => (open ? '0' : '1')};
      transform: ${({ open }) => (open ? 'translateX(20px)' : 'translateX(0)')};
    }

    :nth-child(3) {
      transform: ${({ open }) =>
        open ? `rotate(-45deg) scaleX(${Math.sqrt(2)})` : `rotate(0) scaleX(${Math.sqrt(2)})`};
    
  }
`

export interface MenuBurgerProps {
  open: boolean
  setOpen: () => void
}

export default function MenuBurger({ open, setOpen }: MenuBurgerProps) {
  const {isLightMode} = useApplicationState()
  return (
    <Header isLightMode={isLightMode}>
      <Title href="/">
        <img width={'100%'} src={!isLightMode ? LogoGradient : LogoLight} alt="logo" />
      </Title>
      <StyledBurger open={open} onClick={setOpen} isLightMode={isLightMode}>
        <div />
        <div />
        <div />
      </StyledBurger>
    </Header>
  )
}
