import AppBody from '../AppBody'
import { AutoColumn } from '../../components/Column'
import { Book } from 'react-feather'
import React from 'react'
import { TYPE } from '../../theme'
import { Wrapper } from '../../components/swap/styleds'
import styled from 'styled-components'

export default function() {
  const goToSite = (str: any) => {
    window.open(str, '_blank')
  }

  return (
    <AppBody>
      <AutoColumn style={{ minHeight: 200, justifyContent: 'center', alignItems: 'center' }}>
        <h2>WSB Token Sale:</h2>
      </AutoColumn>
    </AppBody>
  )
}
