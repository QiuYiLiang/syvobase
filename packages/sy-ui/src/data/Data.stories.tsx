import { Meta, StoryObj } from '@storybook/react-vite'
import { Data } from './Data'
import { FilterGroupValue, opItems } from '@/filter'

const meta = {
  title: 'Advanced/Data',
  component: Data,
  argTypes: {},
  args: {},
} satisfies Meta<typeof Data>

export default meta

type Story = StoryObj<typeof meta>
const filterValue: FilterGroupValue = {
  // op 操作符
  op: 'and',
  // 有 children 代表分组
  items: [
    {
      // 左值
      left: 'a',
      // 比较符
      op: 'eq',
      // 右值
      right: '1',
    },
    {
      left: 'b',
      op: 'in',
      right: '2',
    },
    {
      op: 'or',
      items: [
        {
          left: 'c',
          op: 'less',
          right: '1',
        },
        {
          left: 'd',
          op: 'less',
          right: '3',
        },
      ],
    },
  ],
}

const opsMap = {
  a: ['in', 'notIn', 'between'],
  b: ['like', 'notLike'],
}

const presetsMap = {
  a: [
    { value: { op: 'between', right: [1, 100] }, name: '1-100' },
    { value: { op: 'between', right: [100, 200] }, name: '100-200' },
    { value: { op: 'between', right: [200, 500] }, name: '200-500' },
  ],
}

export const Default: Story = {
  args: {} as any,
  render() {
    return (
      <Data
        style={{
          height: '100%',
          width: '100%',
        }}
        filter={{
          defaultValue: filterValue,
          left: {
            type: 'select',
            items: [
              {
                id: 'a',
                name: 'a',
              },
              {
                id: 'b',
                name: 'b',
              },
            ],
          },
          op: ({ left }) => ({
            type: 'select',
            items: opItems.filter(({ id }) =>
              (opsMap[left] ?? []).includes(id)
            ),
          }),
          right: ({ op }) => {
            if (op === 'between') {
              return {
                type: 'number',
                between: true,
              }
            }
            return {
              type: 'text',
            }
          },
          getPresets: ({ left }) => {
            return presetsMap[left]
          },
          style: {
            maxHeight: 100,
          },
        }}
        toolbar={{
          left: [
            {
              name: '批量删除',
            },
          ],
          right: [
            {
              name: '新建',
            },
            {
              name: '导出',
            },
            {
              name: '更多',
              items: [
                {
                  name: '测试按钮1',
                },
                {
                  name: '测试按钮2',
                },
              ],
            },
          ],
        }}
        pagination={{
          index: 0,
          total: 200,
          sizeData: [10, 20, 50, 200],
        }}
      >
        <div
          style={{
            height: '100px',
          }}
        >
          数据
        </div>
      </Data>
    )
  },
}
