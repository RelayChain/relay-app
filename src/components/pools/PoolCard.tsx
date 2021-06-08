import { JSBI } from '@zeroexchange/sdk'
import { BIG_INT_SECONDS_IN_WEEK, BIG_INT_ZERO } from '../../constants'
import { ButtonOutlined, ButtonPrimary } from '../Button'
import React from 'react'
import { StyledInternalLink, TYPE } from '../../theme'
import { CustomLightSpinner} from '../../theme'
import Circle from '../../assets/images/blue-loader.svg'
import { CountUp } from 'use-count-up'
import DoubleCurrencyLogo from '../DoubleLogo'
import SettingIcon from '../Settings/SettingIcon'
import { StakingInfo } from '../../state/stake/hooks'
import { currencyId } from '../../utils/currencyId'
import styled from 'styled-components'
import { useStakingInfoTop } from 'state/pools/hooks'

const moment = require('moment')

const Wrapper = styled.div<{ showBackground: boolean; bgColor: any, isLightMode?: boolean }>`
  border: 2px solid;
  border-image-source: linear-gradient(150.61deg, rgba(255, 255, 255, 0.03) 18.02%, rgba(34, 39, 88, 0) 88.48%);
  background: ${({isLightMode}) => isLightMode ? 'rgba(47, 53, 115, 0.32)' : 'rgba(219, 205, 236, 0.32)'};
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
    background: ${({isLightMode}) => isLightMode ? 'rgba(179, 104, 252, 0.2)' : ''} ;
    border: ${({isLightMode}) => isLightMode ? '2px solid transparent' : '2px solid #ff54ef'} 
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

const Details = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 16px;
  margin-top: 16px;
  width: 100%;
`
const DetailsBox = styled.div<{isLightMode?: boolean}>`
  width: 100%;
  flex-direction: column;
  padding: 34px;
  background: ${({isLightMode}) => isLightMode ? 'rgba(18, 21, 56, 0.54);' : 'rgba(195, 172, 218, 0.24);'};
  border-radius: 44px;
  min-height: 224px;
  justify-content: center;
  align-items: center;
  position: relative;
`

export default function PoolCard({ stakingInfoTop, onHarvest, isLightMode }: { stakingInfoTop: StakingInfo | any; onHarvest: any, isLightMode:boolean }) {
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

  if (stakingInfoTop.isHidden) {
    return <></>
  }

  return (
    <>
      <Wrapper
        isLightMode={isLightMode}
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
            {stakingInfoTop.APR ? stakingInfoTop.APR + '%' : '-'}
          </TYPE.main>
        </Row>
        <Row style={{ marginBottom: '10px' }}>
          <TYPE.main fontWeight={600} fontSize={12} style={{ display: 'flex', flexGrow: 1 }}>
            Reward
          </TYPE.main>
          <TYPE.main fontWeight={500} fontSize={15}>
            {stakingInfo?.active
              ? stakingInfo?.totalRewardRate?.multiply(BIG_INT_SECONDS_IN_WEEK)?.toFixed(0, { groupSeparator: ',' }) ??
                '-'
              : '0'}
            {` ${stakingInfo?.rewardsTokenSymbol ?? 'RELAY'} / week`}
          </TYPE.main>
        </Row>
        <Row style={{ marginBottom: '10px' }}>
          <TYPE.main fontWeight={600} fontSize={12} style={{ flexGrow: 1 }}>
            Liquidity
          </TYPE.main>
          <TYPE.main fontWeight={500} fontSize={15}>
          {valueOfTotalStakedAmountInUSDC || valueOfTotalStakedAmountInWETH
              ? valueOfTotalStakedAmountInUSDC
                ? `$${valueOfTotalStakedAmountInUSDC.toFixed(0, { groupSeparator: ',' })}`
                : `${valueOfTotalStakedAmountInWETH?.toSignificant(4, { groupSeparator: ',' })} ${symbol}`
              : <CustomLightSpinner src={Circle} alt="loader" size={'15px'} />}
          </TYPE.main>
        </Row>
        <Row style={{ marginBottom: '10px' }}>
          <TYPE.main fontWeight={600} fontSize={12} style={{ flexGrow: 1 }}>
            Ending:
          </TYPE.main>
          <TYPE.main fontWeight={500} fontSize={15}>
            {moment(stakingInfo?.periodFinish).fromNow()}
          </TYPE.main>
        </Row>

        <Details>
          <DetailsBox isLightMode={isLightMode}>
            {stakingInfo?.earnedAmount && JSBI.notEqual(BIG_INT_ZERO, stakingInfo?.earnedAmount?.raw) ? (
              <>
                <TYPE.mainPool fontWeight={500} fontSize={16} style={{ textAlign: 'left', marginBottom: '1rem' }}>
                  Earned:
                </TYPE.mainPool>
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
                <TYPE.mainPool fontWeight={500} fontSize={16} style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  Start Farming:
                </TYPE.mainPool>
                <StyledInternalLink
                  style={{ textDecoration: 'none', width: '100%', marginTop: 'auto' }}
                  to={{
                    pathname: `/manage/${currencyId(currency0)}/${currencyId(currency1)}`,
                    state: { stakingRewardAddress }
                  }}
                >
                  <ButtonOutlined style={{ color: 'white'}}>Select</ButtonOutlined>
                </StyledInternalLink>
              </div>
            )}
          </DetailsBox>
        </Details>
      </Wrapper>
    </>
  )
}
