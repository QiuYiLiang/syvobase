import { describe, it, expect } from 'vitest'
import { formatDate, toDate } from '../date'

describe('date 日期工具函数', () => {
  describe('formatDate 日期格式化', () => {
    describe('基础功能', () => {
      it('应该使用默认格式格式化日期', () => {
        const date = new Date('2024-06-15T10:30:45')
        expect(formatDate(date)).toBe('2024-06-15 10:30:45')
      })

      it('应该支持自定义格式', () => {
        const date = new Date('2024-06-15T10:30:45')
        expect(formatDate(date, 'YYYY/MM/DD')).toBe('2024/06/15')
      })

      it('应该支持时间戳输入', () => {
        const timestamp = new Date('2024-06-15T10:30:45').getTime()
        expect(formatDate(timestamp)).toBe('2024-06-15 10:30:45')
      })

      it('应该支持字符串日期输入', () => {
        expect(formatDate('2024-06-15')).toMatch(/2024-06-15/)
      })
    })

    describe('不同格式模式', () => {
      const testDate = new Date('2024-06-15T10:30:45')

      it('应该格式化为年月日', () => {
        expect(formatDate(testDate, 'YYYY-MM-DD')).toBe('2024-06-15')
      })

      it('应该格式化为时分秒', () => {
        expect(formatDate(testDate, 'HH:mm:ss')).toBe('10:30:45')
      })

      it('应该格式化为年月', () => {
        expect(formatDate(testDate, 'YYYY-MM')).toBe('2024-06')
      })

      it('应该格式化为月日', () => {
        expect(formatDate(testDate, 'MM-DD')).toBe('06-15')
      })

      it('应该格式化为中文格式', () => {
        expect(formatDate(testDate, 'YYYY年MM月DD日')).toBe('2024年06月15日')
      })

      it('应该格式化为12小时制', () => {
        expect(formatDate(testDate, 'hh:mm A')).toMatch(/10:30 AM/)
      })

      it('应该格式化为 ISO 日期格式', () => {
        expect(formatDate(testDate, 'YYYY-MM-DDTHH:mm:ss')).toBe(
          '2024-06-15T10:30:45'
        )
      })
    })

    describe('边界情况', () => {
      it('应该处理午夜时间', () => {
        const midnight = new Date('2024-06-15T00:00:00')
        expect(formatDate(midnight, 'HH:mm:ss')).toBe('00:00:00')
      })

      it('应该处理接近午夜的时间', () => {
        const nearMidnight = new Date('2024-06-15T23:59:59')
        expect(formatDate(nearMidnight, 'HH:mm:ss')).toBe('23:59:59')
      })

      it('应该处理月初', () => {
        const firstDay = new Date('2024-06-01')
        expect(formatDate(firstDay, 'DD')).toBe('01')
      })

      it('应该处理月末', () => {
        const lastDay = new Date('2024-06-30')
        expect(formatDate(lastDay, 'DD')).toBe('30')
      })

      it('应该处理年初', () => {
        const newYear = new Date('2024-01-01')
        expect(formatDate(newYear, 'YYYY-MM-DD')).toBe('2024-01-01')
      })

      it('应该处理年末', () => {
        const yearEnd = new Date('2024-12-31')
        expect(formatDate(yearEnd, 'YYYY-MM-DD')).toBe('2024-12-31')
      })

      it('应该处理闰年2月29日', () => {
        const leapDay = new Date('2024-02-29')
        expect(formatDate(leapDay, 'YYYY-MM-DD')).toBe('2024-02-29')
      })
    })

    describe('无效输入处理', () => {
      it('应该处理 undefined 输入', () => {
        // dayjs(undefined) 返回当前日期,这是 dayjs 的行为
        const result = formatDate(undefined)
        expect(result).not.toBe('Invalid Date')
      })

      it('应该处理 null 输入', () => {
        expect(formatDate(null)).toBe('Invalid Date')
      })

      it('应该处理无效日期字符串', () => {
        expect(formatDate('invalid-date')).toBe('Invalid Date')
      })
    })
  })

  describe('toDate 日期转换', () => {
    describe('基础功能', () => {
      it('应该将 Date 对象转换为 dayjs 对象', () => {
        const date = new Date('2024-06-15')
        const result = toDate(date)
        expect(result.isValid()).toBe(true)
        expect(result.year()).toBe(2024)
        expect(result.month()).toBe(5) // dayjs 月份从 0 开始
        expect(result.date()).toBe(15)
      })

      it('应该将时间戳转换为 dayjs 对象', () => {
        const timestamp = new Date('2024-06-15').getTime()
        const result = toDate(timestamp)
        expect(result.isValid()).toBe(true)
        expect(result.year()).toBe(2024)
      })

      it('应该将字符串日期转换为 dayjs 对象', () => {
        const result = toDate('2024-06-15')
        expect(result.isValid()).toBe(true)
        expect(result.format('YYYY-MM-DD')).toBe('2024-06-15')
      })
    })

    describe('dayjs 操作', () => {
      it('应该支持日期加减', () => {
        const result = toDate('2024-06-15')
        expect(result.add(1, 'day').format('YYYY-MM-DD')).toBe('2024-06-16')
        expect(result.subtract(1, 'day').format('YYYY-MM-DD')).toBe(
          '2024-06-14'
        )
      })

      it('应该支持月份加减', () => {
        const result = toDate('2024-06-15')
        expect(result.add(1, 'month').format('YYYY-MM-DD')).toBe('2024-07-15')
        expect(result.subtract(1, 'month').format('YYYY-MM-DD')).toBe(
          '2024-05-15'
        )
      })

      it('应该支持年份加减', () => {
        const result = toDate('2024-06-15')
        expect(result.add(1, 'year').format('YYYY-MM-DD')).toBe('2025-06-15')
        expect(result.subtract(1, 'year').format('YYYY-MM-DD')).toBe(
          '2023-06-15'
        )
      })

      it('应该支持获取月初', () => {
        const result = toDate('2024-06-15')
        expect(result.startOf('month').format('YYYY-MM-DD')).toBe('2024-06-01')
      })

      it('应该支持获取月末', () => {
        const result = toDate('2024-06-15')
        expect(result.endOf('month').format('YYYY-MM-DD')).toBe('2024-06-30')
      })

      it('应该支持日期比较', () => {
        const date1 = toDate('2024-06-15')
        const date2 = toDate('2024-06-16')
        expect(date1.isBefore(date2)).toBe(true)
        expect(date2.isAfter(date1)).toBe(true)
      })
    })

    describe('无效输入处理', () => {
      it('应该处理 undefined 输入', () => {
        const result = toDate(undefined)
        // dayjs(undefined) 返回当前日期,所以是有效的
        expect(result.isValid()).toBe(true)
      })

      it('应该处理 null 输入', () => {
        const result = toDate(null)
        expect(result.isValid()).toBe(false)
      })

      it('应该处理无效日期字符串', () => {
        const result = toDate('invalid-date')
        expect(result.isValid()).toBe(false)
      })
    })

    describe('时区处理', () => {
      it('应该保持 ISO 日期字符串的正确解析', () => {
        const result = toDate('2024-06-15T12:00:00')
        expect(result.hour()).toBe(12)
        expect(result.minute()).toBe(0)
      })
    })
  })
})
