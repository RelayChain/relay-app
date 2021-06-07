import React from 'react'
import styled from 'styled-components'

import BubbleBase from './../BubbleBase'
import Row from 'components/Row'
import QuestionHelper from './../QuestionHelper'
import { ButtonPrimary } from './../../components/Button'

const InfoBlock = styled.div`
  min-width: 240px;
  padding: 24px;
  position: relative;
  color: #a7b1f4;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  min-width: 0px;
  width: 100%;
`};
`

const Title = styled.h3`
  font-weight: 600;
  line-height: 1.5;
  font-size: 16px;
`

const Wrap = styled(Row)`
  align-items: center;
`

const QuestionWrap = styled.div`
  display: flex;
  margin-left: 12px;
`

const NumberWrap = styled(Wrap)`
  margin-top: 20px;
  justify-content: space-between;
`

const SmallNumber = styled.h5`
  color: white;
  margin-top: 7px;
`

const ClaimButton = styled(ButtonPrimary)`
  width: 75px;
  color: white;
  padding: 10px;
  border-radius: 12px;
`

interface StakingInfoBlockProps {
  setOpen: (open: boolean) => void
}

const StakingInfoBlock = ({ setOpen }: StakingInfoBlockProps) => {
  return (
    <InfoBlock>
      <BubbleBase />

      <Wrap>
        <Title>Auto RELAY Bounty</Title>
        <QuestionWrap>
          <QuestionHelper
            text={`This bounty is given as a reward for providing a service to other users. Whenever you successfully claim the bounty, you’re also helping out by activating the Auto RELAY Pool’s compounding function for everyone. Auto-Compound Bounty: 0.05% of all Auto RELAY pool users’ pending yield`}
          />
        </QuestionWrap>
      </Wrap>
      <NumberWrap>
        <div>
          <h4>0.002</h4>
          <SmallNumber>~0.03 USD</SmallNumber>
        </div>
        <ClaimButton onClick={() => setOpen(true)}>Claim</ClaimButton>
      </NumberWrap>
    </InfoBlock>
  )
}

export default StakingInfoBlock
