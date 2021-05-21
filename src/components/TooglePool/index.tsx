import React from 'react'
import Row from 'components/Row'
import styled from 'styled-components'
import { AppDispatch } from '../../state'
import { setToggle } from './../../state/pools/actions'
import { useDispatch } from 'react-redux'
import { usePoolsState } from './../../state/pools/hooks'
const ToggleElement = styled.span<{ isLive?: boolean; isOnSwitch?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 100%;
  font-size: 13px;
  padding: 0.35rem 0.6rem;
  border-radius: 12px;
  background: ${({ isLive, isOnSwitch }) => (isLive ? (isOnSwitch ? '#6752F7' : '#6752F7') : 'none')};
  color: ${({ theme, isLive, isOnSwitch }) => (isLive ? (isOnSwitch ? theme.white : theme.white) : theme.text2)};
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

const StyledToggle = styled.button<{ isLive?: boolean; activeElement?: boolean }>`
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
  margin-right: 20px;
  > input {
    opacity: 0;
  }
  > input + label {
    position: relative;
    padding-left: 25px;
    cursor: pointer;
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 12px;
    margin-right: 10px;
    `};
    &:before {
      content: '';
      position: absolute;
      left: -8px;
      top: -2px;
      width: 22px;
      height: 22px;
      border: 2px solid rgba(179, 104, 252, 1);
      border-radius: 6px;
      box-shadow: inset 0 1px 3px rgb(0 0 0 / 30%);
      background: rgba(179, 104, 252, 0.25);
    }
    &:after {
      content: '✔';
      position: absolute;
      top: -6px;
      left: -2px;
      font-size: 21px;
      color: rgba(179, 104, 252, 1);
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

const AlignCenter = styled.div`
  align-items: center;
  display: flex;
`

export interface ToggleProps {
  isLive: boolean
  onSortChange: (key: string, value: string | boolean) => void
  isStaked: boolean
}

export default function Toggle({ isLive, onSortChange, isStaked }: ToggleProps) {
  return (
    <AlignCenter>
      <StyledStacked onClick={() => onSortChange('isStaked', !isStaked)}>
        <input type="checkbox" checked={isStaked} readOnly />
        <label>Staked only</label>
      </StyledStacked>
      <StyledToggle isLive={isLive} onClick={() => onSortChange('isLive', !isLive)}>
        <ToggleElement isLive={isLive} isOnSwitch={true}>
          Live
        </ToggleElement>
        <ToggleElement isLive={!isLive} isOnSwitch={false}>
          Finished
        </ToggleElement>
      </StyledToggle>
    </AlignCenter>
  )
}
