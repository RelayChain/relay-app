import Row from 'components/Row'
import React from 'react'
import styled from 'styled-components'

const ToggleElement = styled.span<{ isActive?: boolean; isOnSwitch?: boolean }>`
  display: flex;
  height: 100%;
  align-items: center;
  padding: 0.25rem 0.5rem;
  background: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.primary1 : theme.text4) : 'none')};
  color: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.white : theme.text2) : theme.text3)};
  font-size: 1rem;
  font-weight: 400;

  padding: 0.35rem 0.6rem;
  border-radius: 12px;
  background: ${({ isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? '#6752F7' : '#6752F7') : 'none')};
  color: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.white : theme.white) : theme.text2)};
  font-size: 1rem;
  font-weight: ${({ isOnSwitch }) => (isOnSwitch ? '500' : '400')};
  :hover {
    user-select: ${({ isOnSwitch }) => (isOnSwitch ? 'none' : 'initial')};
    color: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.white : theme.white) : theme.text3)};
  }
`

const StyledToggle = styled.button<{ isActive?: boolean; activeElement?: boolean }>`
  border-radius: 12px;
  border: none;
  height: 48px;
  background: rgba(47, 53, 115, 0.32);
  box-shadow: inset 2px 2px 5px rgb(255 255 255 / 10%);
  -webkit-backdrop-filter: blur(28px);
  backdrop-filter: blur(28px);
  border-radius: 44px;
  display: flex;
  width: fit-content;
  cursor: pointer;
  outline: none;
  padding: 0;
`

const StackedWrap = styled.div`
  margin-right: 10px;
  cursor: pointer;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  font-size: 14px;
`};
`

export interface ToggleProps {
  isActive: boolean
  toggle: () => void
  isStaked: boolean
  setShowStaked: () => void
}

export default function Toggle({ isActive, toggle, isStaked, setShowStaked}: ToggleProps) {
  return (
      <Row>
        <StackedWrap>
        <input type="checkbox" id="stacked" checked={isStaked} onChange={setShowStaked}/>
        <label htmlFor="stacked">Staked only</label>
        </StackedWrap>
      <StyledToggle isActive={isActive} onClick={toggle}>
        <ToggleElement isActive={isActive} isOnSwitch={true}>
          Live
        </ToggleElement>
        <ToggleElement isActive={!isActive} isOnSwitch={false}>
          Finished
        </ToggleElement>
      </StyledToggle>
      </Row>
  )
}
