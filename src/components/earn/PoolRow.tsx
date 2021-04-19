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

const Wrapper = styled.tr<{ showBackground: boolean; bgColor: any; showDetails: boolean }>`
  cursor: pointer;
  border-bottom: 0px solid rgba(167, 177, 244, 0.1);
  border-bottom-width: ${({ showDetails }) => (showDetails ? `0` : `1`)}px;
  &:last-of-type {
    border-bottom-width: 0px;
  }
`

const Details = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  column-gap: 34px;
  row-gap: 16px;
  border-bottom: 1px solid rgba(167, 177, 244, 0.1);
  padding-bottom: 16px;
`
const Logo = styled(DoubleCurrencyLogo)`
  margin-bottom: 20px;
`
const Cell = styled.td<{ mobile?: boolean }>`
  display: table-cell;
  padding: 16px 8px;
  ${({ theme, mobile = true }) =>
    !mobile &&
    theme.mediaWidth.upToMedium`
      display: none;
  `};
`
const TitleCell = styled.div`
  display: flex;
  flex-wrap: wrap;
`
const DetailsCell = styled.div<{ showDetails?: boolean }>`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: flex-end;
  ${({ theme }) =>
    theme.mediaWidth.upToMedium`
      div{
        display: none;
      }
  `}
  svg {
    ${({ showDetails }) => showDetails && `transform: rotate(180deg);`}
    margin-left: 8px;
    g {
      fill: #727bba;
    }
  }
`
const DetailsBox = styled.div`
  flex: 1;
  flex-direction: column;
  padding: 34px;
  background: rgba(18, 21, 56, 0.54);
  border-radius: 44px;
`
export default function PoolRow({ stakingInfoTop }: { stakingInfoTop: StakingInfo }) {
  const { chainId, account } = useActiveWeb3React()
  const [showDetails, setShowDetails] = useState(false)
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

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }
  // get the USD value of staked WETH
  const USDPrice = useUSDCPrice(WETH)
  const valueOfTotalStakedAmountInUSDC =
    valueOfTotalStakedAmountInWETH && USDPrice?.quote(valueOfTotalStakedAmountInWETH)

  const symbol = WETH?.symbol

  return (
    <>
      <Wrapper showBackground={isStaking} bgColor={backgroundColor} onClick={toggleDetails} showDetails={showDetails}>
        <Cell>
          <TitleCell>
            <Logo currency0={currency0} currency1={currency1} size={24} style={{marginRight: '8px'}} />
            <TYPE.main fontWeight={500} fontSize={15} style={{ display: 'inline' }}>
              {currency0.symbol}-{currency1.symbol}
            </TYPE.main>
          </TitleCell>
        </Cell>
        <Cell>
          <TYPE.main fontWeight={500} fontSize={15} style={{ textAlign: 'center' }}>
            0
          </TYPE.main>
        </Cell>
        <Cell>
          <TYPE.main fontWeight={500} fontSize={15} style={{ textAlign: 'center' }}>
            80.1%
          </TYPE.main>
        </Cell>
        <Cell mobile={false}>
          <TYPE.main fontWeight={500} fontSize={15} style={{ textAlign: 'center' }}>
            $855.069.231
          </TYPE.main>
        </Cell>
        <Cell mobile={false}>
          <TYPE.main fontWeight={500} fontSize={15} style={{ textAlign: 'center' }}>
            40x
          </TYPE.main>
        </Cell>
        <Cell>
          <DetailsCell showDetails={showDetails}>
            <TYPE.main fontWeight={500} fontSize={15} style={{ textAlign: 'right' }}>
              Details
            </TYPE.main>
            <DropdownArrow />
          </DetailsCell>
        </Cell>
      </Wrapper>
      {showDetails && (
        <tr>
          <td colSpan={6}>
            <Details>
              <DetailsBox>
                <TYPE.main fontWeight={500} fontSize={15}>
                  Earned
                </TYPE.main>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexGrow: 1 }}>
                    <TYPE.white fontWeight={600} fontSize={32}>
                      0.784980
                    </TYPE.white>
                  </div>
                  <div style={{ display: 'flex', flexGrow: 0 }}>
                    <ButtonPrimary>Harvest</ButtonPrimary>
                  </div>
                </div>
              </DetailsBox>
              <DetailsBox>
                <TYPE.white fontWeight={500} fontSize={15} style={{ textAlign: 'center' }}>
                  Start Farming
                </TYPE.white>
                <ButtonOutlined>Select</ButtonOutlined>
              </DetailsBox>
            </Details>
          </td>
        </tr>
      )}
    </>
  )
}
