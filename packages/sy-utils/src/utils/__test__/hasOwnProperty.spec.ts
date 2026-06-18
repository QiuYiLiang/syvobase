import { describe, it, expect } from 'vitest'
import { hasOwnProperty } from '../hasOwnProperty'

describe('hasOwnProperty 属性检查函数', () => {
  it('应该检测对象自身存在的属性', () => {
    const obj = { name: 'John', age: 30 }
    expect(hasOwnProperty(obj, 'name')).toBe(true)
    expect(hasOwnProperty(obj, 'age')).toBe(true)
  })

  it('应该返回 false 对于不存在的属性', () => {
    const obj = { name: 'John' }
    expect(hasOwnProperty(obj, 'age')).toBe(false)
    expect(hasOwnProperty(obj, 'address')).toBe(false)
  })

  it('应该区分自身属性和继承属性', () => {
    const parent = { inherited: true }
    const child = Object.create(parent)
    child.own = true

    expect(hasOwnProperty(child, 'own')).toBe(true)
    expect(hasOwnProperty(child, 'inherited')).toBe(false)
  })

  it('应该处理空对象', () => {
    const obj = {}
    expect(hasOwnProperty(obj, 'anyKey')).toBe(false)
  })

  it('应该处理 null 原型对象', () => {
    const obj = Object.create(null)
    obj.key = 'value'
    expect(hasOwnProperty(obj, 'key')).toBe(true)
    expect(hasOwnProperty(obj, 'other')).toBe(false)
  })

  it('应该正确处理 Object.prototype 上的方法名', () => {
    const obj = { toString: 'custom' }
    expect(hasOwnProperty(obj, 'toString')).toBe(true)
    expect(hasOwnProperty({}, 'toString')).toBe(false)
  })

  it('应该处理值为 undefined 的属性', () => {
    const obj = { key: undefined }
    expect(hasOwnProperty(obj, 'key')).toBe(true)
  })

  it('应该处理值为 null 的属性', () => {
    const obj = { key: null }
    expect(hasOwnProperty(obj, 'key')).toBe(true)
  })

  it('应该处理值为 false 的属性', () => {
    const obj = { key: false }
    expect(hasOwnProperty(obj, 'key')).toBe(true)
  })

  it('应该处理值为 0 的属性', () => {
    const obj = { key: 0 }
    expect(hasOwnProperty(obj, 'key')).toBe(true)
  })

  it('应该处理值为空字符串的属性', () => {
    const obj = { key: '' }
    expect(hasOwnProperty(obj, 'key')).toBe(true)
  })

  it('应该处理数字键', () => {
    const obj = { 0: 'zero', 1: 'one' }
    expect(hasOwnProperty(obj, '0')).toBe(true)
    expect(hasOwnProperty(obj, '1')).toBe(true)
    expect(hasOwnProperty(obj, '2')).toBe(false)
  })

  it('应该处理符号键', () => {
    const sym = Symbol('test')
    const obj = { [sym]: 'value' }
    // hasOwnProperty 只检查字符串键
    expect(hasOwnProperty(obj, 'test')).toBe(false)
  })

  it('应该处理嵌套对象', () => {
    const obj = {
      nested: {
        key: 'value',
      },
    }
    expect(hasOwnProperty(obj, 'nested')).toBe(true)
    expect(hasOwnProperty(obj.nested, 'key')).toBe(true)
  })

  it('应该处理数组', () => {
    const arr = ['a', 'b', 'c'] as unknown as Record<string, any>
    expect(hasOwnProperty(arr, '0')).toBe(true)
    expect(hasOwnProperty(arr, '1')).toBe(true)
    expect(hasOwnProperty(arr, '3')).toBe(false)
    expect(hasOwnProperty(arr, 'length')).toBe(true)
  })

  it('应该处理类实例', () => {
    class MyClass {
      prop = 'value'
      method() {
        return 'result'
      }
    }
    const instance = new MyClass() as unknown as Record<string, any>
    expect(hasOwnProperty(instance, 'prop')).toBe(true)
    expect(hasOwnProperty(instance, 'method')).toBe(false) // 方法在原型上
  })
})
