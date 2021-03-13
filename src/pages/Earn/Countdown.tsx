import { REWARDS_DURATION_DAYS_CHAINS, STAKING_GENESIS_CHAINS } from '../../state/stake/hooks'
import React, { useEffect, useMemo, useState } from 'react'

import { ChainId } from '@zeroexchange/sdk'
import { TYPE } from '../../theme'
import { useActiveWeb3React } from '../../hooks'
import { CHAIN_LABELS } from '../../constants'

const MINUTE = 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
let REWARDS_DURATION = 0;
let STAKING_GENESIS = 0;


export function Countdown({ exactEnd }: { exactEnd?: Date }) {
  const { chainId } = useActiveWeb3React()

  if (chainId !== undefined) {
    REWARDS_DURATION = DAY * REWARDS_DURATION_DAYS_CHAINS[chainId];
    STAKING_GENESIS = STAKING_GENESIS_CHAINS[chainId];
  }

  // get end/beginning times
  const end = useMemo(() => (exactEnd ? Math.floor(exactEnd.getTime() / 1000) :  + REWARDS_DURATION), [
    exactEnd
  ])
  const begin = useMemo(() => end - REWARDS_DURATION, [end])

  // get current time
  const [time, setTime] = useState(() => Math.floor(Date.now() / 1000))
  useEffect((): (() => void) | void => {
    // we only need to tick if rewards haven't ended yet
    if (time <= end) {
      const timeout = setTimeout(() => setTime(Math.floor(Date.now() / 1000)), 1000)
      return () => {
        clearTimeout(timeout)
      }
    }
  }, [time, end])

  const timeUntilGenesis = begin - time
  const timeUntilEnd = end - time

  let timeRemaining: number
  let message: string
  if (timeUntilGenesis >= 0) {
    message = `${chainId && CHAIN_LABELS[chainId]} lifts open in`
    timeRemaining = timeUntilGenesis
  } else {
    const ongoing = timeUntilEnd >= 0
    if (ongoing) {
      message = `${chainId && CHAIN_LABELS[chainId]} lifts close in`
      timeRemaining = timeUntilEnd
    } else {
      message = `${chainId && CHAIN_LABELS[chainId]} lifts are closed!`
      timeRemaining = Infinity
    }
  }

  const days = (timeRemaining - (timeRemaining % DAY)) / DAY
  timeRemaining -= days * DAY
  const hours = (timeRemaining - (timeRemaining % HOUR)) / HOUR
  timeRemaining -= hours * HOUR
  const minutes = (timeRemaining - (timeRemaining % MINUTE)) / MINUTE
  timeRemaining -= minutes * MINUTE
  const seconds = timeRemaining

  return (
    <TYPE.black fontWeight={400}>
      {message}{' '}
      {Number.isFinite(timeRemaining) && (
        <code>
          {`${days}:${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
        </code>
      )}
    </TYPE.black>
  )
}
