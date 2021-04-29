import { AVAX, BNB, ChainId, Currency, DEV, ETHER, MATIC, TokenAmount, WETH, currencyEquals } from '@zeroexchange/sdk'
import {
  AVAX_ROUTER_ADDRESS,
  ETH_ROUTER_ADDRESS,
  MOONBASE_ROUTER_ADDRESS,
  MUMBAI_ROUTER_ADDRESS,
  SMART_CHAIN_ROUTER_ADDRESS,
  WBNB
} from '../../constants'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import { BlueCard, LightCard } from '../../components/Card'
import { ButtonError, ButtonLight, ButtonPrimary } from '../../components/Button'
import { Dots, Wrapper } from '../Legacy_Pool/styleds'
import React, { useCallback, useContext, useState } from 'react'
import Row, { RowBetween, RowFlat } from '../../components/Row'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from '../../utils'
import styled, { ThemeContext } from 'styled-components'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'
import { useIsExpertMode, useUserSlippageTolerance } from '../../state/user/hooks'

import { AddRemoveTabs } from '../../components/NavigationTabs'
import { BigNumber } from '@ethersproject/bignumber'
import { ConfirmAddModalBottom } from './ConfirmAddModalBottom'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { Field } from '../../state/mint/actions'
import { MinimalPositionCard } from '../../components/PositionCard'
import { PairState } from '../../data/Reserves'
import { Plus } from 'react-feather'
import { PoolPriceBar } from './PoolPriceBar'
import { RouteComponentProps } from 'react-router-dom'
import { TYPE } from '../../theme'
import { Text } from 'rebass'
import { TransactionResponse } from '@ethersproject/providers'
import { currencyId } from '../../utils/currencyId'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { useActiveWeb3React } from '../../hooks'
import { useCrossChain } from '../../state/crosschain/hooks'
import { useCurrency } from '../../hooks/Tokens'
import { useTransactionAdder } from '../../state/transactions/hooks'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import { useWalletModalToggle } from '../../state/application/hooks'
import { wrappedCurrency } from '../../utils/wrappedCurrency'

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
const BodyWrapper = styled.div`
  position: relative;
  max-width: 675px;
  margin-top: 4rem;
  width: 100%;
  background: rgba(47, 53, 115, 0.32);
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.095);
  backdrop-filter: blur(28px);
  border-radius: 30px;
  padding: 3rem;
`

export default function AddLiquidity({
  match: {
    params: { currencyIdA, currencyIdB }
  },
  history,
  ...props
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string }>) {
  useCrossChain()

  const { account, chainId, library } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  const locationState: any = props?.location?.state
  const stakingRewardAddress: any = locationState?.stakingRewardAddress ? locationState?.stakingRewardAddress : null

  // hack for BNB / ZERO pool, flip them for staking
  let curA = currencyIdA
  let curB = currencyIdB
  if (
    chainId &&
    chainId === ChainId.SMART_CHAIN &&
    currencyIdA === 'BNB' &&
    currencyIdB === '0x1f534d2B1ee2933f1fdF8e4b63A44b2249d77EAf'
  ) {
    curA = currencyIdB
    curB = currencyIdA
  }
  const currencyA = useCurrency(curA)
  const currencyB = useCurrency(curB)

  const oneCurrencyIsWETH = Boolean(
    chainId &&
      ((currencyA && currencyEquals(currencyA, WETH[chainId])) ||
        (currencyB && currencyEquals(currencyB, WETH[chainId])))
  )

  const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected

  const expertMode = useIsExpertMode()

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const deadline = useTransactionDeadline() // custom from users settings
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users
  const [txHash, setTxHash] = useState<string>('')

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field])
      }
    },
    {}
  )

  const atMaxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0')
      }
    },
    {}
  )

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_A],
    chainId === ChainId.MAINNET || chainId === ChainId.RINKEBY
      ? ETH_ROUTER_ADDRESS
      : chainId === ChainId.SMART_CHAIN || chainId === ChainId.SMART_CHAIN_TEST
      ? SMART_CHAIN_ROUTER_ADDRESS
      : chainId === ChainId.MOONBASE_ALPHA
      ? MOONBASE_ROUTER_ADDRESS
      : chainId === ChainId.MUMBAI
      ? MUMBAI_ROUTER_ADDRESS
      : AVAX_ROUTER_ADDRESS
  )
  const [approvalB, approveBCallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_B],
    chainId === ChainId.MAINNET || chainId === ChainId.RINKEBY
      ? ETH_ROUTER_ADDRESS
      : chainId === ChainId.SMART_CHAIN || chainId === ChainId.SMART_CHAIN_TEST
      ? SMART_CHAIN_ROUTER_ADDRESS
      : chainId === ChainId.MOONBASE_ALPHA
      ? MOONBASE_ROUTER_ADDRESS
      : chainId === ChainId.MUMBAI
      ? MUMBAI_ROUTER_ADDRESS
      : AVAX_ROUTER_ADDRESS
  )

  const addTransaction = useTransactionAdder()

  async function onAdd() {
    if (!chainId || !library || !account) return

    const router = getRouterContract(chainId, library, account)

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0]
    }

    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<string | string[] | number>,
      value: BigNumber | null
    if (
      currencyA === ETHER ||
      currencyB === ETHER ||
      currencyB === BNB ||
      currencyB === MATIC ||
      currencyA === AVAX ||
      currencyB === AVAX ||
      currencyB === BNB ||
      currencyA === WBNB ||
      currencyB === WBNB ||
      currencyA === DEV ||
      currencyA === MATIC ||
      currencyB === DEV
    ) {
      const tokenBIsETH =
        currencyB === ETHER || currencyB === AVAX || currencyB === BNB || currencyB === DEV || currencyB === MATIC
      estimate = router.estimateGas.addLiquidityETH
      method = router.addLiquidityETH
      args = [
        wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)?.address ?? '', // token
        (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadline.toHexString()
      ]
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString())
    } else {
      estimate = router.estimateGas.addLiquidity
      method = router.addLiquidity
      args = [
        wrappedCurrency(currencyA, chainId)?.address ?? '',
        wrappedCurrency(currencyB, chainId)?.address ?? '',
        parsedAmountA.raw.toString(),
        parsedAmountB.raw.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadline.toHexString()
      ]
      value = null
    }

    setAttemptingTxn(true)

    try {
      let gas
      if (chainId === ChainId.AVALANCHE || chainId === ChainId.SMART_CHAIN) {
        gas = BigNumber.from(350000)
      } else {
        gas = await estimate(...args, value ? { value } : {})
      }
      const response = await method(...args, {
        ...(value ? { value } : {}),
        gasLimit: calculateGasMargin(gas)
      })
      setAttemptingTxn(false)

      addTransaction(response, {
        summary:
          'Add ' +
          parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
          ' ' +
          currencies[Field.CURRENCY_A]?.symbol +
          ' and ' +
          parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
          ' ' +
          currencies[Field.CURRENCY_B]?.symbol
      })

      setTxHash(response.hash)
    } catch (error) {
      setAttemptingTxn(false)
      // we only care if the error is something _other_ than the user rejected the tx
      if (error?.code !== 4001) {
        console.error(error)
      }
    }
  }

  const modalHeader = () => {
    return noLiquidity ? (
      <AutoColumn gap="20px">
        <LightCard mt="20px" borderRadius="20px">
          <RowFlat>
            <Text fontSize="48px" fontWeight={500} lineHeight="42px" marginRight={10}>
              {currencies[Field.CURRENCY_A]?.symbol + '/' + currencies[Field.CURRENCY_B]?.symbol}
            </Text>
            <DoubleCurrencyLogo
              currency0={currencies[Field.CURRENCY_A]}
              currency1={currencies[Field.CURRENCY_B]}
              size={30}
            />
          </RowFlat>
        </LightCard>
      </AutoColumn>
    ) : (
      <AutoColumn gap="20px">
        <RowFlat style={{ marginTop: '20px' }}>
          <Text fontSize="48px" fontWeight={500} lineHeight="42px" marginRight={10}>
            {liquidityMinted?.toSignificant(6)}
          </Text>
          <DoubleCurrencyLogo
            currency0={currencies[Field.CURRENCY_A]}
            currency1={currencies[Field.CURRENCY_B]}
            size={30}
          />
        </RowFlat>
        <Row>
          <Text fontSize="24px">
            {currencies[Field.CURRENCY_A]?.symbol + '/' + currencies[Field.CURRENCY_B]?.symbol + ' Pool Tokens'}
          </Text>
        </Row>
        <TYPE.italic fontSize={12} textAlign="left" padding={'8px 0 0 0 '}>
          {`Output is estimated. If the price changes by more than ${allowedSlippage /
            100}% your transaction will revert.`}
        </TYPE.italic>
      </AutoColumn>
    )
  }

  const modalBottom = () => {
    return (
      <ConfirmAddModalBottom
        price={price}
        currencies={currencies}
        parsedAmounts={parsedAmounts}
        noLiquidity={noLiquidity}
        onAdd={onAdd}
        poolTokenPercentage={poolTokenPercentage}
      />
    )
  }

  const pendingText = `Supplying ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${
    currencies[Field.CURRENCY_A]?.symbol
  } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${currencies[Field.CURRENCY_B]?.symbol}`

  const handleCurrencyASelect = useCallback(
    (currencyA: Currency) => {
      const newCurrencyIdA = currencyId(currencyA)
      if (newCurrencyIdA === currencyIdB) {
        history.push(`/add/${currencyIdB}/${currencyIdA}`)
      } else {
        history.push(`/add/${newCurrencyIdA}/${currencyIdB}`)
      }
    },
    [currencyIdB, history, currencyIdA]
  )
  const handleCurrencyBSelect = useCallback(
    (currencyB: Currency) => {
      const newCurrencyIdB = currencyId(currencyB)
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          history.push(`/add/${currencyIdB}/${newCurrencyIdB}`)
        } else {
          history.push(`/add/${newCurrencyIdB}`)
        }
      } else {
        history.push(`/add/${currencyIdA ? currencyIdA : 'ETH'}/${newCurrencyIdB}`)
      }
    },
    [currencyIdA, history, currencyIdB]
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
    }
    setTxHash('')
  }, [onFieldAInput, txHash])

  const isCreate = history.location.pathname.includes('/create')

  const handleGoBack = () => {
    const x = isCreate ? '/create' : '/add';
    const newUrl = history.location.pathname.replace(x, '/manage');
    history.push(newUrl);
  }

  return (
    <>
      {/*<Title>Add Liquidity</Title>*/}
      <BodyWrapper>
        <AddRemoveTabs creating={isCreate} adding={true} onGoBack={handleGoBack} />
        <Wrapper>
          <TransactionConfirmationModal
            isOpen={showConfirm}
            onDismiss={handleDismissConfirmation}
            attemptingTxn={attemptingTxn}
            hash={txHash}
            content={() => (
              <ConfirmationModalContent
                title={noLiquidity ? 'You are creating a pool' : 'You will receive'}
                onDismiss={handleDismissConfirmation}
                topContent={modalHeader}
                bottomContent={modalBottom}
              />
            )}
            pendingText={pendingText}
          />
          <AutoColumn gap="20px">
            {noLiquidity ||
              (isCreate && (
                <ColumnCenter>
                  <BlueCard>
                    <AutoColumn gap="10px">
                      <TYPE.link fontWeight={600} color={'primaryText1'}>
                        You are the first liquidity provider.
                      </TYPE.link>
                      <TYPE.link fontWeight={400} color={'primaryText1'}>
                        The ratio of tokens you add will set the price of this pool.
                      </TYPE.link>
                      <TYPE.link fontWeight={400} color={'primaryText1'}>
                        Once you are happy with the rate click supply to review.
                      </TYPE.link>
                    </AutoColumn>
                  </BlueCard>
                </ColumnCenter>
              ))}
            <CurrencyInputPanel
              value={formattedAmounts[Field.CURRENCY_A]}
              onUserInput={onFieldAInput}
              onMax={() => {
                onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
              }}
              onCurrencySelect={handleCurrencyASelect}
              showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
              currency={currencies[Field.CURRENCY_A]}
              id="add-liquidity-input-tokena"
              showCommonBases
            />
            <ColumnCenter>
              <Plus size="16" color={theme.text2} />
            </ColumnCenter>
            <CurrencyInputPanel
              value={formattedAmounts[Field.CURRENCY_B]}
              onUserInput={onFieldBInput}
              onCurrencySelect={handleCurrencyBSelect}
              onMax={() => {
                onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
              }}
              showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
              currency={currencies[Field.CURRENCY_B]}
              id="add-liquidity-input-tokenb"
              showCommonBases
            />
            {currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID && (
              <>
                <LightCard padding="0px" borderRadius={'20px'} style={{ borderWidth: 0 }}>
                  <RowBetween padding="1rem">
                    <TYPE.subHeader fontWeight={500} fontSize={14}>
                      {noLiquidity ? 'Initial prices' : 'Prices'} and pool share
                    </TYPE.subHeader>
                  </RowBetween>{' '}
                  <LightCard padding="1rem" borderRadius={'20px'} style={{ borderWidth: 0 }}>
                    <PoolPriceBar
                      currencies={currencies}
                      poolTokenPercentage={poolTokenPercentage}
                      noLiquidity={noLiquidity}
                      price={price}
                    />
                  </LightCard>
                </LightCard>
              </>
            )}

            {!account ? (
              <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
            ) : (
              <AutoColumn gap={'md'}>
                {(approvalA === ApprovalState.NOT_APPROVED ||
                  approvalA === ApprovalState.PENDING ||
                  approvalB === ApprovalState.NOT_APPROVED ||
                  approvalB === ApprovalState.PENDING) &&
                  isValid && (
                    <RowBetween>
                      {approvalA !== ApprovalState.APPROVED && (
                        <ButtonPrimary
                          onClick={approveACallback}
                          disabled={approvalA === ApprovalState.PENDING}
                          width={approvalB !== ApprovalState.APPROVED ? '48%' : '100%'}
                        >
                          {approvalA === ApprovalState.PENDING ? (
                            <Dots>Approving {currencies[Field.CURRENCY_A]?.symbol}</Dots>
                          ) : (
                            'Approve ' + currencies[Field.CURRENCY_A]?.symbol
                          )}
                        </ButtonPrimary>
                      )}
                      {approvalB !== ApprovalState.APPROVED && (
                        <ButtonPrimary
                          onClick={approveBCallback}
                          disabled={approvalB === ApprovalState.PENDING}
                          width={approvalA !== ApprovalState.APPROVED ? '48%' : '100%'}
                        >
                          {approvalB === ApprovalState.PENDING ? (
                            <Dots>Approving {currencies[Field.CURRENCY_B]?.symbol}</Dots>
                          ) : (
                            'Approve ' + currencies[Field.CURRENCY_B]?.symbol
                          )}
                        </ButtonPrimary>
                      )}
                    </RowBetween>
                  )}
                <ButtonError
                  onClick={() => {
                    expertMode ? onAdd() : setShowConfirm(true)
                  }}
                  disabled={!isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED}
                  error={!isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]}
                >
                  <Text fontSize={20} fontWeight={500}>
                    {error ?? 'Supply'}
                  </Text>
                </ButtonError>
              </AutoColumn>
            )}
          </AutoColumn>
        </Wrapper>
      </BodyWrapper>
      {pair && !noLiquidity && pairState !== PairState.INVALID ? (
        <AutoColumn style={{ minWidth: '20rem', width: '100%', maxWidth: '600px', marginTop: '1rem', marginBottom: '2rem' }}>
          <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pair} />
        </AutoColumn>
      ) : null}
    </>
  )
}
