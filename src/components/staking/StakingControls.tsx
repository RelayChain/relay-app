import React, { useState } from 'react'

import { ButtonGray } from './../../components/Button'
import { ExternalLink } from '../../theme'
import { HelpCircle as Question } from 'react-feather'
import Toggle from './../../components/TooglePool'
import styled from 'styled-components'

const ToggleWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.2rem;
`

const ButtonHelp = styled(ButtonGray)`
  position: relative;
  justify-content: flex-start;
  width: 80px;
  border-radius: 10px;
  font-size: 14px;
  padding: 12px 18px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    height: 36px;
  `};
`

const QuestionWrapper = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
`

const HelpLink = styled(ExternalLink)`
  :hover {
    text-decoration: none;
  }
`

const StakingControls = () => {
  const [isLive, setIsLive] = useState<boolean>(false)
  return (
    <ToggleWrap>
      <Toggle
        isLive={isLive}
        onSortChange={() => {
          setIsLive(!isLive)
        }}
        isStaked={false}
      />
      <HelpLink href="https://medium.com/@Relay_Chain">
        <ButtonHelp>
          Help
          <QuestionWrapper>
            <Question size={12} />
          </QuestionWrapper>
        </ButtonHelp>
      </HelpLink>
    </ToggleWrap>
  )
}

export default StakingControls
