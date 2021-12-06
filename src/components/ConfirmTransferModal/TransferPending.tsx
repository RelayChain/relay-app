import { AutoColumn, ColumnCenter } from '../Column'
import React, { useEffect } from 'react'

import { ChainTransferState } from '../../state/crosschain/actions' 
import styled from 'styled-components'
import { useCrosschainState } from '../../state/crosschain/hooks'

const Section = styled(AutoColumn)`
  padding: 24px;
`
const ConfirmedIcon = styled(ColumnCenter)`
  padding: 10px 0 40px 0;
`
const TitlePending = styled.div`
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 42px;
  text-align: center;
  color: #FFFFFF;
`
const LogoBlock = styled.img`
  margin: 40px auto;
`
const NotifyBlock = styled.div`
  font-family: Poppins;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 27px;
  /* identical to box height */
  text-align: center;
  color: #FFFFFF;
  flex: none;
  order: 1;
  flex-grow: 0;
  margin: 10px 0px;
`
export default function TransferPending({
  changeTransferState
}: {
  changeTransferState: (state: ChainTransferState) => void
}) {
  const { crosschainTransferStatus } = useCrosschainState()
  useEffect(() => {
    if (crosschainTransferStatus === ChainTransferState.TransferComplete) {
      changeTransferState(ChainTransferState.TransferComplete)
    }
  }, [crosschainTransferStatus, changeTransferState])

  return (
    <Section style={{ justifyContent: "center" }}>
      <TitlePending>Transfer Pending!</TitlePending>
      <LogoBlock src={require('../../assets/images/new-design/spaceship.png')}></LogoBlock>
      <TitlePending>Loading...</TitlePending>
      <NotifyBlock>Waiting for confirmation from MetaMask</NotifyBlock>
    </Section>
  )
}
