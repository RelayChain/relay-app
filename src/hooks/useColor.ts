import { ChainId, Token } from '@zeroexchange/sdk'
import { useLayoutEffect, useState } from 'react'

import Vibrant from 'node-vibrant'
import { hex } from 'wcag-contrast'
import { shade } from 'polished'
import uriToHttp from 'utils/uriToHttp'

import { getCrosschainState } from 'state/crosschain/hooks'

async function getColorFromToken(token: Token): Promise<string | null> {
  if (token.chainId === ChainId.RINKEBY && token.address === '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735') {
    return Promise.resolve('#FAAB14')
  }
  let path
  if (token.address === '0xF0939011a9bb95c3B791f0cb546377Ed2693a574') {
    path = `../../assets/images/0-icon.png`
  } else {
    const { allCrosschainData } = getCrosschainState()
    const chosenTokenChainName = allCrosschainData.chains.find(chain => chain.tokens.find(t => t.address === token.address))?.name
    const chainName = !chosenTokenChainName ? 'ethereum' : (chosenTokenChainName === 'Smart Chain') ? 'binance' : chosenTokenChainName.toLowerCase()
    path = `https://raw.githubusercontent.com/RelayChain/bridge-tokens/main/${chainName}-tokens/${token.address}/logo.png`
  }

  return Vibrant.from(path)
    .getPalette()
    .then(palette => {
      if (palette?.Vibrant) {
        let detectedHex = palette.Vibrant.hex
        let AAscore = hex(detectedHex, '#FFF')
        while (AAscore < 3) {
          detectedHex = shade(0.005, detectedHex)
          AAscore = hex(detectedHex, '#FFF')
        }
        return detectedHex
      }
      return null
    })
    .catch(() => null)
}

export function useColor(token?: Token) {
  const [color, setColor] = useState('#2172E5')

  useLayoutEffect(() => {
    let stale = false

    if (token) {
      getColorFromToken(token).then(tokenColor => {
        if (!stale && tokenColor !== null) {
          setColor(tokenColor)
        }
      })
    }

    return () => {
      stale = true
      setColor('#2172E5')
    }
  }, [token])

  return color
}

async function getColorFromUriPath(uri: string): Promise<string | null> {
  const formattedPath = uriToHttp(uri)[0]

  return Vibrant.from(formattedPath)
    .getPalette()
    .then(palette => {
      if (palette?.Vibrant) {
        return palette.Vibrant.hex
      }
      return null
    })
    .catch(() => null)
}

export function useListColor(listImageUri?: string) {
  const [color, setColor] = useState('#2172E5')

  useLayoutEffect(() => {
    let stale = false

    if (listImageUri) {
      getColorFromUriPath(listImageUri).then(color => {
        if (!stale && color !== null) {
          setColor(color)
        }
      })
    }

    return () => {
      stale = true
      setColor('#2172E5')
    }
  }, [listImageUri])

  return color
}
