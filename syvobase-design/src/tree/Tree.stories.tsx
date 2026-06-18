import { Meta, StoryObj } from '@storybook/react-vite'

import { Tree } from '@/tree'
import { useState } from 'react'

const meta = {
  title: 'Advanced/Tree',
  component: Tree,
  argTypes: {},
  args: {},
} satisfies Meta<typeof Tree>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    toolbar: [
      {
        name: '新建',
        icon: 'Plus',
      },
      {
        name: '新建分组',
        icon: 'FolderPlus',
      },
    ],
    multiple: true,
    checkStrictly: true,
    rowToolbar: () => [
      {
        icon: 'Ellipsis',
        disabledDropdownIcon: true,
        items: [
          {
            name: '新建',
            icon: 'Plus',
          },
          {
            name: '新建分组',
            icon: 'FolderPlus',
          },
          {
            name: '删除',
            icon: 'Trash2',
          },
        ],
      },
    ],
    items: [
      {
        id: '1',
        name: '菜单1',
        type: 'function',
      },
      {
        id: '1-1',
        parentId: '1',
        name: '菜单1-1',
      },
      {
        id: '1-2',
        parentId: '1',
        name: '菜单1-2',
      },
      {
        id: '2',
        name: '菜单2',
      },
      {
        id: '2-1',
        parentId: '2',
        name: '菜单2-1',
      },
      {
        id: '2-1-1',
        parentId: '2-1',
        name: '菜单2-1-1',
      },
      {
        id: '2-2',
        parentId: '2',
        name: '菜单2-2',
      },
      {
        id: '3',
        name: '菜单3',
      },
    ],
    onIconRender: (e) => {
      if (e.node.data.type === 'function') {
        return (
          <div className='flex h-full w-5 cursor-pointer justify-center'>
            <div className='flex w-4 justify-center rounded bg-amber-100 text-[10px] text-slate-600'>
              F
            </div>
          </div>
        )
      }
      return null
    },
    value: ['c3-3', 'c2', 'c2-2', 'c1-1', 'c1'],
  },
  render(args: any) {
    const [selects, setSelects] = useState<string[]>([])

    return (
      <div
        style={{
          width: 200,
          border: '1px solid #666',
          borderRadius: 6,
          padding: 4,
        }}
      >
        <Tree {...args} value={selects} onChange={setSelects} />
      </div>
    )
  },
}
