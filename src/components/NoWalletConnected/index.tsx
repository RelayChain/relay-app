import React from 'react'
import styled from 'styled-components'
import WalletMissing from '../../assets/svg/wallet_missing.svg'
import { ButtonPrimary } from '../../components/Button'
import { TYPE } from '../../theme'

const EmptyData = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  margin-bottom: 64px;
`

const NoAccount = styled.img``
const Message = styled.div`
  padding: 32px;
`
interface NoWalletConnectedProps {
  handleWalletModal: () => void
}

export const NoWalletConnected = ({handleWalletModal}: NoWalletConnectedProps) => {
  return (
    <EmptyData>
      <NoAccount src={WalletMissing} />
      <Message>
        <TYPE.main fontWeight={600} fontSize={24} style={{ textAlign: 'center' }}>
          No Wallet Connected!
        </TYPE.main>
      </Message>
      <div style={{ display: 'flex', flexGrow: 0 }}>
        <ButtonPrimary padding="8px" borderRadius="8px" onClick={() => handleWalletModal()}>
          Connect a Wallet
        </ButtonPrimary>
      </div>
    </EmptyData>
  )
}
