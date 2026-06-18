import { describe, it, expect } from 'vitest'
import { isObject } from '../isObject'

describe('isObject 对象判断函数', () => {
  describe('应该返回 true 的情况', () => {
    it('普通对象应返回 true', () => {
      expect(isObject({})).toBe(true)
    })

    it('带有属性的对象应返回 true', () => {
      expect(isObject({ name: 'John', age: 30 })).toBe(true)
    })

    it('嵌套对象应返回 true', () => {
      expect(isObject({ nested: { key: 'value' } })).toBe(true)
    })

    it('Object.create(null) 创建的对象应返回 true', () => {
      expect(isObject(Object.create(null))).toBe(true)
    })

    it('通过 Object.create 创建的对象应返回 true', () => {
      expect(isObject(Object.create({ proto: true }))).toBe(true)
    })

    it('类实例应返回 true', () => {
      class MyClass {}
      expect(isObject(new MyClass())).toBe(true)
    })

    it('Date 对象应返回 true', () => {
      expect(isObject(new Date())).toBe(true)
    })

    it('RegExp 对象应返回 true', () => {
      expect(isObject(/test/)).toBe(true)
      expect(isObject(new RegExp('test'))).toBe(true)
    })

    it('Error 对象应返回 true', () => {
      expect(isObject(new Error())).toBe(true)
    })

    it('Map 对象应返回 true', () => {
      expect(isObject(new Map())).toBe(true)
    })

    it('Set 对象应返回 true', () => {
      expect(isObject(new Set())).toBe(true)
    })

    it('WeakMap 对象应返回 true', () => {
      expect(isObject(new WeakMap())).toBe(true)
    })

    it('WeakSet 对象应返回 true', () => {
      expect(isObject(new WeakSet())).toBe(true)
    })

    it('Promise 对象应返回 true', () => {
      expect(isObject(Promise.resolve())).toBe(true)
    })
  })

  describe('应该返回 false 的情况', () => {
    it('null 应返回 false', () => {
      expect(isObject(null)).toBe(false)
    })

    it('数组应返回 false', () => {
      expect(isObject([])).toBe(false)
      expect(isObject([1, 2, 3])).toBe(false)
      expect(isObject(new Array(3))).toBe(false)
    })

    it('undefined 应返回 false', () => {
      expect(isObject(undefined)).toBe(false)
    })

    it('字符串应返回 false', () => {
      expect(isObject('')).toBe(false)
      expect(isObject('hello')).toBe(false)
      expect(isObject(String('test'))).toBe(false)
    })

    it('数字应返回 false', () => {
      expect(isObject(0)).toBe(false)
      expect(isObject(42)).toBe(false)
      expect(isObject(-1)).toBe(false)
      expect(isObject(3.14)).toBe(false)
      expect(isObject(Infinity)).toBe(false)
      expect(isObject(NaN)).toBe(false)
    })

    it('布尔值应返回 false', () => {
      expect(isObject(true)).toBe(false)
      expect(isObject(false)).toBe(false)
    })

    it('函数应返回 false', () => {
      expect(isObject(() => {})).toBe(false)
      expect(isObject(function () {})).toBe(false)
      expect(isObject(async () => {})).toBe(false)
      expect(isObject(class MyClass {})).toBe(false)
    })

    it('Symbol 应返回 false', () => {
      expect(isObject(Symbol())).toBe(false)
      expect(isObject(Symbol('test'))).toBe(false)
    })

    it('BigInt 应返回 false', () => {
      expect(isObject(BigInt(123))).toBe(false)
      expect(isObject(123n)).toBe(false)
    })
  })

  describe('边界情况', () => {
    it('嵌套数组中的对象', () => {
      const arr = [{ key: 'value' }]
      expect(isObject(arr)).toBe(false)
      expect(isObject(arr[0])).toBe(true)
    })

    it('对象中的数组属性', () => {
      const obj = { items: [1, 2, 3] }
      expect(isObject(obj)).toBe(true)
      expect(isObject(obj.items)).toBe(false)
    })

    it('arguments 对象', () => {
      function test() {
        // eslint-disable-next-line prefer-rest-params
        expect(isObject(arguments)).toBe(true)
      }
      test()
    })
  })
})
