import { AlertTriangle, X } from 'react-feather'
import { useURLWarningToggle, useURLWarningVisible } from '../../state/user/hooks'

import React from 'react'
import styled from 'styled-components'

const PhishAlert = styled.div<{ isActive: any }>`
  width: 100%;
  height: 40px;
  padding: 6px 6px;
  background-color: ${({ theme }) => theme.blue1};
  color: white;
  font-size: 11px;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  display: ${({ isActive }) => (isActive ? 'flex' : 'none')};
  height: 40px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin-bottom: 0.5rem;
`};
`

export const StyledClose = styled(X)`
  :hover {
    cursor: pointer;
  }
`

export default function URLWarning() {
  const toggleURLWarning = useURLWarningToggle()
  const showURLWarning = useURLWarningVisible()

  return false ? (
    <PhishAlert isActive={showURLWarning}>
      <div style={{ display: 'flex' }}>
        <AlertTriangle style={{ marginRight: 6 }} size={12} />
        Make sure the URL is app.relaychain.com
      </div>
      <StyledClose size={12} onClick={toggleURLWarning} />
    </PhishAlert>
  ) : window.location.hostname === 'app.relaychain.com' ? (
    <PhishAlert isActive={showURLWarning}>
      <div style={{ display: 'flex' }}>
        <AlertTriangle style={{ marginRight: 6 }} size={12} />
        Always make sure the URL is app.relaychain.com - bookmark it to be safe.
      </div>
      <StyledClose size={12} onClick={toggleURLWarning} />
    </PhishAlert>
  ) : null
}
