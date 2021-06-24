import { BigNumber, ethers, utils } from 'ethers'
import React, { useEffect, useState } from 'react'
import { calculateGasMargin, getEtherscanLink, getProviderOrSigner, getSigner } from '../../utils'
import styled, { ThemeContext } from 'styled-components'
import { useTokenContract, useWDSDepositContract, useWISESaleContract } from '../../hooks/useContract'

import { AutoColumn } from '../../components/Column'
import { ButtonOutlined } from '../../components/Button'
import { ChainId } from '@zeroexchange/sdk'
import { useActiveWeb3React } from '../../hooks'
import useGasPrice from 'hooks/useGasPrice'

const USDTTokenABI = require('../../constants/abis/USDTABI.json')


const SwapFlexRow = styled.div`
flex: 1;
width: 100%;
margin-left: auto;
margin-right: auto;
`
const SwapWrap = styled.div`
font-family: Poppins;
position: relative;
width: 400px;
max-width: 100%;
padding: 28px 34px;
background: rgba(47, 53, 115, 0.32);
box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.095);
backdrop-filter: blur(28px);
border-radius: 44px;
margin-left: auto;
margin-right: auto;
margin-top: 2rem;
${({ theme }) => theme.mediaWidth.upToMedium`
  margin-top: 20px
  margin-right: auto;
  margin-left: auto;
`};
${({ theme }) => theme.mediaWidth.upToSmall`
width: 100%;
`};
`
const SwapFlex = styled.div`
display: flex;
justify-content: space-between;
width: 100%;
flex-wrap: wrap;
gap: 1rem;
${({ theme }) => theme.mediaWidth.upToMedium`
flex-direction: column;
align-items: center;
`};
`
const ButtonsFlex = styled.div`
  display: flex;
  flex-direction: column;
  * {
    margin-top: 1rem;
  }
  .disabled {
    opacity: .25;
    pointer-events: none;
  }
`
const BuyWrap = styled.div`
  display: flex;
  flex-direction: column;
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
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
      /* display: none; <- Crashes Chrome on hover */
      -webkit-appearance: none;
      margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
  }
`
const MaxButton = styled.p`
  position: absolute;
  font-size: .85;
  right: 45px;
  margin-top: 54px;
  color: #1EF7E7;
  cursor: pointer;
`

let web3React: any
const WithDecimalsHexString = (value: string, decimals: number) => BigNumber.from(utils.parseUnits(value, decimals)).toHexString()

const DEPOSIT_CONTRACT_ADDR = '0xe691fD6Ea139De7b28392e527124e82Cd0FF15Cc';

export default function WSDSale() {
  web3React = useActiveWeb3React()
  const wiseSale = useWISESaleContract(DEPOSIT_CONTRACT_ADDR)

  const [limits, setLimits] = useState('0.0')
  const [amount, setAmount] = useState('0.0')
  const [isLoading, setIsLoading] = useState(false)
  const [isPendingBuy, setIsPendingBuy] = useState(false)
  const [depositSuccessHash, setDepositSuccessHash] = useState<null | string>(null);

  const onPurchase = async () => {
    try {
      setIsPendingBuy(true)
      const res = await wiseSale?.deposit({
        value: ethers.utils.parseUnits(amount, 18),
        gasPrice: 10 * 10 ** 9,
        gasLimit: 60000,
      })
      await res.wait()
      setDepositSuccessHash(res.hash)
    } catch (e) {
      setIsPendingBuy(false)
      console.log(e)
    } finally {
      setIsPendingBuy(false)
    }
  };



  if (web3React.chainId != ChainId.SMART_CHAIN) {
    return (<>
      <div style={{ textAlign: 'center', fontSize: '1.5rem', display: 'block', background: 'rgba(0,0,0,.25)', borderRadius: '44px', padding: '2rem' }}>Switch to Binance Smart Chain!</div>
    </>);
  }

  
  return (
    <>
      <SwapFlex>
        <SwapFlexRow>
          <SwapWrap>
            <BuyWrap>
              <h2 style={{ marginBottom: '.5rem' }}>WISE Token Sale:</h2>
              <>
                {!web3React.account && <p>Please connect to wallet</p>}
                {web3React.account && (
                  <>
                    <input type="number" name="amount" id="amount-wsd" value={amount} onChange={e => setAmount(e.target.value)} />
                    <ButtonsFlex>
                      <ButtonOutlined className={`green ${depositSuccessHash} ${parseFloat(amount) === 0 || !amount || isPendingBuy ? 'disabled' : ''}`} onClick={onPurchase}>
                        {isPendingBuy ? '... pending' : 'Buy Tokens'}
                      </ButtonOutlined>
                    </ButtonsFlex>
                  </>
                )}
              </>
              {depositSuccessHash ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <p>Deposited successfully</p>
                  <a
                    href={getEtherscanLink(web3React.chainId as number, depositSuccessHash as string, 'transaction')}
                    rel="noreferrer"
                    target="_blank"
                  >
                    View tx on the block explorer
                  </a>
                </div>
              ) : (<></>)}
            </BuyWrap>
          </SwapWrap>
        </SwapFlexRow>
      </SwapFlex>
    </>
  )
}
