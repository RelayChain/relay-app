import React from 'react'

export type ArroDownProps = {
    conditionInput: any
    conditionOutput: any
    defaultColor: string
    activeColor: string
}

const ArrowDown = ({conditionInput, conditionOutput, defaultColor, activeColor}: ArroDownProps) => {
    return (
        <svg width="21" height="13" viewBox="0 0 21 13" fill="none" xmlns="http://www.w3.org/2000/svg" >
          <path d="M2.23535 2.52942L10.2354 10.5294L18.2354 2.52942" stroke={conditionInput && conditionOutput ? defaultColor : activeColor} stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    )
}

export default ArrowDown