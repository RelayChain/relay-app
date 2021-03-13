import React, { useEffect, useState } from 'react'

import ApprovalComplete from './ApprovalComplete'
import ApprovalPending from './ApprovalPending'
import { ChainTransferState } from '../../state/crosschain/actions'
import { CloseIcon } from '../../theme/components'
import { Currency } from '@zeroexchange/sdk'
import Modal from '../Modal'
import NotStarted from './NotStarted'
import { RowBetween } from '../Row'
import { Trade } from '@zeroexchange/sdk'
import TransferComplete from './TransferComplete'
import TransferPending from './TransferPending'
import styled from 'styled-components'
import { useCrosschainState } from '../../state/crosschain/hooks'

interface ConfirmTransferProps {
  isOpen: boolean
  onDismiss: () => void
  activeChain?: string
  transferTo?: string
  currency?: Currency | null
  value?: string
  trade?: Trade
  changeTransferState: (state: ChainTransferState) => void
  tokenTransferState: ChainTransferState
}

const ModalContainer = styled.div`
  padding: 1.5rem;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  h5 {
    font-weight: bold;
    margin-bottom: 1rem;
    display: block;
    text-align: center;
    margin-top: 1rem;
    font-size: 1.25rem;
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
  const { currentToken, transferAmount } = useCrosschainState()

  const [title, setTitle] = useState('')
  useEffect(() => {
    switch (tokenTransferState) {
      case ChainTransferState.NotStarted:
        setTitle('Approve Your Transfer')
        break
      case ChainTransferState.ApprovalPending:
        setTitle('Approval Pending')
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
  }, [tokenTransferState])

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ModalContainer>
        <RowBetween>
          <div />
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <h5>{title}</h5>

        {tokenTransferState === ChainTransferState.NotStarted && (
          <NotStarted
            activeChain={activeChain}
            transferTo={transferTo}
            currency={currency}
            value={value}
            trade={trade}
            changeTransferState={changeTransferState}
            tokenTransferState={tokenTransferState}
          />
        )}

        {tokenTransferState === ChainTransferState.ApprovalPending && <ApprovalPending />}

        {tokenTransferState === ChainTransferState.ApprovalComplete && (
          <ApprovalComplete changeTransferState={changeTransferState} />
        )}

        {tokenTransferState === ChainTransferState.TransferPending && (
          <TransferPending changeTransferState={changeTransferState} />
        )}

        {tokenTransferState === ChainTransferState.TransferComplete && (
          <TransferComplete
            activeChain={activeChain}
            transferTo={transferTo}
            onDismiss={onDismiss}
            currentToken={currentToken}
            transferAmount={transferAmount}
          />
        )}
      </ModalContainer>
    </Modal>
  )
}
