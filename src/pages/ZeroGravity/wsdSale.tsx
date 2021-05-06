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

let web3React: any
const WithDecimalsHexString = (value: string, decimals: number) => BigNumber.from(utils.parseUnits(value, decimals)).toHexString()

const DEPOSIT_CONTRACT_ADDR = process.env.REACT_APP_TESTNET
  ? '0xdA0135E75dA9F2fCe90d5cCdB8dC0868Cc13D1Ae'
  : '0xea83fcee5875c8f09b0a9b999cbbb1ced26a462b';
const TOKEN_CONTRACT_ADDR = process.env.REACT_APP_TESTNET
  ? '0xeb8f08a975ab53e34d8a0330e0d34de942c95926'
  : '0xdac17f958d2ee523a2206206994597c13d831ec7';

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
      setLimits(ethers.utils.formatUnits(res, 6))
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
      const res = await deposit(BigNumber.from(utils.parseUnits(amount, 6)).toHexString(), {
        // gasLimit: '50000',
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
        // gasLimit: '50000',
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

  if (limits === '0.0') {
    return (<></>)
  }

  return (
    <>
      <SwapFlex>
        <SwapFlexRow>
          <SwapWrap>
            <BuyWrap>
              <h2 style={{ marginBottom: '.5rem' }}>Wasder Token Sale:</h2>
              <>
                {!web3React.account && <p>Please connect to wallet</p>}
                {web3React.account && (
                  <>
                    <input type="number" name="amount" id="amount-wsd" value={amount} onChange={e => setAmount(e.target.value)} />
                    <p style={{ textAlign: 'center' }}>Your limit: {limits} USDT</p>
                    <ButtonsFlex>
                      <ButtonOutlined className={ approveSuccessHash ? 'disabled' : ''} onClick={onApprove}>
                        {isLoading ? '... pending' : 'Approve'}
                      </ButtonOutlined>
                      <ButtonOutlined className="green" onClick={onPurchase}>
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
