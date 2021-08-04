import { BigNumber, ethers, utils } from 'ethers'
import React, { useEffect, useMemo, useState } from 'react'
import { toCheckSumAddress, useCrosschainState } from 'state/crosschain/hooks'
import { useRelayaleContract, useRelayTokenContract, useZeroContract } from '../../hooks/useContract'

import BalanceItem from 'components/BalanceItem'
import { ButtonOutlined } from '../../components/Button'
import { Token } from '@zeroexchange/sdk'
import { getEtherscanLink } from '../../utils'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { useUserAddedTokens } from 'state/user/hooks'
import useWindowDimensions from 'hooks/useWindowDimensions'

const SwapFlexRow = styled.div`
    flex: 1;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
`
const InputWrap = styled.div`
    display: flex
`
const SwapWrap = styled.div`
    font-family: Poppins;
    position: relative;
    width: 400px;
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
border: 2px solid #1ef7e7;
background: transparent;
border-radius: 100px;
font-size: 0.875rem;
font-weight: 500;
cursor: pointer;
margin-right: 0.5rem;
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

const SwapFlex = styled.div`
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

const TextBalance = styled.h3`
    font-size: 32px;
    white-space: nowrap;
    margin-bottom: 1rem;
    text-align: center;
    margin-bottom: -4px;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 24px;
    `};
`
const BalanceRow = styled.div<{ isColumn?: boolean }>`
    flex: 1;
    width: 100%;
    display: ${({ isColumn }) => (isColumn ? 'flex' : 'block')};
    flex-direction: ${({ isColumn }) => (isColumn ? 'column' : 'row')};
    align-items: ${({ isColumn }) => (isColumn ? 'center' : '')};
    min-width: 300px;
    max-height: 570px;
    border-radius: 44px;
    overflow-y: scroll;
    padding-right: 1rem;
    padding-left: 1rem;
    #style-7::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    }

    &::-webkit-scrollbar {
    width: 10px;
    background-color: rgba(0, 0, 0, 0.5);
    }

    &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-image: -webkit-gradient(
    linear,
    left bottom,
    left top,
    color-stop(0.44, rgb(41, 32, 98)),
    color-stop(0.72, rgb(51, 40, 123)),
    color-stop(0.86, rgb(61, 49, 148))
    );
    }
`

let web3React: any

export default function RelaySale() {
    const {
        availableTokens,
        currentChain
    } = useCrosschainState()
    web3React = useActiveWeb3React()
    const exchangeContract = useRelayaleContract(currentChain.exchangeContractAddress)
    const zeroContract = useZeroContract(currentChain.zeroContractAddress)
    const relayContract = useRelayTokenContract(currentChain.zeroContractAddress)
    const { account, chainId } = useActiveWeb3React()
    const [allowanceAmount, setAllowanceAmount] = useState(BigNumber.from(0))
    const [amountZero, setAmountZero] = useState('0')
    const [maxAmountZero, setMaxAmountZero] = useState('0')
    const [maxAmountRelay, setMaxAmountRelay] = useState('0')
    const [amountRelay, setAmountRelay] = useState('0')
    const [isPending, setIsPending] = useState(false)
    const [isApprove, setIsApprove] = useState(false)
    const [ethChain, setEthChain] = useState(false)
    const [depositSuccessHash, setDepositSuccessHash] = useState<null | string>(null);
    let resSwap: any = null
    const onSwap = async () => {
        try {
            setIsPending(true)
            const inputValue = BigNumber.from(utils.parseUnits(amountZero, 18))
            if (isApprove) {
                resSwap = await zeroContract?.approve(currentChain.exchangeContractAddress, '57896044618658097711785492504343953926634992332820282019728792003956564819968')
                await resSwap.wait()
                setDepositSuccessHash(resSwap.hash)
                if (depositSuccessHash) {
                    setIsPending(false)
                }

            } else {
                resSwap = await exchangeContract?.swap(inputValue.toHexString(), {
                    gasPrice: 10 * 10 ** 9,
                    gasLimit: 150000,
                })
                await resSwap.wait()
                setDepositSuccessHash(resSwap.hash)
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
    };
    useEffect(() => {
        if (resSwap) {
            setDepositSuccessHash(resSwap?.hash)
        }
    }, [resSwap])

    useEffect(() => {
        const getMaxAmount = async () => {
            const amountToSpend = await zeroContract?.allowance(account, currentChain.exchangeContractAddress)
            if (amountToSpend) {
                setAllowanceAmount(BigNumber.from(amountToSpend))
            }
            const maxUserBalance = await zeroContract?.balanceOf(account)
            if (maxUserBalance) {
                setMaxAmountZero(ethers.utils.formatUnits(maxUserBalance, 'ether'))
            }
        }
        getMaxAmount()

    })

    useEffect(() => {
        const getMaxAmountRelay = async () => {

            const maxRelayBalance = await relayContract?.balanceOf(currentChain.exchangeContractAddress)
            if (maxRelayBalance) {
                setMaxAmountRelay(ethers.utils.formatUnits(maxRelayBalance, 'ether'))
            }
            if (+amountZero >= +maxAmountRelay) {
                setAmountZero(maxAmountRelay)
            }
        }
        getMaxAmountRelay()

    }, [currentChain])

    useEffect(() => {
        if (+amountZero > 0 && +maxAmountZero >= +amountZero && maxAmountZero.length >= amountZero.length) {
            const inputValue = BigNumber.from(utils.parseUnits(amountZero, 18))
            setIsApprove(allowanceAmount.lt(inputValue))
        }

    }, [amountZero, allowanceAmount])

    useEffect(() => {
        if (currentChain?.rateZeroToRelay) {
            const equalRelayAmount = String(+amountZero * currentChain?.rateZeroToRelay)
            setAmountRelay(equalRelayAmount)
        }

    }, [amountZero, currentChain])
    const userTokens = useUserAddedTokens()
        ?.filter((x: any) => x.chainId === chainId)
        ?.map((x: any) => {
            return new Token(x.chainId, x.address, x.decimals, x.symbol, x.name)
        })

    const tokenBalances = useMemo(() => {
        const arr = availableTokens?.filter(token => token?.symbol === 'RELAY' || token?.symbol === 'ZERO')
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
        if (+amountZero >= +maxAmountZero) {
            setAmountZero(maxAmountZero)
        }
    }, [amountZero, maxAmountZero])

    useEffect(() => {
        if (currentChain.name === 'Ethereum' || currentChain.name === 'Polygon' || currentChain.name === 'Smart Chain') {
            setEthChain(true)
        }
    }, [currentChain])

    const maxBalance = async () => {
        setAmountZero(maxAmountZero)
    }
    return (
        <>
            {ethChain ? <SwapFlex style={{ marginTop: '3rem', maxWidth: '1250px', marginLeft: 'auto', marginRight: 'auto' }}>
                <SwapFlexRow>
                    <SwapWrap>
                        <BuyWrap>
                            <h2 style={{ marginBottom: '.5rem' }}>Convert Zero to Relay:</h2>
                            <>
                                {!web3React.account && <p>Please connect to wallet</p>}
                                {web3React.account && (
                                    <>
                                        <InputWrap> <input type="number" name="amount" id="amount-zero" value={amountZero} onChange={e => setAmountZero(e.target.value)} />
                                            <StyledBalanceMax onClick={() => maxBalance()}>MAX</StyledBalanceMax></InputWrap>
                                        {!isApprove && <div>{amountRelay} Relay</div>}
                                        {!isApprove && <div>Max amount available to swap {maxAmountRelay} Relay</div>}
                                        <ButtonsFlex>

                                            <ButtonOutlined className={`green ${depositSuccessHash} ${parseFloat(amountZero) === 0 || !amountZero || isPending ? 'disabled' : ''}`} onClick={onSwap}>
                                                {isApprove ? 'Approve' : 'Swap'}{isPending ? '... pending' : ''}
                                            </ButtonOutlined>
                                        </ButtonsFlex>
                                    </>
                                )}
                            </>
                            {depositSuccessHash && !isPending ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    {isApprove ? <p> Approve successfully</p> : <p>Exchange successfully</p>}
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
                    </SwapWrap>
                </SwapFlexRow>

                {account && tokenBalances && (
                    <BalanceRow isColumn={isColumn}>
                        <TextBalance>{currentChain.name} Balances</TextBalance>
                        {tokenBalances?.map((token: any, index) => {
                            return (
                                <BalanceItem
                                    key={index}
                                    token={token}
                                    chainId={chainId}
                                    account={account}
                                    selectBalance={() => onSelectBalance(false, token)}
                                    isLast={index === tokenBalances.length - 1}
                                ></BalanceItem>
                            )
                        })}
                    </BalanceRow>
                )}
            </SwapFlex> : <SwapFlex> <SwapWrap>{"Zero to Relay swaps work only on Ethereum, Binance and Polygon networks. Please switch any of those chains."}</SwapWrap></SwapFlex>}
        </>
    )
}
