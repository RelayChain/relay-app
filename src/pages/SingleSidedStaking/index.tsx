import React, { useEffect, useState } from 'react'
import { StakingConfig, returnStakingConfig } from './stakingConfig'

import { ButtonOutlined } from '../../components/Button'
import { StakeForm } from './stakeForm';
import {ethers} from 'ethers'
import styled from 'styled-components'
import { useActiveWeb3React } from 'hooks'
import { useStakingAloneContract } from 'hooks/useContract';

const StakeContainer = styled.div`
        font-family: Poppins;
        position: relative;
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

const StakeWrap = styled.div`
    display: flex;
    justify-content: space-between;
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
    opacity: .25;
    pointer-events: none;
  }
`
const ButtonStake = styled(ButtonOutlined)`
  margin-top: 2.5rem;
  width: auto;
  margin-bottom: 1rem;
`

export const SingleSidedStaking = () => {
    const [isPending, setIsPending] = useState(false)
    const { account, chainId } = useActiveWeb3React()
    const [earnedLp, setEarnedLp] = useState('0')
    const [updatedHash, setUpdatedHash] = useState('')
    const [rewardSuccessHash, setRewardSuccessHash] = useState('')

    const stakingContract = useStakingAloneContract(returnStakingConfig(chainId)?.stakingContractAddress || '')

    const harvest = async () => {
        try {
            const earnedAmount = await stakingContract?.getReward().catch(console.log)
            setIsPending(true)
            await earnedAmount?.wait()
            setRewardSuccessHash(earnedAmount?.hash)
        } catch (err) {
            console.log('err :>> ', err);
        } finally {
            setIsPending(false)
        }

    }

    let supportedStakingChains: any[] = []
    Object.keys(StakingConfig).forEach((key) => {
        supportedStakingChains.push(StakingConfig[key])
    })

    useEffect(() => {
        if (!chainId || !stakingContract) {
            return;
        }
        const getEarned = async () => {
            const earnedAmount = await stakingContract?.earned(account).catch(console.log)
            if (earnedAmount) {
                const lpBalance = ethers.utils.formatEther(earnedAmount);
                const formatted = Number((lpBalance)).toFixed(6)
                setEarnedLp(formatted)
            }
        }
        getEarned()
    }, [account, rewardSuccessHash, chainId, stakingContract])
    return (
        <StakeContainer style={{ marginTop: '4rem', marginBottom: '4rem' }}>
            <StakeTitle>Stake Relay, Earn Rewards</StakeTitle>
            {returnStakingConfig(chainId)?.stakingContractAddress && <>
                <StakeWrap>
                    <StakeForm typeAction={'stake'}  updatedHash={updatedHash} setUpdatedHash={setUpdatedHash}/>
                    <StakeForm typeAction={'unstake'} updatedHash={updatedHash} setUpdatedHash={setUpdatedHash}/>
                </StakeWrap>
                <ButtonWrapStake>
                    {parseFloat(earnedLp) > 0 &&
                        <ButtonStake onClick={() => harvest()} className={isPending ? 'disabled' : ''}>
                            {isPending ? '...Pending' : `Harvest ${earnedLp} ${returnStakingConfig(chainId)?.rewardSymbol}`}
                        </ButtonStake>
                    }
                </ButtonWrapStake>
            </>
            }
            {(!chainId || !returnStakingConfig(chainId)?.stakingContractAddress) && <>
                <h3 style={{ marginTop: '2rem' }}>Staking Relay is supported on the following chains:</h3>
                <ul>
                    {supportedStakingChains.map(s => <li key={s.chainName}>
                        {s.chainName}
                    </li>)}
                </ul>
            </>
            }
        </StakeContainer>
    )
}
