import React from 'react'
import { createPortal } from 'react-dom'

export type PortalProps = {
  children: React.ReactNode
  container?: Element | DocumentFragment
}

export const Portal = ({
  children,
  container = window.document.body,
}: PortalProps) => {
  return createPortal(children, container)
}
