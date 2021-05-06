import React, { useEffect, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import useGasPrice from 'hooks/useGasPrice'
import { BigNumber, ethers, utils } from 'ethers'

import { useActiveWeb3React } from '../../hooks'
import { useWDSDepositContract, useTokenContract } from '../../hooks/useContract'
import { calculateGasMargin, getEtherscanLink } from '../../utils'
import { AutoColumn } from '../../components/Column'
import { ButtonLight } from '../../components/Button'
const USDTTokenABI = require('../../constants/abis/USDTABI.json')


const SwapFlexRow = styled.div`
flex: 1;
width: 100%;
`
const SwapWrap = styled.div`
font-family: Poppins;
position: relative;
width: 620px;
max-width: 100%;
padding: 28px 34px;
background: rgba(47, 53, 115, 0.32);
box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.095);
backdrop-filter: blur(28px);
border-radius: 44px;
margin-right: 2rem;
${({ theme }) => theme.mediaWidth.upToMedium`
  margin-top: 20px
  margin-right: auto;
  margin-left: auto;
`};
${({ theme }) => theme.mediaWidth.upToSmall`
width: 100%;
`};
position: sticky;
top: 4rem;
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
margin-left: 140px;
`};
`
const ButtonsFlex = styled.div`
  display: flex;
`
let web3React: any
const WithDecimalsHexString = (value: string, decimals: number) => BigNumber.from(utils.parseUnits(value, decimals)).toHexString()

export default function WSDSale() {
  web3React = useActiveWeb3React()
  const {
    // @ts-ignore
    buyers_limits: buyersLimits,
    // @ts-ignore
    deposit
  } = useWDSDepositContract('0xdA0135E75dA9F2fCe90d5cCdB8dC0868Cc13D1Ae')

  const {
    // @ts-ignore
    approve
  } = useTokenContract('0xeb8f08a975ab53e34d8a0330e0d34de942c95926')

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
      const res = await approve('0xdA0135E75dA9F2fCe90d5cCdB8dC0868Cc13D1Ae', BigNumber.from(utils.parseUnits(transferAmount, 18)).toHexString(), {
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

  return (
    <>
      <SwapFlex>
        <SwapFlexRow>
          <SwapWrap>
            <AutoColumn style={{ minHeight: 200, justifyContent: 'center', alignItems: 'center' }}>
              <h2 style={{ marginBottom: '0' }}>Wasder Token Sale:</h2>
              <>
                {!web3React.account && <p>Please connect to wallet</p>}
                {web3React.account && (
                  <>
                    <input type="number" name="amount" id="amount-wsd" value={amount} onChange={e => setAmount(e.target.value)} />
                    <p style={{ textAlign: 'center' }}>Your limits {limits} USDT</p>
                    <ButtonsFlex>
                      <ButtonLight onClick={onApprove}>
                        {isLoading ? '... pending' : 'Approve'}
                      </ButtonLight>
                      <ButtonLight onClick={onPurchase}>
                        {isPendingBuy ? '... pending' : 'Buy Tokens'}
                      </ButtonLight>
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
            </AutoColumn>
          </SwapWrap>
        </SwapFlexRow>
      </SwapFlex>
    </>
  )
}
