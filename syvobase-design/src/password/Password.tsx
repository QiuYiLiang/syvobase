import { Text, TextProps } from '@/text'
import { RefAttributes, useState } from 'react'
import { BaseInputModel } from '@/utils'
import { $t } from '@/utils/i18n'
import { Button } from '@/button'
import { mergeTag } from '@/utils/tag'

export interface PasswordProps
  extends TextProps, RefAttributes<BaseInputModel> {}

export const Password = (props: PasswordProps) => {
  const { ref } = props
  const [viewPassword, setViewPassword] = useState(false)
  if (props.readMode) {
    return (
      <div {...mergeTag('password', props)}>
        {viewPassword ? props.value : '******'}
        <Button
          icon='Eye'
          type='ghost'
          onlyIcon
          onClick={async (e) => {
            e.stopPropagation()
            setViewPassword(true)
            setTimeout(() => {
              setViewPassword(false)
            }, 3000)
          }}
        >
          {$t('password.view')}
        </Button>
      </div>
    )
  }
  return (
    <Text
      {...mergeTag('password', props)}
      htmlType='password'
      {...props}
      ref={ref}
    />
  )
}
