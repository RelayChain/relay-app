import { AVAX, BNB, ChainId, ETHER, JSBI, TokenAmount } from '@zeroexchange/sdk'
import { Break, CardNoise } from './styled'
import { ButtonOutlined, ButtonPrimary } from '../Button'
import { ExternalLink, StyledInternalLink, TYPE } from '../../theme'
import React, { useState } from 'react'
import { useTokenBalance, useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'

import { AutoColumn } from '../Column'
import { BIG_INT_SECONDS_IN_WEEK } from '../../constants'
import DoubleCurrencyLogo from '../DoubleLogo'
import DropdownArrow from '../../assets/svg/DropdownArrow'
import { RowBetween } from '../Row'
import { StakingInfo } from '../../state/stake/hooks'
import { currencyId } from '../../utils/currencyId'
import styled from 'styled-components'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { useActiveWeb3React } from '../../hooks'
import { useColor } from '../../hooks/useColor'
import { useCurrency } from '../../hooks/Tokens'
import { usePair } from '../../data/Reserves'
import { useStakingInfo } from '../../state/stake/hooks'
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
`

const Row = styled.div`
  display: flex;
  width: 100%;
  padding: 0px 16px;
`

const Icons = styled(DoubleCurrencyLogo)`
  padding: 100px;
`

const Label = styled.div`
  margin-bottom: 16px;
`
const DetailsButton = styled.div<{ showDetails?: boolean }>`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 16px;
  svg {
    ${({ showDetails }) => showDetails && `transform: rotate(180deg);`}
    margin-left: 8px;
    g {
      fill: #727bba;
    }
  }
`
const Details = styled.div<{ showDetails?: boolean }>`
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 16px;
  margin-top: 16px;
  ${({ showDetails }) => !showDetails && `display: none;`}

`
const DetailsBox = styled.div`
  width: 100%;
  flex-direction: column;
  padding: 34px;
  background: rgba(18, 21, 56, 0.54);
  border-radius: 44px;
`
const Multiplier = styled.div`
  border: 2px solid #727bba;
  border-radius: 44px;
  padding: 4px 16px;
`

export default function PoolCard({ stakingInfoTop }: { stakingInfoTop: StakingInfo }) {
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

  const token = currencyA === ETHER || currencyA === AVAX || currencyA === BNB ? tokenB : tokenA
  const WETH = currencyA === ETHER || currencyA === AVAX || currencyA === BNB ? tokenA : tokenB
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

  // get the USD value of staked WETH
  const USDPrice = useUSDCPrice(WETH)
  const valueOfTotalStakedAmountInUSDC =
    valueOfTotalStakedAmountInWETH && USDPrice?.quote(valueOfTotalStakedAmountInWETH)

  const symbol = WETH?.symbol

  return (
    <Wrapper showBackground={isStaking} bgColor={backgroundColor}>
      <Icons currency0={currency0} currency1={currency1} size={38} />
      <Label>
        <TYPE.main fontWeight={600} fontSize={18}>
          {currency0.symbol}-{currency1.symbol}
        </TYPE.main>
      </Label>
      <Multiplier>
        <TYPE.white fontWeight={400} fontSize={15}>
          {`Multiplier: 40x`}
        </TYPE.white>
      </Multiplier>
      <Row>
        <TYPE.main fontWeight={600} fontSize={12} style={{ display: 'flex', flexGrow: 1 }}>
          APR
        </TYPE.main>
        <TYPE.main fontWeight={500} fontSize={15}>
          0%
        </TYPE.main>
      </Row>
      <Row>
        <TYPE.main fontWeight={600} fontSize={12} style={{ flexGrow: 1 }}>
          Liquidity
        </TYPE.main>
        <TYPE.main fontWeight={500} fontSize={15}>
          $15,893,234.34
        </TYPE.main>
      </Row>
      {/* <DetailsButton showDetails={showDetails}  onClick={toggleDetails} >
        <TYPE.main fontWeight={500} fontSize={15} style={{ textAlign: 'right' }}>
          Details
        </TYPE.main>
        <DropdownArrow />
      </DetailsButton> */}

      <Details showDetails={showDetails}>
        <DetailsBox>
          <TYPE.main fontWeight={500} fontSize={15}>
            Earned
          </TYPE.main>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexGrow: 1, marginRight: 16, overflow: 'hidden' }}>
              <TYPE.white fontWeight={600} fontSize={32} style={{ textOverflow: 'ellipsize' }}>
                0.784980
              </TYPE.white>
            </div>
            <div style={{ display: 'flex', flexGrow: 0 }}>
              <ButtonPrimary width={'fit-content'}>Harvest</ButtonPrimary>
            </div>
          </div>
        </DetailsBox>
        <DetailsBox>
          <TYPE.white fontWeight={500} fontSize={15} style={{ textAlign: 'center' }}>
            Staked
          </TYPE.white>
          <StyledInternalLink
            to={{
              pathname: `/zero/${currencyId(currency0)}/${currencyId(currency1)}`,
              state: { stakingRewardAddress }
            }}
          >
            <ButtonOutlined>Select</ButtonOutlined>
          </StyledInternalLink>
        </DetailsBox>
      </Details>
    </Wrapper>
  )
}
