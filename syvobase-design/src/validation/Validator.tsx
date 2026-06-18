import { ReactNode, useEffect } from 'react'
import { ValidatorErrorMsg } from './ErrorMsg'
import { useValidationContext } from './shared'
import { ValidateOtpions } from '@/utils'

export interface ValidatorProps {
  errorMsg?: string
  disabledErrorMsg?: boolean
  validation?: (options: ValidateOtpions) => Promise<boolean>
  children?: ReactNode
}

export const Validator = ({
  errorMsg,
  disabledErrorMsg = false,
  validation,
  children,
}: ValidatorProps) => {
  const validationContext = useValidationContext()
  useEffect(() => {
    if (!validationContext) {
      return
    }
    const { validationSet } = validationContext

    validationSet.add(validation)
    return () => {
      validationSet.delete(validation)
    }
  }, [validation, validationContext])

  if (disabledErrorMsg) {
    return children
  }
  return <ValidatorErrorMsg errorMsg={errorMsg}>{children}</ValidatorErrorMsg>
}
