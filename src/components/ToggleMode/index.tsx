import React, { useState, memo } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { setLightMode } from '../../state/application/actions'
import { useApplicationState } from '../../state/application/hooks'

import './toggleMode.css'

const Title = styled.h3`
  font-family: Poppins;
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 19px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`

const LightTitle = styled(Title)<{isLightMode: boolean}>`
  color: ${({ isLightMode }) => isLightMode ?  '#a7b1f4' : '#7C69FF'};
`

const DarkTitle = styled(Title)<{isLightMode: boolean}>`
  color: ${({ isLightMode }) => isLightMode ?  '#fff' : '#a7b1f4'};
`



const ToggleElement = () => {
  const { isLightMode } = useApplicationState()

  const dispatch = useDispatch()

  return (
    <div className="flex">
      <LightTitle isLightMode={isLightMode}>LIGHT</LightTitle>
      <label className="switch">
        <input
          onChange={() => dispatch(setLightMode({ isLightModePayload: !isLightMode }))}
          type="checkbox"
          checked={isLightMode}
        />
        <span className="slider round"></span>
      </label>
      <DarkTitle isLightMode={isLightMode}>DARK</DarkTitle>
    </div>
  )
}

const ToggleMode = memo(ToggleElement)

export default ToggleMode
