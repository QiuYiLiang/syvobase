import { Meta, StoryObj } from '@storybook/react-vite'
import { Steps, StepsModel } from '@/steps'
import { useRef, useState } from 'react'
import { Toolbar } from '@/toolbar'
import { Button } from '@/button'

const meta = {
  title: 'Layout/Steps',
  component: Steps,
  argTypes: {},
  args: {
    items: [
      {
        id: 'step1',
        name: '步骤1',
        content: <div className='p-4'>这是步骤1的内容</div>,
        description: '这是步骤1的简介',
      },
      {
        id: 'step2',
        name: '步骤2',
        content: <div className='p-4'>这是步骤2的内容</div>,
        description: '这是步骤2的简介',
      },
      {
        id: 'step3',
        name: '步骤3',
        content: <div className='p-4'>这是步骤3的内容</div>,
        description: '这是步骤3的简介',
      },
    ],
  },
} satisfies Meta<typeof Steps>

export default meta

type Story = StoryObj<typeof meta>

// 默认步骤条
export const Default: Story = {
  args: {},
  render(args) {
    const [value, setValue] = useState('step1')
    const ref = useRef<StepsModel>(null)
    return (
      <div className='flex flex-col'>
        <Steps
          {...args}
          ref={ref}
          value={value}
          onChange={setValue}
          style={{
            width: 700,
            height: 200,
          }}
        />
        <Toolbar
          right={[
            {
              name: '上一步',
              type: 'outline',
              onClick: () => {
                ref.current?.prevStep()
              },
            },
            {
              name: '下一步',
              onClick: () => {
                ref.current?.nextStep()
              },
            },
          ]}
        />
      </div>
    )
  },
}

// 在中间步骤
export const MiddleStep: Story = {
  args: {},
  render(args) {
    const [value, setValue] = useState('step2')
    const ref = useRef<StepsModel>(null)
    return (
      <div className='flex flex-col'>
        <Steps
          {...args}
          ref={ref}
          value={value}
          onChange={setValue}
          style={{
            width: 700,
            height: 200,
          }}
        />
        <Toolbar
          right={[
            {
              name: '上一步',
              type: 'outline',
              onClick: () => {
                ref.current?.prevStep()
              },
            },
            {
              name: '下一步',
              onClick: () => {
                ref.current?.nextStep()
              },
            },
          ]}
        />
      </div>
    )
  },
}

// 最后一步
export const LastStep: Story = {
  args: {},
  render(args) {
    const [value, setValue] = useState('step3')
    const ref = useRef<StepsModel>(null)
    return (
      <div className='flex flex-col'>
        <Steps
          {...args}
          ref={ref}
          value={value}
          onChange={setValue}
          style={{
            width: 700,
            height: 200,
          }}
        />
        <Toolbar
          right={[
            {
              name: '上一步',
              type: 'outline',
              onClick: () => {
                ref.current?.prevStep()
              },
            },
            {
              name: '完成',
              onClick: () => {
                console.log('完成')
              },
            },
          ]}
        />
      </div>
    )
  },
}

// 更多步骤
export const MoreSteps: Story = {
  args: {
    items: [
      {
        id: 'step1',
        name: '选择类型',
        content: <div className='p-4'>请选择要创建的类型</div>,
      },
      {
        id: 'step2',
        name: '填写信息',
        content: <div className='p-4'>请填写基本信息</div>,
      },
      {
        id: 'step3',
        name: '配置选项',
        content: <div className='p-4'>请配置相关选项</div>,
      },
      {
        id: 'step4',
        name: '确认提交',
        content: <div className='p-4'>请确认以上信息</div>,
      },
      {
        id: 'step5',
        name: '完成',
        content: <div className='p-4'>创建成功！</div>,
      },
    ],
  },
  render(args) {
    const [value, setValue] = useState('step1')
    const ref = useRef<StepsModel>(null)
    return (
      <div className='flex flex-col'>
        <Steps
          {...args}
          ref={ref}
          value={value}
          onChange={setValue}
          style={{
            width: 900,
            height: 200,
          }}
        />
        <Toolbar
          right={[
            {
              name: '上一步',
              type: 'outline',
              onClick: () => {
                ref.current?.prevStep()
              },
            },
            {
              name: '下一步',
              onClick: () => {
                ref.current?.nextStep()
              },
            },
          ]}
        />
      </div>
    )
  },
}

// 带描述的步骤
export const WithDescription: Story = {
  args: {
    items: [
      {
        id: 'step1',
        name: '账号注册',
        description: '创建您的账号',
        content: <div className='p-4'>请输入您的邮箱和密码</div>,
      },
      {
        id: 'step2',
        name: '信息完善',
        description: '完善个人信息',
        content: <div className='p-4'>请填写您的个人信息</div>,
      },
      {
        id: 'step3',
        name: '邮箱验证',
        description: '验证您的邮箱',
        content: <div className='p-4'>请查收验证邮件</div>,
      },
    ],
  },
  render(args) {
    const [value, setValue] = useState('step1')
    const ref = useRef<StepsModel>(null)
    return (
      <div className='flex flex-col'>
        <Steps
          {...args}
          ref={ref}
          value={value}
          onChange={setValue}
          style={{
            width: 700,
            height: 200,
          }}
        />
        <Toolbar
          right={[
            {
              name: '上一步',
              type: 'outline',
              onClick: () => {
                ref.current?.prevStep()
              },
            },
            {
              name: '下一步',
              onClick: () => {
                ref.current?.nextStep()
              },
            },
          ]}
        />
      </div>
    )
  },
}

// 跳转到指定步骤
export const StepTo: Story = {
  args: {},
  render(args) {
    const [value, setValue] = useState('step1')
    const ref = useRef<StepsModel>(null)
    return (
      <div className='flex flex-col gap-4'>
        <Steps
          {...args}
          ref={ref}
          value={value}
          onChange={setValue}
          style={{
            width: 700,
            height: 200,
          }}
        />
        <div className='flex gap-2'>
          <Button
            type='outline'
            size='sm'
            onClick={() => ref.current?.stepTo('step1')}
          >
            跳转到步骤1
          </Button>
          <Button
            type='outline'
            size='sm'
            onClick={() => ref.current?.stepTo('step2')}
          >
            跳转到步骤2
          </Button>
          <Button
            type='outline'
            size='sm'
            onClick={() => ref.current?.stepTo('step3')}
          >
            跳转到步骤3
          </Button>
        </div>
      </div>
    )
  },
}
