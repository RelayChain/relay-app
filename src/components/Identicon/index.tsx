import React from 'react'
import Davatar from '@davatar/react'
import { useActiveWeb3React } from '../../hooks'

export default function Identicon() {
  const { account } = useActiveWeb3React()

  return <Davatar size={32} address={account || ''} generatedAvatarType="jazzicon" />
}
