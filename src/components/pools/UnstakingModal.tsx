import { CloseIcon, TYPE } from '../../theme'
import { LoadingView, SubmittedView } from '../ModalViews'
import React, { useState } from 'react'

import { AutoColumn } from '../Column'
import { ButtonError } from '../Button'
import FormattedCurrencyAmount from '../FormattedCurrencyAmount'
import Modal from '../Modal'
import { RowBetween } from '../Row'
import { StakingInfo } from '../../state/stake/hooks'
import { TransactionResponse } from '@ethersproject/providers'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { useStakingContract } from '../../hooks/useContract'
import { useTransactionAdder } from '../../state/transactions/hooks'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`

interface StakingModalProps {
  isOpen: boolean
  onDismiss: () => void
  stakingInfo: StakingInfo
}

export default function UnstakingModal({ isOpen, onDismiss, stakingInfo }: StakingModalProps) {
  const { account } = useActiveWeb3React()

  // monitor call to help UI loading state
  const addTransaction = useTransactionAdder()
  const [hash, setHash] = useState<string | undefined>()
  const [attempting, setAttempting] = useState(false)

  function wrappedOndismiss() {
    setHash(undefined)
    setAttempting(false)
    onDismiss()
  }

  const stakingContract = useStakingContract(stakingInfo.stakingRewardAddress)

  async function onWithdraw() {
    if (stakingContract && stakingInfo?.stakedAmount) {
      setAttempting(true)
      await stakingContract
        .exit({ gasLimit: 300000 })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Withdraw deposited liquidity`
          })
          setHash(response.hash)
        })
        .catch((error: any) => {
          setAttempting(false)
          console.log(error)
        })
    }
  }

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }
  if (!stakingInfo?.stakedAmount) {
    error = error ?? 'Enter amount'
  }

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOndismiss} maxHeight={90}>
      {!attempting && !hash && (
        <ContentWrapper gap="lg">
          <RowBetween>
            <TYPE.mediumHeader>Withdraw</TYPE.mediumHeader>
            <CloseIcon onClick={wrappedOndismiss} />
          </RowBetween>
          {stakingInfo?.stakedAmount && (
            <AutoColumn justify="center" gap="md">
              <TYPE.body fontWeight={600} fontSize={36}>
                {
                  stakingInfo?.rewardInfo?.rewardsMultiplier
                    ? stakingInfo.stakedAmount
                      ?.divide(stakingInfo?.rewardInfo?.rewardsMultiplier ? stakingInfo?.rewardInfo?.rewardsMultiplier : 1)
                      ?.toSignificant(Math.min(4, stakingInfo?.stakedAmount?.currency.decimals), { groupSeparator: ',' }) ?? '-'
                    : <FormattedCurrencyAmount currencyAmount={stakingInfo.stakedAmount} />

                }
              </TYPE.body>
              <TYPE.body>Deposited liquidity:</TYPE.body>
            </AutoColumn>
          )}
          {stakingInfo?.earnedAmount && (
            <AutoColumn justify="center" gap="md">
              <TYPE.body fontWeight={600} fontSize={36}>
                {
                  stakingInfo?.rewardInfo?.rewardsMultiplier
                    ? stakingInfo.stakedAmount
                      ?.divide(stakingInfo?.rewardInfo?.rewardsMultiplier ? stakingInfo?.rewardInfo?.rewardsMultiplier : 1)
                      ?.toSignificant(Math.min(4, stakingInfo?.stakedAmount?.currency.decimals), { groupSeparator: ',' }) ?? '-'
                    : <FormattedCurrencyAmount currencyAmount={stakingInfo?.earnedAmount}
                    />}
              </TYPE.body>
              <TYPE.body>Unclaimed {stakingInfo?.rewardsTokenSymbol ?? 'ZERO'}</TYPE.body>
            </AutoColumn>
          )}
          <TYPE.subHeader style={{ textAlign: 'center' }}>
            When you withdraw, your {stakingInfo?.rewardsTokenSymbol ?? 'ZERO'} is claimed and your liquidity is removed from the mining pool.
          </TYPE.subHeader>
          <ButtonError disabled={!!error} error={!!error && !!stakingInfo?.stakedAmount} onClick={onWithdraw}>
            {error ?? 'Withdraw & Claim'}
          </ButtonError>
        </ContentWrapper>
      )}
      {attempting && !hash && (
        <LoadingView onDismiss={wrappedOndismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.body fontSize={20}>Withdrawing {stakingInfo?.stakedAmount
              ?.divide(stakingInfo?.rewardInfo?.rewardsMultiplier ? stakingInfo?.rewardInfo?.rewardsMultiplier : 1)
              ?.toSignificant(4)} LP Tokens</TYPE.body>
            <TYPE.body fontSize={20}>Claiming {stakingInfo?.earnedAmount
              ?.divide(stakingInfo?.rewardInfo?.rewardsMultiplier ? stakingInfo?.rewardInfo?.rewardsMultiplier : 1)
              ?.toSignificant(4)} LP Tokens</TYPE.body>
          </AutoColumn>
        </LoadingView>
      )}
      {hash && (
        <SubmittedView onDismiss={wrappedOndismiss} hash={hash}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.largeHeader>Transaction Submitted</TYPE.largeHeader>
            <TYPE.body fontSize={20}>Withdrew {stakingInfo?.rewardsTokenSymbol ?? 'ZERO'} LP!</TYPE.body>
            <TYPE.body fontSize={20}>Claimed {stakingInfo?.rewardsTokenSymbol ?? 'ZERO'}!</TYPE.body>
          </AutoColumn>
        </SubmittedView>
      )}
    </Modal>
  )
}