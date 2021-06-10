import CardMode from '../../assets/svg/CardMode'
import ListMode from '../../assets/svg/ListMode'
import React from 'react'
import SearchBar from '../../components/SearchBar'
import Select from '../../components/Select'
import { TYPE } from '../../theme'
import TogglePool from '../../components/TooglePool'
import styled from 'styled-components'

import {useApplicationState} from 'state/application/hooks'

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-bottom: 30px;
  justify-content: space-between;
  gap: 1rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`

`};
`
const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  margin-right: 32px;

  &:last-of-type {
    margin-right: 0px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
  flex-direction:column;
  align-items: flex-start;
`};
`
const SearchGroup = styled(ControlGroup)`
  flex-grow: 1;
  max-width: 240px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  max-width: none;
    width: 100%;
    margin-bottom:16px;
    margin-right: 0px;
    flex-direction: row;
  `};
`
const ControlLabel = styled.div`
  display: flex;
  flex-shrink: 0;
  margin-right: 20px;
  flex-wrap: nowrap;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  margin-bottom: 8px;
`};
`
const InputContainer = styled.div<{isLightMode?: boolean}>`
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0px 8px;
  background: ${({isLightMode}) => isLightMode ? 'rgba(47, 53, 115, 0.32)' : 'rgba(219,205,236,0.32)'};
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.095);
  backdrop-filter: blur(28px);
  border-radius: 44px;
`
const Button = styled.button<{ isSelected?: boolean, isLightMode?: boolean }>`
  display: flex;
  width: 40px;
  height: 40px;
  background: none;
  border: 0px;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  &:focus {
    outline: none;
  }
  &:hover {
    svg {
      g {
        fill: ${({isLightMode}) => isLightMode ? '#fff' : '#9726cd'};
      }
    }
  }
  svg {
    g {
      fill: ${({isLightMode, isSelected}) => isLightMode && !isSelected ? '#727bba' : !isLightMode && isSelected ? '#9726cd' : !isLightMode && !isSelected ? '#727bba'  : '#fff'};
    }
  }
  
`
const Group = styled.div`
  display: flex;
`
const ToggleGroup = styled(Group)`
  align-items: flex-end;
`

export interface PoolControlsProps {
  displayMode: string
  searchText: string
  onSortChange: (key: string, value: string | boolean) => void
  isLive: boolean
  isStaked: boolean
  options: any
  activeFilteredMode: string
}

function PoolControls({
  displayMode,
  searchText,
  onSortChange,
  isLive,
  isStaked,
  options,
  activeFilteredMode
}: PoolControlsProps) {
  const {isLightMode} = useApplicationState()
  return (
    <Controls>
      <SearchGroup>
        <SearchBar value={searchText} onChange={e => onSortChange('searchText', e.target.value)} isLightMode={isLightMode}/>
      </SearchGroup>
      <ToggleGroup>
        <TogglePool isLive={isLive} onSortChange={onSortChange} isStaked={isStaked} isLightMode={isLightMode}/>
      </ToggleGroup>
      <Group>
        <ControlGroup>
          <ControlLabel>
            <TYPE.mainPool fontWeight={600} fontSize={12}>
              Sort by:
            </TYPE.mainPool>
          </ControlLabel>
          <Select options={options} onChange={e => onSortChange('filteredMode', e)} activeOption={activeFilteredMode} isLightMode={isLightMode}/>
        </ControlGroup>

        <ControlGroup>
          <ControlLabel>
            <TYPE.mainPool fontWeight={600} fontSize={12}>
              Mode:
            </TYPE.mainPool>
          </ControlLabel>
          <InputContainer isLightMode={isLightMode}>
            <Button isLightMode={isLightMode} isSelected={displayMode === 'table'} onClick={() => onSortChange('displayMode', 'table')}>
              <ListMode />
            </Button>
            <Button isLightMode={isLightMode} isSelected={displayMode === 'grid'} onClick={() => onSortChange('displayMode', 'grid')}>
              <CardMode />
            </Button>
          </InputContainer>
        </ControlGroup>
      </Group>
    </Controls>
  )
}

export default PoolControls
