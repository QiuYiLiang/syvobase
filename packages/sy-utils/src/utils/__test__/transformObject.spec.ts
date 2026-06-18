import { describe, expect, it } from 'vitest'
import { transformObject } from '../transformObject'

describe('transformObject', () => {
  it('基本对象转换测试', () => {
    const obj = { name: 'John' }
    const result = transformObject(obj, (v) => ({
      name: v('default name'),
      age: v(20),
    }))

    expect(result).toEqual({
      name: 'John',
      age: 20,
    })
  })

  it('嵌套对象转换测试', () => {
    const obj = {
      user: {
        name: 'John',
      },
    }
    const result = transformObject(obj, (v) => ({
      user: {
        name: v('default name'),
        age: v(20),
      },
    }))

    expect(result).toEqual({
      user: {
        name: 'John',
        age: 20,
      },
    })
  })

  it('转换函数应用测试', () => {
    const obj = {
      name: 'john',
    }
    const result = transformObject(obj, (v) => ({
      name: v('default', (val) => val.toUpperCase()),
    }))

    expect(result).toEqual({
      name: 'JOHN',
    })
  })

  it('测试缺失属性的默认值', () => {
    const obj = {}
    const result = transformObject(obj, (v) => ({
      name: v('John'),
      age: v(20),
    }))

    expect(result).toEqual({
      name: 'John',
      age: 20,
    })
  })

  it('测试嵌套路径的空对象创建', () => {
    const obj = {}
    const result = transformObject(obj, (v) => ({
      user: {
        profile: {
          name: v('John'),
        },
      },
    }))

    expect(result).toEqual({
      user: {
        profile: {
          name: 'John',
        },
      },
    })
  })
})
