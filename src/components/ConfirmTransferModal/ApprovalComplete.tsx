import { CheckCircle, ChevronsRight } from 'react-feather'

import { AutoColumn } from '../Column'
import { ButtonPrimary } from '../Button'
import React from 'react'
import { RowFixed } from '../Row'
import { Text } from 'rebass'
import { ChainTransferState } from '../../pages/Swap'
import { useCrosschainHooks } from '../../state/crosschain/hooks'

export default function ApprovalComplete ({
// @ts-ignore
    changeTransferState
  }) {
  const {MakeDeposit} = useCrosschainHooks()
  return (
    <AutoColumn gap="12px" justify={'center'}>
      <RowFixed style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <CheckCircle size={'66'} style={{ margin: '2rem 1rem 2rem 1rem', color: '#27AE60' }} />
        <ChevronsRight size={'66'} style={{ margin: '2rem 1rem 2rem 1rem', opacity: '.5'}} />
      </RowFixed>
      <RowFixed style={{ width: '100%'}}>
        <ButtonPrimary onClick={()=>{
          MakeDeposit().catch(console.error)
          changeTransferState(ChainTransferState.TransferPending)
        }}>
          Start Transfer
        </ButtonPrimary>
      </RowFixed>
      <RowFixed style={{ width: '100%', marginTop: '1rem'}}>
        <Text fontSize={16} textAlign="center">
          You will be asked again to confirm this transaction in your wallet
        </Text>
      </RowFixed>
    </AutoColumn>
  )
}
