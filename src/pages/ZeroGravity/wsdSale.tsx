import React, { useEffect, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import useGasPrice from 'hooks/useGasPrice'
import { BigNumber, ethers, utils } from 'ethers'

import { useActiveWeb3React } from '../../hooks'
import { useZeroFreeClaimContract, useTokenContract } from '../../hooks/useContract'
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
min-height: 570px;
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

export default function WSDSale() {
  const { account, chainId, library } = useActiveWeb3React()

  const {
    // @ts-ignore
    buyers_limits: buyersLimits,
    // @ts-ignore
    purchase,
    // @ts-ignore
    estimateGas: { purchase: purchaseEstimate }
  } = useZeroFreeClaimContract('0x650CECaFE61f3f65Edd21eFacCa18Cc905EeF0B7')

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
      const res = await buyersLimits(account)
      setLimits(utils.formatUnits(res, 18))
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (buyersLimits && account) {
      getLimits()
    }
  }, [buyersLimits, account])

  const onPurchase = async () => {
    try {
      setIsLoading(true)
      const res = await purchase({
        gasLimit: 350000
      })
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
      const res = await approve(amount, {
        gasLimit: 350000
      })

      await res.wait()
      setSuccessHash(res.hash)
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }

  

//   const approve = async () => {
//     const { account, chainId, library } = useActiveWeb3React()
//     // @ts-ignore
//     const signer = await library.getSigner() 
//     // https://forum.openzeppelin.com/t/can-not-call-the-function-approve-of-the-usdt-contract/2130/2

//     const transferAmount = String(Number.MAX_SAFE_INTEGER)
//     // USDT Rinkeby address
//     const tokenContract = new ethers.Contract('0xc66227E44bf1E6F043919A65707b826e3E9f1132', USDTTokenABI, signer)
//     const callApprove = tokenContract // currentChain.erc20HandlerAddress
  
//       .approve('0x083D9DacEb094e2b6C018AEbF58BB7c4D01E17db', BigNumber.from(utils.parseUnits(transferAmount, 18)).toHexString(), {
//         gasLimit: '50000',
//         gasPrice: 225,
//         nonce: await library.getSigner().getTransactionCount()
//       })
//       console.log("🚀 ~ file: wsdSale.tsx ~ line 135 ~ approve ~ callApprove", callApprove)

//       // .then((resultApproveTx: any) => {
//       //   console.log("🚀 ~ file: wsdSale.tsx ~ line 138 ~ .then ~ resultApproveTx", resultApproveTx)
//       // }
// }

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
                    href={getEtherscanLink(chainId as number, successHash as string, 'transaction')}
                    rel="noreferrer"
                    target="_blank"
                  >
                    View tx on Ethereum
            </a>
                </div>
              ) : (
                  <>
                    {!account && <p>Please connect to wallet</p>}
                    {account && (
                      <>
                        <input type="number" name="amount" id="amount-wsd" />
                        <p style={{ textAlign: 'center' }}>Your limits {limits} USDT</p>
                        <ButtonsFlex>
                          <ButtonLight disabled={limits === '0.0' || isLoading} onClick={onApprove}>
                            {isLoading ? '... loading' : 'Approve'}
                          </ButtonLight>
                          <ButtonLight disabled={limits === '0.0' || isLoading} onClick={onPurchase}>
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