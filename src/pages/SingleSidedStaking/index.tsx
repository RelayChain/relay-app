
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { StakeForm } from './stakeForm';
import { ButtonOutlined } from '../../components/Button'

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
    return (
        <StakeContainer>
            <StakeTitle>Staking</StakeTitle>
            <StakeWrap>
                <StakeForm typeAction={'stake'} />
                <StakeForm typeAction={'unstake'} />
            </StakeWrap>
            <ButtonWrapStake>
                <ButtonStake >
                    {'Harvest 213 RELAY'}
                </ButtonStake>
            </ButtonWrapStake>
        </StakeContainer>
    )
}
