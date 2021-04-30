import React, { useRef, useState } from 'react'

import styled from 'styled-components'

const StyledInput = styled.input`
  display: flex;
  flex-grow: 1;
  border-radius: 16px;
  background: none;
  border: none;
  outline: none;
  color: #A7B1F4;
  height: 40px;
  width: 100%;
  ::placeholder {
    color: #727bba;
  }
`

const Container = styled.div<{ toggled: boolean }>`
  display: flex;
  flex-grow: 1;
  align-items: center;
  transition: border-radius 0.15s;
  height: 48px;
  background: rgba(47, 53, 115, 0.32);
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.095);
  backdrop-filter: blur(28px);
  border-radius: 44px;
  padding: 16px 24px;
`

interface Props {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const SearchBar: React.FC<Props> = ({ value, onChange }) => {
  const [toggled, setToggled] = useState(false)
  const inputEl = useRef(null)

  return (
    <Container toggled={toggled}>
      <StyledInput
        ref={inputEl}
        value={value}
        onChange={onChange}
        placeholder="Search"
        onFocus={e => (e.target.placeholder = '')}
        onBlur={e => (e.target.placeholder = 'Search')}
      />
    </Container>
  )
}

export default SearchBar
