import React from 'react'

import Modal from 'components/Modal'
import { PopupContent } from 'state/application/actions'
import PopupItem from 'components/Popups/PopupItem'

// const popupContent: PopupContent = {
//   simpleAnnounce: {
//     message: 'Please wait 5 seconds to change RPCs again.'
//   }
// }

interface PlainPopupProps {
  isOpen: boolean
  onDismiss: () => void
  content: PopupContent
  removeAfterMs: number
  hideClose?: boolean | undefined
  link?: string
  buttonName?: string
}
export default function PlainPopup({ isOpen, onDismiss, content, removeAfterMs, hideClose, link, buttonName }: PlainPopupProps) {
  return (
    <>
      {
        <>
          <Modal isOpen={isOpen} onDismiss={onDismiss}>
            <PopupItem key={''} content={content} popKey={''} removeAfterMs={removeAfterMs} hideClose={true} />
            {link && (<a  href={link}> {buttonName}</a>)}
        </Modal>
        </>
      }
    </>
  )
}
