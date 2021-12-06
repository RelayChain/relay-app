import React from 'react'
import { getCurrencyLogoImage } from 'components/CurrencyLogo'
import { logoByName } from './logos'
import styled from 'styled-components'

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 100%;
  margin-left: 5px;
  margin-right: 5px;
`
export const logoPath = (blockchainName: string) => {
  return logoByName[getCurrencyLogoImage(blockchainName)]
}

export default function BlockchainLogo({
  blockchain,
  size = '24px',
  style
}: {
  blockchain?: string
  size?: string
  style?: React.CSSProperties
}) {
  return <StyledEthereumLogo src={logoPath(blockchain || 'ETH')} alt={blockchain} size={size} style={style} />
}
