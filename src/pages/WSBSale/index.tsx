import React, { useEffect, useState } from 'react'
import { utils } from 'ethers'

import { useActiveWeb3React } from '../../hooks'
import { useZeroFreeClaimContract } from '../../hooks/useContract'
import { calculateGasMargin } from '../../utils'
import AppBody from '../AppBody'
import { AutoColumn } from '../../components/Column'
import { ButtonLight } from '../../components/Button'

export default function WSBSale() {
  const { account } = useActiveWeb3React()

  const {
    // @ts-ignore
    buyers_limits: buyersLimits,
    // @ts-ignore
    purchase,
    // @ts-ignore
    estimateGas: { purchase: purchaseEstimate }
  } = useZeroFreeClaimContract('0xa1453A97EF37FD456c0698e9aF0b745c669Ad8Ee')

  const [limits, setLimits] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const getLimits = async () => {
    const res = await buyersLimits(account)
    setLimits(+utils.formatUnits(res, 18))
  }

  useEffect(() => {
    if (buyersLimits && account) {
      getLimits()
    }
  }, [buyersLimits, account])

  const onPurchase = async () => {
    try {
      setIsLoading(true)
      const gusLimit = await purchaseEstimate()
      const res = await purchase({
        gasLimit: calculateGasMargin(gusLimit)
      })
      await res.wait()
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppBody>
      <AutoColumn style={{ minHeight: 200, justifyContent: 'center', alignItems: 'center' }}>
        <h2>WSB Token Sale:</h2>
        {!account && <p>Please connect to wallet</p>}
        {account && (
          <>
            <p style={{ textAlign: 'center' }}>Your limits {limits}</p>
            <ButtonLight disabled={!limits || isLoading} onClick={onPurchase}>
              Claim
            </ButtonLight>
          </>
        )}
      </AutoColumn>
    </AppBody>
  )
}
