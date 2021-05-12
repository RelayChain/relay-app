import React, { ReactNode } from 'react'

import styled from 'styled-components'

const PageWrapper = styled.div`
  max-width: 1240px;
  width: 100%;
  padding: 0 24px;
  margin: 0 auto;
  margin-top: 1rem;
  margin-bottom: 3rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: 0;
  margin-top: 0.5rem;
`};
`

const PageContainer = ({ children }: { children: ReactNode }) => {
  return <PageWrapper>{children}</PageWrapper>
}

export default PageContainer
