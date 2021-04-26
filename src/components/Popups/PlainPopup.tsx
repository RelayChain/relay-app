import React, { useMemo, useState } from 'react'

import Modal from 'components/Modal'
import { PopupContent } from 'state/application/actions'
import PopupItem from 'components/Popups/PopupItem'

const popupContent: PopupContent = {
    simpleAnnounce: {
      message: 'Please wait 5 seconds to change RPCs again.'
    },
  }


interface PlainPopupProps {
    isOpen: boolean
    onDismiss: () => void
    content: PopupContent
    removeAfterMs: number
    hideClose?: boolean | undefined
  }
export default function PlainPopup( {
    isOpen,
    onDismiss,
    content,
    removeAfterMs,
    hideClose,
  }: PlainPopupProps)  {


  return (
    <>
        {
          (
            <>
              <Modal isOpen={isOpen} onDismiss={onDismiss}>
                <PopupItem key={''} content={content} popKey={''} removeAfterMs={removeAfterMs} hideClose={true} />
              </Modal>
            </>

          )
        }

    </>
  )
}
