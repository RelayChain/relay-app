import React, { useMemo, useState } from 'react'
import Modal from 'components/Modal'
import PopupItem from 'components/Popups/PopupItem'
import { PopupContent } from 'state/application/actions'

const popupContent: PopupContent = {
    simpleAnnounce: {
      message: 'please wait to change RPCs'
    }
  } 


interface PlainPopupProps {
    isOpen: boolean
    onDismiss: () => void
    content: PopupContent
    removeAfterMs: number
  }
export default function PlainPopup( { 
    isOpen,
    onDismiss,
    content,
    removeAfterMs,
  }: PlainPopupProps)  {
   

  return (
    <>
        {
          (
            <>
              <Modal isOpen={isOpen} onDismiss={onDismiss}>
                <PopupItem key={''} content={content} popKey={''} removeAfterMs={removeAfterMs} />
              </Modal>
            </>

          )
        }

    </>
  )
}
 