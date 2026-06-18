import { Meta, StoryFn } from '@storybook/react-vite'

import { DragDropProvider, DragList } from '@/dragList'
import React, { useState } from 'react'
import { InsertCursorProvider } from '@/insertCursor'

const meta = {
  title: 'Advanced/DragList',
  component: DragList,
  argTypes: {},
  args: {},
} satisfies Meta<typeof DragList>

export default meta

type Story = StoryFn<typeof DragList>

// 默认拖拽列表
export const Default: Story = () => {
  const [data, setData] = useState<any>([
    { id: '1', name: '项目 1' },
    { id: '2', name: '项目 2' },
    { id: '3', name: '项目 3' },
    { id: '4', name: '项目 4' },
  ])
  return (
    <InsertCursorProvider>
      <div style={{ width: 300 }}>
        <DragDropProvider>
          <DragList
            data={data}
            onChange={setData}
            onItemRender={({ item: { name }, dragHandle }) => (
              <div className='mb-1 flex items-center rounded border bg-white p-2'>
                {dragHandle}
                <span className='ml-2'>{name}</span>
              </div>
            )}
          />
        </DragDropProvider>
      </div>
    </InsertCursorProvider>
  )
}

// 嵌套列表
const NestedGroup = ({
  group,
  dragHandle,
  onChildrenChange,
}: {
  group: any
  dragHandle: React.ReactNode
  onChildrenChange: (nextChildren: any[]) => void
}) => {
  return (
    <div className='mb-2 rounded border bg-white p-2'>
      <div className='flex items-center'>
        {dragHandle}
        <span className='ml-2 font-medium'>{group.name}</span>
      </div>
      {group.type === 'group' && (
        <div className='mt-2 rounded border bg-gray-50 p-2'>
          <DragList
            data={group.children}
            onChange={onChildrenChange}
            onItemRender={({ item: child, dragHandle: childDrag }) => (
              <div className='mb-1 flex items-center rounded border bg-white p-2'>
                {childDrag}
                <span className='ml-2'>{child.name}</span>
              </div>
            )}
          />
        </div>
      )}
    </div>
  )
}

export const Nested: Story = () => {
  const [data, setData] = useState<any>([
    {
      type: 'leaf',
      id: 'leaf-1',
      name: '项目 A',
    },
    {
      type: 'group',
      id: 'group-2',
      name: '分组 B',
      children: [
        { id: 'b-1', name: '子项 B-1' },
        { id: 'b-2', name: '子项 B-2' },
        { id: 'b-3', name: '子项 B-3' },
      ],
    },
  ])

  const updateChildren = (groupId: string, nextChildren: any[]) => {
    setData((prev: any[]) =>
      prev.map((group) =>
        group.id === groupId ? { ...group, children: nextChildren } : group
      )
    )
  }

  return (
    <InsertCursorProvider>
      <div style={{ width: 420 }}>
        <DragDropProvider>
          <DragList
            data={data}
            onChange={setData}
            onItemRender={({ item, dragHandle }) => (
              <NestedGroup
                group={item}
                dragHandle={dragHandle}
                onChildrenChange={(nextChildren) =>
                  updateChildren(item.id, nextChildren)
                }
              />
            )}
          />
        </DragDropProvider>
      </div>
    </InsertCursorProvider>
  )
}

// 两个列表间拖拽
export const TwoLists: Story = () => {
  const [data1, setData1] = useState<any>([
    { id: 'liubei', name: '刘备' },
    { id: 'guanyu', name: '关羽' },
    { id: 'zhangfei', name: '张飞' },
  ])
  const [data2, setData2] = useState<any>([
    { id: 'zhangsan', name: '张三' },
    { id: 'lisi', name: '李四' },
    { id: 'wangwu', name: '王五' },
  ])
  return (
    <InsertCursorProvider>
      <div className='flex gap-4' style={{ width: 600 }}>
        <DragDropProvider>
          <div className='flex-1'>
            <div className='mb-2 text-sm font-medium'>列表 A</div>
            <div className='min-h-[200px] rounded border bg-blue-50 p-2'>
              <DragList
                data={data1}
                onChange={setData1}
                onItemRender={({ item: { name }, dragHandle }) => (
                  <div className='mb-1 flex items-center rounded border bg-white p-2'>
                    {dragHandle}
                    <span className='ml-2'>{name}</span>
                  </div>
                )}
              />
            </div>
          </div>
          <div className='flex-1'>
            <div className='mb-2 text-sm font-medium'>列表 B</div>
            <div className='min-h-[200px] rounded border bg-green-50 p-2'>
              <DragList
                data={data2}
                onChange={setData2}
                onItemRender={({ item: { name }, dragHandle }) => (
                  <div className='mb-1 flex items-center rounded border bg-white p-2'>
                    {dragHandle}
                    <span className='ml-2'>{name}</span>
                  </div>
                )}
              />
            </div>
          </div>
        </DragDropProvider>
      </div>
    </InsertCursorProvider>
  )
}

// 带插入光标
export const WithInsertCursor: Story = () => {
  const [data1, setData1] = useState<any>([
    { id: '1', name: '任务 1' },
    { id: '2', name: '任务 2' },
    { id: '3', name: '任务 3' },
  ])
  const [data2, setData2] = useState<any>([
    { id: '4', name: '任务 4' },
    { id: '5', name: '任务 5' },
  ])
  return (
    <InsertCursorProvider>
      <div className='flex gap-4' style={{ width: 600 }}>
        <DragDropProvider>
          <div className='flex-1'>
            <div className='mb-2 text-sm font-medium'>待办</div>
            <div className='min-h-[200px] rounded border p-2'>
              <DragList
                data={data1}
                onChange={setData1}
                onItemRender={({ item: { name }, dragHandle }) => (
                  <div className='mb-1 flex items-center rounded border bg-white p-2'>
                    {dragHandle}
                    <span className='ml-2'>{name}</span>
                  </div>
                )}
              />
            </div>
          </div>
          <div className='flex-1'>
            <div className='mb-2 text-sm font-medium'>进行中（带插入光标）</div>
            <div className='min-h-[200px] rounded border p-2'>
              <DragList
                data={data2}
                insertCursor
                onChange={setData2}
                onItemRender={({ item: { name }, dragHandle }) => (
                  <div className='mb-1 flex items-center rounded border bg-white p-2'>
                    {dragHandle}
                    <span className='ml-2'>{name}</span>
                  </div>
                )}
              />
            </div>
          </div>
        </DragDropProvider>
      </div>
    </InsertCursorProvider>
  )
}

// 自定义渲染
export const CustomRender: Story = () => {
  const [data, setData] = useState<any>([
    { id: '1', name: '设计稿评审', status: 'done', priority: 'high' },
    { id: '2', name: '前端开发', status: 'doing', priority: 'high' },
    { id: '3', name: '接口联调', status: 'todo', priority: 'medium' },
    { id: '4', name: '测试验收', status: 'todo', priority: 'low' },
  ])

  const priorityColors: any = {
    high: 'bg-red-100 text-red-600',
    medium: 'bg-yellow-100 text-yellow-600',
    low: 'bg-green-100 text-green-600',
  }

  return (
    <InsertCursorProvider>
      <div style={{ width: 350 }}>
        <DragDropProvider>
          <DragList
            data={data}
            onChange={setData}
            onItemRender={({ item, dragHandle }) => (
              <div className='mb-2 flex items-center rounded border bg-white p-3 shadow-sm'>
                {dragHandle}
                <div className='ml-2 flex-1'>
                  <div className='font-medium'>{item.name}</div>
                  <div className='mt-1 flex items-center gap-2'>
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${priorityColors[item.priority]}`}
                    >
                      {item.priority === 'high'
                        ? '高'
                        : item.priority === 'medium'
                          ? '中'
                          : '低'}
                    </span>
                    <span className='text-muted-foreground text-xs'>
                      {item.status === 'done'
                        ? '已完成'
                        : item.status === 'doing'
                          ? '进行中'
                          : '待处理'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          />
        </DragDropProvider>
      </div>
    </InsertCursorProvider>
  )
}

// 自定义分隔线
export const CustomDivider: Story = () => {
  const [data, setData] = useState<any>([
    { id: '1', name: '第一项' },
    { id: '2', name: '第二项' },
    { id: '3', name: '第三项' },
  ])
  return (
    <InsertCursorProvider>
      <div style={{ width: 300 }}>
        <DragDropProvider>
          <DragList
            data={data}
            onChange={setData}
            onItemRender={({ item: { name }, dragHandle }) => (
              <div className='mb-1 flex items-center rounded border bg-white p-2'>
                {dragHandle}
                <span className='ml-2'>{name}</span>
              </div>
            )}
            onDividerRender={() => (
              <div className='my-1 h-1 rounded bg-blue-300' />
            )}
          />
        </DragDropProvider>
      </div>
    </InsertCursorProvider>
  )
}

// 看板样式
export const KanbanStyle: Story = () => {
  const [todoData, setTodoData] = useState<any>([
    { id: '1', name: '需求分析' },
    { id: '2', name: '技术方案' },
  ])
  const [doingData, setDoingData] = useState<any>([
    { id: '3', name: '页面开发' },
  ])
  const [doneData, setDoneData] = useState<any>([{ id: '4', name: '项目立项' }])

  const renderItem = ({ item, dragHandle }: any) => (
    <div className='mb-2 flex items-center rounded border bg-white p-3 shadow-sm'>
      {dragHandle}
      <span className='ml-2'>{item.name}</span>
    </div>
  )

  return (
    <InsertCursorProvider>
      <div className='flex gap-4' style={{ width: 900 }}>
        <DragDropProvider>
          <div className='flex-1'>
            <div className='mb-3 flex items-center gap-2'>
              <div className='h-3 w-3 rounded-full bg-gray-400' />
              <span className='font-medium'>待办</span>
              <span className='text-muted-foreground text-sm'>
                ({todoData.length})
              </span>
            </div>
            <div className='min-h-[300px] rounded border bg-gray-50 p-3'>
              <DragList
                data={todoData}
                onChange={setTodoData}
                onItemRender={renderItem}
              />
            </div>
          </div>
          <div className='flex-1'>
            <div className='mb-3 flex items-center gap-2'>
              <div className='h-3 w-3 rounded-full bg-blue-400' />
              <span className='font-medium'>进行中</span>
              <span className='text-muted-foreground text-sm'>
                ({doingData.length})
              </span>
            </div>
            <div className='min-h-[300px] rounded border bg-blue-50 p-3'>
              <DragList
                data={doingData}
                onChange={setDoingData}
                onItemRender={renderItem}
              />
            </div>
          </div>
          <div className='flex-1'>
            <div className='mb-3 flex items-center gap-2'>
              <div className='h-3 w-3 rounded-full bg-green-400' />
              <span className='font-medium'>已完成</span>
              <span className='text-muted-foreground text-sm'>
                ({doneData.length})
              </span>
            </div>
            <div className='min-h-[300px] rounded border bg-green-50 p-3'>
              <DragList
                data={doneData}
                onChange={setDoneData}
                onItemRender={renderItem}
              />
            </div>
          </div>
        </DragDropProvider>
      </div>
    </InsertCursorProvider>
  )
}
