import { ReactNode, useEffect, useState } from 'react'
import { Popover } from '@/popover'
import { hasErrorMsg } from './shared'

export interface ValidatorErrorMsgProps {
  errorMsg?: string
  children: ReactNode
}

export const ValidatorErrorMsg = ({
  errorMsg,
  children,
}: ValidatorErrorMsgProps) => {
  const open = hasErrorMsg(errorMsg)
  const [innerOpen, setInnerOpen] = useState(false)
  const [disabledOpenChange, setDisabledOpenChange] = useState(false)
  useEffect(() => {
    if (open) {
      setDisabledOpenChange(true)
      setInnerOpen(open)
      setTimeout(() => {
        setDisabledOpenChange(false)
        setInnerOpen(false)
      }, 3000)
    }
  }, [open])

  return (
    <Popover
      content={errorMsg}
      direction='top'
      align='left'
      offset={8}
      className='bg-destructive text-destructive-foreground px-2 py-1'
      open={open && innerOpen}
      onOpenChange={(open) => {
        if (disabledOpenChange) {
          return
        }
        setInnerOpen(open)
      }}
    >
      {children}
    </Popover>
  )
}
