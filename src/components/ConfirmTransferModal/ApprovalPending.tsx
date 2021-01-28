import { AutoColumn, ColumnCenter } from '../Column'

import Circle from '../../assets/images/blue-loader.svg'
import { CustomLightSpinner } from '../../theme/components'
import React from 'react'
import { Text } from 'rebass'
import styled from 'styled-components'

const Section = styled(AutoColumn)`
  padding: 24px;
`
const ConfirmedIcon = styled(ColumnCenter)`
  padding: 10px 0 40px 0;
`

export default function ApprovalPending () {
  return (
    <Section>
      <ConfirmedIcon>
        <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
      </ConfirmedIcon>
      <AutoColumn gap="12px" justify={'center'}>
        <Text fontWeight={500} fontSize={20}>
          Waiting For Transfer Approval
        </Text>
        <Text fontSize={14} color="#565A69" textAlign="center">
          Approve this transaction in your wallet
        </Text>
      </AutoColumn>
    </Section>
  )
}
