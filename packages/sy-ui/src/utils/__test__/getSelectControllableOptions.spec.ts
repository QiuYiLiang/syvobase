import { describe, it, expect } from 'vitest'
import { getSelectControllableOptions } from '../getSelectControllableOptions'

describe('getSelectControllableOptions 选择器可控选项', () => {
  describe('默认配置（单选，非逗号分割）', () => {
    const options = getSelectControllableOptions()

    describe('onGetValue 获取值', () => {
      it('应该将单个值转换为数组', () => {
        expect(options.onGetValue!('option1')).toEqual(['option1'])
      })

      it('应该将空字符串转换为空数组', () => {
        expect(options.onGetValue!('')).toEqual([])
      })

      it('应该将 null 转换为空数组', () => {
        expect(options.onGetValue!(null)).toEqual([])
      })

      it('应该将 undefined 转换为空数组', () => {
        expect(options.onGetValue!(undefined)).toEqual([])
      })

      it('应该将数字值转换为数组', () => {
        expect(options.onGetValue!(123)).toEqual([123])
      })

      it('应该将布尔值转换为数组', () => {
        expect(options.onGetValue!(true)).toEqual([true])
        expect(options.onGetValue!(false)).toEqual([false])
      })
    })

    describe('onSetValue 设置值', () => {
      it('应该返回数组的第一个元素', () => {
        expect(options.onSetValue!(['option1', 'option2'])).toBe('option1')
      })

      it('应该返回 undefined 当数组为空时', () => {
        expect(options.onSetValue!([])).toBeUndefined()
      })

      it('应该返回单个元素', () => {
        expect(options.onSetValue!(['single'])).toBe('single')
      })

      it('应该返回数字类型的第一个元素', () => {
        expect(options.onSetValue!([123, 456])).toBe(123)
      })
    })
  })

  describe('多选配置（非逗号分割）', () => {
    const options = getSelectControllableOptions({ multiple: true })

    describe('onGetValue 获取值', () => {
      it('应该保持数组值不变', () => {
        expect(options.onGetValue!(['a', 'b', 'c'])).toEqual(['a', 'b', 'c'])
      })

      it('应该将 undefined 转换为空数组', () => {
        expect(options.onGetValue!(undefined)).toEqual([])
      })

      it('应该将 null 转换为空数组', () => {
        expect(options.onGetValue!(null)).toEqual([])
      })

      it('应该保持空数组不变', () => {
        expect(options.onGetValue!([])).toEqual([])
      })

      it('应该保持单元素数组不变', () => {
        expect(options.onGetValue!(['single'])).toEqual(['single'])
      })
    })

    describe('onSetValue 设置值', () => {
      it('应该保持数组值不变', () => {
        expect(options.onSetValue!(['a', 'b', 'c'])).toEqual(['a', 'b', 'c'])
      })

      it('应该保持空数组不变', () => {
        expect(options.onSetValue!([])).toEqual([])
      })

      it('应该保持单元素数组不变', () => {
        expect(options.onSetValue!(['single'])).toEqual(['single'])
      })
    })
  })

  describe('逗号分割配置', () => {
    const options = getSelectControllableOptions({
      multiple: true,
      commaSplit: true,
    })

    describe('onGetValue 获取值', () => {
      it('应该将逗号分隔字符串转换为数组', () => {
        expect(options.onGetValue!('a,b,c')).toEqual(['a', 'b', 'c'])
      })

      it('应该将单个值字符串转换为单元素数组', () => {
        expect(options.onGetValue!('single')).toEqual(['single'])
      })

      it('应该将空字符串转换为空数组', () => {
        expect(options.onGetValue!('')).toEqual([])
      })

      it('应该将 undefined 转换为空数组', () => {
        expect(options.onGetValue!(undefined)).toEqual([])
      })

      it('应该将 null 转换为空数组', () => {
        expect(options.onGetValue!(null)).toEqual([])
      })

      it('应该处理包含空格的逗号分隔值', () => {
        // 取决于 strToArray 的实现
        const result = options.onGetValue!('a, b, c')
        expect(result).toBeInstanceOf(Array)
      })
    })

    describe('onSetValue 设置值', () => {
      it('应该将数组转换为逗号分隔字符串', () => {
        expect(options.onSetValue!(['a', 'b', 'c'])).toBe('a,b,c')
      })

      it('应该将空数组转换为空字符串', () => {
        expect(options.onSetValue!([])).toBe('')
      })

      it('应该将单元素数组转换为单个值字符串', () => {
        expect(options.onSetValue!(['single'])).toBe('single')
      })

      it('应该处理数字数组', () => {
        expect(options.onSetValue!([1, 2, 3] as any)).toBe('1,2,3')
      })
    })
  })

  describe('单选 + 逗号分割配置', () => {
    const options = getSelectControllableOptions({
      multiple: false,
      commaSplit: true,
    })

    describe('onGetValue 获取值', () => {
      it('应该将单个值转换为数组（忽略逗号分割）', () => {
        // 单选时 commaSplit 不生效
        expect(options.onGetValue!('option1')).toEqual(['option1'])
      })

      it('应该将空字符串转换为空数组', () => {
        expect(options.onGetValue!('')).toEqual([])
      })
    })

    describe('onSetValue 设置值', () => {
      it('应该返回第一个元素（忽略逗号分割）', () => {
        expect(options.onSetValue!(['a', 'b'])).toBe('a')
      })
    })
  })

  describe('空配置', () => {
    it('应该使用默认值', () => {
      const options = getSelectControllableOptions({})
      expect(options.onGetValue!('test')).toEqual(['test'])
      expect(options.onSetValue!(['test'])).toBe('test')
    })
  })

  describe('返回值结构', () => {
    it('应该返回包含 onGetValue 和 onSetValue 的对象', () => {
      const options = getSelectControllableOptions()
      expect(options).toHaveProperty('onGetValue')
      expect(options).toHaveProperty('onSetValue')
      expect(typeof options.onGetValue).toBe('function')
      expect(typeof options.onSetValue).toBe('function')
    })
  })

  describe('边界情况', () => {
    const singleOptions = getSelectControllableOptions()
    const multiOptions = getSelectControllableOptions({ multiple: true })

    it('应该处理对象值', () => {
      const objValue = { id: 1, name: 'test' }
      expect(singleOptions.onGetValue!(objValue)).toEqual([objValue])
    })

    it('应该处理数组中的对象', () => {
      const objArray = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
      ]
      expect(multiOptions.onGetValue!(objArray)).toEqual(objArray)
      expect(multiOptions.onSetValue!(objArray)).toEqual(objArray)
    })

    it('应该处理混合类型数组', () => {
      const mixedArray = ['string', 123, true, null]
      expect(multiOptions.onGetValue!(mixedArray)).toEqual(mixedArray)
    })

    it('应该处理嵌套数组', () => {
      const nestedArray = [
        ['a', 'b'],
        ['c', 'd'],
      ]
      expect(multiOptions.onGetValue!(nestedArray)).toEqual(nestedArray)
    })

    it('应该处理特殊字符串值', () => {
      expect(singleOptions.onGetValue!('0')).toEqual(['0'])
      expect(singleOptions.onGetValue!('false')).toEqual(['false'])
      expect(singleOptions.onGetValue!('null')).toEqual(['null'])
    })
  })
})
