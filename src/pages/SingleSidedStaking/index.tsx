import React, { useEffect, useState } from 'react'
import { StakingConfig, returnStakingConfig } from './stakingConfig'
import { TYPE, Title } from '../../theme'
import { calculateGasMargin } from '../../utils'
import { ButtonOutlined } from '../../components/Button'
import { StakeForm } from './stakeForm'
import { BigNumber, ethers } from 'ethers'
import styled from 'styled-components'
import { useActiveWeb3React } from 'hooks'
import { useStakingAloneContract } from 'hooks/useContract'
import useGasPrice from 'hooks/useGasPrice'
import { useCrosschainState } from 'state/crosschain/hooks'
import PageContainer from 'components/PageContainer'

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
  margin-right: auto;
  margin-top: 50px;
  margin-bottom: 20px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin: 20px auto;  
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
`};
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

  return (
    <PageContainer>
      <StyledTitle>Staking</StyledTitle>
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
