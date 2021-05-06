import { CgAddR, CgList } from 'react-icons/cg';
import { FaDiscord, FaMedium, FaTelegramPlane, FaTwitter } from 'react-icons/fa';
import React, { useEffect, useMemo, useState } from 'react';

import { BiWorld } from 'react-icons/bi';
import { ButtonOutlined } from 'components/Button'
import { IDO_LIST } from 'constants/idos';
import PageContainer from 'components/PageContainer';
import moment from 'moment';
import snsWebSdk from '@sumsub/websdk'
import styled from 'styled-components';
import { useParams } from 'react-router';

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

export default function ZeroGravityKyc() {

  const goToSite = (str: any) => {
    window.open(str, "_blank");
  };

  let accessToken = "tst:zl9zlZbjtxjf7SHMpBAwJQ8x"
  let applicantEmail = "test@example.org"
  let applicantPhone = "+491758764512"

  let snsWebSdkInstance = snsWebSdk.Builder("https://test-api.sumsub.com", "basic-kyc")
    .withAccessToken(accessToken, () => {
        // EXPIRATION HANDLER
        /* generate a new token and launch WebSDK again */
    })
    .withConf({
        lang: "en",
        email: applicantEmail,
        phone: applicantPhone, // if available
        onMessage: (type: any, payload: any) => {
            console.log('WebSDK onMessage', type, payload)
        },
        onError: (error: any) => {
            console.log('WebSDK onError', error)
        },
    }).build()
    setTimeout(() => {
        snsWebSdkInstance.launch('#sumsub-websdk-container')
    }, 500)

  return (
    <>
      <Title>KYC</Title>
      <PageContainer>
        <div id="sumsub-websdk-container"></div>
      </PageContainer>
    </>
  )
}
