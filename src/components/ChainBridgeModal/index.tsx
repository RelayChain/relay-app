import React, { useEffect, useState } from 'react'

import AutoSizer from 'react-virtualized-auto-sizer'
import ChainBridgeItem from './ChainBridgeItem';
import { ChainTransferState } from '../../state/crosschain/actions'
import { CloseIcon } from '../../theme/components'
import { Currency } from '@zeroexchange/sdk'
import CurrencyLogo from '../CurrencyLogo';
import Modal from '../Modal'
import { RowBetween } from '../Row'
import { Trade } from '@zeroexchange/sdk'
import styled from 'styled-components'
import { useCrosschainState } from '../../state/crosschain/hooks'

interface ChainBridgeProps {
  isOpen: boolean;
  onDismiss: () => void;
  pendingTransfers?: any[];
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
    text-align: left;
    margin-top: 1rem;
    font-size: 1rem;
  }
`

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
`

export default function ChainBridgeModal({
  isOpen,
  onDismiss,
  pendingTransfers,
}: ChainBridgeProps) {

  const {crosschainTransferStatus} = useCrosschainState()

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={80}>
      <ModalContainer>
      <RowBetween>
        <div />
        <CloseIcon onClick={onDismiss} />
      </RowBetween>
      <h5>Pending Cross-Chain Transfers:</h5>
      <ListContainer>
        {pendingTransfers?.map((item: any) =>
          <ChainBridgeItem key={item.symbol} item={item}>
          </ChainBridgeItem>
        )}
      </ListContainer>
      </ModalContainer>
    </Modal>
  )
}
