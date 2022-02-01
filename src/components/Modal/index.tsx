import { DialogContent, DialogOverlay } from '@reach/dialog'
import '@reach/dialog/styles.css'
import React from 'react'
import { isMobile } from 'react-device-detect'
import { animated, useSpring, useTransition } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import styled, { css } from 'styled-components'

const AnimatedDialogOverlay = animated(DialogOverlay)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogOverlay = styled(AnimatedDialogOverlay)`
  &[data-reach-dialog-overlay] {
    z-index: 2;
    background-color: rgba(70, 70, 70, 0.25);
    backdrop-filter: blur(100px);
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: center;
    // background-color: ${({ theme }) => theme.modalBG};
  }
`
/// 
const AnimatedDialogContent = animated(DialogContent)
// destructure to not pass custom props to Dialog DOM element
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogContent = styled(({ minHeight, maxHeight, maxWidth, mobile, isOpen, isChainSwitch, ...rest }) => (
  <AnimatedDialogContent {...rest} />
)).attrs({
  'aria-label': 'dialog'
})`
  overflow-y: ${({ mobile }) => (mobile ? 'auto' : 'hidden')};
  &[data-reach-dialog-content] {   
    background:  linear-gradient(180deg, #211A49 0%, #211A49 100%);
    box-shadow: 11px 10px 20px rgba(0, 0, 0, 0.25);
    padding: 5px 0;
    backdrop-filter: blur(28px); 
    overflow-y: ${({ mobile }) => (mobile ? 'auto' : 'hidden')};
    overflow-x: auto;
    align-self: ${({ mobile }) => (mobile ? 'flex-end' : 'center')}; 
    ${({ isChainSwitch }) =>
    (isChainSwitch) &&
      css ? `
      margin-right: 3px;
      background: #2E2757;
      box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.25);
      width: 508px;
      height: 1024px;
    ` : `
      border-radius: 30px;
      margin:  0 0 2rem 0;
      width: 50vw;
    
    `}

    ${({ maxHeight }) =>
    maxHeight &&
    css`
        max-height: ${maxHeight}vh;
      `}
    ${({ maxWidth }) =>
    maxWidth &&
    css`
        max-width: ${maxWidth}px;
      `}

    ${({ minHeight }) =>
    minHeight &&
    css`
        min-height: ${minHeight}vh;
      `}
    display: flex;
    ${({ theme }) => theme.mediaWidth.upToMedium`
      width: 65vw;
      margin: 0;
    `}
    ${({ theme, mobile }) => theme.mediaWidth.upToSmall`
      width:  85vw;
      ${mobile &&
    css`
          width: 100vw;
          border-radius: 20px;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        `}
    `}
  }
`

interface ModalProps {
  isOpen: boolean
  onDismiss: () => void
  minHeight?: number | false
  maxHeight?: number
  maxWidth?: number
  isChainSwitch?: boolean
  initialFocusRef?: React.RefObject<any>
  children?: React.ReactNode
}

export default function Modal({
  isOpen,
  onDismiss,
  minHeight = false,
  maxHeight = 100,
  maxWidth = 473,
  isChainSwitch = false,
  initialFocusRef,
  children
}: ModalProps) {
  const fadeTransition = useTransition(isOpen, null, {
    config: { duration: 200 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  })

  const [{ y }, set] = useSpring(() => ({ y: 0, config: { mass: 1, tension: 210, friction: 20 } }))
  const bind = useGesture({
    onDrag: state => {
      set({
        y: state.down ? state.movement[1] : 0
      })
      if (state.movement[1] > 300 || (state.velocity > 3 && state.direction[1] > 0)) {
        onDismiss()
      }
    }
  })

  return (
    <>
      {fadeTransition.map(
        ({ item, key, props }) =>
          item && (
            <StyledDialogOverlay key={key} style={props} onDismiss={onDismiss} initialFocusRef={initialFocusRef}>
              <StyledDialogContent
                {...(isMobile
                  ? {
                    ...bind(),
                    style: { transform: y.interpolate(y => `translateY(${y > 0 ? y : 0}px)`) }
                  }
                  : {})}
                aria-label="dialog content"
                minHeight={minHeight}
                maxHeight={maxHeight}
                maxWidth={maxWidth}
                isChainSwitch={isChainSwitch}
                mobile={isMobile}
              >
                {/* prevents the automatic focusing of inputs on mobile by the reach dialog */}
                {!initialFocusRef && isMobile ? <div tabIndex={1} /> : null}
                {children}
              </StyledDialogContent>
            </StyledDialogOverlay>
          )
      )}
    </>
  )
}
