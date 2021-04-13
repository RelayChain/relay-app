import React, { ReactNode } from 'react'
import styled from 'styled-components'

import Background from './Background'
import Icon from './../Icon'

const BubbleWrap = styled.div`
  position: relative;
  width: 261px;
  height: 162px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  width: 156px;
  height: 97px;
`};
`
const BubbleInnerWrap = styled.div`
  position: relative;
  padding: 40px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  padding: 12px 20px;
`};
`
const Title = styled.div<{ color: string }>`
  font-weight: 500;
  font-size: 17px;
  color: ${({ color }) => color};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  font-size: 13px;
`};
`
const Flex = styled.div`
  display: flex;
  align-items: center;
  margin-top: 30px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  margin-top: 15px;
`};
`
const FlexAmount = styled.div`
  display: flex;
  align-items: baseline;
  margin-left: 5px;
`
const TextPrefix = styled.div`
  font-weight: bold;
  font-size: 22px;
  letter-spacing: -0.02em;
  margin: 0 5px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  font-size: 16px;
`};
`
const Heading = styled.div`
  font-weight: bold;
  font-size: 32px;
  letter-spacing: -0.02em;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  font-size: 16px;
`};
`

export interface BubbleProps {
  variant: string
  color: string
  icon?: string
  children?: ReactNode
  prefix?: string
  suffix?: string
}

export default function Bubble({ variant, color, icon, children, prefix, suffix }: BubbleProps) {
  return (
    <BubbleWrap>
      <Background variant={variant} />
      <BubbleInnerWrap>
        <Title color={color}>Wallet Holders</Title>
        <Flex>
          {icon && <Icon icon={icon} color={color} />}
          <FlexAmount>
            {prefix && <TextPrefix>{prefix}</TextPrefix>}
            <Heading>{children}</Heading>
            {suffix && <TextPrefix>{suffix}</TextPrefix>}
          </FlexAmount>
        </Flex>
      </BubbleInnerWrap>
    </BubbleWrap>
  )
}
