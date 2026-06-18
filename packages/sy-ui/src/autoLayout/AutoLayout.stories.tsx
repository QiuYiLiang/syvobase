import { Meta, StoryObj } from '@storybook/react-vite'
import { AutoLayout } from '@/autoLayout'
import { useState } from 'react'
import { AutoLayoutAdd } from './AutoLayoutAdd'

const meta = {
  title: 'Layout/AutoLayout',
  component: AutoLayout,
  argTypes: {},
  args: {},
} satisfies Meta<typeof AutoLayout>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: [
      {
        x: 0,
        y: 0,
        w: 10,
        h: 100,
        id: 'comp1',
      },
      {
        x: 20,
        y: 0,
        w: 20,
        h: 60,
        id: 'comp2',
      },
    ],
    onItemRender: ({ item: { id } }) => (
      <div
        style={{
          border: '1px solid',
          width: '100%',
          height: '100%',
        }}
      >
        {id}
      </div>
    ),
  },
}

export const TowLayout: Story = {
  args: {} as any,
  render() {
    const [layout1, setLayout1] = useState([
      {
        x: 0,
        y: 0,
        w: 10,
        h: 100,
        id: 'comp1',
      },
      {
        x: 20,
        y: 0,
        w: 20,
        h: 60,
        id: 'comp2',
      },
    ])
    const [layout2, setLayout2] = useState([
      {
        x: 0,
        y: 0,
        w: 10,
        h: 50,
        id: 'comp3',
      },
    ])
    return (
      <>
        <AutoLayout
          style={{
            border: '1px solid red',
          }}
          value={layout1}
          onChange={setLayout1}
          onItemRender={({ item: { id } }) => (
            <div
              style={{
                width: '100%',
                height: '100%',
              }}
            >
              {id}
            </div>
          )}
        />
        <AutoLayout
          style={{
            border: '1px solid red',
          }}
          value={layout2}
          onChange={setLayout2}
          onItemRender={({ item: { id } }) => (
            <div
              style={{
                width: '100%',
                height: '100%',
              }}
            >
              {id}
            </div>
          )}
        />
      </>
    )
  },
}

export const Add: Story = {
  args: {} as any,
  render() {
    const [layout1, setLayout1] = useState([
      {
        x: 0,
        y: 0,
        w: 10,
        h: 100,
        id: 'comp1',
      },
      {
        x: 20,
        y: 0,
        w: 20,
        h: 60,
        id: 'comp2',
      },
    ])
    const [layout2, setLayout2] = useState([
      {
        x: 0,
        y: 0,
        w: 10,
        h: 50,
        id: 'comp3',
      },
    ])
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
          }}
        >
          <AutoLayoutAdd
            onAdd={() => {
              return Date.now().toString()
            }}
          >
            张三
          </AutoLayoutAdd>
        </div>
        <AutoLayout
          value={layout1}
          onChange={setLayout1}
          onItemRender={({ item: { id } }) => (
            <div
              style={{
                width: '100%',
                height: '100%',
              }}
            >
              {id}
            </div>
          )}
        />
        <AutoLayout
          value={layout2}
          onChange={setLayout2}
          onItemRender={({ item: { id } }) => (
            <div
              style={{
                width: '100%',
                height: '100%',
              }}
            >
              {id}
            </div>
          )}
        />
      </div>
    )
  },
}

const data1 = [
  { id: 'item-1', x: 0, y: 0, w: 20, h: 30 },
  { id: 'item-2', x: 0, y: 40, w: 20, h: 50 },
  { id: 'item-3', x: 40, y: 50, w: 40, h: 120 },
]

const data2 = [
  { id: 'item-4', x: 0, y: 0, w: 20, h: 30 },
  { id: 'item-5', x: 0, y: 80, w: 20, h: 50 },
]

const data3 = [
  { id: 'item-6', x: 0, y: 0, w: 20, h: 30 },
  { id: 'item-7', x: 0, y: 80, w: 20, h: 50 },
]

const Items3 = ({ item }: { item: any }) => {
  const [items3, setItems3] = useState(data3)
  return (
    <div>
      {item.id}
      位置: ({item.x}%, {item.y}px)
      <br />
      大小: {item.w}% × {item.h}px
      <div
        style={{
          height: '66px',
        }}
      >
        <AutoLayout
          value={items3}
          onChange={setItems3}
          onItemRender={({ item }: any) => {
            return (
              <div>
                {item.id}
                位置: ({item.x}%, {item.y}px)
                <br />
                大小: {item.w}% × {item.h}px
              </div>
            )
          }}
        />
      </div>
    </div>
  )
}

export const NestedLayout: Story = {
  args: {} as any,
  render() {
    const [items1, setItems1] = useState(data1)
    const [items2, setItems2] = useState(data2)

    const onItemRender = ({ item }: any) => {
      if (item.id === 'item-3') {
        return <Items3 item={item} />
      }
      return (
        <div>
          {item.id}
          位置: ({item.x}%, {item.y}px)
          <br />
          大小: {item.w}% × {item.h}px
        </div>
      )
    }

    return (
      <div
        style={{
          height: '100%',
          width: '100%',
        }}
      >
        <div
          style={{
            margin: '0 0 6px 0',
          }}
        >
          <AutoLayout
            value={items1}
            onChange={setItems1}
            onItemRender={onItemRender}
          />
        </div>
        <div>
          <AutoLayout
            value={items2}
            onChange={setItems2}
            onItemRender={onItemRender}
          />
        </div>
      </div>
    )
  },
}

export const PC: Story = {
  args: {
    value: [
      {
        id: 'testRow.f_age',
        x: 50,
        y: 0,
        w: 50,
        h: 770,
      },
      {
        id: 'testRow.f_gender',
        x: 0,
        y: 273,
        w: 50,
        h: 610,
      },
      {
        id: 'testSelect',
        x: 0,
        y: 100,
        w: 50,
        h: 60,
      },
    ],
    style: {
      width: '100%',
      height: '100%',
    },
    readMode: true,
    onItemRender: ({ item: { id } }) => (
      <div
        style={{
          border: '1px solid',
          width: '100%',
          height: '100%',
        }}
      >
        {id}
      </div>
    ),
  },
}

export const Mobile: Story = {
  args: {
    value: [
      {
        x: 0,
        y: 0,
        w: 10,
        h: 50,
        id: 'comp1',
      },
      {
        x: 20,
        y: 0,
        w: 20,
        h: 60,
        id: 'comp2',
      },
    ],
    style: {
      width: 1000,
      height: 1000,
    },
    readMode: true,
    renderType: 'mobile',
    onItemRender: ({ item: { id } }) => (
      <div
        style={{
          border: '1px solid',
          width: '100%',
          height: '100%',
        }}
      >
        {id}
      </div>
    ),
  },
}

export const Editor: Story = {
  args: {
    defaultValue: [
      {
        id: 'form.f_text',
        x: 0,
        y: 0,
        w: 50,
        h: 100,
      },
      {
        id: 'form.f_textarea',
        x: 50,
        y: 0,
        w: 50,
        h: 100,
      },
      {
        id: 'form.f_richtext',
        x: 0,
        y: 100,
        w: 50,
        h: 370,
      },
      {
        id: 'form.f_qrcode',
        x: 50,
        y: 100,
        w: 50,
        h: 100,
      },
      {
        id: 'form.f_password',
        x: 0,
        y: 470,
        w: 50,
        h: 100,
      },
      {
        id: 'form.f_colorPicker',
        x: 50,
        y: 200,
        w: 50,
        h: 100,
      },
      {
        id: 'form.f_mind',
        x: 0,
        y: 570,
        w: 50,
        h: 650,
      },
      {
        id: 'form.f_draw',
        x: 50,
        y: 300,
        w: 50,
        h: 100,
      },
      {
        id: 'form.f_number',
        x: 0,
        y: 1220,
        w: 50,
        h: 100,
      },
      {
        id: 'form.f_select',
        x: 50,
        y: 400,
        w: 50,
        h: 100,
      },
      {
        id: 'form.f_radioGroup',
        x: 0,
        y: 1320,
        w: 50,
        h: 100,
      },
      {
        id: 'form.f_tagGroup',
        x: 50,
        y: 500,
        w: 50,
        h: 100,
      },
      {
        id: 'form.f_date',
        x: 0,
        y: 1420,
        w: 50,
        h: 100,
      },
      {
        id: 'form.f_file',
        x: 50,
        y: 600,
        w: 50,
        h: 100,
      },
      {
        id: 'form.f_increment',
        x: 0,
        y: 1520,
        w: 50,
        h: 100,
      },
      {
        id: 'form.f_location',
        x: 50,
        y: 700,
        w: 50,
        h: 100,
      },
      {
        id: 'form.f_popupSelect',
        x: 0,
        y: 1620,
        w: 50,
        h: 100,
      },
      {
        id: 'toolbar1',
        x: 0,
        y: 1720,
        w: 100,
        h: 60,
      },
    ],
    style: {
      width: 1000,
      height: 1000,
    },
    onItemRender: ({ item: { id } }) => (
      <div
        style={{
          border: '1px solid',
          width: '100%',
          height: '100%',
        }}
      >
        {id}
      </div>
    ),
  },
}
