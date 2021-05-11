import { AVAX, BNB, ChainId, DEV, ETHER, JSBI, MATIC, Pair, TokenAmount } from '@zeroexchange/sdk'
import { BIG_INT_SECONDS_IN_WEEK, BIG_INT_ZERO } from '../../constants'
import { ButtonOutlined, ButtonPrimary, ButtonSuccess } from '../../components/Button'
import { CardBGImage, CardNoise, CardSection, DataCard } from '../../components/pools/styled'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { RowBetween, RowCenter } from '../../components/Row'
import { StyledInternalLink, TYPE } from '../../theme'
import styled, { ThemeContext } from 'styled-components'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import { useTokenBalance, useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'

import { AutoColumn } from '../../components/Column'
import Card from '../../components/Card'
import ClaimRewardModal from '../../components/pools/ClaimRewardModal'
import { CountUp } from 'use-count-up'
import { Dots } from '../../components/swap/styleds'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import FullPositionCard from '../../components/PositionCard'
import { Link } from 'react-router-dom'
import PageContainer from './../../components/PageContainer'
import { RouteComponentProps } from 'react-router-dom'
import StakingModal from '../../components/pools/StakingModal'
import UnstakingModal from '../../components/pools/UnstakingModal'
import { currencyId } from '../../utils/currencyId'
import { useActiveWeb3React } from '../../hooks'
import { useColor } from '../../hooks/useColor'
import { useCurrency } from '../../hooks/Tokens'
import { useHistory } from 'react-router'
import { usePair } from '../../data/Reserves'
import { usePairs } from '../../data/Reserves'
import usePrevious from '../../hooks/usePrevious'
import { useStakingInfo } from '../../state/stake/hooks'
import { useTotalSupply } from '../../data/TotalSupply'
import useUSDCPrice from '../../utils/useUSDCPrice'
import { useWalletModalToggle } from '../../state/application/hooks'
import { wrappedCurrency } from '../../utils/wrappedCurrency'

const PageWrapper = styled.div`
  flex-direction: column;
  display: flex;
  width: 100%;
  flex-grow: 1;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding:0px;
`};
`
const Columns = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: column;
  `};
`
const SingleColumn = styled.div`
  display: flex;
  flex-grow: 1;
  max-width: 50%;
  min-width: 50%;
  width: 50%;
  &.left {
    margin-right: 1rem;
  }
  &.right {
    margin-left: 1rem;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    &.left {
      margin-right: auto;
      margin-left: auto;
      width: 100%;
    }
    &.right {
      margin-right: auto;
      margin-left: auto;
      width: 100%;
    }
  `};
`
const Title = styled.h1`
  width: 100%;
  padding: 0px 64px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding: 0;
  text-align: center;
  font-size: 49px;
  margin-top: 40px;
  margin-bottom: 0px;
`};
`
const Wrapper = styled.div`
  background: rgba(47, 53, 115, 0.32);
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.095);
  backdrop-filter: blur(28px);
  border-radius: 44px;
  margin-bottom: 1rem;
  padding: 2rem 2.5rem;
  width: 100%;
  overflow: hidden;
  position: relative;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  border-radius: 16px;
  padding: 16px 16px;
`};
`

const StatsWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 2rem;
  background: rgba(0,0,0,.25);
  border-radius: 24px;
  margin-bottom: 1.5rem;
  .add-liquidity-link {
    width: 188px;
    margin-left: auto;
    text-decoration: none;
  }
  .remove-liquidity-link {
    text-decoration: none;
    margin-left: 2rem;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
  flex-direction: column;
  align-items: flex-start;
  .add-liquidity-link {
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    max-width: 500px;
  }
  .remove-liquidity-link {
    margin-left: auto;
    margin-right: auto;
    margin-top: 1rem;
    width: 100%;
  }
`};
`
const Stat = styled.div`
  display: flex;
  flex-grow: 0;
  flex-direction: column;
  &.harvest {
    margin-left: 2rem;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
  &.harvest {
    margin-top: 1rem;
    margin-bottom: 1rem;
    margin-left: 0;
  }
`};
`

const StatLabel = styled.h5`
  font-weight: bold;
  color: #fff;
  font-size: 1rem;
  span {
    opacity: .75;
    font-weight: normal;
  }
`

const StatValue = styled.h6`
  font-weight: bold;
  color: #fff;
  font-size: 1.75rem;
  margin-top: 10px;
  margin-bottom: 0;
  span {
    opacity: .75;
    font-weight: normal;
    font-size: 1.25rem;
    margin-left: 4px;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
  font-size: 1.25rem;
`};
`

const PositionInfo = styled(AutoColumn)<{ dim: any }>`
  position: relative;
  max-width: 640px;
  width: 100%;
  opacity: ${({ dim }) => (dim ? 0.6 : 1)};
`

const BottomSection = styled(AutoColumn)`
  border-radius: 12px;
  width: 100%;
  position: relative;
`

const StyledBox = styled.div`
  border-radius: 12px;
  width: 100%;
  position: relative;
  display: flex;
  border: 2px solid ${({ theme }) => theme.green1};
  padding: 1rem;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  div {
    color: ${({ theme }) => theme.green1};
    font-weight: bold;
  }
`

const StyledDataCard = styled(DataCard)<{ bgColor?: any; showBackground?: any }>`
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #1e1a31 0%, #6752F7 100%);
  z-index: 2;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: #111;
`

const StyledBottomCard = styled(DataCard)<{ dim: any }>`
  background: ${({ theme }) => theme.bg3};
  opacity: ${({ dim }) => (dim ? 0.4 : 1)};
  margin-top: -40px;
  padding: 0 1.25rem 1rem 1.25rem;
  padding-top: 32px;
  z-index: 1;
`

const PoolData = styled(DataCard)`
  background: none;
  border: 1px solid ${({ theme }) => theme.bg4};
  padding: 1rem;
  z-index: 1;
`

const EmptyProposals = styled.div`
  border: 1px solid ${({ theme }) => theme.text4};
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const VoteCard = styled(DataCard)`
  background: #111;
  overflow: hidden;
  border: 2px solid rgba(103, 82, 247, .45);
  border-radius: 12px;
`

const DataRow = styled(RowBetween)`
  justify-content: center;
  gap: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    gap: 12px;
  `};
`

const SymbolTitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom 2rem;
`
const SymbolTitleInner = styled.div`
  flex-grow: 0;
  display: flex;
  font-size: 1.5rem;
`

const TextLink = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: #6752F7;
  cursor: pointer;
  transition: all .2s ease-in-out;
  &.pink {
    color: #B368FC
  }
  &:hover {
    opacity: .9;
  }
`

export default function Manage({
  match: {
    params: { currencyIdA, currencyIdB }
  },
  ...props
}: RouteComponentProps<{ currencyIdA: string; currencyIdB: string }>) {
  const { account, chainId } = useActiveWeb3React()
  const history = useHistory()

  const locationState: any = props?.location?.state;
  const stakingRewardAddress: any = locationState?.stakingRewardAddress ? locationState?.stakingRewardAddress : null;

  if (!stakingRewardAddress) {
    history.push('/pools');
  }

  const theme = useContext(ThemeContext)
  // get currencies and pair
  const [currencyA, currencyB] = [useCurrency(currencyIdA), useCurrency(currencyIdB)]
  const tokenA = wrappedCurrency(currencyA ?? undefined, chainId)
  const tokenB = wrappedCurrency(currencyB ?? undefined, chainId)

  const [, stakingTokenPair] = usePair(tokenA, tokenB)
  const baseStakingInfo = useStakingInfo(stakingTokenPair)
  const stakingInfo = baseStakingInfo.find(x => x.stakingRewardAddress === stakingRewardAddress);

  // detect existing unstaked LP position to show add button if none found
  const userLiquidityUnstaked = useTokenBalance(account ?? undefined, stakingInfo?.stakedAmount?.token)
  const showAddLiquidityButton = Boolean(stakingInfo?.stakedAmount?.equalTo('0') && userLiquidityUnstaked?.equalTo('0'))

  // toggle for staking modal and unstaking modal
  const [showStakingModal, setShowStakingModal] = useState(false)
  const [showUnstakingModal, setShowUnstakingModal] = useState(false)
  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)

  // fade cards if nothing staked or nothing earned yet
  const disableTop = !stakingInfo?.stakedAmount || stakingInfo.stakedAmount.equalTo(JSBI.BigInt(0))

  const token = currencyA === ETHER || currencyA === AVAX || currencyA === BNB || currencyA === DEV  || currencyA === MATIC ? tokenB : tokenA
  const WETH = currencyA === ETHER || currencyA === AVAX || currencyA === BNB || currencyA === DEV || currencyA === MATIC ? tokenA : tokenB
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

  const toggleWalletModal = useWalletModalToggle()

  const handleDepositClick = useCallback(() => {
    if (account) {
      setShowStakingModal(true)
    } else {
      toggleWalletModal()
    }
  }, [account, toggleWalletModal])

  // pool functionality =====================
  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )

  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens?.filter(({ liquidityToken }) => {
        if (liquidityToken) {
          v2PairsBalances[liquidityToken?.address]?.greaterThan('0')
        }
      }),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  // show liquidity even if its deposited in rewards contract
  const allStakingInfo = useStakingInfo()
  const stakingInfosWithBalance = allStakingInfo?.filter(pool => JSBI.greaterThan(pool.stakedAmount.raw, BIG_INT_ZERO))
  const stakingPairs = usePairs(stakingInfosWithBalance?.map(stakingInfo => stakingInfo.tokens))

  // remove any pairs that also are included in pairs with stake in mining pool
  const v2PairsWithoutStakedAmount = allV2PairsWithLiquidity.filter(v2Pair => {
    return (
      stakingPairs
        ?.map(stakingPair => stakingPair[1])
        .filter(stakingPair => stakingPair?.liquidityToken.address === v2Pair.liquidityToken.address).length === 0
    )
  })

  const showMe = (pair: any) => {
    return (
      pair?.token0?.symbol === stakingTokenPair?.token0?.symbol &&
      pair?.token1?.symbol === stakingTokenPair?.token1?.symbol
    )
  }

  const symbol = WETH?.symbol
  return (
    <>
    {stakingInfo && (
      <>
        <StakingModal
          isOpen={showStakingModal}
          onDismiss={() => setShowStakingModal(false)}
          stakingInfo={stakingInfo}
          userLiquidityUnstaked={userLiquidityUnstaked}
        />
        <UnstakingModal
          isOpen={showUnstakingModal}
          onDismiss={() => setShowUnstakingModal(false)}
          stakingInfo={stakingInfo}
        />
        <ClaimRewardModal
          isOpen={showClaimRewardModal}
          onDismiss={() => setShowClaimRewardModal(false)}
          stakingInfo={stakingInfo}
        />
      </>
    )}
    <Title>Manage</Title>
    <PageContainer>
      {account !== null && <>
        <SymbolTitleWrapper>
          <SymbolTitleInner>
              {currencyA?.symbol}/{currencyB?.symbol}
              <span style={{ marginLeft: '10px', marginRight: '10px' }}>Liquidity Mining</span>
            <DoubleCurrencyLogo currency0={currencyA ?? undefined} currency1={currencyB ?? undefined} size={30} />
          </SymbolTitleInner>
        </SymbolTitleWrapper>
        <StatsWrapper>
          <Stat className="weekly">
            <StatLabel>Total Deposits:</StatLabel>
            <StatValue>
              {valueOfTotalStakedAmountInUSDC
                ? `$${valueOfTotalStakedAmountInUSDC.toFixed(0, { groupSeparator: ',' })}`
                : `${valueOfTotalStakedAmountInWETH?.toSignificant(4, { groupSeparator: ',' }) ?? '-'}`}
                <span>{symbol}</span>
            </StatValue>
          </Stat>
          <Stat className="harvest">
            <StatLabel>Reward Rate:</StatLabel>
            <StatValue>
              {stakingInfo?.active
                ? stakingInfo?.totalRewardRate
                    ?.multiply(BIG_INT_SECONDS_IN_WEEK)
                    ?.toFixed( 0, { groupSeparator: ',' }) ?? '-'
                : '0'}
                <span>{` ${stakingInfo?.rewardsTokenSymbol ?? 'ZERO'} / week`}</span>
            </StatValue>
          </Stat>
          <StyledInternalLink className="add-liquidity-link"
            to={{
              pathname: `/add/${currencyA && currencyId(currencyA)}/${currencyB && currencyId(currencyB)}`,
              state: { stakingRewardAddress }
            }}
          >
            <ButtonOutlined className="add-liquidity-button">Add Liquidity</ButtonOutlined>
          </StyledInternalLink>
          {!userLiquidityUnstaked ? null : userLiquidityUnstaked.equalTo('0') ? null : !stakingInfo?.active ? null : (
            <StyledInternalLink className="remove-liquidity-link"
              to={{
                pathname: `/remove/${currencyA && currencyId(currencyA)}/${currencyB && currencyId(currencyB)}`,
                state: { stakingRewardAddress }
              }}
            >
              <TextLink>Remove Liquidity</TextLink>
            </StyledInternalLink>
          )}
        </StatsWrapper> </>
      }
      <PageWrapper>
        <Columns>
          <SingleColumn className="left">
            <Wrapper>
              <StatLabel style={{ color: '#A7B1F4' }}>Rewards Earned:</StatLabel>
              <RowBetween className="is-mobile" style={{ marginBottom: '2rem'}}>
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
                {stakingInfo?.earnedAmount && JSBI.notEqual(BIG_INT_ZERO, stakingInfo?.earnedAmount?.raw) && (
                  <ButtonPrimary onClick={() => setShowClaimRewardModal(true)} style={{ width: '160px'}}>
                    Claim
                  </ButtonPrimary>
                )}
              </RowBetween>
              <StatLabel style={{ color: '#A7B1F4'}}>Earning Rate:</StatLabel>
              <RowBetween className="is-mobile" style={{ marginBottom: '2rem'}}>
                <TYPE.white fontWeight={600} fontSize={32} style={{ textOverflow: 'ellipsis' }}>
                  {stakingInfo?.active
                    ? stakingInfo?.rewardRate
                        ?.multiply(BIG_INT_SECONDS_IN_WEEK)
                        ?.toSignificant(Math.min(4, stakingInfo?.earnedAmount?.currency.decimals), { groupSeparator: ',' }) ?? '-'
                    : '0'}
                  <span style={{ opacity: '.8', marginLeft: '5px', fontSize: '16px' }}>{` ${stakingInfo?.rewardsTokenSymbol ?? 'ZERO'} / week`}</span>
                </TYPE.white>
              </RowBetween>
              <StatLabel style={{ color: '#A7B1F4' }}>Current Liquidity Deposits:</StatLabel>
              <RowBetween className="is-mobile" style={{ marginBottom: '2rem'}}>
                <TYPE.white fontWeight={600} fontSize={32} style={{ textOverflow: 'ellipsis' }}>
                  {stakingInfo?.stakedAmount?.toSignificant(Math.min(6, stakingInfo?.earnedAmount?.currency.decimals)) ?? '-'}
                  <span style={{ opacity: '.8', marginLeft: '5px', fontSize: '16px' }}>ZERO {currencyA?.symbol}-{currencyB?.symbol}</span>
                </TYPE.white>
              </RowBetween>
              {stakingInfo?.stakedAmount?.greaterThan(JSBI.BigInt(0)) && (
                <RowCenter>
                  <TextLink onClick={() => setShowUnstakingModal(true)}>Withdraw From Pool</TextLink>
                </RowCenter>
              )}
            </Wrapper>
          </SingleColumn>
          { (stakingInfo?.stakedAmount?.greaterThan(JSBI.BigInt(0)) ||
            (userLiquidityUnstaked && !userLiquidityUnstaked.equalTo('0'))) &&
          <SingleColumn className="right">
            <Wrapper>
              {!userLiquidityUnstaked ? null : userLiquidityUnstaked.equalTo('0') ? null : !stakingInfo?.active ? null : (<>
                <StatLabel style={{ color: '#A7B1F4' }}>LP To Deposit:</StatLabel>
                <RowBetween className="is-mobile" style={{ marginBottom: '2rem'}}>
                  <TYPE.white fontWeight={600} fontSize={32} style={{ textOverflow: 'ellipsis' }}>
                    {userLiquidityUnstaked?.toSignificant(Math.min(6, stakingInfo?.earnedAmount?.currency.decimals))}
                    <span style={{ opacity: '.8', marginLeft: '5px', fontSize: '16px' }}>ZERO LP tokens</span>
                  </TYPE.white>
                  <ButtonOutlined className="remove-liquidity-button green" onClick={handleDepositClick} style={{ width: '160px'}}>
                    {stakingInfo?.stakedAmount?.greaterThan(JSBI.BigInt(0)) ? 'Deposit' : 'Deposit'}
                  </ButtonOutlined>
                </RowBetween>
              </>)}
              {stakingPairs.map(
                (stakingPair, i) =>
                  stakingPair[1] &&
                  showMe(stakingPair[1]) && (
                    <FullPositionCard
                      key={stakingInfosWithBalance[i].stakingRewardAddress}
                      pair={stakingPair[1]}
                      stakedBalance={stakingInfosWithBalance[i].stakedAmount}
                    />
                  )
              )}
            </Wrapper>
          </SingleColumn>}
        </Columns>
      </PageWrapper>
    </PageContainer>
  </>
  )
}

/* ====
<PageWrapper>
  <RowBetween style={{ gap: '24px' }}>
    <TYPE.mediumHeader style={{ margin: 0 }}>
      {currencyA?.symbol}/{currencyB?.symbol} Liquidity Mining
    </TYPE.mediumHeader>
    <DoubleCurrencyLogo currency0={currencyA ?? undefined} currency1={currencyB ?? undefined} size={24} />
  </RowBetween>
  <DataRow style={{ gap: '24px' }}>
    <PoolData>
      <AutoColumn gap="sm">
        <TYPE.body style={{ margin: 0 }}>Total deposits</TYPE.body>
        <TYPE.body fontSize={24} fontWeight={500}>
          {valueOfTotalStakedAmountInUSDC
            ? `$${valueOfTotalStakedAmountInUSDC.toFixed(0, { groupSeparator: ',' })}`
            : `${valueOfTotalStakedAmountInWETH?.toSignificant(4, { groupSeparator: ',' }) ?? '-'} ${symbol}`}
        </TYPE.body>
      </AutoColumn>
    </PoolData>
    <PoolData>
      <AutoColumn gap="sm">
        <TYPE.body style={{ margin: 0 }}>Pool Rate</TYPE.body>
        <TYPE.body fontSize={24} fontWeight={500}>
          {stakingInfo?.active
            ? stakingInfo?.totalRewardRate
                ?.multiply(BIG_INT_SECONDS_IN_WEEK)
                ?.toFixed(0, { groupSeparator: ',' }) ?? '-'
            : '0'}
          {' ZERO / week'}
        </TYPE.body>
      </AutoColumn>
    </PoolData>
  </DataRow>
  {showAddLiquidityButton && (
    <VoteCard>
      <CardSection>
        <AutoColumn gap="md">
          <RowBetween>
            <TYPE.white fontWeight={600}>Step 1. Get ZERO Liquidity Provider Tokens</TYPE.white>
          </RowBetween>
          <RowBetween style={{ marginBottom: '1rem' }}>
            <TYPE.white fontSize={14}>
              {`ZERO LP tokens are required. Once you've added liquidity to the ${currencyA?.symbol}-${currencyB?.symbol} pool you can stake your LP tokens on this page to earn ZERO.`}
            </TYPE.white>
          </RowBetween>
          <ButtonPrimary
            padding="8px"
            borderRadius="8px"
            width={'fit-content'}
            as={Link}
            to={{ pathname: `/add/${currencyA && currencyId(currencyA)}/${currencyB && currencyId(currencyB)}`, state: { stakingRewardAddress }}}
          >
            {`Add ${currencyA?.symbol}/${currencyB?.symbol} liquidity`}
          </ButtonPrimary>
        </AutoColumn>
      </CardSection>
    </VoteCard>
  )}
  {!showAddLiquidityButton && stakingInfo && (
    <ButtonPrimary
      padding="8px"
      borderRadius="8px"
      width={'fit-content'}
      as={Link}
      to={`/add/${currencyA && currencyId(currencyA)}/${currencyB && currencyId(currencyB)}`}
    >
      {`Add more ${currencyA?.symbol}/${currencyB?.symbol} liquidity`}
    </ButtonPrimary>
  )}
  {stakingInfo && (
    <>
      <StakingModal
        isOpen={showStakingModal}
        onDismiss={() => setShowStakingModal(false)}
        stakingInfo={stakingInfo}
        userLiquidityUnstaked={userLiquidityUnstaked}
      />
      <UnstakingModal
        isOpen={showUnstakingModal}
        onDismiss={() => setShowUnstakingModal(false)}
        stakingInfo={stakingInfo}
      />
      <ClaimRewardModal
        isOpen={showClaimRewardModal}
        onDismiss={() => setShowClaimRewardModal(false)}
        stakingInfo={stakingInfo}
      />
    </>
  )}
  <PositionInfo gap="lg" justify="center" dim={showAddLiquidityButton}>
    <BottomSection gap="lg" justify="center">
      <StyledDataCard disabled={disableTop} bgColor={backgroundColor} showBackground={!showAddLiquidityButton}>
        <CardSection>
          <AutoColumn gap="md">
            <RowBetween>
              <TYPE.white fontWeight={600}>Your liquidity deposits</TYPE.white>
            </RowBetween>
            <RowBetween style={{ alignItems: 'baseline' }}>
              <TYPE.white fontSize={36} fontWeight={600}>
                {stakingInfo?.stakedAmount?.toSignificant(6) ?? '-'}
              </TYPE.white>
              <TYPE.white>
                ZERO {currencyA?.symbol}-{currencyB?.symbol}
              </TYPE.white>
            </RowBetween>
          </AutoColumn>
        </CardSection>
      </StyledDataCard>
      <StyledBottomCard dim={stakingInfo?.stakedAmount?.equalTo(JSBI.BigInt(0))}>
        <AutoColumn gap="sm">
          <RowBetween>
            <div>
              <TYPE.black>Your unclaimed ZERO</TYPE.black>
            </div>
            {stakingInfo?.earnedAmount && JSBI.notEqual(BIG_INT_ZERO, stakingInfo?.earnedAmount?.raw) && (
              <ButtonPrimary
                padding="8px"
                borderRadius="8px"
                width="fit-content"
                onClick={() => setShowClaimRewardModal(true)}
              >
                Claim
              </ButtonPrimary>
            )}
          </RowBetween>
          <RowBetween style={{ alignItems: 'baseline' }}>
            <TYPE.largeHeader fontSize={36} fontWeight={600}>
              <CountUp
                key={countUpAmount}
                isCounting
                decimalPlaces={4}
                start={parseFloat(countUpAmountPrevious)}
                end={parseFloat(countUpAmount)}
                thousandsSeparator={','}
                duration={1}
              />
            </TYPE.largeHeader>
            <TYPE.black fontSize={16} fontWeight={500}>
              <span role="img" aria-label="wizard-icon" style={{ marginRight: '8px ' }}>
                ⚡
              </span>
              {stakingInfo?.active
                ? stakingInfo?.rewardRate
                    ?.multiply(BIG_INT_SECONDS_IN_WEEK)
                    ?.toSignificant(4, { groupSeparator: ',' }) ?? '-'
                : '0'}
              {' ZERO / week'}
            </TYPE.black>
          </RowBetween>
        </AutoColumn>
      </StyledBottomCard>
      {!userLiquidityUnstaked ? null : userLiquidityUnstaked.equalTo('0') ? null : !stakingInfo?.active ? null : (
        <StyledBox>
          <TYPE.main>{userLiquidityUnstaked?.toSignificant(6)} ZERO LP tokens</TYPE.main>
          <GreenButton onClick={handleDepositClick}>
            {stakingInfo?.stakedAmount?.greaterThan(JSBI.BigInt(0)) ? 'Deposit' : 'Deposit ZERO LP Tokens'}
          </GreenButton>
        </StyledBox>
      )}
    </BottomSection>
    {!account ? (
      <Card padding="40px">
        <TYPE.body color={theme.text3} textAlign="center">
          Connect to a wallet to view your liquidity.
        </TYPE.body>
      </Card>
    ) : v2IsLoading ? (
      <EmptyProposals>
        <TYPE.body color={theme.text3} textAlign="center">
          <Dots>Loading</Dots>
        </TYPE.body>
      </EmptyProposals>
    ) : allV2PairsWithLiquidity?.length > 0 || stakingPairs?.length > 0 ? (
      <>
        {stakingPairs.map(
          (stakingPair, i) =>
            stakingPair[1] &&
            showMe(stakingPair[1]) && (
              <FullPositionCard
                key={stakingInfosWithBalance[i].stakingRewardAddress}
                pair={stakingPair[1]}
                stakedBalance={stakingInfosWithBalance[i].stakedAmount}
              />
            )
        )}
      </>
    ) : (
      <EmptyProposals>
        <TYPE.body color={theme.text3} textAlign="center">
          No liquidity found.
        </TYPE.body>
      </EmptyProposals>
    )}
    <TYPE.main style={{ textAlign: 'center' }} fontSize={14}>
      <span role="img" aria-label="wizard-icon" style={{ marginRight: '8px' }}>
        ⭐️
      </span>
      When you withdraw, the contract will automagically claim ZERO on your behalf!
    </TYPE.main>
    {!showAddLiquidityButton && (
      <DataRow style={{ marginBottom: '1rem' }}>
        {!userLiquidityUnstaked ? null : userLiquidityUnstaked.equalTo('0') ? null : !stakingInfo?.active ? null : (
          <ButtonPrimary
            padding="8px"
            borderRadius="8px"
            width={'fit-content'}
            as={Link}
            to={`/remove/${currencyA && currencyId(currencyA)}/${currencyB && currencyId(currencyB)}`}
          >
            Remove Liquidity
          </ButtonPrimary>
        )}
        {stakingInfo?.stakedAmount?.greaterThan(JSBI.BigInt(0)) && (
          <>
            <ButtonPrimary
              padding="8px"
              borderRadius="8px"
              margin="10px"
              width="160px"
              onClick={() => setShowUnstakingModal(true)}
            >
              Withdraw
            </ButtonPrimary>
          </>
        )}
      </DataRow>
    )}
  </PositionInfo>
</PageWrapper>
*/
