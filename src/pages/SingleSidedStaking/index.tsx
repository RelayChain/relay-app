
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { BigNumber, ethers, utils } from 'ethers'
import { StakeForm } from './stakeForm';
import { ButtonOutlined } from '../../components/Button'
import { useStakingAloneContract } from 'hooks/useContract';
import { useActiveWeb3React } from 'hooks';

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
* {
margin-top: 1rem;
}
.disabled {
opacity: .25;
pointer-events: none;
}
`
const ButtonStake = styled(ButtonOutlined)`
    width: 500px;
    
`


export const SingleSidedStaking = () => {
    const { account, chainId } = useActiveWeb3React()
    const [earnedLp, setEarnedLp] = useState('0')
    const [rewardSuccessHash, setRewardSuccessHash] = useState('')
    const stakingContract = useStakingAloneContract('0x924F19A9B808573Ca0F7aedEd3aa968Be5112622' || '')
    const harvest = async() => {
        const earnedAmount = await stakingContract?.getReward().catch(console.log)
        await earnedAmount.wait()
        setRewardSuccessHash(earnedAmount.hash)
    }
    useEffect(() => {
        const getEarned = async () => {
            const earnedAmount = await stakingContract?.earned(account).catch(console.log)
            if (earnedAmount) {
                const lpBalance = ethers.utils.formatEther(earnedAmount);
                const formatted = Number((lpBalance)).toFixed(6)
                setEarnedLp(formatted)
            }
        }
        getEarned()
    }, [account, rewardSuccessHash])
    return (
        <StakeContainer>
            <StakeTitle>Staking</StakeTitle>
            <StakeWrap>
                <StakeForm typeAction={'stake'} />
                <StakeForm typeAction={'unstake'} />
            </StakeWrap>
            <ButtonWrapStake>
                <ButtonStake onClick={() => harvest()}>
                    {`Harvest ${earnedLp} RELAY`}
                </ButtonStake>
            </ButtonWrapStake>
            {rewardSuccessHash}
        </StakeContainer>
    )
}
