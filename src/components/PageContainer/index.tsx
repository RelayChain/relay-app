import React, { ReactNode } from 'react'

import styled from 'styled-components'

const PageWrapper = styled.div`
  max-width: 1240px;
  width: 100%;
  padding: 0 24px;
  margin: 0 auto;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: 0;
`};
`

const PageContainer = ({ children }: { children: ReactNode }) => {
  return <PageWrapper>{children}</PageWrapper>
}

export default PageContainer
