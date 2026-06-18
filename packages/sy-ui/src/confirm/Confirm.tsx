import { Dict } from '@syvobase/utils'
import { Form, FormModel, FormProps } from '@/form'
import { createRef, ReactNode } from 'react'
import { dialog, DialogAPI, DialogProps } from '@/dialog'
import { ToolbarItem } from '@/toolbar'
import { BaseProps, cn } from '@/utils'
import { $t } from '@/utils/i18n'

export interface ConfirmOptions extends BaseProps {
  header: ReactNode
  providerKey?: any
  defaultValue?: Dict
  direction?: DialogProps['direction']
  items?: FormProps['items']
  disabledContentPadding?: boolean
  onConfirm: (value: Dict) => Promise<boolean | void> | boolean | void
  onClose?: () => Promise<void> | void
  toolbar?: ToolbarItem[]
}

export function confirm(
  options: ConfirmOptions | ((api: DialogAPI) => ConfirmOptions)
) {
  const ref = createRef<FormModel>()
  return dialog((api) => {
    const {
      header,
      providerKey,
      defaultValue = {},
      className,
      style,
      children,
      direction,
      disabledContentPadding,
      items,
      onConfirm,
      onClose,
      toolbar = [],
    } = typeof options === 'function' ? options(api) : options
    api.setDefaultValue(defaultValue)
    return {
      header,
      providerKey,
      direction,
      disabledContentPadding,
      children: items ? (
        <Form
          ref={ref}
          className={cn('pb-1', className)}
          style={style}
          padding={2}
          value={api.value}
          onChange={api.setValue}
          items={items}
        />
      ) : (
        children
      ),
      onClose: () => {
        onClose?.()
      },
      toolbar: [
        {
          name: $t('confirm.cancel'),
          type: 'ghost',
          onClick: async () => {
            await onClose?.()
            api.close()
          },
        },
        {
          name: $t('confirm.confirm'),
          onClick: async () => {
            if (ref.current && !(await ref.current!.validation())) {
              return
            }
            const flag = await onConfirm(api.value)
            if (flag !== false) {
              api.close()
            }
          },
        },
        ...toolbar,
      ],
    }
  })
}
