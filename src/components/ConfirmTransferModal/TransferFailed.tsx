import React from 'react'
import styled from 'styled-components'


const Fail = styled.div`
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 42px;
  text-align: center;
  color: #FFFFFF;
  margin-bottom: 10px;
`
const TitlePending = styled(Fail)` 
  margin-top: 70px;
  margin-bottom: 40px;
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 42px; 
  text-align: center;
  color: #FFFFFF;
`
const LogoBlock = styled.img`
  width: 350px;
  height: 350px;
  margin-bottom: 60px;
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

const FailedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  content-items: center;
  position: relative;
  height: 707px;
  width: 440px;
`

export default function TransferFiled() {
  return (
    <FailedContainer>
      <TitlePending>Transfer Failed!</TitlePending>
      <LogoBlock src={require('../../assets/images/new-design/fail.png')}></LogoBlock>
      <Fail>Oops!</Fail>
      <NotifyBlock>Something error your tokens failed to transfer.</NotifyBlock>
    </FailedContainer>
  )
}
