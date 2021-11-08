
import { BigNumber, ethers, utils } from 'ethers'
import React, { useEffect, useMemo, useState } from 'react'
import { toCheckSumAddress, useCrosschainState } from 'state/crosschain/hooks'
import { useRelayaleContract, useRelayTokenContract } from '../../hooks/useContract'
import { PopupContent } from 'state/application/actions'

import { ButtonOutlined } from '../../components/Button'
import { Token } from '@zeroexchange/sdk'
import { getEtherscanLink } from '../../utils'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { useUserAddedTokens } from 'state/user/hooks'
import useWindowDimensions from 'hooks/useWindowDimensions'
import PlainPopup from 'components/Popups/PlainPopup'

const StakeFlexRow = styled.div`
        flex: 1;
        width: 100%;
        margin-left: auto;
        margin-right: auto;
    `
const InputWrap = styled.div`
        display: flex
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

export const StakeForm = ({ typeAction }: { typeAction: string }) => {
    const {
        availableTokens,
        currentChain,
        allCrosschainData
    } = useCrosschainState()
    web3React = useActiveWeb3React()

    const currentChainData = allCrosschainData.chains.find(chain => chain.chainId === +currentChain.chainID)
    const relayAddress = currentChainData?.tokens.find(token => token.symbol === 'RELAY')
    const relayContract = useRelayTokenContract(relayAddress?.address || '');
    const { account, chainId } = useActiveWeb3React()
    const [allowanceAmount, setAllowanceAmount] = useState(BigNumber.from(0))
    const [amountRelay, setAmountRelay] = useState('0')
    const [maxAmountRelay, setMaxAmountRelay] = useState('0')
    const [isPending, setIsPending] = useState(false)
    const [isApprove, setIsApprove] = useState(false)
    const [ethChain, setEthChain] = useState(false)
    const [crossPopupOpen, setShowPopupModal] = useState(false)
    const hidePopupModal = () => setShowPopupModal(false)
    const [depositSuccessHash, setDepositSuccessHash] = useState<null | string>(null);
    let resStake: any = null
    const [popupContent, setPopupContent] = useState({} as PopupContent)
    const onStake = async () => {

        setPopupContent({
            simpleAnnounce: {
                message: `Staked ${amountRelay} Relay`
            }
        })
        showCrossChainModal()
        // try {
        //     setIsPending(true)
        //     const inputValue = BigNumber.from(utils.parseUnits(amountRelay, 18))
        //     if (isApprove) {
        //         resStake = await zeroContract?.approve(currentChain.exchangeContractAddress, '57896044618658097711785492504343953926634992332820282019728792003956564819968')
        //         await resStake.wait()
        //         setDepositSuccessHash(resStake.hash)
        //         if (depositSuccessHash) {
        //             setIsPending(false)
        //         }

        //     } else {
        //         resStake = await exchangeContract?.Stake(inputValue.toHexString(), {
        //             gasPrice: 226 * 10 ** 9,
        //             gasLimit: 150000,
        //         })
        //         await resStake.wait()
        //         setDepositSuccessHash(resStake.hash)
        //         if (depositSuccessHash) {
        //             setIsPending(false)
        //         }
        //     }

        // } catch (e) {
        //     setIsPending(false)
        //     console.log(e)
        // } finally {
        //     setIsPending(false)
        // }
    };
    useEffect(() => {
        if (resStake) {
            setDepositSuccessHash(resStake?.hash)
        }
    }, [resStake])

    useEffect(() => {
        // const getMaxAmount = async () => {
        //     const amountToSpend = await zeroContract?.allowance(account, currentChain.exchangeContractAddress).catch(console.log)
        //     if (amountToSpend) {
        //         setAllowanceAmount(BigNumber.from(amountToSpend))
        //     }
        //     const maxUserBalance = await zeroContract?.balanceOf(account).catch(console.log)
        //     if (maxUserBalance) {
        //         setMaxAmountRelay(ethers.utils.formatUnits(maxUserBalance, 'ether'))
        //     }
        // }
        // getMaxAmount()
    })

    useEffect(() => {
        const getMaxAmountRelay = async () => {

            const maxRelayBalance = await relayContract?.balanceOf(account).catch(console.log)
            if (maxRelayBalance) {
                const relayBalance = ethers.utils.formatEther(maxRelayBalance);
                const formatted = Number(relayBalance).toFixed()
                setMaxAmountRelay(formatted);
            }
            setAmountRelay(String(Math.min(+amountRelay, +maxAmountRelay * 100)))
        }
        getMaxAmountRelay()
        // eslint-disable-next-line
    }, [currentChain])

    useEffect(() => {
        if (+amountRelay > 0 && +maxAmountRelay >= +amountRelay && maxAmountRelay.length >= amountRelay.length) {
            const inputValue = BigNumber.from(utils.parseUnits(amountRelay, 18))
            setIsApprove(allowanceAmount.lt(inputValue))
        }

    }, [amountRelay, allowanceAmount, maxAmountRelay])


    const userTokens = useUserAddedTokens()
        ?.filter((x: any) => x.chainId === chainId)
        ?.map((x: any) => {
            return new Token(x.chainId, x.address, x.decimals, x.symbol, x.name)
        })

    const tokenBalances = useMemo(() => {
        const arr = availableTokens?.filter(token => token?.symbol === 'RELAY')
            .map((x: any) => {
                const address = toCheckSumAddress(x?.address)
                const tokenData = { ...x, address }
                return new Token(
                    tokenData?.chainId,
                    tokenData?.address,
                    tokenData?.decimals,
                    tokenData?.symbol,
                    tokenData?.name
                )
            })

        const filteredArray: any = [];
        arr?.forEach((item: any) => {
            const i = filteredArray.findIndex((x: any) => x.address === item.address);
            if (i <= -1) {
                filteredArray.push(item);
            }
        })

        return [...new Set(filteredArray)]
        // eslint-disable-next-line
    }, [availableTokens, userTokens, currentChain])

    const { width } = useWindowDimensions()

    let isColumn = false
    if (width < 1350) {
        isColumn = true
    }
    const onSelectBalance = (isNative: boolean, token?: any) => {
        return ''
    }

    useEffect(() => {
        console.log('amountRelay :>> ', amountRelay);
        if (+amountRelay >= +maxAmountRelay) {
            setAmountRelay(maxAmountRelay)
        }
    }, [amountRelay, maxAmountRelay])

    useEffect(() => {
        if (['Ethereum', 'Polygon', 'Smart Chain', 'Avalanche'].includes(currentChain.name)) {
            setEthChain(true)
        }
    }, [currentChain])

    const maxBalance = async () => {
        setAmountRelay(maxAmountRelay)
    }

    const showCrossChainModal = () => {
        const currentTime = ~~(Date.now() / 1000)
        // if (lastTimeSwitched < currentTime) {
        //   setShowCrossChainModal(true)
        // } else {
        setShowPopupModal(true)
        setTimeout(() => {
            hidePopupModal()
        }, 2000)
        //}
    }
    return (
        <>
            {ethChain ? <StakeFlex style={{ marginTop: '3rem', maxWidth: '1250px', marginLeft: 'auto', marginRight: 'auto' }}>
                <StakeFlexRow>
                    <StakeWrap>
                        <BuyWrap>
                            <TitleStaking>{typeAction === 'stake' ? 'Stake Relay' : 'Unstake Relay'}</TitleStaking>
                            <>
                                {!web3React.account && <p>Please connect to wallet</p>}
                                {web3React.account && (
                                    <>
                                        <BalanceLine>{typeAction === 'stake' ? `${maxAmountRelay} Relay` : '342 LP Staked'}</BalanceLine>
                                        <InputWrap> <input type="number" name="amount" id="amount-zero" value={amountRelay} onChange={e => setAmountRelay(e.target.value)} />
                                            <StyledBalanceMax onClick={() => maxBalance()}>MAX</StyledBalanceMax></InputWrap>

                                        <ButtonsFlex>
                                            <ButtonOutlined className={`green ${depositSuccessHash} ${parseFloat(amountRelay) === 0 || !amountRelay || isPending || maxAmountRelay === '0' ? 'disabled' : ''}`} onClick={onStake}>
                                                {isPending ? '... pending' : typeAction === 'stake' ? 'Stake' : 'Unstake'}
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


            </StakeFlex> :
                <StakeFlex>
                    <StakeWrap>{"RELAY Stakes work only on Ethereum, Binance, Avalanche, Polygon networks. Please switch any of those chains."}</StakeWrap>
                </StakeFlex>}
            <PlainPopup isOpen={crossPopupOpen} onDismiss={hidePopupModal} content={popupContent} removeAfterMs={2000} />
        </>
    )
}
