import {
  ReactNode,
  RefAttributes,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import { useValidationContext, ValidationContext } from './shared'
import { ValidateOtpions } from '@/utils'

export interface ValidationProps extends RefAttributes<ValidationModel> {
  children: ReactNode
}
export interface ValidationModel {
  validation: (options?: ValidateOtpions) => Promise<boolean>
}

export const Validation = ({ ref, children }: ValidationProps) => {
  const validationContextRef = useRef({
    validationSet: new Set(),
  })

  const validationContext = useValidationContext()

  const validation = async (options = {}) => {
    const { validationSet } = validationContextRef.current
    for (const validation of validationSet.values()) {
      if (typeof validation !== 'function') {
        validationSet.delete(validation)
        continue
      }
      if (!(await validation(options))) {
        return false
      }
    }
    return true
  }

  useImperativeHandle(ref, () => ({
    validation,
  }))

  useEffect(() => {
    if (!validationContext) {
      return
    }
    const { validationSet } = validationContext

    validationSet.add(validation)
    return () => {
      validationSet.delete(validation)
    }
  }, [validationContext])

  return (
    <ValidationContext value={validationContextRef.current}>
      {children}
    </ValidationContext>
  )
}
