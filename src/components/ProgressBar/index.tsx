import React from 'react'
import styled from 'styled-components'

type ProgressBarProps = {
  completed: number
  bgcolor: string
  total: number
}

export function ProgressBar({ completed, bgcolor, total }: ProgressBarProps) {
  const ContainerStyles = styled.div`
    height: 8px;
    width: '100%';
    background-color: "#CCCCCC";
    border-radius: 50;
    margin: 50;
`

  const FillerStyles = styled.div`
    height: '100%';
    width: ${completed}%;
    background-color: 'red';
    transition: 'width 1s ease-in-out',
    border-radius: 'inherit';
    text-align: 'right;
    height: 8px;
  `

  const LabelStyles = styled.div`
    font-family: Montserrat;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 15px;    
    color: #FFFFFF;
    text-align: center;
    margin-top: 30px;
  `


  return (
    <>
      <LabelStyles style={{}}>{`${Math.ceil(total * (completed / 100))}/ ${total} Confirm`} </LabelStyles>
      <ContainerStyles style={{ width: '100%', height: "8px", "borderRadius": "10px", backgroundColor: "#130E2E" }}>

        <FillerStyles style={{
          width: `${completed}%`, background: bgcolor,
          height: "8px", "borderRadius": "10px"
        }}>

        </FillerStyles>

      </ContainerStyles>
    </>

  );
}