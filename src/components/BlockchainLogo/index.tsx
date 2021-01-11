import React from 'react'
import styled from 'styled-components'

import AvaxLogo from '../../assets/images/avax-logo.png'
import EthereumLogo from '../../assets/images/ethereum-logo.png'
import ZeroLogo from '../../assets/images/logo-zero-124.png'

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
  margin-left: 5px;
  margin-right: 5px;
`

export default function BlockchainLogo({
  blockchain,
  size = '24px',
  style
}: {
  blockchain?: string
  size?: string
  style?: React.CSSProperties
}) {
  if (blockchain === 'Ethereum') {
    return <StyledEthereumLogo src={EthereumLogo} size={size} style={style} />
  }

  if (blockchain === 'Avalanche') {
    return <StyledEthereumLogo src={AvaxLogo} size={size} style={style} />
  }

  if (blockchain === 'Polkadot') {
    return <StyledEthereumLogo src={ZeroLogo} size={size} style={style} />
  }

  return <StyledEthereumLogo src={EthereumLogo} size={size} style={style} />
}
