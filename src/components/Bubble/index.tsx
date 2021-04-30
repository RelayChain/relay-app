import React, { ReactNode } from 'react'

import Background from './Background'
import Icon from './../Icon'
import styled from 'styled-components'

const BubbleWrap = styled.div`
  position: relative;
  flex: 1;
  height: auto;
  width: 272px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  width: 100%;
`};
`
const BubbleInnerWrap = styled.div`
  position: relative;
  padding: 45px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding: 45px 60px;
  text-align: center;
`};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: 25px;
`};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  padding: 25px 10px;
`};
`
const Title = styled.div<{ color: string }>`
  font-weight: 500;
  font-size: 17px;
  color: ${({ color }) => color};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  font-size: 12px;
`};
`
const Flex = styled.div`
  display: flex;
  align-items: center;
  margin-top: 30px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  justify-content:center;
`};
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
  ${({ theme }) => theme.mediaWidth.upToMedium`
  font-size: 30px;
  `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size: 26px;
`};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  font-size: 16px;
`};
`

export interface BubbleProps {
  variant: string
  color: string
  title: string
  icon?: string
  children?: ReactNode
  prefix?: string
  suffix?: string
  showMountains?: boolean;
}

export default function Bubble({ variant, color, title, icon, children, prefix, suffix, showMountains }: BubbleProps) {
  return (
    <BubbleWrap>
      <Background variant={variant} showMountains={showMountains} />
      <BubbleInnerWrap>
        <Title color={color}>{title}</Title>
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
