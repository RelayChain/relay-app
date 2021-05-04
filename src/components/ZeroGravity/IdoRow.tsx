import { ButtonOutlined, ButtonPrimary } from '../../components/Button'

import { NavLink } from 'react-router-dom'
import React from 'react'
import styled from 'styled-components'

const moment = require('moment');
const StyledNavLink = styled(NavLink)`
`

const RowContainer = styled.div`
  border: 2px solid;
  border-image-source: linear-gradient(150.61deg, rgba(255, 255, 255, 0.03) 18.02%, rgba(34, 39, 88, 0) 88.48%);
  background: rgba(47, 53, 115, 0.32);
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.095);
  backdrop-filter: blur(28px);
  border-radius: 44px;
  padding: 16px 32px;
  margin-bottom: 1rem;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  min-height: 120px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: column;
  `};
`
const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 240px;
  margin-right: auto;
  img {
    max-height: 120px;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-left: auto;
    margin-bottom: 1rem;
    margin-top: 1rem;
  `};
`
const InfoSection = styled.div<{ width?: any }>`
  width: 120px;
  padding-left: 10px;
  padding-right: 10px;
  ${({ width }) => width && `width: ${width}px`};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    &.mobile-hidden {
      display: none;
    }
    margin-bottom: 1rem;
    margin-top: 1rem;
  `};
`
export default function IdoRow({ idoInfo}: { idoInfo: any }) {
  return (
    <RowContainer>
      <LogoWrapper>
        <img src={idoInfo.logo} />
      </LogoWrapper>
      <InfoSection className="mobile-hidden">
        {idoInfo.tierName}
      </InfoSection>
      <InfoSection className="mobile-hidden">
        {moment(idoInfo.launchDate).fromNow()}
      </InfoSection>
      <InfoSection className="mobile-hidden">
        {idoInfo.totalRaise}
      </InfoSection>
      <InfoSection className="mobile-hidden">
        {idoInfo.allocationMin}
      </InfoSection>
      <InfoSection className="mobile-hidden">
        {idoInfo.allocationMax}
      </InfoSection>
      <InfoSection>
        <StyledNavLink id={`${idoInfo.idoURL}-nav-link`} to={`/zero-gravity/${idoInfo.idoURL}`}>
          <ButtonPrimary style={{ width: '120px'}}>Details</ButtonPrimary>
        </StyledNavLink>
      </InfoSection>
    </RowContainer>
  )
}
