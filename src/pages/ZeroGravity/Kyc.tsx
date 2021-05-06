import { CgAddR, CgCheckO, CgList } from 'react-icons/cg';
import { FaDiscord, FaMedium, FaTelegramPlane, FaTwitter } from 'react-icons/fa';
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router';

import { BiWorld } from 'react-icons/bi';
import { ButtonOutlined } from 'components/Button'
import { IDO_LIST } from 'constants/idos';
import PageContainer from 'components/PageContainer';
import moment from 'moment';
import snsWebSdk from '@sumsub/websdk'
import styled from 'styled-components';

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
  margin-bottom: 2rem;
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
  color: rgba(255,255,255,.85);
  font-size: .9rem;
  background: rgba(0,0,0,.25);
  border-radius: 44px;
  padding: 2rem;
  margin-bottom: 2rem;
  margin-top: 4rem;
`

const H3 = styled.div`
  display: block;
  color: #fff;
  font-size: 1rem;
  text-align: center;
  padding: 2rem;
  @media (max-width: 764px) {
    color: #fff;
    font-size: 1.25rem;
  }
`

const Row = styled.div`
  display: flex;
  flex-direction: column;
  h6 {
    margin-bottom: 10px;
  }
  input {
    color: #FFFFFF;
    position: relative;
    font-weight: 600;
    outline: none;
    border: none;
    flex: 1 1 auto;
    background: transparent;
    padding: 0px 15px;
    border-radius: 12px;
    font-size: 22px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-appearance: textfield;
    background: rgba(0,0,0,.25);
    height: 48px;
  }
`
export default function ZeroGravityKyc() {

  const [formSent, setFormSent] = useState(false);

  const [emailState, setEmailState] = useState('');
  const handleEmailState = (input: any) => {
    const val = input.target.value;
    setEmailState(val);
  }

  const [walletState, setWalletState] = useState('');
  const handleWalletState = (input: any) => {
    const val = input.target.value;
    setWalletState(val);
  }

  const emailURL = 'https://prod-44.eastus2.logic.azure.com:443/workflows/1756218e802e427aafde6c1b01ea9913/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=mhkGIWPGB6EVx4Sw-yMp0Z2b5FfCqEApXFD73J0nb7E'
  const handleSubmit = () => {
    fetch(emailURL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ contactEmail: emailState, contactName: walletState })
    }).then((res) => {
      setFormSent(true);
    }).catch(() => {
      setFormSent(true);
    })
  }

  return (
    <>
      <Title>KYC</Title>
      <PageContainer>
        <div style={{ maxWidth: '500px', width: '100%', margin: 'auto'}}>
          <Disclaimer>
            <p>Fill in the information below, and a KYC link will be sent to your email within the hour. Once KYC is completed, you can proceed with your allocation for Wasder.</p>
          </Disclaimer>
          <BgWrapper>
            {!formSent && <>
              <HeadingRow>
                <Heading>
                  Enter your info:
                </Heading>
              </HeadingRow>
              <Row>
                <h6>Email:</h6>
                <input
                  className="input"
                  type="text"
                  placeholder="Name"
                  onChange={handleEmailState}
                  value={emailState}
                />
              </Row>
              <Row>
                <h6>Wallet Address:</h6>
                <input
                  className="input"
                  type="text"
                  placeholder="Wallet Address"
                  onChange={handleWalletState}
                  value={walletState}
                />
              </Row>
              <Row style={{ marginTop: '2rem'}}>
                <ButtonOutlined onClick={handleSubmit}>Submit</ButtonOutlined>
              </Row>
            </>}

            {formSent &&
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <CgCheckO style={{ fontSize: '4rem', marginTop: '2rem' }} />
                <H3>Thank you for submitting, we'll be in touch.</H3>
              </div>
            }
          </BgWrapper>
        </div>
      </PageContainer>
    </>
  )
}
