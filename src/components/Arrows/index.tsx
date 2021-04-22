import React from 'react'

export type ArroDownProps = {
    conditionInput?: any
    conditionOutput?: any
    defaultColor?: string
    activeColor?: string
}

export type ArrowRight = {
    color?: string
}

export const ArrowDown = ({conditionInput, conditionOutput, defaultColor = 'white', activeColor = 'white'}: ArroDownProps) => {
    return (
        <svg width="21" height="13" viewBox="0 0 21 13" fill="none" xmlns="http://www.w3.org/2000/svg" >
          <path d="M2.23535 2.52942L10.2354 10.5294L18.2354 2.52942" stroke={conditionInput && conditionOutput ? defaultColor : activeColor} stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    )
}

export const ArrowRight = ({color = '#727BBA'}: ArrowRight) => {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12.2354 23.5293L20.2354 15.5293L12.2354 7.5293"
          stroke={color}
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    )
  }
