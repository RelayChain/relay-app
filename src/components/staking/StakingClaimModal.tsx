import React from 'react'
import styled from 'styled-components'

import Modal from '../Modal'
import { CloseIcon } from '../../theme'
import { StakingModalProps } from './index'
import { ButtonOutlined } from './../Button'
import QuestionHelper from './../QuestionHelper'

const ModalHeader = styled.header`
  padding: 12px 24px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Title = styled.h2`
  color: #a7b1f4;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  font-size: 14px;
`};
`

const MainContent = styled.main`
  padding: 12px 24px;
`

const UpperContent = styled.div`
  display: flex;
  align-items: flex-start;
  -webkit-box-pack: justify;
  justify-content: space-between;
  border-bottom: 1px solid #6752f759;
  padding-bottom: 15px;
`

const ClaimText = styled.h3`
  color: #a7b1f4;
  font-size: 17px;
`

const ClaimNumber = styled(ClaimText)`
  text-transform: uppercase;
`

const SmallClaimNumber = styled(ClaimNumber)`
  font-size: 13px;
  color: white;
`
const SubTittle = styled(SmallClaimNumber)`
  font-size: 15px;
  text-transform: capitalize;
`

const Flex = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`
const MiddleContent = styled.div`
  margin: 25px auto;
`

const FooterContent = styled.footer`
  margin: 20px auto;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const FooterText = styled.h4`
    font-size: 15px;
    color:  color: #a7b1f4;
`

const QuestionWrap = styled.div`
  display: flex;
  margin-left: 10px;
`

const StakingClaimModal = ({ open, setOpen }: StakingModalProps) => {
  const closeModal = () => setOpen(false)
  return (
    <Modal isOpen={open} onDismiss={closeModal}>
      <div style={{ width: '100%' }}>
        <ModalHeader>
          <Title>Claim Bounty</Title>
          <CloseIcon onClick={closeModal} />
        </ModalHeader>
        <MainContent>
          <UpperContent>
            <ClaimText>You’ll claim</ClaimText>
            <div>
              <ClaimNumber>0.0022657 RELAY</ClaimNumber>
              <SmallClaimNumber>~0.04 USD</SmallClaimNumber>
            </div>
          </UpperContent>
          <MiddleContent>
            <Flex>
              <SubTittle>Pool total pending yield</SubTittle>
              <SubTittle style={{ textAlign: 'right' }}>4.531 RELAY</SubTittle>
            </Flex>
            <Flex>
              <SubTittle>Bounty</SubTittle>
              <SubTittle>0.05%</SubTittle>
            </Flex>
          </MiddleContent>
          <ButtonOutlined>CONFIRM</ButtonOutlined>
        </MainContent>
        <FooterContent>
          <FooterText>What’s this?</FooterText>
          <QuestionWrap>
            <QuestionHelper
              text={`This bounty is given as a reward for providing a service to other users.
                      Whenever you successfully claim the bounty, you’re also helping out by activating the Auto RELAY Pool’s compounding function for everyone.
                      Auto-Compound Bounty: 0.05% of all Auto RELAY pool users pending yield`}
            />
          </QuestionWrap>
        </FooterContent>
      </div>
    </Modal>
  )
}

export default StakingClaimModal
