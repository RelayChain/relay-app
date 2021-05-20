import React from 'react'
import styled from 'styled-components'

type ProgressBarProps = {
  value: any
}

const BarContainer = styled.div`
  display: block;
  border-radius: 100px;
  width: 100%;
  height: 11px;
  background: rgba(18, 21, 56, 0.56);
  position: relative;
  margin: 1.5rem 0rem;
  transition: all 0.3s ease-in-out;
`
const Progress = styled.div`
  display: block;
  height: 100%;
  border-radius: 100px;
  background: #c350d7;
  transition: all 0.3s ease-in-out;
  &.done {
    background: #1ef7e7;
  }
`

export default function ProgressBar({ value }: ProgressBarProps) {
  const returnWidth = () => {
    if (value === 0) {
      return '15%'
    } else {
      return '100%'
    }
  }

  return (
    <BarContainer>
      <Progress style={{ width: returnWidth() }} className={returnWidth() === '100%' ? 'done' : ''} />
    </BarContainer>
  )
}
