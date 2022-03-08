import { ChainTransferState, CrosschainChain } from '../../state/crosschain/actions'
import React, { useEffect, useState } from 'react'
import { useCrosschainHooks, useCrosschainState } from '../../state/crosschain/hooks'

import ApprovalComplete from './ApprovalComplete'
import ApprovalPending from './ApprovalPending'
import { CloseIcon } from '../../theme/components'
import { Currency } from '@zeroexchange/sdk'
import Modal from '../Modal'
import NotStarted from './NotStarted'
import { RowBetween } from '../Row'
import { Trade } from '@zeroexchange/sdk'
import TransferComplete from './TransferComplete'
import TransferFiled from './TransferFailed'
import TransferPending from './TransferPending'
import styled from 'styled-components'

interface ConfirmTransferProps {
  isOpen: boolean
  onDismiss: () => void
  activeChain?: string
  transferTo?: CrosschainChain
  currency?: Currency | null
  value?: string
  trade?: Trade
  changeTransferState: (state: ChainTransferState) => void
  tokenTransferState: ChainTransferState
}

const StyledModal = styled(Modal)`
  max-width: 473px !important;
`

const ModalContainer = styled.div`
  padding: 1.5rem;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  h5 {
    margin: 1rem 0;
    text-align: center;
    font-size: 1.25rem;
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 1rem;
    `
  }
}
`

export default function ConfirmTransferModal({
  isOpen,
  onDismiss,
  activeChain,
  transferTo,
  currency,
  value,
  trade,
  changeTransferState,
  tokenTransferState
}: ConfirmTransferProps) {
  const { currentToken, transferAmount, allCrosschainData } = useCrosschainState()
  const { GetAllowance } = useCrosschainHooks()
  const [title, setTitle] = useState('')
  const [targetTokenAddress, setTargetTokenAddress] = useState('')

  let allowanceInterval: any

  useEffect(() => {
    if (allCrosschainData && allCrosschainData?.chains?.length) {
      const chaindata = allCrosschainData.chains.find(chaindata => chaindata.name === transferTo?.name)
      chaindata?.tokens.map(token => {
        if (token.resourceId === currentToken.resourceId) {
          setTargetTokenAddress(token.address)
        }
      })
    }
  }, [currentToken, transferTo])

  useEffect(() => {
    switch (tokenTransferState) {
      case ChainTransferState.NotStarted:
        setTitle('Approve Your Transfer')
        break
      case ChainTransferState.ApprovalPending:
        setTitle('Approval Pending')
        break
      case ChainTransferState.ApprovalSubmitted:
        setTitle('Approval Submitted')
        allowanceInterval = setInterval(async () => {
          GetAllowance()
        }, 10000);
        break
      case ChainTransferState.ApprovalComplete:
        setTitle('Approved! Now Start Transfer')
        break
      case ChainTransferState.TransferPending:
        setTitle('Transfer Pending')
        break
      case ChainTransferState.TransferComplete:
        setTitle('Transfer Complete')
        break
      default:
    }
    return () => clearInterval(allowanceInterval)
  }, [tokenTransferState])

  const handleOnDismiss = () => {
    if (allowanceInterval) {
      clearInterval(allowanceInterval)
    }
    onDismiss()
  }

  return (
    <StyledModal isOpen={isOpen} onDismiss={handleOnDismiss} maxHeight={707} >
      <ModalContainer>
        {tokenTransferState === ChainTransferState.NotStarted && !!value && (
          <NotStarted
            activeChain={activeChain}
            transferTo={transferTo?.name}
            currency={currency}
            value={value}
            trade={trade}
            changeTransferState={changeTransferState}
            tokenTransferState={tokenTransferState}
          />
        )}

        {tokenTransferState === ChainTransferState.TransferFailed &&
          <TransferFiled />
        }

        {(tokenTransferState === ChainTransferState.ApprovalPending || tokenTransferState === ChainTransferState.ApprovalSubmitted) &&
          <ApprovalPending tokenTransferState={tokenTransferState} />
        }

        {tokenTransferState === ChainTransferState.ApprovalComplete && (
          <ApprovalComplete changeTransferState={changeTransferState} onDismiss={handleOnDismiss} />
        )}

        {tokenTransferState === ChainTransferState.TransferPending && (
          <TransferPending changeTransferState={changeTransferState} />
        )}

        {tokenTransferState === ChainTransferState.TransferComplete && (
          <TransferComplete
            activeChain={activeChain}
            transferTo={transferTo?.name}
            onDismiss={handleOnDismiss}
            currentToken={currentToken}
            transferAmount={transferAmount}
            targetTokenAddress={targetTokenAddress}
          />
        )}
      </ModalContainer>
    </StyledModal>
  )
}
