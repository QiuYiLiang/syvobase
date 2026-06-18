import { Meta, StoryObj } from '@storybook/react-vite'
import { Validator, Validation, ValidatorProps } from '@/validation'
import { Text } from '@/text'
import { Button } from '@/button'
import { useState, useRef } from 'react'

const meta: Meta<typeof Validator> = {
  title: 'Base/Validator',
  component: Validator,
  argTypes: {
    errorMsg: {
      control: 'text',
      description: '错误信息',
    },
    disabledErrorMsg: {
      control: 'boolean',
      description: '是否禁用错误信息显示',
    },
  },
}

export default meta

type Story = StoryObj<ValidatorProps>

// 默认示例
export const Default: Story = {
  args: {
    errorMsg: '这是一条错误信息',
    children: <Text placeholder='请输入内容' />,
  },
}

// 无错误
export const NoError: Story = {
  args: {
    errorMsg: '',
    children: <Text placeholder='请输入内容' />,
  },
}

// 禁用错误信息
export const DisabledErrorMsg: Story = {
  args: {
    errorMsg: '这条错误信息不会显示',
    disabledErrorMsg: true,
    children: <Text placeholder='请输入内容' />,
  },
}

// 不同类型的子元素
export const WithDifferentChildren: Story = {
  render() {
    return (
      <div className='space-y-4'>
        <Validator errorMsg='输入框错误'>
          <Text placeholder='输入框' />
        </Validator>
        <Validator errorMsg='按钮错误'>
          <Button>按钮</Button>
        </Validator>
        <Validator errorMsg='自定义内容错误'>
          <div className='rounded border p-3'>自定义内容</div>
        </Validator>
      </div>
    )
  },
}

// 带验证函数
export const WithValidation: Story = {
  render() {
    const [value, setValue] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const validate = async () => {
      if (!value) {
        setErrorMsg('请输入内容')
        return false
      }
      if (value.length < 3) {
        setErrorMsg('内容长度不能少于3个字符')
        return false
      }
      setErrorMsg('')
      return true
    }

    return (
      <div className='space-y-4'>
        <Validator errorMsg={errorMsg} validation={validate}>
          <Text
            value={value}
            onChange={setValue}
            placeholder='请输入至少3个字符'
          />
        </Validator>
        <Button onClick={validate}>验证</Button>
      </div>
    )
  },
}

// 多个验证器
export const MultipleValidators: Story = {
  render() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [nameError, setNameError] = useState('')
    const [emailError, setEmailError] = useState('')

    const validateAll = () => {
      let valid = true
      if (!name) {
        setNameError('请输入姓名')
        valid = false
      } else {
        setNameError('')
      }

      if (!email) {
        setEmailError('请输入邮箱')
        valid = false
      } else if (!email.includes('@')) {
        setEmailError('邮箱格式不正确')
        valid = false
      } else {
        setEmailError('')
      }

      return valid
    }

    return (
      <div className='w-80 space-y-4'>
        <div>
          <label className='mb-1 block text-sm font-medium'>姓名</label>
          <Validator errorMsg={nameError}>
            <Text value={name} onChange={setName} placeholder='请输入姓名' />
          </Validator>
        </div>
        <div>
          <label className='mb-1 block text-sm font-medium'>邮箱</label>
          <Validator errorMsg={emailError}>
            <Text value={email} onChange={setEmail} placeholder='请输入邮箱' />
          </Validator>
        </div>
        <Button onClick={validateAll}>提交</Button>
      </div>
    )
  },
}

// 实时验证
export const RealTimeValidation: Story = {
  render() {
    const [value, setValue] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const handleChange = (val: string) => {
      setValue(val)
      if (!val) {
        setErrorMsg('请输入内容')
      } else if (val.length < 6) {
        setErrorMsg(`还需输入 ${6 - val.length} 个字符`)
      } else {
        setErrorMsg('')
      }
    }

    return (
      <div className='space-y-2'>
        <Validator errorMsg={errorMsg}>
          <Text
            value={value}
            onChange={handleChange}
            placeholder='请输入至少6个字符'
          />
        </Validator>
        <div className='text-muted-foreground text-sm'>
          当前输入 {value.length} 个字符
        </div>
      </div>
    )
  },
}

// 在 Validation 上下文中使用
export const WithValidationContext: Story = {
  render() {
    const [name, setName] = useState('')
    const [nameError, setNameError] = useState('')
    const validationRef = useRef<{ validation: () => Promise<boolean> }>(null)

    return (
      <div className='space-y-4'>
        <Validation ref={validationRef as any}>
          <Validator
            errorMsg={nameError}
            validation={async () => {
              if (!name) {
                setNameError('请输入姓名')
                return false
              }
              setNameError('')
              return true
            }}
          >
            <Text value={name} onChange={setName} placeholder='请输入姓名' />
          </Validator>
        </Validation>
        <Button
          onClick={async () => {
            const valid = await validationRef.current?.validation()
            if (valid) {
              alert('验证通过！')
            }
          }}
        >
          通过 Validation 验证
        </Button>
      </div>
    )
  },
}
