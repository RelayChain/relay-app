import { AutoColumn, ColumnCenter } from '../Column'
import React, { useEffect, useState } from 'react'

import { ChainTransferState } from '../../state/crosschain/actions'
import Circle from '../../assets/images/blue-loader.svg'
import { CustomLightSpinner } from '../../theme/components'
import { ProgressBar } from 'components/ProgressBar'
import { Text } from 'rebass'
import styled from 'styled-components'

const Section = styled(AutoColumn)`
  height: 600px;
  width: 450px;
  padding: 50px;
`
const WalletLogo = styled.img`

`
const StyledProgressBar = styled(ProgressBar)`
margin-top: 110px;
`

export default function ApprovalPending ({ tokenTransferState }: { tokenTransferState: ChainTransferState }) {
  const [completed, setCompleted] = useState(0);

function* addProgress() {
  yield 17;
  yield 23;
  yield 36;
  yield 44;
  yield 52;
  yield 61;
  yield 77;
  yield 83;
  yield 95
  return 100;
}

const gen = addProgress()

 useEffect(() => {
  const startProgress = setInterval(() => {
    const value = gen.next().value
    if(value) {
      setCompleted(value)
    } else {
      clearInterval(startProgress)
    }
  }, 2000)

}, [])
  return (
    <Section>
      <WalletLogo src={require('../../assets/images/new-design/wallet.png')} />
    <StyledProgressBar  bgcolor={"#6a1b9a"} completed={completed} />
        { tokenTransferState === ChainTransferState.ApprovalSubmitted &&
          <Text fontSize={14} color="#565A69" textAlign="center" style={{ marginTop: '2rem'}}>
            Your approval has been submitted, waiting for confirmation.
          </Text>
        }
    </Section>
  )
}
