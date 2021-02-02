import { BIG_INT_SECONDS_IN_WEEK, BIG_INT_ZERO } from '../../constants'
import { CardBGImage, CardNoise, CardSection, DataCard } from '../../components/earn/styled'
import { ETHER, JSBI, Pair, TokenAmount } from '@zeroexchange/sdk'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import { useTokenBalance, useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'

import { AutoColumn } from '../../components/Column'
import { ButtonPrimary } from '../../components/Button'
import Card from '../../components/Card'
import ClaimRewardModal from '../../components/earn/ClaimRewardModal'
import { CountUp } from 'use-count-up'
import { Dots } from '../../components/swap/styleds'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import FullPositionCard from '../../components/PositionCard'
import { Link } from 'react-router-dom'
import { RouteComponentProps } from 'react-router-dom'
import { RowBetween } from '../../components/Row'
import StakingModal from '../../components/earn/StakingModal'
import { TYPE } from '../../theme'
import UnstakingModal from '../../components/earn/UnstakingModal'
import { currencyId } from '../../utils/currencyId'
import { useActiveWeb3React } from '../../hooks'
import { useColor } from '../../hooks/useColor'
import { useCurrency } from '../../hooks/Tokens'
import { usePair } from '../../data/Reserves'
import { usePairs } from '../../data/Reserves'
import usePrevious from '../../hooks/usePrevious'
import { useStakingInfo } from '../../state/stake/hooks'
import { useTotalSupply } from '../../data/TotalSupply'
import useUSDCPrice from '../../utils/useUSDCPrice'
import { useWalletModalToggle } from '../../state/application/hooks'
import { wrappedCurrency } from '../../utils/wrappedCurrency'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
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

const StyledDataCard = styled(DataCard)<{ bgColor?: any; showBackground?: any }>`
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #1e1a31 0%, #3d51a5 100%);
  z-index: 2;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: ${({ theme, bgColor, showBackground }) =>
    `radial-gradient(91.85% 100% at 1.84% 0%, ${bgColor} 0%,  ${showBackground ? theme.black : theme.bg5} 100%) `};
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
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #27ae60 0%, #000000 100%);
  overflow: hidden;
`

const DataRow = styled(RowBetween)`
  justify-content: center;
  gap: 12px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    gap: 12px;
  `};
`

export default function Manage({
  match: {
    params: { currencyIdA, currencyIdB }
  }
}: RouteComponentProps<{ currencyIdA: string; currencyIdB: string }>) {
  const { account, chainId } = useActiveWeb3React()

  const theme = useContext(ThemeContext)

  // get currencies and pair
  const [currencyA, currencyB] = [useCurrency(currencyIdA), useCurrency(currencyIdB)]
  const tokenA = wrappedCurrency(currencyA ?? undefined, chainId)
  const tokenB = wrappedCurrency(currencyB ?? undefined, chainId)

  const [, stakingTokenPair] = usePair(tokenA, tokenB)
  const stakingInfo = useStakingInfo(stakingTokenPair)?.[0]

  // detect existing unstaked LP position to show add button if none found
  const userLiquidityUnstaked = useTokenBalance(account ?? undefined, stakingInfo?.stakedAmount?.token)
  const showAddLiquidityButton = Boolean(stakingInfo?.stakedAmount?.equalTo('0') && userLiquidityUnstaked?.equalTo('0'))

  // toggle for staking modal and unstaking modal
  const [showStakingModal, setShowStakingModal] = useState(false)
  const [showUnstakingModal, setShowUnstakingModal] = useState(false)
  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)

  // fade cards if nothing staked or nothing earned yet
  const disableTop = !stakingInfo?.stakedAmount || stakingInfo.stakedAmount.equalTo(JSBI.BigInt(0))

  const token = currencyA === ETHER ? tokenB : tokenA
  const WETH = currencyA === ETHER ? tokenA : tokenB
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

  const countUpAmount = stakingInfo?.earnedAmount?.toFixed(6) ?? '0'
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

  // pool functionality ============================

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
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
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

  return (
    <PageWrapper gap="lg" justify="center">
      <RowBetween style={{ gap: '24px' }}>
        <TYPE.mediumHeader style={{ margin: 0 }}>
          {currencyA?.symbol}-{currencyB?.symbol} Liquidity Mining
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
                : `${valueOfTotalStakedAmountInWETH?.toSignificant(4, { groupSeparator: ',' }) ?? '-'} ETH`}
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
          <CardBGImage />
          <CardNoise />
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
                to={`/add/${currencyA && currencyId(currencyA)}/${currencyB && currencyId(currencyB)}`}
              >
                {`Add ${currencyA?.symbol}-${currencyB?.symbol} liquidity`}
              </ButtonPrimary>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </VoteCard>
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
              <CardBGImage desaturate />
              <CardNoise />
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
            <CardBGImage desaturate />
            <CardNoise />
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
            {v2PairsWithoutStakedAmount.map(v2Pair => (
              <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
            ))}
            {stakingPairs.map(
              (stakingPair, i) =>
                stakingPair[1] && ( // skip pairs that arent loaded
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
            {stakingInfo && stakingInfo.active && (
              <ButtonPrimary padding="8px" borderRadius="8px" width="160px" margin="10px" onClick={handleDepositClick}>
                {stakingInfo?.stakedAmount?.greaterThan(JSBI.BigInt(0)) ? 'Deposit' : 'Deposit ZERO LP Tokens'}
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
        {!userLiquidityUnstaked ? null : userLiquidityUnstaked.equalTo('0') ? null : !stakingInfo?.active ? null : (
          <div>
            <TYPE.main>{userLiquidityUnstaked.toSignificant(6)} ZERO LP tokens available</TYPE.main>
            <DataRow style={{ marginBottom: '1rem', marginTop: '1rem' }}>
              <ButtonPrimary
                padding="8px"
                borderRadius="8px"
                width={'fit-content'}
                as={Link}
                to={`/remove/${currencyA && currencyId(currencyA)}/${currencyB && currencyId(currencyB)}`}
              >
                Remove Liquidity
              </ButtonPrimary>
            </DataRow>
          </div>
        )}
      </PositionInfo>
    </PageWrapper>
  )
}
