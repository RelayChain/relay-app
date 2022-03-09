import { ButtonGradient } from '../../components/Button'
import React, { useState } from 'react'

import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'

const InputWrap = styled.div`
  display: flex;
  align-items: center;
`

const StyledBalanceMax = styled.button`
  height: 35px;
  position: absolute;
  border: 2px solid #ad00ff;
  background: linear-gradient(90deg, #ad00ff 0%, #7000ff 100%);
  border-radius: 100px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  right: 40px;
  margin-top: 2px;
  color: #fff;
  transition: all 0.2s ease-in-out;
  padding-left: 10px;
  padding-right: 10px;
  :hover {
    opacity: 0.9;
  }
  :focus {
    outline: none;
  }
`

const ButtonLayout = styled.div`
  button {
    width: 50%;
    margin: 0 auto;
    margin-top: 1rem;
  }
  .disabled {
    opacity: 0.25;
    pointer-events: none;
  }
`
const WrapWrap = styled.div`
  border-radius: 30px;
  background: rgb(18, 26, 56);
  width: 100%;
  max-width: 585px;
  padding: 2rem;
  position: relative;
  border: 2px solid transparent;
  background-clip: padding-box;
  &::after {
    position: absolute;
    top: -2px;
    bottom: -2px;
    left: -2px;
    right: -2px;
    content: '';
    z-index: -1;
    border-radius: 30px;
    background: linear-gradient(4.66deg, rgba(255, 255, 255, 0.2) 3.92%, rgba(255, 255, 255, 0) 96.38%);
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
            margin-top: 20px
            margin-right: auto;
            margin-left: auto;
        `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
        width: 100%;
        `};
`

const StyledNumericalInput = styled.input`
  box-shadow: 0 0 0 2px #ffffff40;
  position: relative;
  font-weight: 600;
  outline: none;
  border: none;
  min-width: 100px;
  width: 100%;
  height: 60px;
  background: rgba(70, 70, 70, 0.25);
  padding: 0px 15px;
  border-radius: 48px;
  font-size: 24px;
  color: #ffffff;
  flex: 1 1 auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-appearance: textfield;
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
  }
`

const Heading = styled.div`
  display: flex;
  text-align: center;
  font-size: 32px;
  justify-content: space-between;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size: 24px;
`};
`

const Description = styled.p`
  text-align: center;
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 29px;
  color: #ffffff;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  font-size: 20px;
`};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size: 18px;

`};
`
const BelowForm = styled.div`
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #ffffff;
  padding: 20px;
`
let web3React: any

export const WrapForm = ({ typeAction }: { typeAction: string }) => {
  web3React = useActiveWeb3React()

  const [wrappedAmount, setWrappedAmount] = useState('')
  const [unWrapdAmount, setUnWrapdAmount] = useState('')

  const getButtonName = () => {
    if (typeAction === 'Wrap') {
      return 'UnWrap'
    } else {
      return 'Wrap'
    }
  }

  return (
    <>
      <WrapWrap>
        <Heading>
          <Description>{typeAction === 'Wrap' ? 'Wrap Token' : 'UnWrap Token'}</Description>{' '}
        </Heading>
        <>
          {!web3React.account && <p>Please connect to wallet</p>}
          {web3React.account && (
            <>
              <BelowForm style={{ textAlign: 'end' }}>
                {typeAction === 'Wrap'
                  ? `${wrappedAmount ? wrappedAmount : '0.00'} Wrap`
                  : `${unWrapdAmount ? unWrapdAmount : '0.00'} UnWrap`}
              </BelowForm>
              <InputWrap>
                <StyledNumericalInput
                  placeholder="0.00"
                  autoComplete="off"
                  type="number"
                  name="amount"
                  value={typeAction === 'Wrap' ? wrappedAmount : unWrapdAmount}
                  onChange={e =>
                    typeAction === 'Wrap' ? setWrappedAmount(e.target.value) : setUnWrapdAmount(e.target.value)
                  }
                />

                <StyledBalanceMax style={{ right: '30%' }}>MAX </StyledBalanceMax>
                <StyledBalanceMax>Select Token</StyledBalanceMax>
              </InputWrap>
              <ButtonLayout>
                <ButtonGradient>{getButtonName()}</ButtonGradient>
              </ButtonLayout>
            </>
          )}
        </>
      </WrapWrap>
      {/* {!disableCurrencySelect && onCurrencySelect && ( */}
      {/* <CurrencySearchModal
            isOpen={modalOpen}
            onDismiss={handleDismissSearch}
            onCurrencySelect={handleInputSelect}
            selectedCurrency={altCurrency}
            otherSelectedCurrency={otherCurrency}
            showCommonBases={!isCrossChain}
            isCrossChain={isCrossChain}
          /> */}
      {/* )} */}
      {/* <PlainPopup isOpen={crossPopupOpen} onDismiss={hidePopupModal} content={popupContent} removeAfterMs={2000} /> */}
    </>
  )
}
