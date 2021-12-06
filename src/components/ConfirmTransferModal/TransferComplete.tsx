import { ButtonOutlined } from '../Button'
import React from 'react'
import styled from 'styled-components'

const Message = styled.p`
  font-size: 0.85rem;
  margin-top: 1rem;
  line-height: 20px;
  color: #ced0d9;
  a {
    font-weight: bold;
    color: ${({ theme }) => theme.primary1};
    cursor: pointer;
    outline: none;
    text-decoration: none;
    margin-left: 4px;
    margin-right: 4px;
  }
`
const Success = styled.div`
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 42px;
  text-align: center;
  color: #FFFFFF;
  margin-top: 1rem;
`
const TitlePending = styled(Success)`
  height: 470px;
`
const LogoBlock = styled.img`
  position: absolute;
  top: 50px;
  height: 500px;
`
const NotifyBlock = styled.div`
  font-family: Poppins;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 27px;
  /* identical to box height */
  text-align: center;
  color: #FFFFFF;
`
const StyledButton = styled(ButtonOutlined)`
  width: 220px;
  height: 60px;
  background: linear-gradient(90deg, #AD00FF 0%, #7000FF 100%);
  border-radius: 100px;
  font-family: Montserrat;
  font-style: normal;
  font-weight: normal;
  font-size: 30px;
  line-height: 37px;
  text-align: center;
  color: #FFFFFF;
  margin-top: 2rem;
`
const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  height: 707px;
  width: 440px;
`

export default function TransferComplete({
  onDismiss,
  activeChain,
  transferTo,
  transferAmount,
  currentToken
}: {
  onDismiss: () => void
  activeChain?: string
  transferTo?: string
  transferAmount?: string
  currentToken?: any
}) {
  return (
    <SuccessContainer>
      <TitlePending>Transfer Complete!</TitlePending>
      <LogoBlock src={require('../../assets/images/new-design/success.png')}></LogoBlock>
      <Success>Success!</Success>
      <NotifyBlock>Your token transfer has been successful.</NotifyBlock>
      <StyledButton onClick={onDismiss}>Done</StyledButton>
    </SuccessContainer>
  )
}
