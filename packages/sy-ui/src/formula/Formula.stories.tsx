import { Meta, StoryObj } from '@storybook/react-vite'
import { Formula, FormulaModel } from '@/formula'
import { useState, useRef } from 'react'
import { Button } from '@/button'

const meta = {
  title: 'Layout/Formula',
  component: Formula,
  argTypes: {},
  args: {},
} satisfies Meta<typeof Formula>

export default meta

type Story = StoryObj<typeof meta>

// 默认公式编辑器
export const Default: Story = {
  render() {
    const [value, setValue] = useState('')
    return (
      <div style={{ height: 500 }}>
        <Formula value={value} onChange={setValue} />
      </div>
    )
  },
}

// 带字段列表
export const WithItems: Story = {
  render() {
    const [value, setValue] = useState('')
    const items = [
      { id: 'field1', name: '数量' },
      { id: 'field2', name: '单价' },
      { id: 'field3', name: '折扣' },
      { id: 'field4', name: '税率' },
    ]
    return (
      <div style={{ height: 500 }}>
        <Formula value={value} onChange={setValue} items={items} />
      </div>
    )
  },
}

// 带初始值
export const WithInitialValue: Story = {
  render() {
    const items = [
      { id: 'quantity', name: '数量' },
      { id: 'price', name: '单价' },
    ]
    const [value, setValue] = useState('#(quantity) * #(price)')
    return (
      <div className='space-y-2'>
        <div className='text-muted-foreground text-sm'>
          公式: 数量 × 单价 = 总价
        </div>
        <div style={{ height: 500 }}>
          <Formula value={value} onChange={setValue} items={items} />
        </div>
      </div>
    )
  },
}

// 使用 ref 插入字段
export const WithRef: Story = {
  render() {
    const [value, setValue] = useState('')
    const formulaRef = useRef<FormulaModel>(null)
    const items = [
      { id: 'a', name: '字段A' },
      { id: 'b', name: '字段B' },
      { id: 'c', name: '字段C' },
    ]
    return (
      <div className='space-y-4'>
        <div className='flex gap-2'>
          <Button onClick={() => formulaRef.current?.insert('a')}>
            插入字段A
          </Button>
          <Button onClick={() => formulaRef.current?.insert('b')}>
            插入字段B
          </Button>
          <Button onClick={() => formulaRef.current?.insert('c')}>
            插入字段C
          </Button>
        </div>
        <div style={{ height: 450 }}>
          <Formula
            ref={formulaRef}
            value={value}
            onChange={setValue}
            items={items}
          />
        </div>
      </div>
    )
  },
}

// 自定义获取名称
export const WithCustomGetName: Story = {
  render() {
    const [value, setValue] = useState('')
    const fieldMap: Record<string, string> = {
      f1: '销售额',
      f2: '成本',
      f3: '利润',
      f4: '利润率',
    }
    return (
      <div className='space-y-2'>
        <div className='text-muted-foreground text-sm'>
          使用 onGetName 自定义字段名称显示
        </div>
        <div style={{ height: 500 }}>
          <Formula
            value={value}
            onChange={setValue}
            items={Object.keys(fieldMap).map((id) => ({
              id,
              name: fieldMap[id],
            }))}
            onGetName={(id) => fieldMap[id] || id}
          />
        </div>
      </div>
    )
  },
}

// 复杂公式示例
export const ComplexFormula: Story = {
  render() {
    const [value, setValue] = useState(
      'IF(#(status) == "completed", #(amount) * #(rate), 0)'
    )
    const items = [
      { id: 'status', name: '状态' },
      { id: 'amount', name: '金额' },
      { id: 'rate', name: '费率' },
      { id: 'discount', name: '折扣' },
    ]
    return (
      <div className='space-y-2'>
        <div className='text-muted-foreground text-sm'>复杂条件公式示例</div>
        <div style={{ height: 500 }}>
          <Formula value={value} onChange={setValue} items={items} />
        </div>
        <div className='text-muted-foreground text-xs'>当前公式值: {value}</div>
      </div>
    )
  },
}

// 受控模式
export const Controlled: Story = {
  render() {
    const [value, setValue] = useState('')
    const items = [
      { id: 'x', name: 'X' },
      { id: 'y', name: 'Y' },
    ]
    return (
      <div className='space-y-4'>
        <div className='flex gap-2'>
          <Button onClick={() => setValue('')}>清空</Button>
          <Button onClick={() => setValue('#(x) + #(y)')}>X + Y</Button>
          <Button onClick={() => setValue('#(x) * #(y)')}>X × Y</Button>
          <Button onClick={() => setValue('SUM(#(x), #(y))')}>SUM(X, Y)</Button>
        </div>
        <div style={{ height: 450 }}>
          <Formula value={value} onChange={setValue} items={items} />
        </div>
        <div className='bg-muted rounded p-2 text-sm'>
          <span className='font-medium'>当前公式: </span>
          {value || '(空)'}
        </div>
      </div>
    )
  },
}

// 多字段分组
export const GroupedItems: Story = {
  render() {
    const [value, setValue] = useState('')
    const items = [
      { id: 'order_id', name: '订单ID' },
      { id: 'order_date', name: '订单日期' },
      { id: 'customer_name', name: '客户名称' },
      { id: 'product_name', name: '产品名称' },
      { id: 'quantity', name: '数量' },
      { id: 'unit_price', name: '单价' },
      { id: 'total_amount', name: '总金额' },
      { id: 'discount', name: '折扣' },
      { id: 'tax', name: '税额' },
    ]
    return (
      <div style={{ height: 550 }}>
        <Formula value={value} onChange={setValue} items={items} />
      </div>
    )
  },
}
