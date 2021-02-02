import { AlertCircle, CheckCircle } from 'react-feather'
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'

import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'
import { ChainId } from '@zeroexchange/sdk'
import { ExternalLink } from '../../theme/components'
import { TYPE } from '../../theme'
import { getEtherscanLink } from '../../utils'
import { useActiveWeb3React } from '../../hooks'
const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`

export default function TransactionPopup({
  hash,
  success,
  summary
}: {
  hash: string
  success?: boolean
  summary?: string
}) {
  const { chainId } = useActiveWeb3React()

  const theme = useContext(ThemeContext)

  return (
    <RowNoFlex>
      <div style={{ paddingRight: 16 }}>
        {success ? <CheckCircle color={theme.green1} size={24} /> : <AlertCircle color={theme.red1} size={24} />}
      </div>
      <AutoColumn gap="8px">
        <TYPE.body fontWeight={500}>{summary ?? 'Hash: ' + hash.slice(0, 8) + '...' + hash.slice(58, 65)}</TYPE.body>
        {chainId && (
          <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')}>
            { chainId && chainId === ChainId.MAINNET ? 'View on Etherscan' : 'View on Avalanche'}
          </ExternalLink>
        )}
      </AutoColumn>
    </RowNoFlex>
  )
}
