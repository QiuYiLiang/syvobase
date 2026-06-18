import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { confirm } from '../Confirm'
import { SyvobaseUI } from '@/syvobaseUI'

describe('Confirm 确认对话框', () => {
  const renderWithProvider = (ui: React.ReactNode) => {
    return render(<SyvobaseUI>{ui}</SyvobaseUI>)
  }

  describe('基础渲染', () => {
    it('应该显示确认对话框', async () => {
      const onConfirm = vi.fn()
      renderWithProvider(<div data-testid='container' />)

      confirm({
        header: '确认操作',
        onConfirm,
      })

      await waitFor(() => {
        expect(screen.getByText('确认操作')).toBeInTheDocument()
      })
    })

    it('应该显示取消和确认按钮', async () => {
      const onConfirm = vi.fn()
      renderWithProvider(<div data-testid='container' />)

      confirm({
        header: '确认删除',
        items: [],
        onConfirm,
      })

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /取消|cancel/i })
        ).toBeInTheDocument()
        expect(
          screen.getByRole('button', { name: /确定|confirm/i })
        ).toBeInTheDocument()
      })
    })
  })

  describe('自定义内容 (children)', () => {
    it('应该渲染自定义内容', async () => {
      const onConfirm = vi.fn()
      renderWithProvider(<div data-testid='container' />)

      confirm({
        header: '提示',
        children: <div>自定义内容</div>,
        onConfirm,
      })

      await waitFor(() => {
        expect(screen.getByText('自定义内容')).toBeInTheDocument()
      })
    })
  })

  describe('表单项 (items)', () => {
    it('应该渲染表单项', async () => {
      const onConfirm = vi.fn()
      renderWithProvider(<div data-testid='container' />)

      confirm({
        header: '表单确认',
        items: [{ id: 'input', type: 'text', name: '输入框' }],
        onConfirm,
      })

      await waitFor(() => {
        expect(screen.getByText('输入框')).toBeInTheDocument()
      })
    })
  })

  describe('事件回调', () => {
    it('点击确认应该调用 onConfirm', async () => {
      const onConfirm = vi.fn().mockResolvedValue(true)
      renderWithProvider(<div data-testid='container' />)

      confirm({
        header: '确认',
        onConfirm,
      })

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /确定|confirm/i })
        ).toBeInTheDocument()
      })

      const confirmBtn = screen.getByRole('button', { name: /确定|confirm/i })
      fireEvent.click(confirmBtn)

      await waitFor(() => {
        expect(onConfirm).toHaveBeenCalled()
      })
    })

    it('点击取消应该调用 onClose', async () => {
      const onConfirm = vi.fn()
      const onClose = vi.fn()
      renderWithProvider(<div data-testid='container' />)

      confirm({
        header: '确认',
        onConfirm,
        onClose,
      })

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /取消|cancel/i })
        ).toBeInTheDocument()
      })

      const cancelBtn = screen.getByRole('button', { name: /取消|cancel/i })
      fireEvent.click(cancelBtn)

      await waitFor(() => {
        expect(onClose).toHaveBeenCalled()
      })
    })
  })

  describe('默认值 (defaultValue)', () => {
    it('应该支持设置默认值', async () => {
      const onConfirm = vi.fn()
      renderWithProvider(<div data-testid='container' />)

      confirm({
        header: '默认值测试',
        defaultValue: { name: '默认名称' },
        items: [{ id: 'name', type: 'text', name: '名称' }],
        onConfirm,
      })

      await waitFor(() => {
        expect(screen.getByText('名称')).toBeInTheDocument()
      })
    })
  })
})
