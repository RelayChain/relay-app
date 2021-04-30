import React from 'react'
import styled from 'styled-components'

const ToggleElement = styled.span<{ isActive?: boolean; isOnSwitch?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100%;
  font-size: 13px;
  padding: 0.35rem 0.6rem;
  border-radius: 25px;
  background: ${({ isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? '#6752F7' : '#6752F7') : 'none')};
  color: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.white : theme.white) : theme.text2)};
  font-weight: ${({ isOnSwitch }) => (isOnSwitch ? '500' : '400')};
  :hover {
    user-select: ${({ isOnSwitch }) => (isOnSwitch ? 'none' : 'initial')};
    color: ${({ theme }) => theme.white};
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
width: 90px;
`};
`

const StyledToggle = styled.button<{ isActive?: boolean; activeElement?: boolean }>`
  border-radius: 25px;
  border: none;
  height: 48px;
  background: rgba(47, 53, 115, 0.32);
  box-shadow: inset 2px 2px 5px rgb(255 255 255 / 10%);
  -webkit-backdrop-filter: blur(28px);
  backdrop-filter: blur(28px);
  display: flex;
  width: fit-content;
  cursor: pointer;
  outline: none;
  padding: 0;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
height: 40px;
`};
`
export interface ToggleProps {
  isActive: boolean
  toggle: () => void
  text1: string
  text2: string
}

export default function Toggle({ isActive, toggle, text1, text2 }: ToggleProps) {
  return (
    <StyledToggle isActive={isActive} onClick={() => toggle()}>
      <ToggleElement isActive={isActive} isOnSwitch={false}>
        {text1}
      </ToggleElement>
      <ToggleElement isActive={!isActive} isOnSwitch={true}>
        {text2}
      </ToggleElement>
    </StyledToggle>
  )
}
