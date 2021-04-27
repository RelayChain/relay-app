import Row from 'components/Row'
import React from 'react'
import styled from 'styled-components'

const ToggleElement = styled.span<{ isActive?: boolean; isOnSwitch?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 100%;
  font-size: 13px;
  padding: 0.35rem 0.6rem;
  border-radius: 12px;
  background: ${({ isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? '#6752F7' : '#6752F7') : 'none')};
  color: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.white : theme.white) : theme.text2)};
  font-weight: ${({ isOnSwitch }) => (isOnSwitch ? '500' : '400')};
  :hover {
    user-select: ${({ isOnSwitch }) => (isOnSwitch ? 'none' : 'initial')};
    color: ${({ theme }) => theme.white};
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  width: 60px;
  font-size: 12px;
  `};
`

const StyledToggle = styled.button<{ isActive?: boolean; activeElement?: boolean }>`
  border-radius: 12px;
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
  height: 36px;
  `};
`

const StyledStacked = styled.div`
  display: inline-block;
  margin-right: 10px;
  > input {
    opacity: 0;
  }
  > input + label {
    position: relative;
    padding-left: 25px;
    cursor: pointer;
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-szie: 13px;
    `};
    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 1px;
      width: 17px;
      height: 17px;
      border: 1px solid rgba(47,53,115,0.92);
      border-radius: 10px;
      box-shadow: inset 0 1px 3px rgb(0 0 0 / 30%);
      background: rgba(47,53,115,0.12);
    }
    &:after {
      content: '✔';
      position: absolute;
      top: -6px;
      left: 2px;
      font-size: 21px;
      color: #6752F7;
      transition: all 0.2s;
    }
  }
  > input:not(:checked) + label {
    &:after {
      opacity: 0;
      transform: scale(0);
    }
  }
  > input:disabled:not(:checked) + label {
    &:before {
      box-shadow: none;
      border-color: #bbb;
      background-color: #ddd;
    }
  }
  > input:checked + label {
    &:after {
      opacity: 1;
      transform: scale(1);
    }
  }
  > input:disabled:checked + label {
    &:after {
      color: #999;
    }
  }
  > input:disabled + label {
    color: #aaa;
  }
  > input:checked:focus + label,
  input:not(:checked):focus + label {
    &:before {
      border: 1px dotted blue;
    }
  }
`

export interface ToggleProps {
  isActive: boolean
  toggle: () => void
  isStaked: boolean
  setShowStaked: () => void
}

export default function Toggle({ isActive, toggle, isStaked, setShowStaked }: ToggleProps) {
  return (
    <Row>
        <StyledStacked onClick={setShowStaked}>
          <input type="checkbox" checked={isStaked} />
          <label>Staked only</label>
        </StyledStacked>
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
