import {
  RefAttributes,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import {
  allFuns,
  dateFuns,
  FormulaFunc,
  logicFuns,
  numberFuns,
  textFuns,
} from './shared'
import { BaseValueProps, cn, useControllable } from '@/utils'
import { Tree, TreeProps } from '@/tree'
import { Tabs } from '@/tabs'
import { Button } from '@/button'
import { Formula as _Formula } from '@syvobase/utils'
import { $t } from '@/utils/i18n'
import { mergeTag } from '@/utils/tag'
import './Formula.css'

export interface FormulaProps
  extends BaseValueProps<string>, RefAttributes<FormulaModel> {
  items?: TreeProps['items']
  onGetName?: (id: string) => string
}

export interface FormulaModel {
  insert: (id: string) => void
}

export const Formula = (props: FormulaProps) => {
  const { className, style, items, onGetName } = props
  const [currentFuncType, setCurrentFuncType] = useState('all')
  const ref = useRef<HTMLDivElement>(null)
  const [value, setValue] = useControllable<FormulaProps, 'value'>({
    props,
    value: '',
  })

  useEffect(() => {
    if (value && ref.current && !ref.current.innerHTML) {
      const regex = /#\((.*?)\)/g
      const getName = (id: string) => {
        if (items) {
          return items.find((item) => item.id === id)?.name
        } else {
          return onGetName?.(id)
        }
      }

      ref.current.innerHTML = value.replace(regex, (_, id) => {
        return `<div class="nk-formula-value" contentEditable="false" data-id="${id}">${getName(id)}</div>`
      })
    }
  }, [onGetName, items, value])
  const createFuncTree = ({
    formulaFuncs,
  }: {
    formulaFuncs: FormulaFunc[]
  }) => (
    <Tree
      localSearch
      isTree={false}
      value={[]}
      items={formulaFuncs.map(({ id, template }) => ({
        id,
        name: id,
        template,
      }))}
      onNodeClick={(node) => {
        const template = node.data.template
        const el = ref.current
        if (!el) return
        el.focus()
        const sel = window.getSelection()
        if (!sel || sel.rangeCount === 0) return
        const range = sel.getRangeAt(0)
        range.deleteContents()
        const textNode = document.createTextNode(template)
        range.insertNode(textNode)
        const newRange = document.createRange()
        newRange.setStart(textNode, template.length - 1)
        newRange.setEnd(textNode, template.length - 1)
        sel.removeAllRanges()
        sel.addRange(newRange)
        update()
      }}
    />
  )
  const update = () => {
    const el = ref.current
    if (!el) return
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = el.innerHTML
    const nodes = tempDiv.querySelectorAll('[data-id]')
    nodes.forEach((node) => {
      const id = node.getAttribute('data-id')
      if (id) {
        const textNode = document.createTextNode(`#(${id})`)
        node.parentNode?.replaceChild(textNode, node)
      }
    })
    setValue(tempDiv.innerHTML)
  }

  const insert = (id: string) => {
    const tempDiv = document.createElement('div')
    const getName = (id: string) => {
      if (items) {
        return items.find((item) => item.id === id)?.name
      } else {
        return onGetName?.(id)
      }
    }
    tempDiv.innerHTML = `<div class="nk-formula-value" contentEditable="false" data-id="${id}">${getName(id)}</div>`
    const insertNode = tempDiv.firstChild as any

    const el = ref.current
    if (!el) return
    el.focus()
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return
    const range = sel.getRangeAt(0)
    range.deleteContents()
    range.insertNode(insertNode)
    sel.removeAllRanges()
    update()
  }

  useImperativeHandle(props.ref, () => ({
    insert,
  }))

  return (
    <div
      {...mergeTag('formula', props)}
      className={cn(
        'divide-border flex h-full w-full flex-row divide-x',
        className
      )}
      style={style}
    >
      <div className='divide-border flex w-60 flex-col divide-y'>
        {items && (
          <Tree
            className='flex-1 p-2'
            localSearch
            isTree={false}
            value={[]}
            items={items}
            onNodeClick={(node) => {
              insert(node.id)
            }}
          />
        )}
        <div
          className={cn(
            'flex flex-col gap-2 overflow-auto',
            items ? 'h-64' : 'h-full'
          )}
        >
          <Tabs
            className='px-2'
            full
            type='line'
            value={currentFuncType}
            items={[
              {
                id: 'all',
                name: $t('formula.all'),
              },
              {
                id: 'number',
                name: $t('formula.number'),
              },
              {
                id: 'date',
                name: $t('formula.date'),
              },
              {
                id: 'text',
                name: $t('formula.text'),
              },
              {
                id: 'logic',
                name: $t('formula.logic'),
              },
            ]}
            onChange={setCurrentFuncType}
          />
          <div className='w-full flex-1 p-2'>
            {currentFuncType === 'all' &&
              createFuncTree({ formulaFuncs: allFuns })}
            {currentFuncType === 'number' &&
              createFuncTree({ formulaFuncs: numberFuns })}
            {currentFuncType === 'date' &&
              createFuncTree({ formulaFuncs: dateFuns })}
            {currentFuncType === 'text' &&
              createFuncTree({ formulaFuncs: textFuns })}
            {currentFuncType === 'logic' &&
              createFuncTree({ formulaFuncs: logicFuns })}
          </div>
        </div>
      </div>
      <div className='divide-border flex flex-1 flex-col divide-y'>
        <div className='divide-border flex flex-1 flex-col divide-y'>
          <div className='flex flex-row p-1'>
            {_Formula.operators.map((operator) => {
              return (
                <Button type='ghost' key={operator}>
                  {operator}
                </Button>
              )
            })}
          </div>
          <div
            className='w-full flex-1 p-2'
            contentEditable
            ref={ref}
            onInput={() => {
              update()
            }}
          ></div>
        </div>
        <div className='h-44'></div>
      </div>
    </div>
  )
}
