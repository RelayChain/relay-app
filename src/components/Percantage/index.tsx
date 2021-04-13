import React from 'react'
import styled from 'styled-components'

import toPercentage from './../../utils/toPercentage'

export type PercentageProps = {
  value: number
}

const Text = styled.span<{ value: number }>`
  margin-left: 10px;
  font-size: 12px;
  font-family: 'Poppins', sans-serif;
  color: ${({ value }) => (value < 0 ? '#FF574D' : '#57DC19')};
`

const Percentage = ({ value }: PercentageProps) => {
  return <Text value={value}>{`${value > 0 ? '+' : ''}${toPercentage(value)}%`}</Text>
}

export default Percentage
