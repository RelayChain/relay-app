import { BigNumber, ethers, utils } from 'ethers'
import React, { useEffect, useState } from 'react'
import { calculateGasMargin, getEtherscanLink } from '../../utils'
import styled, { ThemeContext } from 'styled-components'
import { useTokenContract, useWDSDepositContract } from '../../hooks/useContract'

import { AutoColumn } from '../../components/Column'
import { ButtonOutlined } from '../../components/Button'
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

const DEPOSIT_CONTRACT_ADDR = '0x8B2bdF262b4869d1A89006F6D5b14509Aee249Db';
const TOKEN_CONTRACT_ADDR = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56';
const TOKEN_DECIMALS = 18;

export default function WSDSale() {
  web3React = useActiveWeb3React()
  const {
    // @ts-ignore
    buyers_limits: buyersLimits,
    // @ts-ignore
    deposit
  } = useWDSDepositContract(DEPOSIT_CONTRACT_ADDR)

  const {
    // @ts-ignore
    approve
  } = useTokenContract(TOKEN_CONTRACT_ADDR);

  const [limits, setLimits] = useState('0.0')
  const [amount, setAmount] = useState('0.0')
  const [isLoading, setIsLoading] = useState(false)
  const [isPendingBuy, setIsPendingBuy] = useState(false)
  const [approveSuccessHash, setApproveSuccessHash] = useState<null | string>(null);
  const [depositSuccessHash, setDepositSuccessHash] = useState<null | string>(null);
  // const currentGasPrice = await useGasPrice()
  const getLimits = async () => {
    try {
      const res = await buyersLimits(web3React?.account)
      setLimits(ethers.utils.formatUnits(res, TOKEN_DECIMALS))
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (buyersLimits && web3React?.account) {
      getLimits()
    }
  }, [buyersLimits, web3React?.account])

  const onPurchase = async () => {
    try {
      setIsPendingBuy(true)
      const res = await deposit(BigNumber.from(utils.parseUnits(amount, TOKEN_DECIMALS)).toHexString(), {
        // gasLimit: '55000',
        gasPrice: await web3React.library.getSigner().getGasPrice(),
        nonce: await web3React.library.getSigner().getTransactionCount()
      })
      await res.wait()
      setDepositSuccessHash(res.hash)
    } catch (e) {
      setIsPendingBuy(false)
      console.log(e)
    } finally {
      // setAmount('0.0')
      setIsPendingBuy(false)
    }
  }

  const onApprove = async () => {
    try {
      setIsLoading(true)
      const transferAmount = String(Number.MAX_SAFE_INTEGER)
      const res = await approve(DEPOSIT_CONTRACT_ADDR, BigNumber.from(utils.parseUnits(transferAmount, 18)).toHexString(), {
        // gasLimit: '55000',
        gasPrice: await web3React.library.getSigner().getGasPrice(),
        nonce: await web3React.library.getSigner().getTransactionCount()
      })

      await res.wait()
      setApproveSuccessHash(res.hash)
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }

  if (limits === '0.0' && !approveSuccessHash && !depositSuccessHash) {
    return (<></>)
  }

  return (
    <>
      <SwapFlex>
        <SwapFlexRow>
          <SwapWrap>
            <BuyWrap>
              <h2 style={{ marginBottom: '.5rem' }}>Grow Token Sale:</h2>
              <>
                {!web3React.account && <p>Please connect to wallet</p>}
                {web3React.account && (
                  <>
                    <input type="number" name="amount" id="amount-wsd" value={amount} onChange={e => setAmount(e.target.value)} />
                    <MaxButton onClick={() => setAmount(limits)}>MAX</MaxButton>
                    <p style={{ textAlign: 'center' }}>Your limit: {limits} BUSD</p>
                    <ButtonsFlex>
                      <ButtonOutlined className={ (approveSuccessHash || parseFloat(amount) > parseFloat(limits)) ? 'disabled' : ''} onClick={onApprove}>
                        {isLoading ? '... pending' : 'Approve'}
                      </ButtonOutlined>
                      <ButtonOutlined className={`green ${ (depositSuccessHash || parseFloat(amount) > parseFloat(limits)) ? 'disabled' : ''}`} onClick={onPurchase}>
                        {isPendingBuy ? '... pending' : 'Buy Tokens'}
                      </ButtonOutlined>
                    </ButtonsFlex>
                  </>
                )}
              </>
              {approveSuccessHash ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <p>Approved successfully</p>
                  <a
                    href={getEtherscanLink(web3React.chainId as number, approveSuccessHash as string, 'transaction')}
                    rel="noreferrer"
                    target="_blank"
                  >
                    View tx on Ethereum
                  </a>
                </div>
              ) : (<></>)}
              {depositSuccessHash ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <p>Deposited successfully</p>
                  <a
                    href={getEtherscanLink(web3React.chainId as number, depositSuccessHash as string, 'transaction')}
                    rel="noreferrer"
                    target="_blank"
                  >
                    View tx on Ethereum
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
