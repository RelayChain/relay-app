import { ButtonOutlined } from '../Button'
import Copy from '../AccountDetails/Copy'
import React from 'react'
import styled from 'styled-components'

const Title = styled.div`
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 42px;
  text-align: center;
  color: #FFFFFF;
  margin-top: 10px;
`
const Success = styled(Title)`
  margin-top: -50px;
`
const LogoBlock = styled.div`
  height: 470px;
  width: 425px;
`
const NotifyBlock = styled.div`
  font-family: Poppins;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 27px;
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
  margin-top: 20px;
  margin-bottom: 10px;
`
const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`
const DestinationAddress = styled(Copy)`
  margin-top: 16px;
`


export default function TransferComplete({
  onDismiss,
  activeChain,
  transferTo,
  transferAmount,
  currentToken,
  targetTokenAddress
}: {
  onDismiss: () => void
  activeChain?: string
  transferTo?: string
  transferAmount?: string
  currentToken?: any
  targetTokenAddress?: string
}) {
  return (
    <SuccessContainer>
      <Title>Transfer Complete!</Title>
      <LogoBlock className="hero-success"></LogoBlock>
      <Success>Success!</Success>
      <NotifyBlock>Your token transfer has been successful.</NotifyBlock>
      <StyledButton onClick={onDismiss}>Done</StyledButton>
      {targetTokenAddress && <DestinationAddress toCopy={targetTokenAddress}>
                          <span style={{ marginLeft: '4px', marginTop: '15px' }}>Copy the token address on the destination chain</span>
                        </DestinationAddress>}
    </SuccessContainer>
  )
}
