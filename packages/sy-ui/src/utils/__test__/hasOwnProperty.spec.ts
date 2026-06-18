import { describe, it, expect } from 'vitest'
import { hasOwnProperty } from '../hasOwnProperty'

describe('hasOwnProperty 属性检查函数', () => {
  describe('基础功能', () => {
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
  })

  describe('继承属性处理', () => {
    it('应该区分自身属性和继承属性', () => {
      const parent = { inherited: true }
      const child = Object.create(parent)
      child.own = true

      expect(hasOwnProperty(child, 'own')).toBe(true)
      expect(hasOwnProperty(child, 'inherited')).toBe(false)
    })

    it('应该不识别 Object.prototype 上的方法', () => {
      const obj = {}
      expect(hasOwnProperty(obj, 'toString')).toBe(false)
      expect(hasOwnProperty(obj, 'hasOwnProperty')).toBe(false)
      expect(hasOwnProperty(obj, 'valueOf')).toBe(false)
    })

    it('应该识别覆盖了原型方法的属性', () => {
      const obj = { toString: 'custom' }
      expect(hasOwnProperty(obj, 'toString')).toBe(true)
    })
  })

  describe('特殊对象处理', () => {
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

    it('应该处理嵌套对象', () => {
      const obj = {
        nested: {
          key: 'value',
        },
      }
      expect(hasOwnProperty(obj, 'nested')).toBe(true)
      expect(hasOwnProperty(obj.nested, 'key')).toBe(true)
    })
  })

  describe('特殊值处理', () => {
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

    it('应该处理值为 NaN 的属性', () => {
      const obj = { key: NaN }
      expect(hasOwnProperty(obj, 'key')).toBe(true)
    })
  })

  describe('键类型处理', () => {
    it('应该处理数字键', () => {
      const obj = { 0: 'zero', 1: 'one' }
      expect(hasOwnProperty(obj, '0')).toBe(true)
      expect(hasOwnProperty(obj, '1')).toBe(true)
      expect(hasOwnProperty(obj, '2')).toBe(false)
    })

    it('应该处理数组', () => {
      const arr = ['a', 'b', 'c'] as unknown as Record<string, any>
      expect(hasOwnProperty(arr, '0')).toBe(true)
      expect(hasOwnProperty(arr, '1')).toBe(true)
      expect(hasOwnProperty(arr, '3')).toBe(false)
      expect(hasOwnProperty(arr, 'length')).toBe(true)
    })

    it('应该处理特殊键名', () => {
      const obj = {
        'key-with-dash': 1,
        'key.with.dot': 2,
        'key with space': 3,
      }
      expect(hasOwnProperty(obj, 'key-with-dash')).toBe(true)
      expect(hasOwnProperty(obj, 'key.with.dot')).toBe(true)
      expect(hasOwnProperty(obj, 'key with space')).toBe(true)
    })

    it('应该处理空字符串键', () => {
      const obj = { '': 'empty key' }
      expect(hasOwnProperty(obj, '')).toBe(true)
    })
  })

  describe('类实例处理', () => {
    it('应该正确处理类实例属性', () => {
      class TestClass {
        instanceProp = 'value'
        method() {
          return 'method'
        }
      }

      const instance = new TestClass()
      expect(hasOwnProperty(instance, 'instanceProp')).toBe(true)
      // 方法在原型上，不是实例自身属性
      expect(hasOwnProperty(instance, 'method')).toBe(false)
    })

    it('应该处理使用 Object.defineProperty 定义的属性', () => {
      const obj: Record<string, any> = {}
      Object.defineProperty(obj, 'definedProp', {
        value: 'test',
        enumerable: false,
      })
      expect(hasOwnProperty(obj, 'definedProp')).toBe(true)
    })
  })

  describe('边界情况', () => {
    it('应该处理 constructor 属性', () => {
      const obj = {}
      expect(hasOwnProperty(obj, 'constructor')).toBe(false)

      const objWithConstructor = { constructor: 'custom' }
      expect(hasOwnProperty(objWithConstructor, 'constructor')).toBe(true)
    })

    it('应该处理 __proto__ 属性', () => {
      const obj = {}
      expect(hasOwnProperty(obj, '__proto__')).toBe(false)
    })

    it('应该处理函数对象', () => {
      const fn = function test() {} as unknown as Record<string, any>
      fn.customProp = 'value'
      expect(hasOwnProperty(fn, 'customProp')).toBe(true)
      expect(hasOwnProperty(fn, 'name')).toBe(true)
      expect(hasOwnProperty(fn, 'length')).toBe(true)
    })
  })
})
