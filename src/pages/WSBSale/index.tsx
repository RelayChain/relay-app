import React, { useEffect, useState } from 'react'
import { utils } from 'ethers'

import { useActiveWeb3React } from '../../hooks'
import { useZeroFreeClaimContract } from '../../hooks/useContract'
import { calculateGasMargin, getEtherscanLink } from '../../utils'
import AppBody from '../AppBody'
import { AutoColumn } from '../../components/Column'
import { ButtonLight } from '../../components/Button'

export default function WSBSale() {
  const { account, chainId } = useActiveWeb3React()

  const {
    // @ts-ignore
    buyers_limits: buyersLimits,
    // @ts-ignore
    purchase,
    // @ts-ignore
    estimateGas: { purchase: purchaseEstimate }
  } = useZeroFreeClaimContract('0x4316D36b3dDbee249f8E9EfB22505cD047988e07')

  const [limits, setLimits] = useState('0.0')
  const [isLoading, setIsLoading] = useState(false)
  const [successHash, setSuccessHash] = useState<null | string>(null)

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

  return (
    <AppBody>
      <AutoColumn style={{ minHeight: 200, justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ marginBottom: '0' }}>WSB Token Sale:</h2>
        {successHash ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p>Claimed successfully</p>
            <a
              href={getEtherscanLink(chainId as number, successHash as string, 'transaction')}
              rel="noreferrer"
              target="_blank"
            >
              View tx on bscscan
            </a>
          </div>
        ) : (
          <>
            {!account && <p>Please connect to wallet</p>}
            {account && (
              <>
                <p style={{ textAlign: 'center' }}>Your limits {limits} BUSD</p>
                <ButtonLight disabled={limits === '0.0' || isLoading} onClick={onPurchase}>
                  {isLoading ? '... loading' : 'Claim'}
                </ButtonLight>
              </>
            )}
          </>
        )}
      </AutoColumn>
    </AppBody>
  )
}
