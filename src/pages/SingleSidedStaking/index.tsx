import { BigNumber, ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { StakingConfig, returnStakingConfig } from './stakingConfig'
import { TYPE, Title } from '../../theme'

import { ButtonOutlined } from '../../components/Button'
import PageContainer from 'components/PageContainer'
import { StakeForm } from './stakeForm'
import { calculateGasMargin } from '../../utils'
import styled from 'styled-components'
import { useActiveWeb3React } from 'hooks'
import { useCrosschainState } from 'state/crosschain/hooks'
import useGasPrice from 'hooks/useGasPrice'
import { useStakingAloneContract } from 'hooks/useContract'
import { RowBetween, RowFixed } from '../../components/Row'
import { tickerTocCoinbaseName } from 'constants/lists'
import { useCoinGeckoPrice } from 'hooks/useCoinGeckoPrice'

const StakeContainer = styled.div`
  font-family: Poppins;
  margin-left: auto;
  margin-right: auto;
  margin-top: 4rem;
  margin-bottom: 4rem;

  ${({ theme }) => theme.mediaWidth.upToMedium`
            margin-top: 20px
            margin-right: auto;
            margin-left: auto;
        `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
        width: 100%;
        `};
`
const SideCardHolder = styled.div`
  margin-right: 75px; 
  display: flex;
  flex-direction: row;
  background: rgb(18,26,56);
  border-radius: 24px;
  padding: 1rem 1.5rem;
  border: 2px solid #B368FC;
  color: #B368FC;
  font-style: normal;
  font-weight: bold;
  font-size: 30px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 2rem;
    flex-direction: column;
    width: 100%;
  `};
`
const StakeWrap = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  //flex-wrap: wrap;
  gap: 1rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
        flex-direction: column;
        align-items: center;
    `};
`
const StakeTitle = styled.h2`
  text-align: center;
`
const ButtonWrapStake = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  .disabled {
    opacity: 0.25;
    pointer-events: none;
  }
`
const ButtonStake = styled(ButtonOutlined)`
  margin-top: 2.5rem;
  width: auto;
  margin-bottom: 1rem;
`

const StyledTitle = styled.h1`
  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: 60px;
  color: #00fff6;
  margin-left: 70px;
  margin-top: 50px;
  margin-bottom: 40px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin: 20px auto;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
`};
`

const RowBetweenSidecard = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
  flex-direction: column;
  align-items: center;
  position: relative;
`};
`
const StakingTitle = styled.div`
  display: flex;
`
export const SingleSidedStaking = () => {
  const { currentChain } = useCrosschainState()
  const [isPending, setIsPending] = useState(false)
  const { account, chainId } = useActiveWeb3React()
  const [earnedLp, setEarnedLp] = useState('0')
  const [updatedHash, setUpdatedHash] = useState('')
  const [rewardSuccessHash, setRewardSuccessHash] = useState('')
  const [indexUpdate, setIndexUpdate] = useState(0)
  const currentGasPrice = useGasPrice(+currentChain.chainID)
  const [priceTokenInUsd, setPriceTokenInUsd] = useState(0)
  const [yearlyRewards, setYearlyRewards] = useState(0)
  const [stakedAmount, setStakedAmount] = useState('0')
  const [priceRewardToken, setPriceRewardToken] = useState(0)
  const [apr, setApr] = useState('0')
  const stakingContract = useStakingAloneContract(returnStakingConfig(chainId)?.stakingContractAddress || '')

  const harvest = async () => {
    try {
      const gasPriceNow = await currentGasPrice
      const estimatedGas = await stakingContract?.estimateGas.getReward().catch(() => {
        // general fallback for tokens who restrict approval amounts

        return stakingContract?.estimateGas.getReward()
      })

      const gasLimitNow = estimatedGas ? estimatedGas : BigNumber.from(250000)
      const earnedAmount = await stakingContract
        ?.getReward({
          gasPrice: gasPriceNow,
          gasLimit: calculateGasMargin(gasLimitNow)
        })
        .catch(console.log)
      setIsPending(true)
      await earnedAmount?.wait()
      setRewardSuccessHash(earnedAmount?.hash)
    } catch (err) {
      console.log('err :>> ', err)
    } finally {
      setIsPending(false)
    }
  }

  let supportedStakingChains: any[] = []
  Object.keys(StakingConfig).forEach(key => {
    supportedStakingChains.push(StakingConfig[key])
  })

  useEffect(() => {
    if (!chainId || !stakingContract) {
      return
    }

    const getEarned = async () => {
      const earnedAmount = await stakingContract?.earned(account).catch(console.log)
      if (earnedAmount) {
        const lpBalance = ethers.utils.formatEther(earnedAmount)
        const formatted = Number(lpBalance).toFixed(6)
        setEarnedLp(formatted)
      }
    }

    if (stakingContract && indexUpdate === 3) {
      getEarned()
    } else {
      return
    }
  }, [stakingContract, indexUpdate])

  const countYearlyRewards = async () => {
    const rewardRate = await stakingContract?.rewardRate().catch(console.log)
    if (rewardRate) {
      const lpBalance = ethers.utils.formatEther(rewardRate)
      const formatted = Number(lpBalance) * 365 * 60 * 60 * 24
      setYearlyRewards(formatted)
    }
  }

  useEffect(() => {
    let ind = indexUpdate
    setInterval(() => {
      if (ind !== 0 && ind % 10 === 0) {
        ind = 0
        setIndexUpdate(ind)
      } else {
        setIndexUpdate(ind++)
      }
    }, 1000)
  }, [])

  useEffect(() => {
    const getMaxAmountLp = async () => {
      const stakedBalance = await stakingContract?.totalSupply().catch(console.log)
      if (stakedBalance) {
        const lpBalance = ethers.utils.formatEther(stakedBalance)
        setStakedAmount(lpBalance)
      }
    }
    getMaxAmountLp()
  }, [account])
  const priceInUsd = useCoinGeckoPrice

  useEffect(() => {
    priceInUsd(tickerTocCoinbaseName['RELAY']).then(data => {
      const usd = Object.values(data)[0]
      setPriceTokenInUsd(usd?.usd ? +usd?.usd : 0)
    })
    if (chainId && returnStakingConfig(chainId)) {
      const rewardSymbol = returnStakingConfig(chainId)?.rewardSymbol
      priceInUsd(tickerTocCoinbaseName[rewardSymbol]).then(data => {
        const usd = Object.values(data)[0]
        setPriceRewardToken(usd?.usd ? +usd?.usd : 0)
      })
    }
    countYearlyRewards()
  }, [chainId])

  useEffect(() => {
    if (+stakedAmount > 0 && priceTokenInUsd > 0 && yearlyRewards && priceRewardToken) {
      const totalApr = ((yearlyRewards * priceRewardToken / (+stakedAmount * priceTokenInUsd)) * 100).toFixed(2)
      setApr(totalApr)
    }

  }, [priceTokenInUsd, priceRewardToken, stakedAmount, yearlyRewards])
  return (
    <PageContainer>
      <RowBetweenSidecard>
        <StyledTitle>Staking</StyledTitle>
        <SideCardHolder>
          {`APR ${apr}%`}
        </SideCardHolder>
      </RowBetweenSidecard>
      <StakeContainer>
        {returnStakingConfig(chainId)?.stakingContractAddress && (
          <>
            <StakeWrap>
              <StakeForm typeAction={'stake'} updatedHash={updatedHash} setUpdatedHash={setUpdatedHash} />
              <StakeForm typeAction={'unstake'} updatedHash={updatedHash} setUpdatedHash={setUpdatedHash} />
            </StakeWrap>
            <ButtonWrapStake>
              {parseFloat(earnedLp) > 0 && (
                <ButtonStake onClick={() => harvest()} className={isPending ? 'disabled' : ''}>
                  {isPending ? '...Pending' : `Harvest ${earnedLp} ${returnStakingConfig(chainId)?.rewardSymbol}`}
                </ButtonStake>
              )}
            </ButtonWrapStake>
          </>
        )}
        {(!chainId || !returnStakingConfig(chainId)?.stakingContractAddress) && (
          <>
            <h3 style={{ marginTop: '2rem' }}>Staking Relay is supported on the following chains:</h3>
            <ul>
              {supportedStakingChains.map(s => (
                <li key={s.chainName}>{s.chainName}</li>
              ))}
            </ul>
          </>
        )}
      </StakeContainer>
    </PageContainer>
  )
}
