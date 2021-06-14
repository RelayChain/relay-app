import { ButtonOutlined, ButtonPrimary } from '../Button'
import React, { useState } from 'react'
import { StyledInternalLink, TYPE } from '../../theme'
import { CustomLightSpinner} from '../../theme'
import Circle from '../../assets/images/blue-loader.svg'

import { BIG_INT_SECONDS_IN_WEEK } from '../../constants'
import { CountUp } from 'use-count-up'
import DoubleCurrencyLogo from '../DoubleLogo'
import DropdownArrow from '../../assets/svg/DropdownArrow'
import { StakingInfo } from '../../state/stake/hooks'
import { currencyId } from '../../utils/currencyId'
import styled from 'styled-components'
import { useStakingInfoTop } from 'state/pools/hooks'

const moment = require('moment')

const Wrapper = styled.tr<{ showBackground: boolean; bgColor: any; showDetails: boolean }>`
  cursor: pointer;
  border-bottom: 0px solid rgba(167, 177, 244, 0.1);
  border-bottom-width: ${({ showDetails }) => (showDetails ? `0` : `1`)}px;
  &:last-of-type {
    border-bottom-width: 0px;
  }
  &.active {
    background: rgba(179, 104, 252, 0.2);
  }
`

const Details = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  column-gap: 34px;
  row-gap: 16px;
  border-bottom: 1px solid rgba(167, 177, 244, 0.1);
  padding: 22px 45px;
  ${({ theme }) =>
    theme.mediaWidth.upToExtraSmall`
    display: flex;
    flex-direction: column;
    padding: 12px 10px;
`}
`
const Logo = styled(DoubleCurrencyLogo)`
  margin-bottom: 20px;
`
const Cell = styled.td<{ mobile?: boolean }>`
  display: table-cell;
  padding: 16px 8px;
  :first-child {
    width: 45px;
  }
  :last-child {
    width: 45px;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
  :first-child {
    width: 15px;
  }
  :last-child {
    width: 15px;
  }
  `};
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
  text-align: left;
  justify-content: flex-start;
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
  justify-content: center;
  display: flex;
`
export default function PoolRow({
  stakingInfoTop,
  onHarvest,
}: {
  stakingInfoTop: StakingInfo | any
  onHarvest: any
}) {
  const [showDetails, setShowDetails] = useState(false)
  const {
    countUpAmount,
    isStaking,
    backgroundColor,
    currency0,
    currency1,
    stakingInfo,
    valueOfTotalStakedAmountInUSDC,
    stakingRewardAddress,
    valueOfTotalStakedAmountInWETH,
    countUpAmountPrevious,
    symbol
  } = useStakingInfoTop(stakingInfoTop)

  const isSingleSided = stakingInfo.tokens[0].address === stakingInfo.tokens[1].address;

  if (stakingInfoTop.isHidden) {
    return <></>
  }
  return (
    <>
      <Wrapper
        className={parseFloat(countUpAmount) !== 0 ? 'active' : ''}
        showBackground={isStaking}
        bgColor={backgroundColor}
        onClick={() => setShowDetails(!showDetails)}
        showDetails={showDetails}
      >
        <Cell></Cell>
        <Cell>
          <TitleCell>
            <Logo currency0={currency0} currency1={currency1} size={24} style={{ marginRight: '8px' }} />
            <TYPE.main fontWeight={500} fontSize={15} style={{ display: 'inline' }}>
              {currency0.symbol}-{currency1.symbol}
            </TYPE.main>
          </TitleCell>
        </Cell>
        <Cell mobile={false}>
          <TYPE.main fontWeight={500} fontSize={15} style={{ textAlign: 'center' }}>
            {stakingInfo?.active
              ? stakingInfo?.totalRewardRate?.multiply(BIG_INT_SECONDS_IN_WEEK)?.toFixed(0, { groupSeparator: ',' }) ??
                '-'
              : '0'}
            {` ${stakingInfo?.rewardsTokenSymbol ?? 'ZERO'} / week`}
          </TYPE.main>
        </Cell>
        <Cell mobile={false}>
          <TYPE.main fontWeight={500} fontSize={15} style={{ textAlign: 'center' }}>
            {stakingInfoTop.APR ? stakingInfoTop.APR + '%' : '-'}
          </TYPE.main>
        </Cell>
        <Cell mobile={false}>
          <TYPE.main fontWeight={500} fontSize={15} style={{ textAlign: 'center' }}>
            {isSingleSided 
              ? '-' 
              : valueOfTotalStakedAmountInUSDC || valueOfTotalStakedAmountInWETH
                ? valueOfTotalStakedAmountInUSDC
                  ? `$${valueOfTotalStakedAmountInUSDC.toFixed(0, { groupSeparator: ',' })}`
                  : `${valueOfTotalStakedAmountInWETH?.toSignificant(4, { groupSeparator: ',' })} ${symbol}`
                : <CustomLightSpinner src={Circle} alt="loader" size={'15px'} />}
          </TYPE.main>
        </Cell>
        <Cell mobile={false}>
          <TYPE.main fontWeight={500} fontSize={15} style={{ textAlign: 'center' }}>
            {countUpAmount}
          </TYPE.main>
        </Cell>
        <Cell style={{ width: '150px' }}>
          <DetailsCell showDetails={showDetails}>
            <TYPE.main fontWeight={500} fontSize={15} style={{ textAlign: 'left', marginRight: 'auto' }}>
              {moment(stakingInfo?.periodFinish).fromNow()}
            </TYPE.main>
            <DropdownArrow />
          </DetailsCell>
        </Cell>
        <Cell></Cell>
      </Wrapper>
      {showDetails && (
        <tr>
          <td colSpan={8}>
            <Details>
              <DetailsBox>
                <TYPE.main fontWeight={500} fontSize={15}>
                  Earned:
                </TYPE.main>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexGrow: 1 }}>
                    <TYPE.white fontWeight={600} fontSize={32}>
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
                  </div>
                  {countUpAmount && parseFloat(countUpAmount) > 0 && (
                    <div style={{ display: 'flex', flexGrow: 0 }}>
                      <ButtonPrimary onClick={onHarvest}>Claim</ButtonPrimary>
                    </div>
                  )}
                </div>
              </DetailsBox>
              <DetailsBox>
                <StyledInternalLink
                  style={{ textDecoration: 'none', width: '100%' }}
                  to={{
                    pathname: `/manage/${currencyId(currency0)}/${currencyId(currency1)}`,
                    state: { stakingRewardAddress }
                  }}
                >
                  <ButtonOutlined>Select</ButtonOutlined>
                </StyledInternalLink>
              </DetailsBox>
            </Details>
          </td>
        </tr>
      )}
    </>
  )
}
