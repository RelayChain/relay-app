import { AutoColumn, ColumnCenter } from '../Column'

import Circle from '../../assets/images/blue-loader.svg'
import { CustomLightSpinner } from '../../theme/components'
import React, { useEffect } from 'react'
import { Text } from 'rebass'
import styled from 'styled-components'
import { ChainTransferState } from '../../pages/Swap'
import { useCrosschainState } from '../../state/crosschain/hooks'
import { swap } from 'formik'

const Section = styled(AutoColumn)`
  padding: 24px;
`
const ConfirmedIcon = styled(ColumnCenter)`
  padding: 10px 0 40px 0;
`

export default function TransferPending ({
// @ts-ignore
                                           changeTransferState
                                         }) {
  const {depositStatus} = useCrosschainState()
  useEffect(()=>{
    if(depositStatus){
      changeTransferState(ChainTransferState.TransferComplete)
    }
  }, [depositStatus])
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
