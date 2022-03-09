import React from 'react'

import PageContainer from 'components/PageContainer'
import styled from 'styled-components'
import { RowBetween } from '../../components/Row'
import { WrapForm } from './wrapForm'

const WrapContainer = styled.div`
  font-family: Poppins;
  margin-left: auto;
  margin-right: auto;
  margin-top: 4rem;
  margin-bottom: 4rem;

  ${({ theme }) => theme.mediaWidth.upToMedium`
            margin-top: 20px
            margin-right: auto;
            margin-left: auto;
        `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
        width: 100%;
        `};
`

const WrapWrap = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  //flex-wrap: wrap;
  gap: 1rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
        flex-direction: column;
        align-items: center;
    `};
`

const StyledTitle = styled.h1`
  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: 60px;
  color: #00fff6;
  margin-left: 70px;
  margin-top: 50px;
  margin-bottom: 40px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin: 20px auto;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
`};
`

const RowBetweenSidecard = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
  flex-direction: column;
  align-items: center;
  position: relative;
`};
`

export const Wrapping = () => {
  return (
    <PageContainer>
      <RowBetweenSidecard>
        <StyledTitle>Wrap/UnWrap</StyledTitle>
      </RowBetweenSidecard>
      <WrapContainer>
        <WrapWrap>
          <WrapForm typeAction={'Wrap'} />
          <WrapForm typeAction={'UnWrap'} />
        </WrapWrap>
      </WrapContainer>
    </PageContainer>
  )
}
