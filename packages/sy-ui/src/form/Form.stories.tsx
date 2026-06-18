import { Meta, StoryObj } from '@storybook/react-vite'
import { Form } from '@/form'
import { useRef, useState } from 'react'
import { Icon } from '@/icon'
import { Dict } from '@syvobase/utils'
import { BaseInputModel } from '@/utils'

const meta = {
  title: 'Advanced/Form',
  component: Form,
  argTypes: {},
  args: {},
} satisfies Meta<typeof Form>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {} as any,
  render() {
    const ref = useRef<BaseInputModel>(null)

    const [value, setValue] = useState<Dict>({
      name: 'zhangsan',
      password: '888888',
    })
    return (
      <Form
        ref={ref}
        value={value}
        topLabel={false}
        items={[
          [
            {
              id: 'name',
              name: '用户名',
              help: '哈哈哈',
              control: {
                placeholder: '用户名',
                before: <Icon name='User' />,
                rules: [
                  {
                    trigger: 'blur',
                    required: true,
                  },
                ],
              },
            },
            {
              id: 'name2',
              name: '用户名2',
              control: {
                placeholder: '用户名2',
                rules: [
                  {
                    trigger: 'blur',
                    validator: (value) => {
                      if (value !== 'hhh') {
                        throw new Error('不是hhh')
                      }
                    },
                  },
                ],
                before: <Icon name='User' />,
              },
            },
            {
              id: 'a.b.c.d.prop1',
              name: '属性1',
              control: {
                placeholder: '属性1',
              },
            },
          ],
          {
            id: 'password',
            control: {
              type: 'password',
              placeholder: '密码',
              rules: [
                {
                  trigger: 'blur',
                  validator: (value) => {
                    if (value.length < 8) {
                      throw new Error('密码不能小于8位数')
                    }
                  },
                },
              ],
              before: <Icon name='KeyRound' />,
            },
          },
        ]}
        toolbar={[
          {
            name: '注册',
          },
          {
            name: '登陆',
            onClick: async () => {
              console.log(await ref.current!.validation())
            },
          },
        ]}
        onChange={(value) => {
          setValue(value)
        }}
      />
    )
  },
}

export const PropsForm: Story = {
  args: {} as any,
  render() {
    const ref = useRef<BaseInputModel>(null)

    const [value, setValue] = useState<Dict>({
      name: 'zhangsan',
      password: '888888',
    })
    return (
      <Form
        ref={ref}
        value={value}
        topLabel={false}
        style={{
          width: 300,
        }}
        items={[
          {
            type: 'tabs',
            full: true,
            items: [
              {
                id: 'props',
                name: '属性',
                items: [
                  {
                    type: 'collapse',
                    size: 'sm',
                    collapseType: 'collapse',
                    defaultValue: ['base'],
                    items: [
                      {
                        id: 'base',
                        name: '基础',
                        items: [
                          {
                            id: 'prop1',
                            name: '属性1',
                            control: {
                              type: 'text',
                            },
                          },
                          {
                            id: 'prop2',
                            name: '属性2',
                            control: {
                              type: 'text',
                            },
                          },
                          {
                            id: 'prop3',
                            name: '属性3',
                            control: {
                              type: 'text',
                            },
                          },
                        ],
                      },
                      {
                        id: 'advandced',
                        name: '高级',
                        items: [
                          {
                            id: 'prop4',
                            name: '属性4',
                            control: {
                              type: 'text',
                            },
                          },
                          {
                            id: 'prop5',
                            name: '属性5',
                            control: {
                              type: 'text',
                            },
                          },
                          {
                            id: 'prop6',
                            name: '属性6',
                            control: {
                              type: 'text',
                            },
                          },
                          {
                            id: 'prop7',
                            name: '属性7',
                            control: {
                              type: 'text',
                            },
                          },
                          {
                            id: 'prop8',
                            name: '属性8',
                            control: {
                              type: 'text',
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                id: 'event',
                name: '事件',
                items: [],
              },
            ],
          },
        ]}
        onChange={(value) => {
          setValue(value)
        }}
      />
    )
  },
}

export const AdvancedForm: Story = {
  args: {} as any,
  render() {
    const ref = useRef<BaseInputModel>(null)

    const [value, setValue] = useState<Dict>({
      name: 'zhangsan',
      password: '888888',
    })
    return (
      <Form
        ref={ref}
        value={value}
        topLabel={false}
        style={{
          width: 800,
        }}
        items={[
          {
            type: 'tabs',
            items: [
              {
                id: 'props',
                name: '标签1',
                items: [
                  {
                    type: 'collapse',
                    size: 'sm',
                    items: [
                      {
                        id: 'base',
                        name: '基础',
                        items: [
                          [
                            {
                              id: 'prop1',
                              name: '属性1',
                              control: {
                                type: 'text',
                                rules: [{ required: true }],
                              },
                            },
                            {
                              id: 'prop2',
                              name: '属性2',
                              control: {
                                type: 'text',
                                rules: [{ required: true }],
                              },
                            },
                          ],
                          [
                            {
                              id: 'prop3',
                              name: '属性3',
                              control: {
                                type: 'text',
                              },
                            },
                          ],
                        ],
                      },
                      {
                        id: 'advandced',
                        name: '标签2',
                        items: [
                          [
                            {
                              id: 'prop4',
                              name: '属性4',
                              control: {
                                type: 'text',
                              },
                            },
                            {
                              id: 'prop5',
                              name: '属性5',
                              control: {
                                type: 'text',
                              },
                            },
                          ],
                          [
                            {
                              id: 'prop6',
                              name: '属性6',
                              control: {
                                type: 'text',
                                rules: [{ required: true }],
                              },
                            },
                            {
                              id: 'prop7',
                              name: '属性7',
                              control: {
                                type: 'text',
                              },
                            },
                            {
                              id: 'prop8',
                              name: '属性8',
                              control: {
                                type: 'text',
                              },
                            },
                          ],
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                id: 'event',
                name: '事件',
                items: [],
              },
            ],
          },
        ]}
        onChange={(value) => {
          setValue(value)
        }}
      />
    )
  },
}
