import React from 'react'
import styled from 'styled-components'

const StyledBurger = styled.button<{ open?: boolean }>`
  display: none;
  position: fixed;
  top: 5rem;
  right: 2rem;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 101;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  display: flex;
  overflow: hidden
`};

  ${({ theme }) => theme.mediaWidth.upToSmall`
top: 42px;
right: 22px;
`};

  &:focus {
    outline: none;
  }

  div {
    width: 2rem;
    height: 0.25rem;
    background: #effffa;
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;

    :first-child {
      transform: ${({ open }) => (open ? 'rotate(45deg)' : 'rotate(0)')};
    }

    :nth-child(2) {
      opacity: ${({ open }) => (open ? '0' : '1')};
      transform: ${({ open }) => (open ? 'translateX(20px)' : 'translateX(0)')};
    }

    :nth-child(3) {
      transform: ${({ open }) => (open ? 'rotate(-45deg)' : 'rotate(0)')};
    }
  }
`

export interface MenuBurgerProps {
  open: boolean
  setOpen: () => void
}

export default function MenuBurger({ open, setOpen }: MenuBurgerProps) {
  return (
    <StyledBurger open={open} onClick={setOpen}>
      <div />
      <div />
      <div />
    </StyledBurger>
  )
}
