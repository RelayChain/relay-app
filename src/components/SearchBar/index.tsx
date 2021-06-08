import React, { useRef, useState } from 'react'
import SearchIcon from '../../assets/svg/search_icon.svg'

import styled from 'styled-components'

const StyledInput = styled.input`
  display: flex;
  flex-grow: 1;
  border-radius: 16px;
  background: none;
  border: none;
  outline: none;
  color: #a7b1f4;
  height: 40px;
  width: 100%;
  ::placeholder {
    color: #727bba;
  }
`

const Container = styled.div<{ toggled: boolean, isLightMode?: boolean }>`
  display: flex;
  flex-grow: 1;
  align-items: center;
  transition: border-radius 0.15s;
  height: 48px;
  background: ${({isLightMode}) => isLightMode ? 'rgba(47, 53, 115, 0.32)' : ' rgba(219, 205, 236, 0.32)'} ;
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.095);
  backdrop-filter: blur(28px);
  border-radius: 44px;
  padding: 16px 24px;
`

const Icon = styled.img`
  width: 24px;
  height: 24px;
`
interface Props {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isLightMode?: boolean
}

const SearchBar: React.FC<Props> = ({ value, onChange, isLightMode }) => {
  const [toggled, setToggled] = useState(false)
  const inputEl = useRef(null)

  return (
    <Container toggled={toggled} isLightMode={isLightMode}>
      <StyledInput
        ref={inputEl}
        value={value}
        onChange={onChange}
        placeholder="Search"
        onFocus={e => (e.target.placeholder = '')}
        onBlur={e => (e.target.placeholder = 'Search')}
      />
      <Icon src={SearchIcon} />
    </Container>
  )
}

export default SearchBar
