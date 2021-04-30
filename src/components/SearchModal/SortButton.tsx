import React from 'react'
import { RowFixed } from '../Row'
import { Text } from 'rebass'
import styled from 'styled-components'

export const FilterWrapper = styled(RowFixed)`
  padding: 8px;
  background-color: rgba(0,0,0,.25);
  color: ${({ theme }) => theme.text1};
  border-radius: 8px;
  user-select: none;
  width: 40px;
  text-align: center;
  justify-content: center;
  & > * {
    user-select: none;
    margin: auto;
  }
  :hover {
    cursor: pointer;
  }
`

export default function SortButton({
  toggleSortOrder,
  ascending
}: {
  toggleSortOrder: () => void
  ascending: boolean
}) {
  return (
    <FilterWrapper onClick={toggleSortOrder}>
      <Text fontSize={14} fontWeight={500} style={{ textAlign: 'center' }}>
        {ascending ? '↑' : '↓'}
      </Text>
    </FilterWrapper>
  )
}
