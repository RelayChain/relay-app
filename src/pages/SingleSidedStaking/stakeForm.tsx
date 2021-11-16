import { BigNumber, ethers, utils } from 'ethers'
import { MaxUint256 } from '@ethersproject/constants'
import React, { useEffect, useState } from 'react'
import { useRelayTokenContract, useStakingAloneContract } from '../../hooks/useContract'

import { ButtonOutlined } from '../../components/Button'
import PlainPopup from 'components/Popups/PlainPopup'
import { PopupContent } from 'state/application/actions'
import { calculateGasMargin, getEtherscanLink } from '../../utils'
import { returnStakingConfig } from './stakingConfig'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { useCrosschainState } from 'state/crosschain/hooks'
import useGasPrice from 'hooks/useGasPrice'

const StakeFlexRow = styled.div`
        flex: 1;
        width: 100%;
        margin-left: auto;
        margin-right: auto;
    `
const InputWrap = styled.div`
        display: flex;
        align-items: center;
    `
const StakeWrap = styled.div`
        font-family: Poppins;
        position: relative;
        width: 440px;
        max-width: 100%;
        padding: 28px 34px;
        background: rgba(47, 53, 115, 0.32);
        box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.095);
        backdrop-filter: blur(28px);
        border-radius: 44px;
        margin-left: auto;
        margin-right: auto;
        margin-top: 1rem;
        ${({ theme }) => theme.mediaWidth.upToMedium`
            margin-top: 20px
            margin-right: auto;
            margin-left: auto;
        `};
        ${({ theme }) => theme.mediaWidth.upToSmall`
        width: 100%;
        `};
    `
const StyledBalanceMax = styled.button`
    height: 35px;
    position: absolute;
    border: 2px solid #1ef7e7;
    background: transparent;
    border-radius: 100px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    right: 40px;
    margin-top: 2px;
    color: #1ef7e7;
    transition: all 0.2s ease-in-out;
    padding-left: 10px;
    padding-right: 10px;
    :hover {
        opacity: 0.9;
        }
        :focus {
        outline: none;
    }

        ${({ theme }) => theme.mediaWidth.upToSmall`
        margin: 15px auto 0;
        `};
    `

const StakeFlex = styled.div`
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
        flex-direction: column;
      * {
        margin-top: 1rem;
        }
        .disabled {
        opacity: .25;
        pointer-events: none;
        }
    `
const BuyWrap = styled.div`
        display: flex;
        flex-direction: column;
        input {
        color: #FFFFFF;
        position: relative;
        font-weight: 600;
        outline: none;
        border: none;
        flex: 1 1 auto;
        background: transparent;
        padding: 0px 15px;
        border-radius: 12px;
        font-size: 22px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-appearance: textfield;
        background: rgba(0,0,0,.25);
        height: 48px;
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          /* display: none; <- Crashes Chrome on hover */
        -webkit-appearance: none;
          margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
        }
    `
const TitleStaking = styled.h2`

    `
const BalanceLine = styled.div`
        text-align: end;
    `
let web3React: any

export const StakeForm = ({ typeAction, updatedHash, setUpdatedHash }: { typeAction: string, updatedHash: string, setUpdatedHash: (hash: string) => void }) => {
    const {
        currentChain
    } = useCrosschainState()
    web3React = useActiveWeb3React()
    const { account, chainId } = useActiveWeb3React()

    const [allowanceAmount, setAllowanceAmount] = useState(BigNumber.from(0))
    const [amountRelay, setAmountRelay] = useState('0')
    const [unstakedAmount, setUnstakedAmount] = useState('0')

    const [maxAmountRelay, setMaxAmountRelay] = useState('0')
    const [stakedAmount, setStakedAmount] = useState('0')
    const [isPending, setIsPending] = useState(false)
    const [isApprove, setIsApprove] = useState(true)

    const [crossPopupOpen, setShowPopupModal] = useState(false)
    const hidePopupModal = () => setShowPopupModal(false)
    const [depositSuccessHash, setDepositSuccessHash] = useState<null | string>(null);
    let resStake: any = null
    const [popupContent, setPopupContent] = useState({} as PopupContent)
    const stakedInfo = returnStakingConfig(chainId)
    const stakingContract = useStakingAloneContract(stakedInfo?.stakingContractAddress || '')
    const stakedTokenContract = useRelayTokenContract(stakedInfo?.stakedTokenAddress || '')
    const currentGasPrice = useGasPrice(+currentChain.chainID)
    const doStake = async (amount: string) => {
        try {
            const gasPriceNow = await currentGasPrice
            setIsPending(true)
            const amountToStake = BigNumber.from(utils.parseUnits(amount, 18))

            const estimatedGas = await stakingContract?.estimateGas.stake(amountToStake.toHexString()).catch(() => {
                // general fallback for tokens who restrict approval amounts

                return stakingContract?.estimateGas.stake(amountToStake.toHexString())
            })

            const gasLimitNow = estimatedGas ? estimatedGas : BigNumber.from(350000)
            resStake = await stakingContract?.stake(amountToStake.toHexString(), {
                gasPrice: gasPriceNow,
                gasLimit: calculateGasMargin(gasLimitNow),
            })
            if (resStake) {
                await resStake.wait()
                setPopupContent({
                    simpleAnnounce: {
                        message: `Staked ${amount} Relay`
                    }
                })
                showCrossChainModal()
                setDepositSuccessHash(resStake.hash)
                setUpdatedHash(resStake.hash)
            }
        } catch (e) {
            console.log(e)
        } finally {
            setIsPending(false)
        }
    }
    const onStake = async () => {
        const gasPriceNow = await currentGasPrice
        setIsPending(true)
        if (isApprove) {
            if (typeAction === 'stake') {
                await doStake(amountRelay)
            }
        }
        if (+unstakedAmount > 0) {
            try {
                setIsPending(true)
                const amountToUnstake = BigNumber.from(utils.parseUnits(unstakedAmount, 18))
                const estimatedGas = await stakingContract?.estimateGas.withdraw(amountToUnstake.toHexString()).catch(() => {
                    // general fallback for tokens who restrict approval amounts
    
                    return stakingContract?.estimateGas.withdraw(amountToUnstake.toHexString())
                })
    
                const gasLimitNow = estimatedGas ? estimatedGas : BigNumber.from(250000)
                resStake = await stakingContract?.withdraw(amountToUnstake.toHexString(), {
                    gasPrice: gasPriceNow,
                    gasLimit: calculateGasMargin(gasLimitNow),
                })
                if (resStake) {
                    await resStake.wait()
                    setPopupContent({
                        simpleAnnounce: {
                            message: `Unstaked ${unstakedAmount} Relay`
                        }
                    })
                    showCrossChainModal()
                    setDepositSuccessHash(resStake.hash)
                    setUpdatedHash(resStake.hash)
                    if (depositSuccessHash) {
                        setIsPending(false)
                    }
                }
            } catch (e) {
                setIsPending(false)
                console.log(e)
            } finally {
                setIsPending(false)
            }
        }
        if (!isApprove && +unstakedAmount === 0) {
            try {
                const estimatedGas = await stakedTokenContract?.estimateGas.approve(stakedInfo?.stakingContractAddress, MaxUint256).catch(() => {
                    // general fallback for tokens who restrict approval amounts
    
                    return stakedTokenContract?.estimateGas.approve(stakedInfo?.stakingContractAddress, MaxUint256)
                })
    
                const gasLimitNow = estimatedGas ? estimatedGas : BigNumber.from(150000)
                resStake = await stakedTokenContract?.approve(stakedInfo?.stakingContractAddress, MaxUint256,
                    {
                        gasPrice: gasPriceNow,
                        gasLimit: calculateGasMargin(gasLimitNow),
                    })
                await resStake.wait()


            } catch (err) {
                console.log('err :>> ', err);
            } finally {
                if (resStake.hash) {
                    setPopupContent({
                        simpleAnnounce: {
                            message: `Approved Relay token for staking`
                        }
                    })
                    showCrossChainModal()
                    setDepositSuccessHash(resStake.hash)
                    setUpdatedHash(resStake.hash)
                    await doStake(amountRelay)
                }
            }

        }
    }
    useEffect(() => {
        if (resStake) {
            setDepositSuccessHash(resStake?.hash)
        }
    }, [resStake])


    useEffect(() => {
        const getMaxAmount = async () => {
            const amountToSpend = await stakedTokenContract?.allowance(account, stakedInfo?.stakingContractAddress).catch(console.log)
            if (amountToSpend) {
                setAllowanceAmount(BigNumber.from(amountToSpend))
            }
            const maxUserBalance = await stakedTokenContract?.balanceOf(account).catch(console.log)
            if (maxUserBalance) {
                setMaxAmountRelay(ethers.utils.formatUnits(maxUserBalance, 'ether'))
            }
        }
        getMaxAmount()
    }, [depositSuccessHash, updatedHash])

    useEffect(() => {
        const getMaxAmountRelay = async () => {
            const maxRelayBalance = await stakedTokenContract?.balanceOf(account).catch(console.log)
            if (maxRelayBalance) {
                const relayBalance = ethers.utils.formatEther(maxRelayBalance);
                const formatted = Number(relayBalance).toFixed()
                setMaxAmountRelay(formatted);
            }
            setAmountRelay(String(Math.min(+amountRelay, +maxAmountRelay * 100)))
        }
        getMaxAmountRelay()
        // eslint-disable-next-line
    }, [depositSuccessHash, updatedHash])

    useEffect(() => {
        const getMaxAmountLp = async () => {
            const stakedBalance = await stakingContract?.balanceOf(account).catch(console.log)
            if (stakedBalance) {
                const lpBalance = ethers.utils.formatEther(stakedBalance);
                //const formatted = Number(lpBalance).toFixed()
                setStakedAmount(lpBalance)
            }
        }
        getMaxAmountLp()
    }, [currentChain, unstakedAmount, depositSuccessHash, updatedHash])

    useEffect(() => {
        if (+amountRelay > 0 && +maxAmountRelay >= +amountRelay && maxAmountRelay.length >= amountRelay.length) {
            const inputValue = BigNumber.from(utils.parseUnits(amountRelay, 18))
            setIsApprove(allowanceAmount.gte(inputValue))
        }

    }, [amountRelay, allowanceAmount, maxAmountRelay, updatedHash])

    useEffect(() => {
        setUnstakedAmount('0')
        setAmountRelay('0')

    }, [updatedHash])


    useEffect(() => {
        if (+amountRelay < 0) {
            setAmountRelay('0')
        }
        if (+amountRelay >= +maxAmountRelay) {
            setAmountRelay(maxAmountRelay)
        }
    }, [amountRelay, maxAmountRelay, updatedHash])

    useEffect(() => {
        if (+unstakedAmount < 0) {
            setUnstakedAmount('0')
        }
        if (+unstakedAmount >= +stakedAmount) {
            setUnstakedAmount(stakedAmount)
        }
    }, [stakedAmount, unstakedAmount, updatedHash])


    const maxBalance = async () => {
        setAmountRelay(maxAmountRelay)
    }

    const maxUnstakedBalance = () => {
        setUnstakedAmount(stakedAmount)
    }

    const showCrossChainModal = () => {

        setShowPopupModal(true)
        setTimeout(() => {
            hidePopupModal()
        }, 2000)
    }

    const getButtonDisabledClass = () => {
        if (typeAction === 'stake') {
            return parseFloat(amountRelay) === 0 || !amountRelay || isPending || maxAmountRelay === '0' ? 'disabled' : ''
        } else {
            return !unstakedAmount || stakedAmount === '0' || isPending ? 'disabled' : ''
        }
    }

    const getButtonName = () => {
        if (isPending) {
            return '... pending'
        } else if (typeAction === 'stake') {
            return !isApprove ? 'Approve' : 'Stake'
        } else {
            return 'Unstake'
        }
    }
    const handleOnFocus = (e: any) => {
        const x = typeAction === 'stake' ? amountRelay : unstakedAmount;
        if (x === '0' || x === '') {
            e.target.value = '';
        }
    }

    const handleOnBlur = (e: any) => {
        const x = typeAction === 'stake' ? amountRelay : unstakedAmount;
        if (x === '0' || x === '') {
            e.target.value = '0';
        }
    }

    return (
        <>
            <StakeFlex style={{ marginTop: '1rem', maxWidth: '1250px', marginLeft: 'auto', marginRight: 'auto' }}>
                <StakeFlexRow>
                    <StakeWrap>
                        <BuyWrap>
                            <TitleStaking>{typeAction === 'stake' ? 'Stake Relay' : 'Unstake Relay'}</TitleStaking>
                            <>
                                {!web3React.account && <p>Please connect to wallet</p>}
                                {web3React.account && (
                                    <>
                                        <BalanceLine>{typeAction === 'stake' ? `${maxAmountRelay} Relay` : `${stakedAmount} LP Staked`}</BalanceLine>
                                        <InputWrap>
                                            <input
                                                autoComplete="off"
                                                type="number"
                                                name="amount"
                                                id="amount-relay"
                                                value={typeAction === 'stake' ? amountRelay : unstakedAmount}
                                                onFocus={handleOnFocus}
                                                onBlur={handleOnBlur}
                                                onChange={e => typeAction === 'stake' ? setAmountRelay(e.target.value) : setUnstakedAmount(e.target.value)} />
                                            <StyledBalanceMax onClick={typeAction === 'stake' ? () => maxBalance() : () => maxUnstakedBalance()}>MAX </StyledBalanceMax>
                                        </InputWrap>
                                        <ButtonsFlex>
                                            <ButtonOutlined className={`green ${getButtonDisabledClass()}`} onClick={onStake}>
                                                {getButtonName()}
                                            </ButtonOutlined>
                                        </ButtonsFlex>
                                    </>
                                )}
                            </>
                            {depositSuccessHash && !isPending ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <p>Transaction completed successfully</p>
                                    <a
                                        href={getEtherscanLink(web3React.chainId as number, depositSuccessHash as string, 'transaction')}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        View tx on the block explorer
                                    </a>
                                </div>
                            ) : (<></>)}
                        </BuyWrap>
                    </StakeWrap>
                </StakeFlexRow>


            </StakeFlex>

            <PlainPopup isOpen={crossPopupOpen} onDismiss={hidePopupModal} content={popupContent} removeAfterMs={2000} />
        </>
    )
}
