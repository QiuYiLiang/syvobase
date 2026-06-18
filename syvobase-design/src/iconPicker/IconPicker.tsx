import { ColorPicker } from '@/colorPicker'
import { Form } from '@/form'
import { Icon } from '@/icon/Icon'
import { Popover } from '@/popover'
import { BaseValueProps, cn, useControllable } from '@/utils'
import { IconSelects } from './IconSelect'
import { Button } from '@/button'
import { icons } from './shared'
import { FileIconPicker } from './FileIconPicker'
import { $t } from '@/utils/i18n'
import { TRANSPARENT_COLOR } from '@/colorPicker/shared'

export interface IconPickerProps extends BaseValueProps<{
  type: 'default' | 'custom' | 'none'
  value?: any
  color: string
}> {
  readMode?: boolean
  size?: 'sm' | 'default' | 'lg' | 'xl'
}

const sizeMap = {
  sm: 'size-6',
  default: 'size-8',
  lg: 'size-10',
  xl: 'size-12',
}

const iconSizeMap = {
  sm: 16,
  default: 20,
  lg: 24,
  xl: 32,
}

export const IconPicker = (props: IconPickerProps) => {
  const { className, style, readMode = false, size = 'default' } = props
  const [value, setValue] = useControllable<IconPickerProps, 'value'>({
    props,
    value: {
      type: 'none',
      color: TRANSPARENT_COLOR,
    },
  })
  if (readMode && value.type === 'none') {
    return
  }
  const content = (
    <div
      className={cn(
        'flex items-center justify-center rounded-lg p-1',
        sizeMap[size],
        className
      )}
      style={{
        background: value.color,
        ...style,
      }}
    >
      {value.type !== 'none' &&
        (value.type === 'default' ? (
          <Icon
            {...(value.color !== TRANSPARENT_COLOR
              ? { color: 'var(--syvobase-background)' }
              : {})}
            name={value.value}
            size={iconSizeMap[size]}
          />
        ) : (
          <div
            className='repeat-0 h-full w-full bg-cover'
            style={{
              backgroundImage: `url(${value.value?.base64})`,
            }}
          ></div>
        ))}
    </div>
  )
  if (readMode) {
    return content
  }
  return (
    <Popover
      trigger='click'
      align='left'
      content={
        <Form
          padding={0}
          value={value}
          items={[
            {
              id: 'type',
              name: $t('colorPicker.type'),
              control: {
                type: 'checkboxGroup',
                multiple: false,
                items: [
                  {
                    id: 'none',
                    name: $t('colorPicker.none'),
                  },
                  {
                    id: 'default',
                    name: $t('colorPicker.default'),
                  },
                  {
                    id: 'custom',
                    name: $t('colorPicker.custom'),
                  },
                ],
                onChange: (value) => {
                  setValue((_value) => ({
                    ..._value,
                    type: value,
                    value: value === 'default' ? icons[0] : undefined,
                  }))
                },
              },
            },
            value.type === 'default'
              ? {
                  id: 'value',
                  name: (
                    <div className='flex w-full items-center justify-between'>
                      <div>{$t('colorPicker.icon')}</div>
                      <Button
                        type='link'
                        size='sm'
                        trigger='click'
                        popover={
                          <div>
                            <IconSelects
                              full
                              value={value.value}
                              onChange={(_value) => {
                                setValue((value) => ({
                                  ...value,
                                  value: _value,
                                }))
                              }}
                            />
                          </div>
                        }
                      >
                        {$t('colorPicker.more')}
                      </Button>
                    </div>
                  ),
                  control: {
                    type: (props) => (
                      <div>
                        <IconSelects {...props} />
                      </div>
                    ),
                  },
                }
              : {
                  id: 'value',
                  name: $t('colorPicker.icon'),
                  control: {
                    type: FileIconPicker,
                  },
                },
            {
              id: 'color',
              name: $t('colorPicker.color'),
              control: {
                type: ColorPicker,
              },
            },
          ]}
          onChange={setValue}
        />
      }
    >
      <div className='flex cursor-pointer items-center justify-center space-x-2'>
        {content}
        <Icon name='ChevronDown' />
      </div>
    </Popover>
  )
}
