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
  } = useTokenContract('0xc66227E44bf1E6F043919A65707b826e3E9f1132')

  const [limits, setLimits] = useState('0.0')
  const [amount, setAmount] = useState('0.0')
  const [isLoading, setIsLoading] = useState(false)
  const [successHash, setSuccessHash] = useState<null | string>(null)
  // const currentGasPrice = await useGasPrice()
  const getLimits = async () => {
    try {
      const res = await buyersLimits(web3React?.account)
      setLimits(web3React?.utils.formatUnits(res, 18))
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
      setIsLoading(true)
      const res = await deposit(BigNumber.from(utils.parseUnits('1456', 18)).toHexString(), {
        gasLimit: '50000',
        gasPrice: BigNumber.from(utils.parseUnits('225', 10)),
        nonce: await web3React.library.getSigner().getTransactionCount()
      })
      console.log("🚀 ~ file: wsdSale.tsx ~ line  104 ~ onPurchase ~ res", res)
      await res.wait()
      setSuccessHash(res.hash)
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }
  const onApprove = async () => {

    try {
      setIsLoading(true)
      const transferAmount = String(Number.MAX_SAFE_INTEGER)
      const res = await approve('0xdA0135E75dA9F2fCe90d5cCdB8dC0868Cc13D1Ae', BigNumber.from(utils.parseUnits(transferAmount, 18)).toHexString(), {
        gasLimit: '50000',
        gasPrice: BigNumber.from(utils.parseUnits('225', 10)),
        nonce: await web3React.library.getSigner().getTransactionCount()
      }
      )

      await res.wait()
      setSuccessHash(res.hash)
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
              {successHash ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <p>Claimed successfully</p>
                  <a
                    href={getEtherscanLink(web3React.chainId as number, successHash as string, 'transaction')}
                    rel="noreferrer"
                    target="_blank"
                  >
                    View tx on Ethereum
            </a>
                </div>
              ) : (
                  <>
                    {!web3React.account && <p>Please connect to wallet</p>}
                    {web3React.account && (
                      <>
                        <input type="number" name="amount" id="amount-wsd" />
                        <p style={{ textAlign: 'center' }}>Your limits {limits} USDT</p>
                        <ButtonsFlex>
                          <ButtonLight onClick={onApprove}>
                            {isLoading ? '... loading' : 'Approve'}
                          </ButtonLight>
                          <ButtonLight onClick={onPurchase}>
                            {isLoading ? '... loading' : 'Buy Tokens'}
                          </ButtonLight>
                        </ButtonsFlex>

                      </>
                    )}
                  </>
                )}
            </AutoColumn>
          </SwapWrap>
        </SwapFlexRow>
      </SwapFlex>
    </>
  )
}