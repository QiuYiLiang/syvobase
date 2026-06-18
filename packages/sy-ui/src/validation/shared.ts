import { createContext, useContext, useState } from 'react'
import { $t } from '@/utils/i18n'
import { ValidateOtpions, ValidatorModel, ValidatorRule } from '@/utils'

export function useValidator<V = any>({
  value: _value,
  errorMsg: _errorMsg,
  required,
  rules = [],
}: {
  value?: V
  errorMsg?: string
  required?: boolean
  rules?: ValidatorRule<V>[]
}) {
  const [innerErrorMsg, setInnerErrorMsg] = useState('')

  const verify = new ValidatorModel({
    rules: required ? [...rules, { required: true }] : rules,
    emptyMessage: $t('validation.notEmpty'),
  })

  const errorMsg = _errorMsg ?? innerErrorMsg
  const verifyClassName = hasErrorMsg(errorMsg)
    ? 'rounded-md! ring-2! ring-destructive/50!'
    : ''

  const validation = async ({ trigger, value }: ValidateOtpions = {}) => {
    try {
      await verify.validation({
        trigger,
        value: value ?? _value,
      })
      setInnerErrorMsg('')
      return true
    } catch (error) {
      const message = (error as Error)?.message
      if (message) {
        setInnerErrorMsg(message)
      }
      return false
    }
  }
  return {
    errorMsg,
    verifyClassName,
    validation,
  }
}

export function hasErrorMsg(errorMsg?: string) {
  return !!errorMsg && errorMsg !== ''
}

export interface ValidationContextType {
  validationSet: Set<ValidatorModel['validation']>
}

export const ValidationContext = createContext({
  validationSet: new Set(),
})

export function useValidationContext() {
  return useContext(ValidationContext)
}
