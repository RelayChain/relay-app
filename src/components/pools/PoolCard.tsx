import { AVAX, BNB, DEV, ETHER, JSBI, MATIC, TokenAmount } from '@zeroexchange/sdk'
import { BIG_INT_SECONDS_IN_WEEK, BIG_INT_ZERO } from '../../constants'
import { ButtonOutlined, ButtonPrimary } from '../Button'
import React, { useEffect, useState } from 'react'
import { StyledInternalLink, TYPE } from '../../theme'

import { CountUp } from 'use-count-up'
import DoubleCurrencyLogo from '../DoubleLogo'
import SettingIcon from '../Settings/SettingIcon'
import { StakingInfo } from '../../state/stake/hooks'
import { currencyId } from '../../utils/currencyId'
import styled from 'styled-components'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { useActiveWeb3React } from '../../hooks'
import { useColor } from '../../hooks/useColor'
import { useCurrency } from '../../hooks/Tokens'
import { usePair } from '../../data/Reserves'
import usePrevious from '../../hooks/usePrevious'
import { useStakingInfo } from '../../state/stake/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useTotalSupply } from '../../data/TotalSupply'
import useUSDCPrice from '../../utils/useUSDCPrice'
import { wrappedCurrency } from '../../utils/wrappedCurrency'

const Wrapper = styled.div<{ showBackground: boolean; bgColor: any }>`
  border: 2px solid;
  border-image-source: linear-gradient(150.61deg, rgba(255, 255, 255, 0.03) 18.02%, rgba(34, 39, 88, 0) 88.48%);
  background: rgba(47, 53, 115, 0.32);
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.095);
  backdrop-filter: blur(28px);
  border-radius: 44px;
  padding: 32px 16px;
  margin-bottom: 1rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  &.active {
    background: rgba(179, 104, 252, 0.2);
  }
`

const Row = styled.div`
  display: flex;
  width: 100%;
  padding: 0px 16px;
`

const Icons = styled(DoubleCurrencyLogo)`
  padding: 100px;
`

const ManageButton = styled(StyledInternalLink)`
  postion: absolute;
  width: 140px;
  padding: 0.25rem;
  text-decoration: none !important;
  position: absolute;
  right: 0;
  top: 28px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6752f7;
  transition: all 0.2s ease-in-out;
  &:hover {
    color: #6752f7;
    filter: brightness(1.2);
  }
`

const Label = styled.div`
  margin-bottom: 16px;
`

const Details = styled.div<{ showDetails?: boolean }>`
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 16px;
  margin-top: 16px;
  width: 100%;
  ${({ showDetails }) => !showDetails && `display: none;`}
`
const DetailsBox = styled.div`
  width: 100%;
  flex-direction: column;
  padding: 34px;
  background: rgba(18, 21, 56, 0.54);
  border-radius: 44px;
  min-height: 224px;
  justify-content: center;
  align-items: center;
  position: relative;
`

export default function PoolCard({
  stakingInfoTop,
  sendDataUp,
  harvestSent,
  earningsSent,
  liquiditySent,
  onHarvest,
  stakingInfoAPR
}: {
  stakingInfoTop: StakingInfo | any
  sendDataUp: any
  harvestSent: any
  earningsSent: any
  liquiditySent: any
  onHarvest: any
  stakingInfoAPR: any
}) {
  const { chainId, account } = useActiveWeb3React()
  const [showDetails, setShowDetails] = useState(true)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const token0 = stakingInfoTop.tokens[0]
  const token1 = stakingInfoTop.tokens[1]

  const currency0 = unwrappedToken(token0, chainId)
  const currency1 = unwrappedToken(token1, chainId)

  // get currencies and pair
  const [currencyA, currencyB] = [useCurrency(currencyId(currency0)), useCurrency(currencyId(currency1))]

  const tokenA = wrappedCurrency(currencyA ?? undefined, chainId)
  const tokenB = wrappedCurrency(currencyB ?? undefined, chainId)

  const [, stakingTokenPair] = usePair(tokenA, tokenB)
  const baseStakingInfo = useStakingInfo(stakingTokenPair)
  const stakingInfo = baseStakingInfo.find(x => x.stakingRewardAddress === stakingInfoTop.stakingRewardAddress)
  const stakingRewardAddress = stakingInfoTop.stakingRewardAddress
  const isStaking = Boolean(stakingInfo?.stakedAmount?.greaterThan('0'))

  // detect existing unstaked LP position to show add button if none found
  const userLiquidityUnstaked = useTokenBalance(account ?? undefined, stakingInfo?.stakedAmount?.token)
  const showAddLiquidityButton = Boolean(stakingInfo?.stakedAmount?.equalTo('0') && userLiquidityUnstaked?.equalTo('0'))

  // toggle for staking modal and unstaking modal
  const [showStakingModal, setShowStakingModal] = useState(false)
  const [showUnstakingModal, setShowUnstakingModal] = useState(false)
  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)

  // fade cards if nothing staked or nothing earned yet
  const disableTop = !stakingInfo?.stakedAmount || stakingInfo.stakedAmount.equalTo(JSBI.BigInt(0))

  const token =
    currencyA === ETHER || currencyA === AVAX || currencyA === BNB || currencyA === DEV || currencyA === MATIC
      ? tokenB
      : tokenA
  const WETH =
    currencyA === ETHER || currencyA === AVAX || currencyA === BNB || currencyA === DEV || currencyA === MATIC
      ? tokenA
      : tokenB
  const backgroundColor = useColor(token)

  // get WETH value of staked LP tokens
  const totalSupplyOfStakingToken = useTotalSupply(stakingInfo?.stakedAmount?.token)
  let valueOfTotalStakedAmountInWETH: TokenAmount | undefined
  if (totalSupplyOfStakingToken && stakingTokenPair && stakingInfo && WETH) {
    // take the total amount of LP tokens staked, multiply by ETH value of all LP tokens, divide by all LP tokens
    valueOfTotalStakedAmountInWETH = new TokenAmount(
      WETH,
      JSBI.divide(
        JSBI.multiply(
          JSBI.multiply(stakingInfo.totalStakedAmount.raw, stakingTokenPair.reserveOf(WETH).raw),
          JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the WETH they entitle owner to
        ),
        totalSupplyOfStakingToken.raw
      )
    )
  }

  const countUpAmount = stakingInfo?.earnedAmount?.toFixed(Math.min(6, stakingInfo?.earnedAmount?.currency.decimals)) ?? '0'
  const countUpAmountPrevious = usePrevious(countUpAmount) ?? '0'

  // get the USD value of staked WETH
  const USDPrice = useUSDCPrice(WETH)
  const valueOfTotalStakedAmountInUSDC =
    valueOfTotalStakedAmountInWETH && USDPrice?.quote(valueOfTotalStakedAmountInWETH)

  const symbol = WETH?.symbol

  useEffect(() => {
    const contract = stakingInfo?.stakingRewardAddress
    const singleWeeklyEarnings = stakingInfo?.active
      ? stakingInfo?.rewardRate?.multiply(BIG_INT_SECONDS_IN_WEEK)?.toSignificant(Math.min(4, stakingInfo?.earnedAmount?.currency.decimals), { groupSeparator: ',' }) ?? '-'
      : '0'
    const readyToHarvest = countUpAmount
    const liquidityValue = valueOfTotalStakedAmountInUSDC
      ? `${valueOfTotalStakedAmountInUSDC.toFixed(0)}`
      : `${valueOfTotalStakedAmountInWETH?.toSignificant(4)}`

    // this prevents infinite loops / re-renders
    if (harvestSent === readyToHarvest &&
        earningsSent === singleWeeklyEarnings &&
        liquiditySent === liquidityValue) {
      return;
    }

    if (
      parseFloat(singleWeeklyEarnings) !== 0 &&
      parseFloat(readyToHarvest) !== 0 &&
      parseFloat(liquidityValue) !== 0
    ) {
      sendDataUp({ singleWeeklyEarnings, readyToHarvest, liquidityValue, contract })
    }
  }, [
    countUpAmount,
    stakingInfo,
    harvestSent,
    earningsSent,
    liquiditySent,
    valueOfTotalStakedAmountInUSDC,
    valueOfTotalStakedAmountInWETH
  ])

  if (stakingInfoTop.isHidden) {
    return <></>
  }

  return (
    <>
      <Wrapper
        showBackground={isStaking}
        bgColor={backgroundColor}
        className={parseFloat(countUpAmount) !== 0 ? 'active' : ''}
      >
        <Icons currency0={currency0} currency1={currency1} size={38} />
        <Label>
          <TYPE.main fontWeight={600} fontSize={18}>
            {currency0.symbol}-{currency1.symbol}
          </TYPE.main>
        </Label>
        <Row style={{ marginBottom: '10px' }}>
          <TYPE.main fontWeight={600} fontSize={12} style={{ display: 'flex', flexGrow: 1 }}>
            APR
          </TYPE.main>
          <TYPE.main fontWeight={500} fontSize={15}>
            {stakingInfoAPR ? stakingInfoAPR + '%' : '-'}
          </TYPE.main>
        </Row>
        <Row style={{ marginBottom: '10px' }}>
          <TYPE.main fontWeight={600} fontSize={12} style={{ display: 'flex', flexGrow: 1 }}>
            Reward
          </TYPE.main>
          <TYPE.main fontWeight={500} fontSize={15}>
            {stakingInfo?.active
              ? stakingInfo?.totalRewardRate?.multiply(BIG_INT_SECONDS_IN_WEEK)?.toFixed( 0, { groupSeparator: ',' }) ??
                '-'
              : '0'}
            {` ${stakingInfo?.rewardsTokenSymbol ?? 'ZERO'} / week`}
          </TYPE.main>
        </Row>
        <Row style={{ marginBottom: '10px' }}>
          <TYPE.main fontWeight={600} fontSize={12} style={{ flexGrow: 1 }}>
            Liquidity
          </TYPE.main>
          <TYPE.main fontWeight={500} fontSize={15}>
            {valueOfTotalStakedAmountInUSDC
              ? `$${valueOfTotalStakedAmountInUSDC.toFixed( 0, { groupSeparator: ',' })}`
              : `${valueOfTotalStakedAmountInWETH?.toSignificant(4, { groupSeparator: ',' }) ?? '-'} ${symbol}`}
          </TYPE.main>
        </Row>

        <Details showDetails={showDetails}>
          <DetailsBox>
            {stakingInfo?.earnedAmount && JSBI.notEqual(BIG_INT_ZERO, stakingInfo?.earnedAmount?.raw) ? (
              <>
                <TYPE.white fontWeight={500} fontSize={16} style={{ textAlign: 'left', marginBottom: '1rem' }}>
                  Earned:
                </TYPE.white>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    justifyContent: 'flex-start'
                  }}
                >
                  <TYPE.white fontWeight={600} fontSize={32} style={{ textOverflow: 'ellipsis' }}>
                    <CountUp
                      key={countUpAmount}
                      isCounting
                      decimalPlaces={4}
                      start={parseFloat(countUpAmountPrevious)}
                      end={parseFloat(countUpAmount)}
                      thousandsSeparator={','}
                      duration={1}
                    />
                  </TYPE.white>
                  <div style={{ display: 'flex', flexGrow: 1, marginTop: '1rem', width: '100%' }}>
                    <ButtonPrimary style={{ width: '100%' }} onClick={onHarvest}>
                      Claim
                    </ButtonPrimary>
                  </div>
                </div>
                <ManageButton
                  to={{
                    pathname: `/manage/${currencyId(currency0)}/${currencyId(currency1)}`,
                    state: { stakingRewardAddress }
                  }}
                >
                  <span style={{ marginRight: '10px' }}>Manage</span>
                  <SettingIcon stroke="#6752F7" />
                </ManageButton>
              </>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexGrow: 1,
                  height: '100%',
                  justifyContent: 'flex-start',
                  flexDirection: 'column'
                }}
              >
                <TYPE.white fontWeight={500} fontSize={16} style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  Start Farming:
                </TYPE.white>
                <StyledInternalLink
                  style={{ textDecoration: 'none', width: '100%', marginTop: 'auto' }}
                  to={{
                    pathname: `/manage/${currencyId(currency0)}/${currencyId(currency1)}`,
                    state: { stakingRewardAddress }
                  }}
                >
                  <ButtonOutlined>Select</ButtonOutlined>
                </StyledInternalLink>
              </div>
            )}
          </DetailsBox>
        </Details>
      </Wrapper>
    </>
  )
}
