import React, { FormEvent, useState } from 'react'

import  BubbleBase from './../BubbleBase'
import styled from 'styled-components'

export type DropDownProps = {
  options: {
    label: string
    value: string
  }[]
}

const DropDownBox = styled.div`
  position: relative;
  color: #727bba;
  width: 150px;
`
const Select = styled.select`
  cursor: pointer;
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: rgba(47, 53, 115, 0.32);
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.095);
  backdrop-filter: blur(28px);
  padding-left: 24px;
  border-radius: 44px;
  border: none;
  width: 150px;
  height: 48px;
  font-family: Poppins;
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 19px;
  letter-spacing: 0.05em;
  color: #a7b1f4;
`
const DropDownBoxArrow = styled.div`
  position: absolute;
  cursor: pointer;
  top: 50%;
  right: 4px;
  transform: translateY(-50%);
`
const Option = styled.option`
font-family: Poppins;
font-style: normal;
font-weight: 600;
font-size: 13px;
line-height: 19px;
letter-spacing: 0.05em;
color: #A7B1F4;`

const DropDown = ({ options }: DropDownProps) => {
  const [selected, setSelected] = useState<string>(options[0].value)

  const onChange = (e: FormEvent<HTMLSelectElement>) => {
    setSelected(e.currentTarget.value)
  }

  return (
    <DropDownBox>
        <BubbleBase/>
      <Select value={selected} onChange={onChange}>
        {options.map((o, index) => (
          <Option key={index} value={o.value}>
            {o.label}
          </Option>
        ))}
      </Select>
      <DropDownBoxArrow>
        <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2.17651 2.39708L8.17651 8.39708L14.1765 2.39708"
            stroke="#727BBA"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </DropDownBoxArrow>
    </DropDownBox>
  )
}

export default DropDown
