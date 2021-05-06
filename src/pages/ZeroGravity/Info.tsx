import { CgAddR, CgList } from 'react-icons/cg';
import { FaDiscord, FaMedium, FaTelegramPlane, FaTwitter } from 'react-icons/fa';
import React, { useEffect, useMemo, useState } from 'react';

import { BiWorld } from 'react-icons/bi';
import { ButtonOutlined } from 'components/Button'
import { IDO_LIST } from 'constants/idos';
import PageContainer from 'components/PageContainer';
import moment from 'moment';
import styled from 'styled-components';
import { useParams } from 'react-router';
import WSDSale from './wsdSale';

const Title = styled.h1`
  width: 100%;
  padding: 0px 64px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 0;
    text-align: center;
    font-size: 49px;
    margin-top: 40px;
    margin-bottom: 0px;
  `};
`
const ImageContainer = styled.div`
  margin-top: 1rem;
  height: 2rem;
  width: 100%;
  display: flex;
  justify-content: center;
`
const MiniImageContainer = styled.div`
  height: 1.2rem;
  & img {
    height: 100%;
  }
`
const InfoSection = styled.div`
  margin: 1rem 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const ButtonsSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  max-width: 24rem;
  margin: auto;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `};
`
const ButtonIcon = styled.div`
  margin-right: 0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
`
const ButtonsSpacer = styled.div`
  width: 2rem;
  height: 0;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 0;
    height: 1rem;
  `};
`
const VerticalLine = styled.div`
  height: 1rem;
  width: 0;
  border-right: solid 1px white;
  margin: 0 0.6rem;
`
const BgWrapper = styled.div`
  background: rgba(47, 53, 115, 0.32);
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.095);
  backdrop-filter: blur(28px);
  border-radius: 44px;
  margin-bottom: 8rem;
  margin-top: 4rem;
  padding: 30px;
  width: 100%;
  position: relative;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    border-radius: 16px;
    padding: 20px;
  `};
`
const HeadingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const Heading = styled.h2`

`
const Detail = styled.p`
  margin: 2rem 0;
`
const SocialLinks = styled.div`
  display: flex;
`
const SocialIcon = styled.div`
  cursor: pointer;
  font-size: 1.4rem;
  display: flex;
  position: relative;
  padding: .4rem .6rem;
  &:hover .tooltip {
    visibility: visible;
    opacity: 1;
  }
`
const Tooltip = styled.div`
  cursor: pointer;
  font-size: .8rem;
  visibility: hidden;
  width: 120px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
  &:after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #555 transparent transparent transparent;
  }
`
const StatsSection = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `};
`
const Stat = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`
const StatTitle = styled.p`
  color: rgba(255,255,255,0.5);
  margin-bottom: 0.4rem;
`
const StatText = styled.p`
  margin: 0;
`
const Disclaimer = styled.div`
  color: rgba(255,255,255,.5);
  font-size: .75rem;
  background: rgba(0,0,0,.25);
  border-radius: 44px;
  padding: 2rem;
  margin-top: -5rem;
`

export default function ZeroGravityInfo() {

  const {idoURL} = useParams<{idoURL:string}>();

  const [idoData, setIdoData] = useState<any>();

  const socialMediaLinks = useMemo<Array<{type:string,url:string,icon:any}>>(() => {
    if (idoData?.socials) {
      return idoData.socials.map((social:{type:string,url:string}) => {
        let icon = <BiWorld />
        if (social.type === 'WEBSITE') icon = <BiWorld />
        else if (social.type === 'TELEGRAM') icon = <FaTelegramPlane/>
        else if (social.type === 'TWITTER') icon = <FaTwitter/>
        else if (social.type === 'DISCORD') icon = <FaDiscord/>
        else if (social.type === 'MEDIUM') icon = <FaMedium/>

        return {
          type: social.type,
          url: social.url,
          icon
        }
      })
    }
    return [];
  }, [idoData]);

  const launchingString = useMemo<string>(() => {
    if (idoData?.launchDate) {
      if (moment(idoData.launchDate).isBefore(moment.now())) {
        return `Launched ${moment(idoData?.launchDate??'').fromNow()}`;
      }
      return `Launching ${moment(idoData?.launchDate??'').fromNow()}`;
    }
    return '';
  }, [idoData]);

  useEffect(() => {
    // fetch data here
    setIdoData(IDO_LIST.find(item => item.idoURL===idoURL))
  }, [idoURL])

  const goToSite = (str: any) => {
    window.open(str, "_blank");
  };

  return (
    <>
      <Title>Info</Title>
      <PageContainer>
        <ImageContainer>
          <img src={idoData?.logo ?? ''} alt={idoData?.idoURL ?? ''}/>
        </ImageContainer>
        <InfoSection>
          <p>Future</p>
          {/*<VerticalLine />
          <MiniImageContainer>
            <img src={idoData?.logo ?? ''} alt={idoData?.idoURL ?? ''}/>
          </MiniImageContainer>*/}
          <VerticalLine />
          <p>{launchingString}</p>
        </InfoSection>
        <ButtonsSection>
          <ButtonOutlined onClick={() => goToSite('https://docs.google.com/spreadsheets/d/16N4S_VqEfN04hfsfz4SIqZdH-jGqyJynCfZ6bjMBhaE/edit?usp=sharing')} >
            <ButtonIcon>
              <CgList/>
            </ButtonIcon>
            View Whitelist
          </ButtonOutlined>
          <ButtonsSpacer />
          {/*<ButtonOutlined className="green" onClick={() => goToSite('https://api.sumsub.com/idensic/l/#/mV0MxyEpZS4ucuCv')}>
            <ButtonIcon>
              <CgAddR/>
            </ButtonIcon>
            KYC Here
          </ButtonOutlined>*/}
        </ButtonsSection>
        <BgWrapper>
          <HeadingRow>
            <Heading>
              Pool details
            </Heading>
            <SocialLinks>
              {socialMediaLinks.map(iconDetails =>
                <SocialIcon onClick={()=>window.open(iconDetails.url)}>
                  {iconDetails.icon}
                  <Tooltip className="tooltip">{iconDetails.type}</Tooltip>
                </SocialIcon>
              )}
            </SocialLinks>
          </HeadingRow>
          <Detail>
            {idoData?.description ?? ''}
          </Detail>
          {/* <WSDSale /> */}
          <StatsSection>
            <Stat>
              <StatTitle> Auction Start Date </StatTitle>
              <StatText>{moment(idoData?.launchDate??"").format('MMM DD, YYYY hh:mm A')}</StatText>
            </Stat>
            <Stat>
              <StatTitle> Token Distribution Date </StatTitle>
              <StatText>{moment(idoData?.distributionDate??"").format('MMM DD, YYYY hh:mm A')}</StatText>
            </Stat>
            <Stat>
              <StatTitle> Min. Allocation </StatTitle>
              <StatText>{idoData?.allocationMin??''}</StatText>
            </Stat>
            <Stat>
              <StatTitle> Allocation per Winning Ticket </StatTitle>
              <StatText>{idoData?.allocationWinningAmount??''}</StatText>
            </Stat>
          </StatsSection>
        </BgWrapper>
        { idoData?.disclaimer &&
          <Disclaimer>
            {idoData?.disclaimer}
          </Disclaimer>
        }
      </PageContainer>
    </>
  )
}
