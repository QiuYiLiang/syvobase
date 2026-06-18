import { Meta, StoryObj } from '@storybook/react-vite'
import { Table, TableModel } from '@/table'
import { useEffect, useRef, useState } from 'react'
import { Dict } from '@syvobase/utils'
import { Text } from '@/text'
import { FilterConditions } from './shared'
import { Button } from '@/button'
import { useMount } from '@/utils'
import { FilterGroupValue } from '@/filter'
import { opItems } from '@/filter/shared'

const meta = {
  title: 'Advanced/Table',
  component: Table,
  argTypes: {},
  args: {},
} satisfies Meta<typeof Table>

export default meta

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

type Story = StoryObj<typeof meta>
const arrayTree2 = [
  {
    id: '1',
    name: '菜单1',
    group: '分组1',
    group2: '子分组1',
    order: 1000,
    select: 'zhangsan,lisi',
    draw: '<mxfile host="embed.diagrams.net" agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36" version="24.7.14">\n  <diagram id="tV7_Zinx4Uz_pHsj--OC" name="第 1 页">\n    <mxGraphModel dx="314" dy="357" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0">\n      <root>\n        <mxCell id="0" />\n        <mxCell id="1" parent="0" />\n        <mxCell id="2" value="哈哈哈" style="rounded=0;whiteSpace=wrap;html=1;" parent="1" vertex="1">\n          <mxGeometry x="50" y="130" width="120" height="60" as="geometry" />\n        </mxCell>\n      </root>\n    </mxGraphModel>\n  </diagram>\n</mxfile>\n',
    text: `村里有个姑娘叫小芳长得好看又善良一双美丽的大眼睛辫子粗又长在回城之前的那个晚上你和我来到小河旁从没流过的泪水随着小河淌谢谢你给我的爱今生今世我不忘怀谢谢你给我的温柔伴我度过那个年代多少次我回回头看看走过的路衷心祝福你善良的姑娘多少次我回回头看看走过的路你站在小河旁`,
    password: 'hhhhhh',
    colorPicker: 'rgb(70,45,45)',
    checkboxGroup: ['zhangsan', 'lisi'],
    checkbox: true,
    number: 10086,
    qrcode: 'hhhhh',
    textarea: `村里有个姑娘叫小芳长得好看又善良一双美丽的大眼睛辫子粗又长在回城之前的那个晚上你和我来到小河旁从没流过的泪水随着小河淌谢谢你给我的爱今生今世我不忘怀谢谢你给我的温柔伴我度过那个年代多少次我回回头看看走过的路衷心祝福你善良的姑娘多少次我回回头看看走过的路你站在小河旁`,
    file: [
      {
        id: '1',
        name: '测试文件.txt',
      },
      {
        id: '2',
        name: '测试图片.png',
      },
      {
        id: '3',
        name: '测试视频.mp4',
      },
      {
        id: '4',
        name: '测试音频.mp3',
      },
      {
        id: '5',
        name: '测试文档.docx',
      },
      {
        id: '6',
        name: '测试表格.xlsx',
      },
      {
        id: '7',
        name: '测试幻灯片.pptx',
      },
    ],
    mindmap: {
      nodeData: {
        id: '21563846dead4fbc',
        topic: 'new topic',
        root: true,
        children: [
          {
            topic: '12313',
            id: '215638e9c12fe21d',
          },
        ],
      },
      arrows: [],
      summaries: [],
      direction: 1,
      theme: {
        name: 'Latte',
        palette: [
          '#dd7878',
          '#ea76cb',
          '#8839ef',
          '#e64553',
          '#fe640b',
          '#df8e1d',
          '#40a02b',
          '#209fb5',
          '#1e66f5',
          '#7287fd',
        ],
        cssVar: {
          '--main-color': '#444446',
          '--main-bgcolor': '#ffffff',
          '--color': '#777777',
          '--bgcolor': '#f6f6f6',
          '--panel-color': '#444446',
          '--panel-bgcolor': '#ffffff',
          '--panel-border-color': '#eaeaea',
        },
      },
    },
  },
  {
    id: '1-1',
    parentId: '1',
    name: '菜单1-1',
    group: '分组2',
    group2: '子分组2',
    order: 1000,
    password: '',
  },
  {
    id: '1-2',
    parentId: '1',
    name: '菜单1-2',
    group: '分组1',
    group2: '子分组1',
    order: 2000,
  },
  {
    id: '2',
    name: '村里有个姑娘叫小芳\n      长得好看又善良\n      一双美丽的大眼睛\n      辫子粗又长\n      在回城之前的那个晚上\n      你和我来到小河旁\n      从没流过的泪水\n      随着小河淌\n      谢谢你给我的爱\n      今生今世我不忘怀\n      谢谢你给我的温柔\n      伴我度过那个年代\n      多少次我回回头看看走过的路\n      衷心祝福你善良的姑娘\n      多少次我回回头看看走过的路\n      你站在小河旁\n    ',
    group: '分组1',
    group2: '子分组1',
    order: 2000,
  },
  {
    id: '2-1',
    parentId: '2',
    name: '菜单2-1',
    group: '分组1',
    group2: '子分组2',
    order: 1000,
  },
  {
    id: '2-1-1',
    parentId: '2-1',
    name: '菜单2-1-1',
    group: '分组2',
    group2: '子分组1',
    order: 1000,
  },
  {
    id: '2-2',
    parentId: '2',
    name: '菜单2-2',
    group: '分组2',
    group2: '子分组1',
    order: 2000,
  },
  {
    id: '3',
    name: '菜单3',
    group: '分组1',
    group2: '子分组1',
    order: 3000,
  },
]
const arrayTree = [
  {
    id: '1',
    name: '菜单1',
    group: '分组1',
    group2: '子分组1',
    order: 1000,
    isLeaf: false,
  },
  {
    id: '1-1',
    parentId: '1',
    name: '菜单1-1',
    group: '分组2',
    group2: '子分组2',
    order: 1000,
    isLeaf: true,
  },
  {
    id: '1-2',
    parentId: '1',
    name: '菜单1-2',
    group: '分组1',
    group2: '子分组1',
    order: 2000,
    isLeaf: true,
  },
  {
    id: '2',
    name: `村里有个姑娘叫小芳
      长得好看又善良
      一双美丽的大眼睛
      辫子粗又长
      在回城之前的那个晚上
      你和我来到小河旁
      从没流过的泪水
      随着小河淌
      谢谢你给我的爱
      今生今世我不忘怀
      谢谢你给我的温柔
      伴我度过那个年代
      多少次我回回头看看走过的路
      衷心祝福你善良的姑娘
      多少次我回回头看看走过的路
      你站在小河旁
    `,
    group: '分组1',
    group2: '子分组1',
    order: 2000,
    isLeaf: false,
  },
  {
    id: '2-1',
    parentId: '2',
    name: '菜单2-1',
    group: '分组1',
    group2: '子分组2',
    order: 1000,
    isLeaf: false,
  },
  {
    id: '2-1-1',
    parentId: '2-1',
    name: '菜单2-1-1',
    group: '分组2',
    group2: '子分组1',
    order: 1000,
    isLeaf: true,
  },
  {
    id: '2-2',
    parentId: '2',
    name: '菜单2-2',
    group: '分组2',
    group2: '子分组1',
    order: 2000,
    isLeaf: true,
  },
  {
    id: '3',
    name: '菜单3',
    group: '分组1',
    group2: '子分组1',
    order: 3000,
    isLeaf: true,
  },
]

export const Default: Story = {
  args: {} as any,
  render() {
    const [value, setValue] = useState<Dict[]>(arrayTree)
    const [selects, _setSelects] = useState<string[]>([])
    const setSelects = (value: string[]) => {
      _setSelects(value)
    }
    const ref = useRef<TableModel>(null)
    return (
      <>
        <Button
          onClick={async () => {
            console.log(await ref.current!.validation())
          }}
        >
          校验
        </Button>
        <Table
          draggable
          multiple
          readMode={false}
          editMode='cell'
          resize
          ref={ref}
          onColumnWidthsChange={(columnWidths) => {
            console.log(columnWidths)
          }}
          selects={selects}
          onSelectsChange={setSelects}
          columns={[
            {
              id: 'id',
              name: 'id',
              width: 50,
              fixed: 'left',
            },
            {
              id: 'name',
              name: '名称',
              help: '哈哈哈',
              control: {
                rules: [
                  {
                    trigger: 'blur',
                    required: true,
                  },
                  {
                    trigger: 'blur',
                    validator: (value) => {
                      if (value !== 'hhh') {
                        throw new Error('不是hhh')
                      }
                    },
                  },
                ],
              },
            },
            {
              id: 'sex',
              name: '性别',
              control: {
                type: 'select',
                items: [
                  { id: 'man', name: '男' },
                  { id: 'women', name: '女' },
                ],
              },
            },
          ]}
          value={value}
          onChange={setValue}
          rowToolbar={() => []}
        />
      </>
    )
  },
}

export const Tree: Story = {
  args: {} as any,
  render() {
    const [value, setValue] = useState<Dict[]>(arrayTree)
    const ref = useRef(null)
    return (
      <Table
        ref={ref}
        isTree
        draggable
        multiple
        checkStrictly
        defaultExpandLevel={2}
        columns={[
          {
            id: 'id',
            name: 'id',
          },
          {
            id: 'name',
            name: '名称',
            control: {},
          },
        ]}
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const Loading: Story = {
  args: {} as any,
  render() {
    const [value, setValue] = useState<Dict[]>(arrayTree)
    return (
      <Table
        loading
        isTree
        draggable
        multiple
        hideHeader
        columns={[
          {
            id: 'id',
          },
          {
            id: 'name',
            control: {},
          },
        ]}
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const Fixed: Story = {
  args: {} as any,
  render() {
    const [value, setValue] = useState<Dict[]>(arrayTree)
    const [filterConditions, setFilterConditions] = useState<FilterConditions>({
      name: {
        sort: 'asc',
      },
    })
    return (
      <Table
        draggable
        multiple
        border='cell'
        style={{
          width: '100%',
          height: '100%',
          padding: 8,
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
            // maxHeight: 100,
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
        filterConditions={filterConditions}
        onFilterConditionsChange={setFilterConditions}
        onCellStyle={(data) => {
          return data.node.id === '1'
            ? {
                background: 'cyan',
              }
            : {}
        }}
        columns={[
          {
            name: '分组1',
            help: 'hhh',
            children: [
              {
                id: 'id',
                name: 'id',
                width: 200,
                help: '哈哈哈',
                fixed: 'left',
              },
              {
                id: 'name',
                name: '名称',
                fixed: 'left',
                onStyle: (data) => {
                  return data.node.id === '3'
                    ? {
                        background: 'red',
                        color: 'white',
                      }
                    : {}
                },
                enabledSort: true,
                onFooterRender: () => '总计: 1000',
                onFilterRender: ({ value = '', setValue }) => (
                  <Text value={value} onChange={setValue} />
                ),
              },
            ],
          },
          {
            id: 'columnId1',
            name: '字段1',
          },
          {
            id: 'columnId2',
            name: '字段2',
          },
          {
            id: 'columnId3',
            name: '字段3',
          },
          {
            id: 'columnId4',
            name: '字段4',
          },
          {
            id: 'columnId5',
            name: '字段5',
          },
          {
            id: 'columnId6',
            name: '字段6',
          },
          {
            id: 'columnId7',
            name: '字段7',
          },
          {
            id: 'columnId8',
            name: '字段8',
          },
          {
            id: 'columnId9',
            name: '字段9',
          },
          {
            id: 'columnId10',
            name: '字段10',
          },
          {
            id: 'columnId11',
            name: '字段11',
          },
          {
            id: 'columnId12',
            name: '字段12',
          },
        ]}
        value={value}
        onChange={setValue}
        rowToolbar={(item) => {
          if (!item.isLeaf) {
            return []
          }
          return [
            ...(item.id !== '3'
              ? [
                  {
                    name: '编辑',
                    onClick: () => {
                      console.log(item)
                    },
                  },
                ]
              : []),
            {
              name: '删除',
            },
            {
              name: '更多',
              items: [
                {
                  name: '编辑',
                },
                {
                  name: '删除',
                  items: [
                    {
                      name: '编辑',
                    },
                    {
                      name: '删除',
                    },
                  ],
                },
              ],
            },
          ]
        }}
        onRefresh={() =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(undefined)
            }, 2000)
          })
        }
      />
    )
  },
}

export const Virtual: Story = {
  args: {} as any,
  render() {
    const [value, setValue] = useState<Dict[]>(() =>
      Array.from({ length: 10000 }).map((_, index) => ({
        id: index,
      }))
    )
    const [filterConditions, setFilterConditions] = useState<FilterConditions>({
      name: {
        sort: 'asc',
      },
    })
    return (
      <Table
        draggable
        multiple
        border='cell'
        style={{
          width: 800,
          height: 300,
        }}
        virtual={{
          vertical: true,
        }}
        filterConditions={filterConditions}
        onFilterConditionsChange={setFilterConditions}
        onCellStyle={(data) => {
          return data.node.id === '1'
            ? {
                background: 'cyan',
              }
            : {}
        }}
        columns={[
          {
            id: 'id',
            name: 'id',
            width: 200,
            fixed: 'left',
          },
          {
            id: 'name',
            name: '名称',
            fixed: 'left',
            onStyle: (data) => {
              return data.node.id === '3'
                ? {
                    background: 'red',
                    color: 'white',
                  }
                : {}
            },
            enabledSort: true,
            onFooterRender: () => '总计: 1000',
            onFilterRender: ({ value = '', setValue }) => (
              <Text value={value} onChange={setValue} />
            ),
          },
          {
            id: 'columnId1',
            name: '字段1',
          },
          {
            id: 'columnId2',
            name: '字段2',
          },
          {
            id: 'columnId3',
            name: '字段3',
          },
          {
            id: 'columnId4',
            name: '字段4',
          },
          {
            id: 'columnId5',
            name: '字段5',
          },
          {
            id: 'columnId6',
            name: '字段6',
          },
          {
            id: 'columnId7',
            name: '字段7',
          },
          {
            id: 'columnId8',
            name: '字段8',
          },
          {
            id: 'columnId9',
            name: '字段9',
          },
          {
            id: 'columnId10',
            name: '字段10',
          },
          {
            id: 'columnId11',
            name: '字段11',
          },
          {
            id: 'columnId12',
            name: '字段12',
          },
        ]}
        value={value}
        onChange={setValue}
        rowToolbar={(item) => {
          if (!item.isLeaf) {
            return []
          }
          return [
            ...(item.id !== '3'
              ? [
                  {
                    name: '编辑',
                    onClick: () => {
                      console.log(item)
                    },
                  },
                ]
              : []),
            {
              name: '删除',
            },
            {
              name: '更多',
              items: [
                {
                  name: '编辑',
                },
                {
                  name: '删除',
                  items: [
                    {
                      name: '编辑',
                    },
                    {
                      name: '删除',
                    },
                  ],
                },
              ],
            },
          ]
        }}
        onRefresh={() =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(undefined)
            }, 2000)
          })
        }
      />
    )
  },
}

export const Group: Story = {
  args: {} as any,
  render() {
    return (
      <Table
        draggable
        multiple
        group={['group', 'group2']}
        columns={[
          {
            id: 'id',
            name: 'id',
          },
          {
            id: 'name',
            name: '名称',
          },
          {
            id: 'group',
            name: '分组',
          },
          {
            id: 'group2',
            name: '分组2',
          },
        ]}
        value={arrayTree}
      />
    )
  },
}

const items = [
  {
    id: 'zhangsan',
    name: '张三',
  },
  {
    id: 'lisi',
    name: '李四',
  },
  {
    id: 'wangwu',
    name: '王五',
  },
]
const fullColumns = [
  {
    id: 'id',
    name: 'id',
  },
  {
    id: 'checkbox',
    name: 'checkbox',
    control: {
      type: 'checkbox',
      name: '测试',
    },
  },
  {
    id: 'checkboxGroup',
    name: 'checkboxGroup',
    control: {
      type: 'checkboxGroup',
      items,
    },
  },
  {
    id: 'colorPicker',
    name: 'colorPicker',
    control: {
      type: 'colorPicker',
    },
  },

  {
    id: 'number',
    name: 'number',
    control: {
      type: 'number',
    },
  },
  {
    id: 'otp',
    name: 'otp',
    control: {
      type: 'otp',
    },
  },
  {
    id: 'password',
    name: 'password',
    control: {
      type: 'password',
    },
  },
  {
    id: 'qrcode',
    name: 'qrcode',
    control: {
      type: 'qrcode',
    },
  },
  {
    id: 'select',
    name: 'select',
    control: {
      type: 'select',
      multiple: true,
      commaSplit: true,
      items,
    },
  },
  {
    id: 'switch',
    name: 'switch',
    control: {
      type: 'switch',
      items,
    },
  },
  {
    id: 'textarea',
    name: 'textarea',
    control: {
      type: 'textarea',
    },
  },
  {
    id: 'text',
    name: 'text',
    control: {
      type: 'text',
    },
  },
  {
    id: 'file',
    name: 'file',
    control: {
      type: 'file',
    },
  },
  {
    id: 'datePicker',
    name: 'datePicker',
    control: {
      type: 'datePicker',
    },
  },
  {
    id: 'draw',
    name: 'draw',
    control: {
      type: 'draw',
    },
  },
  {
    id: 'mindmap',
    name: 'mindmap',
    control: {
      type: 'mindmap',
    },
  },
]
export const Readonly: Story = {
  args: {} as any,
  render() {
    const [value, setValue] = useState<Dict[]>(() => arrayTree2)
    const ref = useRef<TableModel>(null)
    useEffect(() => {
      console.log(value)
    }, [value])
    return (
      <Table
        draggable
        multiple
        readMode={true}
        resize
        ref={ref}
        cellMaxHeight={80}
        style={{
          height: 200,
        }}
        columns={fullColumns}
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const Edit: Story = {
  args: {} as any,
  render() {
    const [value, setValue] = useState<Dict[]>(() => arrayTree2)
    const ref = useRef<TableModel>(null)
    useEffect(() => {
      console.log(value)
    }, [value])
    return (
      <Table
        draggable
        multiple
        readMode={false}
        resize
        ref={ref}
        style={{
          height: 200,
        }}
        editMode='cell'
        columns={fullColumns}
        value={value}
        onChange={setValue}
      />
    )
  },
}

function getData(parentId?: string) {
  return new Promise<Dict[]>((resolve) => {
    setTimeout(() => {
      resolve(arrayTree.filter((item) => item.parentId === parentId))
    }, 3000)
  })
}

export const AsyncTree: Story = {
  args: {} as any,
  render() {
    const [value, setValue] = useState<Dict[]>([])
    useMount(() => {
      getData().then((data) => {
        setValue(data)
      })
    })
    const ref = useRef(null)
    return (
      <Table
        ref={ref}
        isTree
        draggable
        multiple
        columns={[
          {
            id: 'id',
            name: 'id',
          },
          {
            id: 'name',
            name: 'name',
          },
        ]}
        value={value}
        onChange={setValue}
        onFetchChildren={async (node) => await getData(node.id)}
      />
    )
  },
}

// 甘特图示例数据 - 生成100条不定行高数据
const ganttData = (() => {
  const tasks: Dict[] = []
  const phases = ['规划', '设计', '开发', '测试', '部署', '维护']
  const statuses = ['未开始', '进行中', '已完成', '已延期']
  const priorities = ['低', '中', '高', '紧急']
  const assignees = ['张三', '李四', '王五', '赵六', '陈七', '周八']

  // 生成长短不一的描述文本
  const getDescription = (i: number) => {
    const texts = [
      '简短描述',
      '这是一个中等长度的任务描述，包含一些详细信息',
      '这是一个比较长的任务描述，\n需要多行显示，\n包含详细的任务说明和备注信息',
      '超长描述文本：这个任务需要完成多项工作，\n包括但不限于：\n1. 需求分析和调研\n2. 技术方案设计\n3. 代码开发和测试\n4. 文档编写和评审',
      '单行',
    ]
    return texts[i % texts.length]
  }

  for (let i = 1; i <= 100; i++) {
    const phaseIndex = Math.floor((i - 1) / 17) % phases.length
    const startOffset = Math.floor(Math.random() * 60)
    const duration = Math.floor(Math.random() * 20) + 3
    // 前10条中有5条没有日期，方便测试拖拽新增功能
    const hasDate = i > 10 ? i % 5 !== 0 : i % 2 === 0

    tasks.push({
      id: String(i),
      name: hasDate
        ? `${phases[phaseIndex]}任务 ${i}`
        : `【待排期】${phases[phaseIndex]}任务 ${i}`,
      description: getDescription(i),
      status: hasDate ? statuses[i % statuses.length] : '未开始',
      priority: priorities[i % priorities.length],
      assignee: assignees[i % assignees.length],
      budget: Math.floor(Math.random() * 100000) + 10000,
      startDate: hasDate ? new Date(2026, 0, 1 + startOffset) : undefined,
      endDate: hasDate
        ? new Date(2026, 0, 1 + startOffset + duration)
        : undefined,
      percentage: hasDate ? Math.floor(Math.random() * 101) : 0,
      order: i * 1000,
    })
  }

  return tasks
})()

export const WithGantt: Story = {
  args: {} as any,
  render() {
    const [value, setValue] = useState<Dict[]>(ganttData)
    const ref = useRef<TableModel>(null)

    return (
      <div className='h-full w-full'>
        <Table
          className='h-full'
          ref={ref}
          readMode={false}
          ganttMode='day'
          columns={[
            // 左侧固定列
            {
              id: 'id',
              name: 'ID',
              width: 60,
              fixed: 'left',
            },
            {
              id: 'name',
              name: '任务名称',
              width: 150,
              fixed: 'left',
            },
            // 多级表头 - 任务信息组
            {
              id: 'taskInfo',
              name: '任务信息',
              children: [
                {
                  id: 'description',
                  name: '描述',
                  width: 200,
                  onRender: ({ node }) => (
                    <div className='whitespace-pre-wrap'>
                      {node.data.description}
                    </div>
                  ),
                },
                {
                  id: 'status',
                  name: '状态',
                  width: 80,
                },
                {
                  id: 'priority',
                  name: '优先级',
                  width: 80,
                },
              ],
            },
            // 多级表头 - 资源信息组
            {
              id: 'resourceInfo',
              name: '资源信息',
              children: [
                {
                  id: 'assignee',
                  name: '负责人',
                  width: 80,
                },
                {
                  id: 'budget',
                  name: '预算',
                  width: 100,
                  onRender: ({ node }) =>
                    `¥${node.data.budget?.toLocaleString() ?? 0}`,
                },
              ],
            },
            // 右侧固定列
            {
              id: 'percentage',
              name: '进度',
              width: 80,
              fixed: 'right',
              onRender: ({ node }) => `${node.data.percentage ?? 0}%`,
            },
          ]}
          value={value}
          onChange={setValue}
          onRowClick={(node) => {
            console.log('Row clicked:', node)
          }}
        />
      </div>
    )
  },
}

// 资产负债表 - 标准小企业左右对照格式
// 左侧：资产（行次1-30）  右侧：负债和所有者权益（行次31-53）
// level 0=分类标题, 1=明细项, 2=其中子项, 2+=小计/合计/总计
const balanceSheetData: Dict[] = [
  {
    id: '1',
    order: 1000,
    leftItem: '流动资产：',
    leftLevel: 0,
    rightItem: '流动负债：',
    rightLevel: 0,
  },
  {
    id: '2',
    order: 2000,
    leftItem: '货币资金',
    leftLevel: 1,
    leftRowNum: 1,
    leftEnd: 79181,
    leftStart: 92181,
    rightItem: '短期借款',
    rightLevel: 1,
    rightRowNum: 31,
  },
  {
    id: '3',
    order: 3000,
    leftItem: '短期投资',
    leftLevel: 1,
    leftRowNum: 2,
    rightItem: '应付票据',
    rightLevel: 1,
    rightRowNum: 32,
  },
  {
    id: '4',
    order: 4000,
    leftItem: '应收票据',
    leftLevel: 1,
    leftRowNum: 3,
    rightItem: '应付账款',
    rightLevel: 1,
    rightRowNum: 33,
    rightEnd: 745845.94,
    rightStart: 49585,
  },
  {
    id: '5',
    order: 5000,
    leftItem: '应收账款',
    leftLevel: 1,
    leftRowNum: 4,
    leftEnd: 376511.23,
    leftStart: 362603.2,
    rightItem: '预收账款',
    rightLevel: 1,
    rightRowNum: 34,
  },
  {
    id: '6',
    order: 6000,
    leftItem: '预付账款',
    leftLevel: 1,
    leftRowNum: 5,
    rightItem: '应付职工薪酬',
    rightLevel: 1,
    rightRowNum: 35,
    rightEnd: 7855.2,
    rightStart: 7855.2,
  },
  {
    id: '7',
    order: 7000,
    leftItem: '应收股利',
    leftLevel: 1,
    leftRowNum: 6,
    rightItem: '应交税费',
    rightLevel: 1,
    rightRowNum: 36,
    rightEnd: -55404.58,
  },
  {
    id: '8',
    order: 8000,
    leftItem: '应收利息',
    leftLevel: 1,
    leftRowNum: 7,
    rightItem: '应付利息',
    rightLevel: 1,
    rightRowNum: 37,
  },
  {
    id: '9',
    order: 9000,
    leftItem: '其他应收款',
    leftLevel: 1,
    leftRowNum: 8,
    rightItem: '应付利润',
    rightLevel: 1,
    rightRowNum: 38,
  },
  {
    id: '10',
    order: 10000,
    leftItem: '存货',
    leftLevel: 1,
    leftRowNum: 9,
    leftEnd: 658524.32,
    leftStart: 22656,
    rightItem: '其他应付款',
    rightLevel: 1,
    rightRowNum: 39,
    rightEnd: 420000,
    rightStart: 420000,
  },
  {
    id: '11',
    order: 11000,
    leftItem: '其中：原材料',
    leftLevel: 2,
    leftRowNum: 10,
    leftEnd: 10000,
    rightItem: '其他流动负债',
    rightLevel: 1,
    rightRowNum: 40,
  },
  {
    id: '12',
    order: 12000,
    leftItem: '在产品',
    leftLevel: 2,
    leftRowNum: 11,
    rightItem: '流动负债合计',
    rightLevel: 2,
    rightRowNum: 41,
    rightEnd: 1118296.56,
    rightStart: 477440.2,
  },
  {
    id: '13',
    order: 13000,
    leftItem: '库存商品',
    leftLevel: 2,
    leftRowNum: 12,
    leftEnd: 648524.32,
    leftStart: 22656,
    rightItem: '非流动负债：',
    rightLevel: 0,
  },
  {
    id: '14',
    order: 14000,
    leftItem: '周转材料',
    leftLevel: 2,
    leftRowNum: 13,
    rightItem: '长期借款',
    rightLevel: 1,
    rightRowNum: 42,
  },
  {
    id: '15',
    order: 15000,
    leftItem: '其他流动资产',
    leftLevel: 1,
    leftRowNum: 14,
    rightItem: '长期应付款',
    rightLevel: 1,
    rightRowNum: 43,
  },
  {
    id: '16',
    order: 16000,
    leftItem: '流动资产合计',
    leftLevel: 2,
    leftRowNum: 15,
    leftEnd: 1114216.55,
    leftStart: 477440.2,
    rightItem: '递延收益',
    rightLevel: 1,
    rightRowNum: 44,
  },
  {
    id: '17',
    order: 17000,
    leftItem: '非流动资产：',
    leftLevel: 0,
    rightItem: '其他非流动负债',
    rightLevel: 1,
    rightRowNum: 45,
  },
  {
    id: '18',
    order: 18000,
    leftItem: '长期债券投资',
    leftLevel: 1,
    leftRowNum: 16,
    rightItem: '非流动负债合计',
    rightLevel: 2,
    rightRowNum: 46,
  },
  {
    id: '19',
    order: 19000,
    leftItem: '长期股权投资',
    leftLevel: 1,
    leftRowNum: 17,
    rightItem: '负债合计',
    rightLevel: 3,
    rightRowNum: 47,
    rightEnd: 1118296.56,
    rightStart: 477440.2,
  },
  {
    id: '20',
    order: 20000,
    leftItem: '固定资产原价',
    leftLevel: 1,
    leftRowNum: 18,
  },
  {
    id: '21',
    order: 21000,
    leftItem: '减：累计折旧',
    leftLevel: 1,
    leftRowNum: 19,
  },
  {
    id: '22',
    order: 22000,
    leftItem: '固定资产账面价值',
    leftLevel: 1,
    leftRowNum: 20,
  },
  {
    id: '23',
    order: 23000,
    leftItem: '在建工程',
    leftLevel: 1,
    leftRowNum: 21,
  },
  {
    id: '24',
    order: 24000,
    leftItem: '工程物资',
    leftLevel: 1,
    leftRowNum: 22,
  },
  {
    id: '25',
    order: 25000,
    leftItem: '固定资产清理',
    leftLevel: 1,
    leftRowNum: 23,
  },
  {
    id: '26',
    order: 26000,
    leftItem: '生产性生物资产',
    leftLevel: 1,
    leftRowNum: 24,
    rightItem: '所有者权益（或股东权益）：',
    rightLevel: 0,
  },
  {
    id: '27',
    order: 27000,
    leftItem: '无形资产',
    leftLevel: 1,
    leftRowNum: 25,
    rightItem: '实收资本（或股本）',
    rightLevel: 1,
    rightRowNum: 48,
  },
  {
    id: '28',
    order: 28000,
    leftItem: '开发支出',
    leftLevel: 1,
    leftRowNum: 26,
    rightItem: '资本公积',
    rightLevel: 1,
    rightRowNum: 49,
  },
  {
    id: '29',
    order: 29000,
    leftItem: '长期待摊费用',
    leftLevel: 1,
    leftRowNum: 27,
    rightItem: '盈余公积',
    rightLevel: 1,
    rightRowNum: 50,
  },
  {
    id: '30',
    order: 30000,
    leftItem: '其他非流动资产',
    leftLevel: 1,
    leftRowNum: 28,
    rightItem: '未分配利润',
    rightLevel: 1,
    rightRowNum: 51,
    rightEnd: -4080.01,
  },
  {
    id: '31',
    order: 31000,
    leftItem: '非流动资产合计',
    leftLevel: 2,
    leftRowNum: 29,
    rightItem: '所有者权益（或股东权益）合计',
    rightLevel: 2,
    rightRowNum: 52,
    rightEnd: -4080.01,
  },
  {
    id: '32',
    order: 32000,
    leftItem: '资产总计',
    leftLevel: 3,
    leftRowNum: 30,
    leftEnd: 1114216.55,
    leftStart: 477440.2,
    rightItem: '负债和所有者权益（或股东权益）总计',
    rightLevel: 3,
    rightRowNum: 53,
    rightEnd: 1114216.55,
    rightStart: 477440.2,
  },
]

// 金额格式化
const formatAmount = (val: number | undefined) => {
  if (val == null) return ''
  return val.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export const BalanceSheet: Story = {
  args: {} as any,
  render() {
    const [value, setValue] = useState<Dict[]>(balanceSheetData)

    return (
      <div className='flex h-full w-full flex-col'>
        <div className='py-4 text-center'>
          <h2 className='text-xl font-bold'>XX 科技有限公司</h2>
          <h3 className='text-lg'>资 产 负 债 表</h3>
          <p className='text-sm text-gray-500'>
            编制日期：2026年2月25日 &emsp; 单位：人民币元
          </p>
        </div>
        <Table
          className='flex-1'
          readMode
          border='cell'
          columns={[
            {
              id: 'leftItem',
              name: '资产',
              width: 200,
              onRender: ({ node }) => (
                <span
                  style={{
                    paddingLeft: (node.data.leftLevel ?? 0) * 24,
                  }}
                >
                  {node.data.leftItem}
                </span>
              ),
            },
            {
              id: 'leftRowNum',
              name: '行次',
              width: 60,
              onRender: ({ node }) => node.data.leftRowNum,
            },
            {
              id: 'leftEnd',
              name: '期末余额',
              width: 140,
              onRender: ({ node }) => formatAmount(node.data.leftEnd),
            },
            {
              id: 'leftStart',
              name: '年初余额',
              width: 140,
              onRender: ({ node }) => formatAmount(node.data.leftStart),
            },
            {
              id: 'rightItem',
              name: '负债和所有者权益（或股东权益）',
              width: 260,
              onRender: ({ node }) => (
                <span
                  style={{
                    paddingLeft: (node.data.rightLevel ?? 0) * 24,
                  }}
                >
                  {node.data.rightItem}
                </span>
              ),
            },
            {
              id: 'rightRowNum',
              name: '行次',
              width: 60,
              onRender: ({ node }) => node.data.rightRowNum,
            },
            {
              id: 'rightEnd',
              name: '期末余额',
              width: 140,
              onRender: ({ node }) => formatAmount(node.data.rightEnd),
            },
            {
              id: 'rightStart',
              name: '年初余额',
              width: 140,
              onRender: ({ node }) => formatAmount(node.data.rightStart),
            },
          ]}
          value={value}
          onChange={setValue}
        />
      </div>
    )
  },
}
