import React, { useState, useRef, useEffect } from 'react'
import { ExternalLink, TYPE } from '../../theme'
import styled, { css } from 'styled-components'
import DropdownArrow from '../../assets/svg/DropdownArrow'

const DropDownHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: border-radius 0.15s;
  height: 48px;
  background: rgba(47, 53, 115, 0.32);
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.095);
  backdrop-filter: blur(28px);
  border-radius: 44px;

  svg {
    g {
      fill: #727bba;
    }
  }
`

const DropDownListContainer = styled.div`
  min-width: 136px;
  height: 0;
  position: absolute;
  overflow: hidden;
  z-index: 999;
  transition: transform 0.15s, opacity 0.15s;
  transform: scaleY(0);
  transform-origin: top;
  opacity: 0;

  backdrop-filter: blur(28px);
`

const DropDownContainer = styled.div<{ isOpen: boolean; width: number; height: number }>`
  cursor: pointer;
  width: ${({ width }) => width}px;
  position: relative;
  border-radius: 16px;
  height: 48px;
  min-width: 136px;

  ${props =>
    props.isOpen &&
    css`
      ${DropDownHeader} {
        border-radius: 16px 16px 0 0;
      }

      ${DropDownListContainer} {
        height: auto;
        transform: scaleY(1);
        opacity: 1;
        border-top-width: 0;
        border-radius: 0 0 16px 16px;
      }
    `}

  svg {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }
`

const DropDownList = styled.ul`
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  z-index: 999;
  background: rgba(47, 53, 115, 0.32);
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.095);
  backdrop-filter: blur(28px);
`

const ListItem = styled.li`
  list-style: none;
  padding: 16px 24px;
  &:hover {
  }
`

export interface SelectProps {
  options: OptionProps[]
  onChange?: (option: OptionProps) => void
  sortedData?: any
}

export interface OptionProps {
  label: string
  value: any
}

const Select: React.FunctionComponent<SelectProps> = ({ options, onChange, sortedData }) => {
  const containerRef = useRef(null)
  const dropdownRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(options[0])
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  const toggling = () => setIsOpen(!isOpen)

  const onOptionClicked = (option: OptionProps) => () => {
    setSelectedOption(option)
    setIsOpen(false)

    if (onChange) {
      onChange(option)
    }
  }
  useEffect(() => {
    if (sortedData) {
      setSelectedOption(sortedData[0])
    }
    const container = dropdownRef.current
    if (container) {
      setContainerSize({
        width: container['offsetWidth'], // Consider border
        height: container['offsetHeight']
      })
    }
  }, [sortedData])

  return (
    <DropDownContainer isOpen={isOpen} ref={containerRef} {...containerSize}>
      {containerSize.width !== 0 && (
        <DropDownHeader onClick={toggling}>
          <ListItem>
            <TYPE.main fontWeight={600} fontSize={13}>
              {selectedOption.label}{' '}
            </TYPE.main>
            <DropdownArrow />
          </ListItem>
        </DropDownHeader>
      )}
      <DropDownListContainer>
        <DropDownList ref={dropdownRef}>
          {options.map(option =>
            option.label !== selectedOption.label ? (
              <ListItem onClick={onOptionClicked(option)} key={option.label}>
                <TYPE.main fontWeight={600} fontSize={13}>
                  {option.label}{' '}
                </TYPE.main>
              </ListItem>
            ) : null
          )}
        </DropDownList>
      </DropDownListContainer>
    </DropDownContainer>
  )
}

export default Select
