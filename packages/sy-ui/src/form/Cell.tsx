import { ReactNode, useContext } from 'react'
import { FormContext } from './shared'
import { Control, ControlProps } from '@/control'
import { cn, hasOwnProperty } from '@/utils'
import { FlowForm, FlowFormProps } from './FlowForm'
import { GridForm, GridFormProps } from './GridForm'
import { Icon } from '@/icon'
import { Popover } from '@/popover'
import { get, Dict } from '@syvobase/utils'
import { CollapseForm, CollapseFormProps } from './CollapseForm'
import { TabsForm, TabsFormProps } from './TabsForm'

export type CellProps =
  | {
      id: string
      type?: string
      name?: ReactNode
      help?: ReactNode
      control?: ControlProps
      visible?: (value: Dict) => boolean
      onChange?: (value: any) => void
    }
  | ({
      type: 'flow'
      visible?: (value: Dict) => boolean
    } & FlowFormProps)
  | ({
      type: 'grid'
      visible?: (value: Dict) => boolean
    } & GridFormProps)
  | ({
      type: 'collapse'
      visible?: (value: Dict) => boolean
    } & CollapseFormProps)
  | ({ type: 'tabs'; visible?: (value: Dict) => boolean } & TabsFormProps)

export const Cell = (props: CellProps) => {
  const {
    type = '',
    id,
    name,
    help,
    control: _control = {},
    onChange,
  } = props as any
  const {
    value = {},
    readMode,
    disabled,
    padding,
    labelWidth,
    topLabel,
    handleInputChange,
  } = useContext(FormContext)
  const isLayout = ['flow', 'grid', 'collapse', 'tabs'].includes(type)
  const control = { ..._control }
  if (isLayout) {
    if (!hasOwnProperty(control, 'readMode')) {
      ;(control as ControlProps).readMode = !!readMode
    }
    if (!hasOwnProperty(control, 'disabled')) {
      ;(control as ControlProps).disabled = !!disabled
    }
  }
  const { required: _required, rules = [] } = control as any
  const required = _required || rules.some(({ required }) => required)

  return (
    <div
      className={cn('flex', topLabel && 'flex-col')}
      style={
        isLayout
          ? {}
          : {
              padding,
              ...(topLabel
                ? {
                    margin: '0 2px',
                  }
                : {}),
            }
      }
    >
      {!isLayout && name && (
        <div
          className={cn('text-foreground/70 flex text-sm leading-8')}
          style={
            topLabel
              ? {}
              : {
                  width: `${labelWidth}px`,
                }
          }
        >
          {name}
          {help && (
            <Popover content={help}>
              <div className='flex h-8 items-center'>
                <Icon className='cursor-pointer' name='BadgeQuestionMark' />
              </div>
            </Popover>
          )}
          {required && <div className='text-red-600'>*</div>}
        </div>
      )}
      <div className='flex flex-1 items-center overflow-visible!'>
        {!isLayout ? (
          <Control
            value={get(value, id)}
            onChange={async (value: any) => {
              handleInputChange(id, value)
              onChange?.(value)
            }}
            {...(control as ControlProps)}
          />
        ) : type === 'flow' ? (
          <FlowForm {...(props as FlowFormProps)} />
        ) : type === 'grid' ? (
          <GridForm {...(props as GridFormProps)} />
        ) : type === 'collapse' ? (
          <CollapseForm {...(props as CollapseFormProps)} />
        ) : (
          <TabsForm {...(props as TabsFormProps)} />
        )}
      </div>
    </div>
  )
}
