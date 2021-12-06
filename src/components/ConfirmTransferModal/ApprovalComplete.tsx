import { CheckCircle, ChevronsRight } from 'react-feather'

import { AutoColumn } from '../Column'
import { ButtonPrimary } from '../Button'
import { ChainTransferState } from '../../state/crosschain/actions'
import React from 'react'
import { RowFixed } from '../Row'
import { Text } from 'rebass'
import styled from 'styled-components'
import { useAddPopup } from '../../state/application/hooks'
import { useCrosschainHooks } from '../../state/crosschain/hooks'

const CancelLink = styled.a`
  color: rgba(255, 255, 255, 0.35);
  font-weight: bold;
  font-size: 1rem;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.075);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`
export default function ApprovalComplete({
  changeTransferState,
  onDismiss
}: any) {
  const { MakeDeposit, BreakCrosschainSwap } = useCrosschainHooks()

  const cancelTransfer = () => {
    BreakCrosschainSwap()
    onDismiss();
  }

  const handleStartTransfer = async () => {
    try {
      await MakeDeposit();
    } catch (err) {
      cancelTransfer();
    }
  }

  return (
    <AutoColumn gap="12px" justify={'center'}>
      <RowFixed style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <CheckCircle size={'66'} style={{ margin: '2rem 1rem 2rem 1rem', color: '#27AE60' }} />
        <ChevronsRight size={'66'} style={{ margin: '2rem 1rem 2rem 1rem', opacity: '.5' }} />
      </RowFixed>
      <RowFixed style={{ width: '100%' }}>
        <ButtonPrimary
          onClick={() => handleStartTransfer()}
        >
          Start Transfer
        </ButtonPrimary>
      </RowFixed>
      <RowFixed style={{ width: '100%', marginTop: '1rem' }}>
        <Text fontSize={14} textAlign="center">
          You will be asked again to confirm this transaction in your wallet
        </Text>
      </RowFixed>
      <RowFixed>
        <CancelLink onClick={cancelTransfer}>Cancel Transfer</CancelLink>
      </RowFixed>
    </AutoColumn>
  )
}
