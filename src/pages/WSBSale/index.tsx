import React, { useEffect, useState } from 'react'
import { utils } from 'ethers'
import { useActiveWeb3React } from '../../hooks'
import { useZeroFreeClaimContract } from '../../hooks/useContract'
import { calculateGasMargin } from '../../utils'

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
    <div>
      <h1>WSB Token Sale:</h1>
      {!account && <p>Please connect to wallet</p>}
      {limits && <p>Your limits {limits}</p>}
      <button disabled={!limits || isLoading} onClick={onPurchase}>
        Claim
      </button>
    </div>
  )
}
