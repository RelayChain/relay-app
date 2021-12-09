import React from 'react'
import styled from 'styled-components'

type ProgressBarProps = {
    completed: number;
    bgcolor: string
}

export function ProgressBar({completed, bgcolor}: ProgressBarProps) {
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
    font-family: Poppins;
    font-style: normal;
    font-weight: 500;
    font-size: 28px;
    line-height: 42px;
    color: #FFFFFF;
    text-align: center;
    margin-top: 30px;
  `


    return (
    <ContainerStyles style={{width: '100%', height: "8px", "borderRadius": "10px", backgroundColor: "#CCCCCC"}}>
      <FillerStyles style={{width: `${completed}%`, background: "linear-gradient(96.23deg, #D34FA0 -15.95%, #7F46F0 123.53%)",
        height: "8px", "borderRadius": "10px"}}>
        
      </FillerStyles>
      <LabelStyles  style={{textAlign: "center", marginTop: "30px", fontSize: "28px"}}>{`${completed}%`} </LabelStyles>
    </ContainerStyles>
  );
}