import { BookOpen, Globe, Twitter } from 'react-feather'
import { ButtonOutlined, ButtonPrimary } from '../../components/Button'
import React, { useState } from 'react';

import { ExternalLink } from '../../theme'
import { IDO_LIST } from '../../constants/idos';
import IdoRow from '../../components/ZeroGravity/IdoRow';
import PageContainer from '../../components/PageContainer'
import { RouteComponentProps } from 'react-router-dom'
import { RowBetween } from '../../components/Row';
import Toggle from '../../components/Toggle';
import styled from 'styled-components'

const moment = require('moment');

const StyledExternalLink = styled(ExternalLink)`
  text-decoration: none !important;
  margin-left: auto;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-right: auto;
  `};
`
const Title = styled.h1`
  width: 100%;
  padding: 0px 64px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  text-align: center;
  font-size: 49px;
  margin-top: 40px;
  margin-bottom: 0px;
`};
  ${({ theme }) => theme.mediaWidth.upToSmall`
padding: 0;
`};
`
const SubTitle = styled.h3`
  width: 100%;
  max-width: 600px;
  padding: 1rem;
  text-align: center;
  font-size: 1.5rem;
  margin-left: auto; margin-right: auto;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size: 1rem;
`};
`

const ControlsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 24px;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  .launch-button {
    margin-left: auto;
    max-width: 200px;
  }
  .action-button {
    margin-left: 10px;
    margin-right: 10px;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
  flex-direction: column;
  max-width: 100%;
  align-items: flex-start;
  * {
    margin-left: auto; margin-right: auto;
  }
  .launch-button {
    margin-right: auto;
    margin-top: 2rem;
  }
`};
`
const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  margin-bottom: 2rem;
`
const HeadersWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 1rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`
const HeaderSection = styled.div<{ width?: any }>`
  width: 120px;
  padding-left: 10px;
  padding-right: 10px;
  font-size: .8rem;
  font-weight: bold;
  color: #A7B1F4;
`
const LogoImage = styled.div`
  display: block;
  margin: auto;
  width: 100%;
  margin-top: 20px;
  max-width: 300px;
  img {
    width: 100%;
  }
`
const DateTime = styled.h5`
  display: block;
  text-align: center;
  color: #A7B1F4;
  font-size: 1.25rem;
`

const DetailsContainer = styled.div`
  border: 2px solid;
  border-image-source: linear-gradient(150.61deg, rgba(255, 255, 255, 0.03) 18.02%, rgba(34, 39, 88, 0) 88.48%);
  background: rgba(47, 53, 115, 0.32);
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.095);
  backdrop-filter: blur(28px);
  border-radius: 44px;
  padding: 32px;
  margin-bottom: 1rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 120px;
  ${({ theme }) => theme.mediaWidth.upToMedium`

  `};
`
const SocialButtons = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: auto;
  a {
    margin-left: 14px;
    color: #A7B1F4;
    cursor: pointer;
  }
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  h6 {
    color: #A7B1F4;
    margin-bottom: 0;
    margin-top: 10px;
  }
`
export default function ZeroGravityInfo({
  match: {
    params: { idoURL }
  },
  ...props
}: RouteComponentProps<{ idoURL: string }>) {

  const info: any = IDO_LIST.find(x => x.idoURL === idoURL);

  return (
    <div style={{ marginTop: '4rem', width: '100%' }}>
      <PageContainer>
        <LogoImage>
          <img src={info.logo} />
        </LogoImage>
        <SubTitle>{info.idoName} Token Launch</SubTitle>
        <DateTime>{moment(info.launchDate).fromNow()}</DateTime>
        <ControlsContainer>
          <ButtonOutlined className="action-button">Join Waitlist</ButtonOutlined>
          <ButtonOutlined className="action-button green">Join Pool</ButtonOutlined>
        </ControlsContainer>
        <DetailsContainer>
          <RowBetween>
            <h4 style={{ fontSize: '1.5rem'}}>Details:</h4>
            <SocialButtons>
              <a href={info.twitter} target="_blank">
                <Twitter size={22} />
              </a>
              <a href={info.blog} target="_blank">
                <BookOpen size={22} />
              </a>
              <a href={info.website} target="_blank">
                <Globe size={22} />
              </a>
            </SocialButtons>
          </RowBetween>
          <RowBetween style={{ marginTop: '1rem', marginBottom: '1rem'}}>
            <p>{info.description}</p>
          </RowBetween>
          <RowBetween>
            <InfoItem>
              <h6>Start Date:</h6>
              <p>{moment(info.launchDate).fromNow()}</p>
            </InfoItem>
            <InfoItem>
              <h6>End Date:</h6>
              <p>{moment(info.endDate).fromNow()}</p>
            </InfoItem>
            <InfoItem>
              <h6>Total Raise:</h6>
              <p>{info.totalRaise}</p>
            </InfoItem>
            <InfoItem>
              <h6>Allocation Min:</h6>
              <p>{info.allocationMin}</p>
            </InfoItem>
            <InfoItem>
              <h6>Allocation Max:</h6>
              <p>{info.allocationMax}</p>
            </InfoItem>
            <InfoItem>
              <h6>Winning Ticket Amount:</h6>
              <p>{info.allocationWinningAmount}</p>
            </InfoItem>
          </RowBetween>
        </DetailsContainer>
      </PageContainer>
    </div>)
}

// idoName: 'Wasder',
// idoURL: 'wasder',
// logo: '/images/idos/wasder-logo.png',
// tierName: 'Platinum', // if no tier, leave blank
// tierLogo: null, // if you include this image, it will override the tierName
// launchDate: new Date('May 05, 2021 06:00:00'),
// endDate: new Date('May 08, 2021 06:00:00'),
// totalRaise: '$500,000',
// allocationMin: '$10,000',
// allocationMax: '$100,000',
// allocationCurrency: 'ETH',
// description: 'This is the Wasder IDO description',
// distributionDate: new Date('May 10, 2021 06:00:00'),
// allocationWinningAmount: '$250',
// twitter: '',
// website: '',
// blog: '',
// telegram: '',
