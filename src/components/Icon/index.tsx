import React from 'react'
import styled from 'styled-components'
import Icons from './Icons'

const StyledSpan = styled.span`
  width: 20px;
  height: 20px;
`
export interface IconProps {
  icon: string
  active?: boolean
}

const Icon = ({ icon, active = false  }: IconProps) => {
  const IconPath = Icons[icon]
  return (
    <StyledSpan>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <IconPath color={active ? 'white' : '#A7B1F4'} />
      </svg>
    </StyledSpan>
  )
}

export default Icon
