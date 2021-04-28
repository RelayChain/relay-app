import { Currency } from '@zeroexchange/sdk'
import React from 'react'
import styled from 'styled-components'
import CurrencyLogo from '../CurrencyLogo'

const Wrapper = styled.div<{ margin: boolean; sizeraw: number }>`
  position: relative;
  display: flex;
  flex-direction: row;
  height: ${({ sizeraw }) => `${sizeraw}px`};
  width: ${({ sizeraw }) => `${sizeraw * 1.75}px`};
  margin-right: ${({ sizeraw, margin }) => margin && (sizeraw / 3 + 8).toString() + 'px'};
`

interface DoubleCurrencyLogoProps {
  margin?: boolean
  size?: number
  currency0?: Currency|any
  currency1?: Currency|any
  style?: object
}

const HigherLogo = styled.div`
  z-index: 2;
`
const CoveredLogo = styled.div<{ sizeraw: number }>`
  position: absolute;
  z-index: 1;
  left: ${({ sizeraw }) => `${sizeraw * 0.75}px`} !important;
`

export default function DoubleCurrencyLogo({
  currency0,
  currency1,
  size = 16,
  margin = false,
  style
}: DoubleCurrencyLogoProps) {
  return (
    <Wrapper sizeraw={size} margin={margin} style={style}>
      {currency0 && (
        <HigherLogo>
          <CurrencyLogo currency={currency0} size={size.toString() + 'px'} />
        </HigherLogo>
      )}
      {currency1 && (
        <CoveredLogo sizeraw={size}>
          <CurrencyLogo currency={currency1} size={size.toString() + 'px'} />
        </CoveredLogo>
      )}
    </Wrapper>
  )
}
