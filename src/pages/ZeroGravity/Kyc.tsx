import React, { useState } from 'react';

import { ButtonOutlined } from 'components/Button'
import { CgCheckO } from 'react-icons/cg';
import PageContainer from 'components/PageContainer';
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

const Disclaimer = styled.div`
  color: rgba(255,255,255,.85);
  font-size: .9rem;
  background: rgba(0,0,0,.25);
  border-radius: 44px;
  padding: 2rem;
  margin-bottom: 2rem;
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
