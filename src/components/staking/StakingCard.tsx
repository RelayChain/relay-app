import React, { useState } from 'react'
import styled from 'styled-components'
import { ChevronDown } from 'react-feather'
import Row from 'components/Row'
import BubbleBase from './../BubbleBase'
import MetaMaskIcon from '../../assets/images/metamask-icon.svg'
import OutsideLink from '../../assets/images/outside-link.svg'
import { ButtonOutlined } from './../Button'
import QuestionHelper from './../QuestionHelper'
import Tooltip from './../Tooltip'
import Icon from './../Icon'
import { StakingRoiModal } from './index'

const StakingCardStyled = styled.div`
  width: 352px;
  position: relative;
  height: fit-content;
`

const Header = styled.header`
  background: rgba(18, 21, 56, 0.54);
  box-shadow: inset 2px 2px 5px rgb(255 255 255 / 10%);
  backdrop-filter: blur(28px);
  min-height: 60px;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  padding: 24px;
`

const Title = styled.h3`
  font-weight: 600;
  line-height: 1.5;
  font-size: 20px;
`
const Description = styled.p`
  font-size: 15px;
  font-weight: 600;
  color: #a7b1f4;
  margin-bottom: 0;
`
const LogoWrapper = styled.div`
  width: 50px;
  height: 50px;
  img {
    max-width: 100%;
  }
`

const IconWrapper = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  img {
    max-width: 100%;
  }
`

const Flex = styled(Row)`
  align-items: center;
  justify-content: space-between;
`

const CenterWrap = styled.div`
  padding: 24px;
  border-bottom: 1px solid #6752f759;
`

const TextApr = styled.h3`
  color: #a7b1f4;
  font-weight: 500;
  1font-size: 14px;
`
const QuestionWrap = styled.div`
  display: flex;
`

const TextEarned = styled.h4`
  font-size: 12px;
  margin-top: 25px;
  margin-bottom: 5px;
`

const SmallNumberEarn = styled(TextApr)`
  font-size: 10px;
`

const EarnButton = styled(ButtonOutlined)`
  width: 100px;
  border-radius: 12px;
`

const BottomWrap = styled(CenterWrap)`
  border-bottom: none;
`

const ManualButton = styled(ButtonOutlined)`
  cursor: default;
  width: 80px;
  font-size: 10px;
  padding: 7px;
  border: 1px solid #a7b1f4;
  background: none;
  :hover {
    border-color: #a7b1f4;
  }
`

const FlexBottom = styled(Flex)`
  gap: 0.7rem;
  width: 110px;
`

const ArrayWrap = styled.div<{ showDetails: boolean }>`
  transform: ${({ showDetails }) => (showDetails ? 'rotate(180deg)' : 'none')};
  display: flex;
`

const DetailsWrap = styled(BottomWrap)`
  padding: 0 24px 24px;
`

const FlexEnd = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
  align-items: center;
  gap: 5px;

  a {
    text-decoration: none;
    font-size: 13px;
    transition: color ease 0.3s;

    :hover {
      color: white;
    }
  }
`

const StakingCard = () => {
  const [showDetails, setShowDetails] = useState<boolean>(false)
  const [tooltipShow, setTooltipShow] = useState<boolean>(false)
  const [openRoiModal, setOpenRoiModal] = useState<boolean>(false)
  return (
    <StakingCardStyled>
      <StakingRoiModal open={openRoiModal} setOpen={setOpenRoiModal}/>
      <BubbleBase />
      <Header>
        <Flex>
          <div>
            <Title>Manual RELAY</Title>
            <Description>Stake RELAY</Description>
          </div>
          <LogoWrapper>
            <img src={MetaMaskIcon} alt="logo" />
          </LogoWrapper>
        </Flex>
      </Header>
      <CenterWrap>
        <Flex>
          <div onMouseEnter={() => setTooltipShow(true)} onMouseLeave={() => setTooltipShow(false)}>
            <Tooltip text="This pool’s rewards aren’t compounded automatically, so we show APR" show={tooltipShow}>
              <TextApr>APR</TextApr>
            </Tooltip>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TextApr>152.5%</TextApr>
            <div style={{ marginLeft: '10px', cursor: 'pointer' }} onClick={() => setOpenRoiModal(true)}>
              <Icon icon="alien" color="#a7b1f4" />
            </div>
          </div>
        </Flex>
        <TextEarned>RELAY EARNED</TextEarned>
        <Flex>
          <div>
            <TextApr>0</TextApr>
            <SmallNumberEarn>~0 USD</SmallNumberEarn>
          </div>
          <EarnButton className="launch-button green">HARVEST</EarnButton>
        </Flex>
        <TextEarned>STAKE RELAY</TextEarned>
        <ButtonOutlined>ENABLE</ButtonOutlined>
      </CenterWrap>
      <BottomWrap>
        <Flex>
          <FlexBottom>
            <ManualButton>MANUAL</ManualButton>
            <QuestionWrap>
              <QuestionHelper text={`You must harvest and compound your earnings from this pool manually.`} />
            </QuestionWrap>
          </FlexBottom>
          <Flex style={{ width: '90px', cursor: 'pointer' }} onClick={() => setShowDetails(!showDetails)}>
            <h4>{showDetails ? 'Hide' : 'Details'}</h4>
            <ArrayWrap showDetails={showDetails}>
              <ChevronDown size="24" />
            </ArrayWrap>
          </Flex>
        </Flex>
      </BottomWrap>
      {showDetails && (
        <DetailsWrap>
          <Flex>
            <h5>Total staked:</h5>
            <h5>189,628.378 RELAY</h5>
          </Flex>
          <Flex>
            <h5>End:</h5>
            <h5>1,668,149 blocks</h5>
          </Flex>
          <FlexEnd>
            <a href="#">View Project Site</a>
            <IconWrapper>
              <img src={OutsideLink} alt="MetaMask icon" />
            </IconWrapper>
          </FlexEnd>
          <FlexEnd>
            <a href="#">View Contract</a>
            <IconWrapper>
              <img src={OutsideLink} alt="MetaMask icon" />
            </IconWrapper>
          </FlexEnd>
          <FlexEnd>
            <a href="#">Add to Metamask</a>
            <IconWrapper>
              <img src={MetaMaskIcon} alt="MetaMask icon" />
            </IconWrapper>
          </FlexEnd>
        </DetailsWrap>
      )}
    </StakingCardStyled>
  )
}

export default StakingCard
