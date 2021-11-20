import React, { useMemo, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
position: fixed;
    left: 0;
    bottom: 0;
    width: 1920px;
    height: 50px;
    background: rgba(70, 70, 70, 0.25);
    box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(28px);
    display: flex;

`
const ItemFooter = styled.a`
color: white;
`
export function Footer() {
    const itemsFooter = ['telegram', 'reddit', 'github', 'youtube', 'twitter', 'discord']
    const fillFooter = () => 
        itemsFooter.map(item => {
            return (
                <ItemFooter href="#">{item}</ItemFooter>
            )
        }
        )
    
    return (
        <Container>{fillFooter()}</Container>
    )
}