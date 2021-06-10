import { isFirefox, isIOS } from 'react-device-detect'

import React from 'react'
import styled from 'styled-components'

export interface BubbleBaseProps {
  mode?: 'normal' | 'light'
  isLightMode?: boolean
}

const BubbleBaseWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
`

const BubbleBase = ({ mode = 'normal', isLightMode=true }: BubbleBaseProps) => {
  const prefixGradient = `prefixGradientBubbleBase${Math.round(Math.random() * 99999)}`

  return (
    <BubbleBaseWrap>
      <svg
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: mode !== 'normal' ? 'rotate(180deg)' : 'none'
        }}
      >
        <g filter={isIOS || isFirefox ? '' : `url(#${prefixGradient})`}>
          <rect
            width="100%"
            height="100%"
            rx={44}
            fill={mode === 'normal' && !isLightMode ? 'rgba(219,205,236,0.72)' : '#202550'}
            fillOpacity={mode === 'normal' && !isLightMode ? 0.8 : 0.72}
          />
          <rect
            x={1}
            y={1}
            width="100%"
            height="100%"
            rx={44}
            stroke="url(#prefixGradientBubbleBase)"
            strokeOpacity={mode === 'normal' ? 0.03 : 0.06}
            strokeWidth={2}
          />
        </g>
        <defs>
          <linearGradient
            id="prefixGradientBubbleBase"
            x1="50%"
            y1={0}
            x2="79%"
            y2="100%"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset={1} stopColor="#222758" stopOpacity={0} />
            <stop stopColor="#fff" />
          </linearGradient>
          <filter
            id={prefixGradient}
            x={0}
            y={0}
            width="120%"
            height="100%"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImage" stdDeviation={14} />
            <feComposite in2="SourceAlpha" operator="in" result="bubbleBaseEffectBlend1" />
            <feBlend in="SourceGraphic" in2="bubbleBaseEffectBlend1" result="shape" />
            <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dx={2} dy={2} />
            <feGaussianBlur stdDeviation={2.5} />
            <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
            <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.12 0" />
            <feBlend mode="overlay" in2="shape" result="bubbleBaseEffectBlend2" />
          </filter>
        </defs>
      </svg>
    </BubbleBaseWrap>
  )
}

export default BubbleBase
