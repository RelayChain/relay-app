import { AdvancedSwapDetails, AdvancedSwapDetailsProps } from './AdvancedSwapDetails'

import React from 'react'
import styled from 'styled-components'
import { useLastTruthy } from '../../hooks/useLast'

const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  padding-top: .5rem;
  padding-bottom: 20px;
  margin: 2rem auto 0;
  width: 100%;
  max-width: 400px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  color: ${({ theme }) => theme.text2};
  background-color: ${({ theme, show }) => (show ? theme.advancedBG : 'null')};
  z-index: -1;

  transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
  transition: transform 300ms ease-in-out;
`

export default function AdvancedSwapDetailsDropdown({ trade, ...rest }: AdvancedSwapDetailsProps) {
  const lastTrade = useLastTruthy(trade)

  return (
    <AdvancedDetailsFooter show={Boolean(trade)}>
      <AdvancedSwapDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
    </AdvancedDetailsFooter>
  )
}
