import { AutoColumn, ColumnCenter } from '../Column'
import React, { useEffect } from 'react'

import Circle from '../../assets/images/blue-loader.svg'
import { CustomLightSpinner } from '../../theme/components'
import { Text } from 'rebass'
import styled from 'styled-components'
import { swap } from 'formik'
import { useCrosschainState } from '../../state/crosschain/hooks'
import { ChainTransferState } from '../../state/crosschain/actions'

const Section = styled(AutoColumn)`
  padding: 24px;
`
const ConfirmedIcon = styled(ColumnCenter)`
  padding: 10px 0 40px 0;
`

export default function TransferPending ({ changeTransferState }: {
  changeTransferState: (state: ChainTransferState) => void;
}) {
  const {crosschainTransferStatus} = useCrosschainState()
  useEffect(()=>{
    if (crosschainTransferStatus === ChainTransferState.TransferComplete) {
      changeTransferState(ChainTransferState.TransferComplete)
    }
  }, [crosschainTransferStatus])

  return (
    <Section>
      <ConfirmedIcon>
        <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
      </ConfirmedIcon>
      <AutoColumn gap="12px" justify={'center'}>
        <Text fontWeight={500} fontSize={20}>
          Waiting For Transfer
        </Text>
        <Text fontSize={12} color="#565A69" textAlign="center">
          Confirm this transaction in your wallet
        </Text>
      </AutoColumn>
    </Section>
  )
}
