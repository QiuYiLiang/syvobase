import { Checkbox, CheckboxProps } from '@/checkbox'
import { CheckboxGroup, CheckboxGroupProps } from '@/checkboxGroup'
import { ColorPicker, ColorPickerProps } from '@/colorPicker'
import { Password, PasswordProps } from '@/password'
import { Qrcode, QrcodeProps } from '@/qrcode'
import { Select, SelectProps } from '@/select'
import { Textarea, TextareaProps } from '@/textarea'
import { Text, TextProps } from '@/text'
import { Mindmap, MindmapProps } from '@/mindmap'
import { Draw, DrawProps } from '@/draw'
import { Number, NumberProps } from '@/number'
import { OTP, OTPProps } from '@/otp'
import { Switch, SwitchProps } from '@/switch'
import { ComponentType, CSSProperties, useRef } from 'react'
import { Button } from '@/button'
import { dialog } from '@/dialog'
import { DatePicker, DatePickerProps } from '@/datePicker'
import { File, FileProps } from '@/file'
import { Dict } from '@syvobase/utils'
import { $t } from '@/utils/i18n'
import { Richtext, RichtextProps } from '@/richtext'

// eslint-disable-next-line react-refresh/only-export-components
export const ComponentMap = {
  checkbox: Checkbox,
  checkboxGroup: CheckboxGroup,
  colorPicker: ColorPicker,
  number: Number,
  password: Password,
  select: Select,
  switch: Switch,
  textarea: Textarea,
  text: Text,
  datePicker: DatePicker,
  file: File,
  otp: createModelControl({
    Component: OTP,
  }),
  qrcode: createModelControl({
    Component: Qrcode,
  }),
  draw: createModelControl({
    Component: Draw,
    style: { width: 800, height: 600, padding: 0 },
  }),
  mindmap: createModelControl({
    Component: Mindmap,
    style: { width: 800, height: 600, padding: 0 },
  }),
  richtext: createModelControl({
    Component: Richtext,
    style: { width: 800, height: 600, padding: 0 },
  }),
}

const notClickEditComponents: ComponentType<any>[] = [
  ComponentMap.checkbox,
  ComponentMap.checkboxGroup,
  ComponentMap.otp,
  ComponentMap.colorPicker,
  ComponentMap.switch,
  ComponentMap.qrcode,
  ComponentMap.draw,
  ComponentMap.mindmap,
  ComponentMap.richtext,
  ComponentMap.datePicker,
  ComponentMap.file,
]

interface ModelControlProps {
  control: ControlProps
  options: {
    Component: any
    style?: CSSProperties
    center?: boolean
  }
}

const ModelControl = ({
  control: { onExitEditMode, ...props },
  options: { Component, style = {} },
}: ModelControlProps) => {
  const { inlineMode, readMode } = props
  const ref = useRef<any>(null)

  const handleClick = (isEdit: boolean) => {
    const { close } = dialog({
      direction: 'center',
      header: isEdit ? $t('control.edit') : $t('control.view'),
      children: (
        <div
          style={{
            width: 'auto',
            height: 'auto',
            minHeight: 30,
            minWidth: 100,
            ...style,
          }}
        >
          <Component {...props} ref={ref} readMode={!isEdit} />
        </div>
      ),
      ...(isEdit
        ? {
            toolbar: {
              right: [
                {
                  type: 'outline',
                  name: $t('control.cancel'),
                  onClick: () => {
                    close()
                    onExitEditMode?.()
                  },
                },
                {
                  name: $t('control.save'),
                  onClick: () => {
                    ref?.current?.triggerUpdate()
                    close()
                    onExitEditMode?.()
                  },
                },
              ],
            },
          }
        : {}),
    })
  }

  if (inlineMode) {
    return (
      <>
        <Button
          icon='Eye'
          type='ghost'
          onlyIcon
          onClick={() => {
            handleClick(false)
          }}
        >
          {$t('control.view')}
        </Button>
        {!readMode && (
          <Button
            icon='SquarePen'
            type='ghost'
            onlyIcon
            onClick={() => {
              handleClick(true)
            }}
          >
            {$t('control.edit')}
          </Button>
        )}
      </>
    )
  }
  return <Component {...props} ref={ref} readMode={readMode} />
}

// eslint-disable-next-line react-refresh/only-export-components
export function createModelControl(options: ModelControlProps['options']) {
  return (props: ControlProps) => {
    return <ModelControl control={props} options={options} />
  }
}

export type ControlType<T extends string, P> = { type: T } & P

export type ControlProps = (
  | ControlType<'checkbox', CheckboxProps>
  | ControlType<'checkboxGroup', CheckboxGroupProps>
  | ControlType<'colorPicker', ColorPickerProps>
  | ControlType<'draw', DrawProps>
  | ControlType<'mindmap', MindmapProps>
  | ControlType<'richtext', RichtextProps>
  | ControlType<'number', NumberProps>
  | ControlType<'opt', OTPProps>
  | ControlType<'password', PasswordProps>
  | ControlType<'qrcode', QrcodeProps>
  | ControlType<'select', SelectProps>
  | ControlType<'switch', SwitchProps>
  | ControlType<'textarea', TextareaProps>
  | ControlType<'text', TextProps>
  | ControlType<'datePicker', DatePickerProps>
  | ControlType<'file', FileProps>
  | TextProps
) & {
  type?: string | any
  canEdit?: boolean
  onExitEditMode?: () => void
} & Dict

export const Control = ({ ref, type = 'text', ...props }: ControlProps) => {
  const Component = typeof type === 'string' ? ComponentMap[type] : type
  if (!Component) {
    return
  }

  const isNotClickEditComponentType =
    props.canEdit && notClickEditComponents.includes(Component)
  const readMode = isNotClickEditComponentType ? false : props.readMode

  return typeof type === 'function' ? (
    type({
      ...props,
      ref,
      readMode,
    })
  ) : (
    <Component {...props} ref={ref} readMode={readMode} />
  )
}

Control.registerComponent = (options: {
  name: string
  Component: any
  modelOptions?: ModelControlProps['options']
  isNotClickEdit?: boolean
}) => {
  const { name, Component, modelOptions, isNotClickEdit = false } = options
  const Comp = modelOptions
    ? createModelControl({ Component, ...(modelOptions as any) })
    : Component
  ComponentMap[name] = Comp
  if (isNotClickEdit) {
    notClickEditComponents.push(Comp)
  }
}
