import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Validation } from '../Validation'

describe('Validation 验证组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染子元素', () => {
      const { container } = render(
        <Validation>
          <div>表单内容</div>
        </Validation>
      )
      expect(container.textContent).toContain('表单内容')
    })
  })

  describe('ref 方法', () => {
    it('应该通过 ref 暴露 validation 方法', () => {
      const ref = { current: null as any }
      render(
        <Validation ref={ref}>
          <div>内容</div>
        </Validation>
      )
      expect(ref.current).toHaveProperty('validation')
      expect(typeof ref.current.validation).toBe('function')
    })

    it('validation 方法应该返回 Promise', async () => {
      const ref = { current: null as any }
      render(
        <Validation ref={ref}>
          <div>内容</div>
        </Validation>
      )
      const result = ref.current.validation()
      expect(result).toBeInstanceOf(Promise)
    })

    it('没有验证规则时 validation 应该返回 true', async () => {
      const ref = { current: null as any }
      render(
        <Validation ref={ref}>
          <div>内容</div>
        </Validation>
      )
      const result = await ref.current.validation()
      expect(result).toBe(true)
    })
  })

  describe('嵌套验证', () => {
    it('应该支持嵌套的验证组件', () => {
      const parentRef = { current: null as any }
      const childRef = { current: null as any }
      render(
        <Validation ref={parentRef}>
          <Validation ref={childRef}>
            <div>嵌套内容</div>
          </Validation>
        </Validation>
      )
      expect(parentRef.current).toHaveProperty('validation')
      expect(childRef.current).toHaveProperty('validation')
    })
  })

  describe('组合场景', () => {
    it('带多个子组件的验证应该正确渲染', () => {
      const ref = { current: null as any }
      const { container } = render(
        <Validation ref={ref}>
          <div>字段1</div>
          <div>字段2</div>
          <div>字段3</div>
        </Validation>
      )
      expect(container.textContent).toContain('字段1')
      expect(container.textContent).toContain('字段2')
      expect(container.textContent).toContain('字段3')
    })
  })
})
