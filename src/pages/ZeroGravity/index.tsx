import { ButtonOutlined } from '../../components/Button'
import React, { useMemo, useState } from 'react';

import { ExternalLink, Title } from '../../theme'
import { IDO_LIST } from '../../constants/idos';
import IdoRow from '../../components/ZeroGravity/IdoRow';
import PageContainer from '../../components/PageContainer'
import Toggle from '../../components/Toggle';
import styled from 'styled-components';
import moment from 'moment';

const StyledExternalLink = styled(ExternalLink)`
  text-decoration: none !important;
  margin-left: auto;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-right: auto;
  `};
`

const SubTitle = styled.h3`
  width: 100%;
  max-width: 600px;
  padding: 1rem;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 1.5rem;
  margin-left: auto; margin-right: auto;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size: 1rem;
`};
`

const ControlsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 24px;
  margin-bottom: 1.5rem;
  .launch-button {
    margin-left: auto;
    max-width: 200px;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
  flex-direction: column;
  align-items: flex-start;
  * {
    margin-left: auto; margin-right: auto;
  }
  .launch-button {
    margin-right: auto;
    margin-top: 2rem;
  }
`};
`
const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  margin-bottom: 2rem;
`
const HeadersWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 1rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`
const HeaderSection = styled.div<{ width?: any }>`
  width: 120px;
  padding-left: 10px;
  padding-right: 10px;
  font-size: .8rem;
  font-weight: bold;
  color: #A7B1F4;
`

export default function ZeroGravityList() {

  const [showActive, setShowActive] = useState(true);

  const IdoListComplete = IDO_LIST; // fetch this list from the server

  const IdoListFiltered = useMemo(() => {
    if (showActive) {
      return IdoListComplete.filter(item => moment(item?.endDate??'').isAfter(moment.now()))
    }
    return IdoListComplete.filter(item => moment(item?.endDate??'').isBefore(moment.now()))
  }, [showActive, IdoListComplete])

  const onHandleToggleActive = () => {
    setShowActive(!showActive);
  }

  return (
    <>
      <Title>ZERO GRAVITY</Title>
      <PageContainer>
        <SubTitle>Exclusive offerings to the ZERO community</SubTitle>

        <ControlsContainer>
          <Toggle
            isActive={showActive}
            toggle={onHandleToggleActive}
            activeText="Live"
            inActiveText="Finished"
            width="186px" 
          />
          <StyledExternalLink href={`https://0.exchange/partners`}>
            <ButtonOutlined className="launch-button green">Launch My Token</ButtonOutlined>
          </StyledExternalLink>
        </ControlsContainer>

        <ListContainer>
          <HeadersWrap>
            <div style={{ marginRight: 'auto', maxWidth: '240px'}}></div>
            <HeaderSection>
              Tier
            </HeaderSection>
            <HeaderSection>
              Launching
            </HeaderSection>
            <HeaderSection>
              Total Raise
            </HeaderSection>
            <HeaderSection>
              Min Alloc.
            </HeaderSection>
            <HeaderSection>
              Max Alloc.
            </HeaderSection>
            <HeaderSection style={{ width: '152px'}}>
            </HeaderSection>
          </HeadersWrap>
          {IdoListFiltered?.map((idoInfo: any) => {
            return (
              <IdoRow
                idoInfo={idoInfo}
              />
            )
          })}
        </ListContainer>

      </PageContainer>
    </>)
}
