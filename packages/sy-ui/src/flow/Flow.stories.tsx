import { Meta, StoryFn } from '@storybook/react-vite'
import { useState } from 'react'
import { Flow } from './Flow'
import { FlowNodeValue, FlowValue } from './shared'

const meta = {
  title: 'Advanced/Flow',
  component: Flow,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Flow>

export default meta

type Story = StoryFn<typeof Flow>

// 节点渲染器
const renderNode = (node: FlowNodeValue) => {
  return (
    <div className='flex h-full w-full items-center justify-center p-2'>
      <span className='text-sm font-medium'>{node.id}</span>
    </div>
  )
}

// 初始数据
const initialValue: FlowValue = {
  nodes: [
    {
      id: '开始',
      position: { x: 100, y: 150 },
      port: [{ id: 'out', type: 'output', name: '输出' }],
    },
    {
      id: '处理',
      position: { x: 350, y: 100 },
      port: [
        { id: 'in', type: 'input', name: '输入' },
        { id: 'out', type: 'output', name: '输出' },
      ],
    },
    {
      id: '分支',
      position: { x: 350, y: 230 },
      port: [
        { id: 'in', type: 'input', name: '输入' },
        { id: 'yes', type: 'output', name: '是' },
        { id: 'no', type: 'output', name: '否' },
      ],
    },
    {
      id: '结束',
      position: { x: 600, y: 165 },
      port: [{ id: 'in', type: 'input', name: '输入' }],
    },
  ],
  edges: [
    {
      id: 'e1',
      source: { id: '开始', portId: 'out' },
      target: { id: '处理', portId: 'in' },
    },
    {
      id: 'e2',
      source: { id: '开始', portId: 'out' },
      target: { id: '分支', portId: 'in' },
    },
    {
      id: 'e3',
      source: { id: '处理', portId: 'out' },
      target: { id: '结束', portId: 'in' },
    },
    {
      id: 'e4',
      source: { id: '分支', portId: 'yes' },
      target: { id: '结束', portId: 'in' },
    },
  ],
}

/** 基础示例 */
export const Default: Story = () => {
  const [value, setValue] = useState<FlowValue>(initialValue)
  const [nodeCounter, setNodeCounter] = useState(1)

  return (
    <div className='h-screen w-full'>
      <Flow
        value={value}
        onChange={setValue}
        onNodeRender={renderNode}
        onCreateRender={({ addNode }) => (
          <div className='flex flex-col gap-1 p-2'>
            <button
              className='hover:bg-accent rounded-md px-3 py-1.5 text-left text-sm'
              onClick={() => {
                addNode({ id: `新节点-${nodeCounter}` })
                setNodeCounter((c) => c + 1)
              }}
            >
              ➕ 添加普通节点
            </button>
            <button
              className='hover:bg-accent rounded-md px-3 py-1.5 text-left text-sm'
              onClick={() => {
                addNode({ id: `分支-${nodeCounter}` })
                setNodeCounter((c) => c + 1)
              }}
            >
              🔀 添加分支节点
            </button>
            <button
              className='hover:bg-accent rounded-md px-3 py-1.5 text-left text-sm'
              onClick={() => {
                addNode({ id: `结束-${nodeCounter}` })
                setNodeCounter((c) => c + 1)
              }}
            >
              ⏹️ 添加结束节点
            </button>
          </div>
        )}
      />
    </div>
  )
}

/** 复杂工作流 - 展示自动布局和连线交叉 */
export const ComplexWorkflow: Story = () => {
  const [value, setValue] = useState<FlowValue>({
    nodes: [
      {
        id: '触发器',
        position: { x: 0, y: 100 },
        port: [{ id: 'out', type: 'output', name: '触发' }],
      },
      {
        id: '数据获取',
        position: { x: 200, y: 0 },
        port: [
          { id: 'in', type: 'input', name: '输入' },
          { id: 'out', type: 'output', name: '数据' },
        ],
      },
      {
        id: '条件判断',
        position: { x: 200, y: 100 },
        port: [
          { id: 'in', type: 'input', name: '输入' },
          { id: 'yes', type: 'output', name: '是' },
          { id: 'no', type: 'output', name: '否' },
        ],
      },
      {
        id: '发送通知',
        position: { x: 200, y: 200 },
        port: [
          { id: 'in', type: 'input', name: '输入' },
          { id: 'out', type: 'output', name: '输出' },
        ],
      },
      {
        id: '处理A',
        position: { x: 400, y: 50 },
        port: [
          { id: 'in', type: 'input', name: '输入' },
          { id: 'out', type: 'output', name: '输出' },
        ],
      },
      {
        id: '处理B',
        position: { x: 400, y: 150 },
        port: [
          { id: 'in', type: 'input', name: '输入' },
          { id: 'out', type: 'output', name: '输出' },
        ],
      },
      {
        id: '合并',
        position: { x: 600, y: 100 },
        port: [
          { id: 'in1', type: 'input', name: '输入1' },
          { id: 'in2', type: 'input', name: '输入2' },
          { id: 'in3', type: 'input', name: '输入3' },
          { id: 'out', type: 'output', name: '输出' },
        ],
      },
      {
        id: '结束',
        position: { x: 800, y: 100 },
        port: [{ id: 'in', type: 'input', name: '完成' }],
      },
    ],
    edges: [
      {
        id: 'e1',
        source: { id: '触发器', portId: 'out' },
        target: { id: '数据获取', portId: 'in' },
      },
      {
        id: 'e2',
        source: { id: '触发器', portId: 'out' },
        target: { id: '条件判断', portId: 'in' },
      },
      {
        id: 'e3',
        source: { id: '触发器', portId: 'out' },
        target: { id: '发送通知', portId: 'in' },
      },
      {
        id: 'e4',
        source: { id: '数据获取', portId: 'out' },
        target: { id: '处理A', portId: 'in' },
      },
      {
        id: 'e5',
        source: { id: '条件判断', portId: 'yes' },
        target: { id: '处理A', portId: 'in' },
      },
      {
        id: 'e6',
        source: { id: '条件判断', portId: 'no' },
        target: { id: '处理B', portId: 'in' },
      },
      {
        id: 'e7',
        source: { id: '发送通知', portId: 'out' },
        target: { id: '处理B', portId: 'in' },
      },
      {
        id: 'e8',
        source: { id: '处理A', portId: 'out' },
        target: { id: '合并', portId: 'in1' },
      },
      {
        id: 'e9',
        source: { id: '处理B', portId: 'out' },
        target: { id: '合并', portId: 'in2' },
      },
      {
        id: 'e10',
        source: { id: '数据获取', portId: 'out' },
        target: { id: '合并', portId: 'in3' },
      },
      {
        id: 'e11',
        source: { id: '合并', portId: 'out' },
        target: { id: '结束', portId: 'in' },
      },
    ],
  })

  const customRender = (node: FlowNodeValue) => {
    const colors: Record<string, string> = {
      触发器: 'bg-emerald-50',
      数据获取: 'bg-blue-50',
      条件判断: 'bg-amber-50',
      发送通知: 'bg-purple-50',
      处理A: 'bg-sky-50',
      处理B: 'bg-sky-50',
      合并: 'bg-orange-50',
      结束: 'bg-red-50',
    }
    const icons: Record<string, string> = {
      触发器: '⚡',
      数据获取: '📥',
      条件判断: '❓',
      发送通知: '📧',
      处理A: '⚙️',
      处理B: '⚙️',
      合并: '🔀',
      结束: '🏁',
    }

    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center ${colors[node.id] || ''}`}
      >
        <span className='text-xl'>{icons[node.id] || '📦'}</span>
        <span className='mt-1 text-xs font-medium'>{node.id}</span>
      </div>
    )
  }

  const [nodeCounter, setNodeCounter] = useState(1)

  return (
    <div className='flex h-screen w-full flex-col'>
      <div className='bg-muted/50 border-b p-3'>
        <h3 className='font-medium'>复杂工作流示例</h3>
        <p className='text-muted-foreground text-sm'>
          展示多端口、连线交叉、自动布局功能。点击底部工具栏的「优化布局」按钮自动排列节点。
        </p>
      </div>
      <div className='min-h-0 flex-1'>
        <Flow
          value={value}
          onChange={setValue}
          onNodeRender={customRender}
          onCreateRender={({ addNode }) => (
            <div className='flex flex-col gap-1 p-2'>
              <button
                className='hover:bg-accent rounded-md px-3 py-1.5 text-left text-sm'
                onClick={() => {
                  addNode({ id: `任务-${nodeCounter}` })
                  setNodeCounter((c) => c + 1)
                }}
              >
                ⚙️ 添加任务节点
              </button>
              <button
                className='hover:bg-accent rounded-md px-3 py-1.5 text-left text-sm'
                onClick={() => {
                  addNode({ id: `条件-${nodeCounter}` })
                  setNodeCounter((c) => c + 1)
                }}
              >
                ❓ 添加条件节点
              </button>
            </div>
          )}
        />
      </div>
    </div>
  )
}

/** 自定义节点渲染 */
export const CustomNodeRender: Story = () => {
  const [value, setValue] = useState<FlowValue>({
    nodes: [
      {
        id: 'trigger',
        position: { x: 100, y: 100 },
        port: [{ id: 'out', type: 'output', name: '输出' }],
      },
      {
        id: 'action',
        position: { x: 350, y: 100 },
        port: [
          { id: 'in', type: 'input', name: '输入' },
          { id: 'out', type: 'output', name: '输出' },
        ],
      },
      {
        id: 'end',
        position: { x: 600, y: 100 },
        port: [{ id: 'in', type: 'input', name: '输入' }],
      },
    ],
    edges: [
      {
        id: 'e1',
        source: { id: 'trigger', portId: 'out' },
        target: { id: 'action', portId: 'in' },
      },
      {
        id: 'e2',
        source: { id: 'action', portId: 'out' },
        target: { id: 'end', portId: 'in' },
      },
    ],
  })

  const customRender = (node: FlowNodeValue) => {
    const colors: Record<string, string> = {
      trigger: 'bg-emerald-100',
      action: 'bg-blue-100',
      end: 'bg-red-100',
    }
    const icons: Record<string, string> = {
      trigger: '⚡',
      action: '⚙️',
      end: '🏁',
    }

    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center ${colors[node.id] || 'bg-gray-100'}`}
      >
        <span className='text-2xl'>{icons[node.id] || '📦'}</span>
        <span className='mt-1 text-sm font-medium'>{node.id}</span>
      </div>
    )
  }

  const [nodeCounter, setNodeCounter] = useState(1)

  return (
    <div className='h-screen w-full'>
      <Flow
        value={value}
        onChange={setValue}
        onNodeRender={customRender}
        onCreateRender={({ addNode }) => (
          <div className='flex flex-col gap-1 p-2'>
            <button
              className='hover:bg-accent rounded-md px-3 py-1.5 text-left text-sm'
              onClick={() => {
                addNode({ id: `node-${nodeCounter}` })
                setNodeCounter((c) => c + 1)
              }}
            >
              📦 添加节点
            </button>
          </div>
        )}
      />
    </div>
  )
}

/** 不同尺寸节点 - 展示节点自适应内容大小 */
export const VariableSizeNodes: Story = () => {
  const [value, setValue] = useState<FlowValue>({
    nodes: [
      {
        id: '小节点',
        position: { x: 100, y: 150 },
        port: [{ id: 'out', type: 'output', name: '输出' }],
      },
      {
        id: '中等节点',
        position: { x: 300, y: 50 },
        port: [
          { id: 'in', type: 'input', name: '输入' },
          { id: 'out', type: 'output', name: '输出' },
        ],
      },
      {
        id: '大节点',
        position: { x: 300, y: 200 },
        port: [
          { id: 'in', type: 'input', name: '输入' },
          { id: 'out1', type: 'output', name: '成功' },
          { id: 'out2', type: 'output', name: '失败' },
        ],
      },
      {
        id: '超宽节点',
        position: { x: 550, y: 50 },
        port: [
          { id: 'in', type: 'input', name: '输入' },
          { id: 'out', type: 'output', name: '输出' },
        ],
      },
      {
        id: '超高节点',
        position: { x: 550, y: 180 },
        port: [
          { id: 'in', type: 'input', name: '输入' },
          { id: 'out', type: 'output', name: '输出' },
        ],
      },
      {
        id: '结束',
        position: { x: 850, y: 150 },
        port: [{ id: 'in', type: 'input', name: '输入' }],
      },
    ],
    edges: [
      {
        id: 'e1',
        source: { id: '小节点', portId: 'out' },
        target: { id: '中等节点', portId: 'in' },
      },
      {
        id: 'e2',
        source: { id: '小节点', portId: 'out' },
        target: { id: '大节点', portId: 'in' },
      },
      {
        id: 'e3',
        source: { id: '中等节点', portId: 'out' },
        target: { id: '超宽节点', portId: 'in' },
      },
      {
        id: 'e4',
        source: { id: '大节点', portId: 'out1' },
        target: { id: '超高节点', portId: 'in' },
      },
      {
        id: 'e5',
        source: { id: '超宽节点', portId: 'out' },
        target: { id: '结束', portId: 'in' },
      },
      {
        id: 'e6',
        source: { id: '超高节点', portId: 'out' },
        target: { id: '结束', portId: 'in' },
      },
    ],
  })

  const variableSizeRender = (node: FlowNodeValue) => {
    // 不同节点使用不同的尺寸
    const sizeStyles: Record<
      string,
      { width: string; height: string; padding: string }
    > = {
      小节点: { width: '80px', height: '40px', padding: '4px' },
      中等节点: { width: '140px', height: '60px', padding: '8px' },
      大节点: { width: '180px', height: '100px', padding: '12px' },
      超宽节点: { width: '280px', height: '50px', padding: '8px' },
      超高节点: { width: '100px', height: '160px', padding: '8px' },
      结束: { width: '100px', height: '50px', padding: '8px' },
    }

    const colors: Record<string, string> = {
      小节点: 'bg-green-100 border-green-300',
      中等节点: 'bg-blue-100 border-blue-300',
      大节点: 'bg-purple-100 border-purple-300',
      超宽节点: 'bg-amber-100 border-amber-300',
      超高节点: 'bg-pink-100 border-pink-300',
      结束: 'bg-red-100 border-red-300',
    }

    const descriptions: Record<string, string> = {
      小节点: '紧凑',
      中等节点: '标准大小的节点',
      大节点: '包含更多内容的节点\n支持多行文本显示',
      超宽节点: '这是一个非常宽的节点，用于显示长标题或横向排列的内容',
      超高节点: '垂直\n方向\n展示\n更多\n信息',
      结束: '完成',
    }

    const style = sizeStyles[node.id] || {
      width: '120px',
      height: '40px',
      padding: '8px',
    }
    const color = colors[node.id] || 'bg-gray-100 border-gray-300'

    return (
      <div
        className={`flex flex-col items-center justify-center border-2 ${color}`}
        style={{
          width: style.width,
          height: style.height,
          padding: style.padding,
        }}
      >
        <span className='text-xs font-bold'>{node.id}</span>
        <span className='text-muted-foreground mt-1 text-center text-[10px] whitespace-pre-wrap'>
          {descriptions[node.id]}
        </span>
      </div>
    )
  }

  const [nodeCounter, setNodeCounter] = useState(1)

  return (
    <div className='flex h-screen w-full flex-col'>
      <div className='bg-muted/50 border-b p-3'>
        <h3 className='font-medium'>不同尺寸节点示例</h3>
        <p className='text-muted-foreground text-sm'>
          展示节点可以根据内容自动适应不同尺寸。连线会自动连接到正确的端口位置。点击「优化布局」查看自动排列效果。
        </p>
      </div>
      <div className='min-h-0 flex-1'>
        <Flow
          value={value}
          onChange={setValue}
          onNodeRender={variableSizeRender}
          onCreateRender={({ addNode }) => (
            <div className='flex flex-col gap-1 p-2'>
              <button
                className='hover:bg-accent rounded-md px-3 py-1.5 text-left text-sm'
                onClick={() => {
                  addNode({ id: `节点-${nodeCounter}` })
                  setNodeCounter((c) => c + 1)
                }}
              >
                ➕ 添加节点
              </button>
            </div>
          )}
        />
      </div>
    </div>
  )
}

/** 交互说明 */
export const InteractionGuide: Story = () => {
  const [value, setValue] = useState<FlowValue>(initialValue)
  const [nodeCounter, setNodeCounter] = useState(1)

  return (
    <div className='flex h-screen w-full flex-col'>
      <div className='bg-muted/50 border-b p-4'>
        <h3 className='mb-2 font-medium'>交互指南</h3>
        <ul className='text-muted-foreground space-y-1 text-sm'>
          <li>
            ➕ <strong>添加节点</strong>
            ：悬停工具栏左侧的加号按钮，或悬停在输出端口上点击加号
          </li>
          <li>
            🔗 <strong>快速添加</strong>
            ：从输出端口拖出连线到空白处松开，显示添加面板
          </li>
          <li>
            🖱️ <strong>拖拽画布</strong>：在空白处按住鼠标左键拖动
          </li>
          <li>
            🔍 <strong>缩放</strong>：使用鼠标滚轮或底部工具栏按钮
          </li>
          <li>
            📦 <strong>移动节点</strong>：拖拽节点到新位置
          </li>
          <li>
            🔗 <strong>创建连线</strong>：从端口拖拽到另一个端口
          </li>
          <li>
            🗑️ <strong>删除</strong>：选中节点或连线后按 Delete/Backspace
          </li>
          <li>
            📐 <strong>优化布局</strong>：点击工具栏的布局按钮自动排列
          </li>
          <li>
            🎯 <strong>适应视图</strong>：点击工具栏的最大化按钮居中显示
          </li>
        </ul>
      </div>
      <div className='min-h-0 flex-1'>
        <Flow
          value={value}
          onChange={setValue}
          onNodeRender={renderNode}
          onCreateRender={({ addNode }) => (
            <div className='flex flex-col gap-1 p-2'>
              <button
                className='hover:bg-accent rounded-md px-3 py-1.5 text-left text-sm'
                onClick={() => {
                  addNode({ id: `新节点-${nodeCounter}` })
                  setNodeCounter((c) => c + 1)
                }}
              >
                ➕ 添加节点
              </button>
            </div>
          )}
        />
      </div>
    </div>
  )
}
