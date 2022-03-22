import React from 'react'
import styled from 'styled-components'
import { escapeRegExp } from '../../utils'
import { useLocation } from 'react-router-dom'

const StyledInput = styled.input<{
  error?: boolean
  fontSize?: string
  align?: string
  transferPage?: boolean
  widget?: boolean
}>`
  color: ${({ error, theme }) => (error ? theme.red1 : theme.text1)};
  width: 0;
  position: relative;
  font-weight: 600;
  outline: none;
  border: none;
  flex: 1 1 auto;
  // background: ${({ transferPage }) => (transferPage ? '#171C47' : 'transparent')};
  min-width:100px;
  max-width:240px;
  width:100%;
  height: ${({ widget }) => (widget ? '40px' : '60px')};
  background: rgba(70, 70, 70, 0.25);
  padding: 0px 15px;
  border-radius: 48px;
  font-size: ${({ fontSize }) => fontSize ?? '24px'};
  text-align: ${({ align }) => align && align};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  [type='number'] {
    -moz-appearance: textfield;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.text1};
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
  width: 100%;
  font-size: 30px;
  color: #C8CEFF;
  ::placeholder {
    color: #C8CEFF;
  }
`};
`

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

export const Input = React.memo(function InnerInput({
  value,
  onUserInput,
  placeholder,
  ...rest
}: {
  value: string | number
  onUserInput: (input: string) => void
  error?: boolean
  fontSize?: string
  align?: 'right' | 'left'
  transferPage?: boolean
} & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) {
  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      onUserInput(nextUserInput)
    }
  }
  const location = useLocation()
  return (
    <StyledInput
      {...rest}
      value={value}
      onChange={event => {
        // replace commas with periods, because uniswap exclusively uses period as the decimal separator
        enforcer(event.target.value.replace(/,/g, '.'))
      }}
      // universal input options
      inputMode="decimal"
      title="Token Amount"
      autoComplete="off"
      autoCorrect="off"
      // text-specific options
      type="text"
      pattern="^[0-9]*[.,]?[0-9]*$"
      placeholder={placeholder || '0.0'}
      minLength={1}
      maxLength={79}
      spellCheck="false"
      widget={location.search === '?widget' ? true : false}
    />
  )
})

export default Input

// const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
