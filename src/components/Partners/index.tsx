import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
const PartnersWrapper = styled.div`
    display: flex;
    flex-wrap: wrap; 
    justify-content: space-between;   
`
const LogoContainer = styled.div` 
    height: 120px;
    margin-right: 60px; 
    img{
        height: 30px;
    } 
`
export function Partners() {
    const logos = [
        { iconUrl: require('../../assets/images/new-design/partners/moonbeam.png') },
        { iconUrl: require('../../assets/images/new-design/partners/quickswap.png') },
        { iconUrl: require('../../assets/images/new-design/partners/solarbeam.png') },
        { iconUrl: require('../../assets/images/new-design/partners/canary.png') },
        { iconUrl: require('../../assets/images/new-design/partners/mcn.png') },
        { iconUrl: require('../../assets/images/new-design/partners/iotex.png') },
        { iconUrl: require('../../assets/images/new-design/partners/moonbeam.png') },
        { iconUrl: require('../../assets/images/new-design/partners/quickswap.png') },
        { iconUrl: require('../../assets/images/new-design/partners/solarbeam.png') },
        { iconUrl: require('../../assets/images/new-design/partners/canary.png') },
        { iconUrl: require('../../assets/images/new-design/partners/mcn.png') },
        { iconUrl: require('../../assets/images/new-design/partners/iotex.png') },
        { iconUrl: require('../../assets/images/new-design/partners/moonbeam.png') },
        { iconUrl: require('../../assets/images/new-design/partners/quickswap.png') },
        { iconUrl: require('../../assets/images/new-design/partners/solarbeam.png') },
        { iconUrl: require('../../assets/images/new-design/partners/canary.png') },
        { iconUrl: require('../../assets/images/new-design/partners/mcn.png') },
        { iconUrl: require('../../assets/images/new-design/partners/iotex.png') },
        { iconUrl: require('../../assets/images/new-design/partners/moonbeam.png') },
        { iconUrl: require('../../assets/images/new-design/partners/quickswap.png') },
        { iconUrl: require('../../assets/images/new-design/partners/solarbeam.png') },
        { iconUrl: require('../../assets/images/new-design/partners/canary.png') },
        { iconUrl: require('../../assets/images/new-design/partners/mcn.png') },
        { iconUrl: require('../../assets/images/new-design/partners/iotex.png') },
        { iconUrl: require('../../assets/images/new-design/partners/moonbeam.png') },
        { iconUrl: require('../../assets/images/new-design/partners/quickswap.png') },
        { iconUrl: require('../../assets/images/new-design/partners/solarbeam.png') },
        { iconUrl: require('../../assets/images/new-design/partners/canary.png') },
        { iconUrl: require('../../assets/images/new-design/partners/mcn.png') },
        { iconUrl: require('../../assets/images/new-design/partners/iotex.png') },

    ]
    const fillItems = () => {
        return logos.map((item, ind) => {
            return (
                <LogoContainer key={ind}>
                    <img src={item.iconUrl}></img>
                </LogoContainer>
            )
        })
    }
    return (
        <>
            <PartnersWrapper> 
                {fillItems()} 
            </PartnersWrapper>
        </>
    )
}