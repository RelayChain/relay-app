import React from 'react'
import styled from 'styled-components'
import useWindowDimensions from './../../hooks/useWindowDimensions'
import { isIOS, isFirefox } from 'react-device-detect'

const BackgroundWrap = styled.div`
  position: absolute;
  bottom: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
`

export interface BackgroundProps {
  variant: string
  showMountains?: boolean;
}

export default function Background({ variant = 'green', showMountains }: BackgroundProps) {
  const { width } = useWindowDimensions()

  const widthSize = '100%'
  const heightSize = '100%'
  return (
    <BackgroundWrap>
      {variant === 'green' ? (
        <svg width={widthSize} height={heightSize} viewBox="0 0 261 162" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#prefix__filter0_bi)">
            <rect width={261} height={162} rx={44} fill="#1EF7E7" fillOpacity={0.26} />
            <rect
              x={1}
              y={1}
              width={259}
              height={160}
              rx={43}
              stroke="url(#prefix__paint0_linear)"
              strokeOpacity={0.04}
              strokeWidth={2}
            />
          </g>
          { showMountains &&
            <path
              opacity={0.36}
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 115l25-21 27-3 26-8 26-16 28 14 25 32 26-30 26 2 26-10 26 16v27c0 24.301-19.699 44-44 44H44c-24.3 0-44-19.699-44-44v-3z"
              fill="#1EF7E7"
            />
          }
          <defs>
            <filter
              id="prefix__filter0_bi"
              x={-16}
              y={-16}
              width={293}
              height={194}
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feGaussianBlur in="BackgroundImage" stdDeviation={8} />
              <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
              <feBlend in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
              <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx={2} dy={2} />
              <feGaussianBlur stdDeviation={2.5} />
              <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
              <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.18 0" />
              <feBlend mode="overlay" in2="shape" result="effect2_innerShadow" />
            </filter>
          </defs>
        </svg>
      ) : variant === 'purple' ? (
        <svg width={widthSize} height={heightSize} viewBox="0 0 261 162" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter={isIOS || isFirefox ? '' : 'url(#prefix__filter0_bi)'}>
            <rect width={261} height={162} rx={44} fill="#6752F7" fillOpacity={0.26} />
            <rect
              x={1}
              y={1}
              width={259}
              height={160}
              rx={43}
              stroke="url(#prefix__paint0_linear)"
              strokeOpacity={0.04}
              strokeWidth={2}
            />
          </g>
          { showMountains &&
            <path
              opacity={0.36}
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 100l33 14 32-28 31-11 35 48 32-24 33-11 32 16 33-20v34c0 24.301-19.699 44-44 44H44c-24.3 0-44-19.699-44-44v-18z"
              fill="#6752F7"
            />
          }
          <defs>
            <linearGradient
              id="prefix__paint0_linear"
              x1={130.5}
              y1={0}
              x2={186.097}
              y2={159.024}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fff" />
              <stop offset={1} stopColor="#222758" stopOpacity={0} />
            </linearGradient>
            <filter
              id="prefix__filter0_bi"
              x={-16}
              y={-16}
              width={293}
              height={194}
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feGaussianBlur in="BackgroundImage" stdDeviation={8} />
              <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
              <feBlend in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
              <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx={2} dy={2} />
              <feGaussianBlur stdDeviation={2.5} />
              <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
              <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.18 0" />
              <feBlend mode="overlay" in2="shape" result="effect2_innerShadow" />
            </filter>
          </defs>
        </svg>
      ) : variant === 'blue' ?
      (
        <svg width={widthSize} height={heightSize} viewBox="0 0 261 162" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#prefix__filter0_bi)">
            <rect width={261} height={162} rx={44} fill="#1CB0F9" fillOpacity={0.26} />
            <rect
              x={1}
              y={1}
              width={259}
              height={160}
              rx={43}
              stroke="url(#prefix__paint0_linear)"
              strokeOpacity={0.04}
              strokeWidth={2}
            />
          </g>
          { showMountains &&
            <path
              opacity={0.36}
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 100l33 14 32-28 31-11 35 48 32-24 33-11 32 16 33-20v34c0 24.301-19.699 44-44 44H44c-24.3 0-44-19.699-44-44v-18z"
              fill="#1CB0F9"
            />
          }
          <defs>
            <linearGradient
              id="prefix__paint0_linear"
              x1={130.5}
              y1={0}
              x2={186.097}
              y2={159.024}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fff" />
              <stop offset={1} stopColor="#222758" stopOpacity={0} />
            </linearGradient>
            <filter
              id="prefix__filter0_bi"
              x={-16}
              y={-16}
              width={293}
              height={194}
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feGaussianBlur in="BackgroundImage" stdDeviation={8} />
              <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
              <feBlend in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
              <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx={2} dy={2} />
              <feGaussianBlur stdDeviation={2.5} />
              <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
              <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.18 0" />
              <feBlend mode="overlay" in2="shape" result="effect2_innerShadow" />
            </filter>
          </defs>
        </svg>
      ): variant === 'pink' ? (
        <svg width={widthSize} height={heightSize} viewBox="0 0 261 162" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter={isIOS || isFirefox ? '' : 'url(#prefix__filter0_bi)'}>
            <rect width={261} height={162} rx={44} fill="#B368FC" fillOpacity={0.26} />
            <rect
              x={1}
              y={1}
              width={259}
              height={160}
              rx={43}
              stroke="url(#prefix__paint0_linear)"
              strokeOpacity={0.04}
              strokeWidth={2}
            />
          </g>
          { showMountains &&
            <path
              opacity={0.36}
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 100l33 14 32-28 31-11 35 48 32-24 33-11 32 16 33-20v34c0 24.301-19.699 44-44 44H44c-24.3 0-44-19.699-44-44v-18z"
              fill="#B368FC"
            />
          }
          <defs>
            <linearGradient
              id="prefix__paint0_linear"
              x1={130.5}
              y1={0}
              x2={186.097}
              y2={159.024}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fff" />
              <stop offset={1} stopColor="#222758" stopOpacity={0} />
            </linearGradient>
            <filter
              id="prefix__filter0_bi"
              x={-16}
              y={-16}
              width={293}
              height={194}
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feGaussianBlur in="BackgroundImage" stdDeviation={8} />
              <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
              <feBlend in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
              <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx={2} dy={2} />
              <feGaussianBlur stdDeviation={2.5} />
              <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
              <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.18 0" />
              <feBlend mode="overlay" in2="shape" result="effect2_innerShadow" />
            </filter>
          </defs>
        </svg>
      ): ''}
    </BackgroundWrap>
  )
}
