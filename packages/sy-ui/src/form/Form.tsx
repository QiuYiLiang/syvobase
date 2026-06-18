import { useControllable, cn, ValidatorModel, ValidatorRules } from '@/utils'
import { $t } from '@/utils/i18n'
import { ReactNode, useImperativeHandle, useRef } from 'react'
import { FlowForm } from './FlowForm'
import { GridForm } from './GridForm'
import { Panel } from '@/panel'
import { FormContext, FormProps } from './shared'
import { Validation, ValidationModel } from '@/validation'
import { ControlProps } from '@/control'
import { get, set, Dict} from '@syvobase/utils'
import { mergeTag } from '@/utils/tag'

export const Form = ((props: FormProps) => {
  const {
    ref,
    className,
    style = {},
    padding = 10,
    labelWidth = 80,
    width = '100%',
    items,
    topToolbar,
    toolbar,
    type,
    border,
    fixed = false,
    topLabel = true,
    header,
    footer,
    onFieldChange,
  } = props
  const [value, setValue] = useControllable({
    props,
    value: {},
  })

  const cells = (() => {
    const cells: ({
      id: string
      name?: string
    } & ControlProps)[] = []
    const initItems: any = Array.isArray(items) ? items : items.items
    const eachItems = (items: any) => {
      items.forEach((item: any) => {
        const { type, items } = item
        if (type === 'FlowForm') {
          items.forFach((item: any) => {
            eachItems(item)
          })
        }
        if (type === 'FlowForm') {
          Array.isArray(items)
          items.forFach((item: any) => {
            eachItems(Array.isArray(item) ? item : [item])
          })
        }
        cells.push(item)
      })
    }
    eachItems(initItems)
    return cells
  })()

  const validationRef = useRef<ValidationModel>(null)

  const form = Array.isArray(items) ? (
    <FlowForm items={items} />
  ) : typeof items === 'object' ? (
    <GridForm {...items} />
  ) : null

  const handleInputChange = async (id: string, value: any) => {
    onFieldChange?.(id, value)

    setValue((_value) => {
      set(_value, id, value)
      return { ..._value }
    })
  }

  useImperativeHandle(ref, () => ({
    validation: async (options) => {
      if (!(await validationRef.current!.validation(options))) {
        return false
      }

      for (const { id, required, rules = [] } of cells) {
        if (rules.length > 0) {
          const validatorModel = new ValidatorModel({
            rules: (required
              ? [...rules, { required: true }]
              : rules) as ValidatorRules<any>,
            emptyMessage: $t('validation.notEmpty'),
          })
          try {
            await validatorModel.validation({
              value: get(value, id),
            })
          } catch (error) {
            console.warn((error as any).message)
            return false
          }
        }
      }
      return true
    },
  }))

  return (
    <Validation ref={validationRef}>
      <FormContext
        value={{
          ...props,
          value,
          padding,
          labelWidth,
          topLabel,
          handleInputChange,
        }}
      >
        <Panel
          {...mergeTag('form', props)}
          className={cn(className)}
          padding={padding / 2}
          style={style}
          width={width}
          type={type}
          border={border}
          fixed={fixed}
          header={header}
          footer={footer}
          topToolbar={topToolbar}
          toolbar={toolbar}
          disabledContentPadding
        >
          {form}
        </Panel>
      </FormContext>
    </Validation>
  )
}) as <V = Dict>(props: FormProps<V>) => ReactNode
