import React from 'react'
import styled from 'styled-components'

import toPercentage from './../../utils/toPercentage'

export type PercentageProps = {
  value: number
}

const Text = styled.span<{ value: number }>`
    font-size: 22px;
    font-family: 'Poppins', sans-serif;
    color: ${({ value }) => value < 0 ? 'red' : 'lime'};
`

const Percentage = ({ value }: PercentageProps) => {
  return (
    <Text value={value}>
      {`${value > 0 ? '+' : ''}${toPercentage(value)}%`}
    </Text>
  )
}

export default Percentage
