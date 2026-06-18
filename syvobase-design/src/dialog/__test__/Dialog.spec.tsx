import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Dialog } from '../Dialog'

describe('Dialog 对话框组件', () => {
  describe('基础渲染', () => {
    it('open 为 false 时不应该渲染内容', () => {
      render(<Dialog open={false}>对话框内容</Dialog>)
      expect(screen.queryByText('对话框内容')).not.toBeInTheDocument()
    })

    it('open 为 true 时应该渲染内容', () => {
      render(<Dialog open={true}>对话框内容</Dialog>)
      expect(screen.getByText('对话框内容')).toBeInTheDocument()
    })

    it('defaultOpen 为 true 时应该默认打开', () => {
      render(<Dialog defaultOpen={true}>默认打开</Dialog>)
      expect(screen.getByText('默认打开')).toBeInTheDocument()
    })
  })

  describe('关闭功能', () => {
    it('应该有关闭按钮', () => {
      render(<Dialog open={true}>内容</Dialog>)
      const closeButton = screen.getByRole('button')
      expect(closeButton).toBeInTheDocument()
    })

    it('点击关闭按钮应该触发 onOpenChange', () => {
      const onOpenChange = vi.fn()
      render(
        <Dialog open={true} onOpenChange={onOpenChange}>
          内容
        </Dialog>
      )
      const closeButton = screen.getByRole('button')
      fireEvent.click(closeButton)
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })

    it('点击遮罩层应该关闭对话框', async () => {
      const onOpenChange = vi.fn()
      render(
        <Dialog open={true} onOpenChange={onOpenChange}>
          内容
        </Dialog>
      )
      const overlay = document.querySelector(
        'div[data-state="open"][style*="z-index"]'
      )
      fireEvent.click(overlay as Element)
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('方向 (direction)', () => {
    it('默认方向应该是 center', () => {
      render(
        <Dialog open={true} direction='center'>
          居中对话框
        </Dialog>
      )
      expect(screen.getByText('居中对话框')).toBeInTheDocument()
    })

    it('left 方向应该渲染侧边抽屉', () => {
      render(
        <Dialog open={true} direction='left'>
          左侧抽屉
        </Dialog>
      )
      expect(screen.getByText('左侧抽屉')).toBeInTheDocument()
    })

    it('right 方向应该渲染侧边抽屉', () => {
      render(
        <Dialog open={true} direction='right'>
          右侧抽屉
        </Dialog>
      )
      expect(screen.getByText('右侧抽屉')).toBeInTheDocument()
    })

    it('top 方向应该渲染顶部抽屉', () => {
      render(
        <Dialog open={true} direction='top'>
          顶部抽屉
        </Dialog>
      )
      expect(screen.getByText('顶部抽屉')).toBeInTheDocument()
    })

    it('bottom 方向应该渲染底部抽屉', () => {
      render(
        <Dialog open={true} direction='bottom'>
          底部抽屉
        </Dialog>
      )
      expect(screen.getByText('底部抽屉')).toBeInTheDocument()
    })
  })

  describe('标题和工具栏', () => {
    it('应该渲染标题', () => {
      render(
        <Dialog open={true} header='对话框标题'>
          内容
        </Dialog>
      )
      expect(screen.getByText('对话框标题')).toBeInTheDocument()
    })

    it('应该支持自定义工具栏', () => {
      render(
        <Dialog open={true} toolbar={[{ name: '确定' }, { name: '取消' }]}>
          内容
        </Dialog>
      )
      expect(screen.getByText('确定')).toBeInTheDocument()
      expect(screen.getByText('取消')).toBeInTheDocument()
    })
  })

  describe('禁用内容内边距 (disabledContentPadding)', () => {
    it('默认应该有内容内边距', () => {
      render(<Dialog open={true}>内容</Dialog>)
      expect(document.querySelector('.px-4')).toBeInTheDocument()
    })

    it('disabledContentPadding 为 true 时不应该有内边距', () => {
      render(
        <Dialog open={true} disabledContentPadding>
          内容
        </Dialog>
      )
      const contentDiv = document.querySelector('.h-full.w-full')
      expect(contentDiv).not.toHaveClass('px-4')
    })
  })

  describe('自定义 zIndex', () => {
    it('应该支持自定义 zIndex', () => {
      render(
        <Dialog open={true} zIndex={1000}>
          内容
        </Dialog>
      )
      const overlay = document.querySelector('[data-state="open"]')
      expect(overlay).toHaveStyle({ zIndex: '1000' })
    })
  })

  describe('组合场景', () => {
    it('带标题和工具栏的居中对话框应该正确渲染', () => {
      render(
        <Dialog
          open={true}
          header='确认删除'
          toolbar={[
            { name: '取消', type: 'secondary' },
            { name: '删除', type: 'destructive' },
          ]}
        >
          确定要删除这条记录吗？
        </Dialog>
      )
      expect(screen.getByText('确认删除')).toBeInTheDocument()
      expect(screen.getByText('确定要删除这条记录吗？')).toBeInTheDocument()
      expect(screen.getByText('取消')).toBeInTheDocument()
      expect(screen.getByText('删除')).toBeInTheDocument()
    })

    it('右侧抽屉应该正确渲染', () => {
      render(
        <Dialog open={true} direction='right' header='设置'>
          设置内容
        </Dialog>
      )
      expect(screen.getByText('设置')).toBeInTheDocument()
      expect(screen.getByText('设置内容')).toBeInTheDocument()
    })
  })
})
