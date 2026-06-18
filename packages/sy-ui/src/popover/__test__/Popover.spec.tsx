import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { Popover } from '../Popover'

describe('Popover 弹出框组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染触发元素', () => {
      render(
        <Popover content='提示内容'>
          <button>触发按钮</button>
        </Popover>
      )
      expect(screen.getByText('触发按钮')).toBeInTheDocument()
    })
  })

  describe('click 触发', () => {
    it('click 触发应该在点击时显示', async () => {
      render(
        <Popover content='点击提示' trigger='click'>
          <button>点击我</button>
        </Popover>
      )
      const button = screen.getByText('点击我')
      await act(async () => {
        fireEvent.click(button)
      })
      await waitFor(() => {
        expect(screen.getByText('点击提示')).toBeInTheDocument()
      })
    })
  })

  describe('内容 (content)', () => {
    it('应该支持字符串内容', async () => {
      render(
        <Popover content='字符串提示' trigger='click'>
          <button>触发</button>
        </Popover>
      )
      await act(async () => {
        fireEvent.click(screen.getByText('触发'))
      })
      await waitFor(() => {
        expect(screen.getByText('字符串提示')).toBeInTheDocument()
      })
    })

    it('应该支持 ReactNode 内容', async () => {
      render(
        <Popover
          content={<div data-testid='custom-content'>自定义内容</div>}
          trigger='click'
        >
          <button>触发</button>
        </Popover>
      )
      await act(async () => {
        fireEvent.click(screen.getByText('触发'))
      })
      await waitFor(() => {
        expect(screen.getByTestId('custom-content')).toBeInTheDocument()
      })
    })

    it('应该支持函数返回内容', async () => {
      render(
        <Popover content={() => <span>函数内容</span>} trigger='click'>
          <button>触发</button>
        </Popover>
      )
      await act(async () => {
        fireEvent.click(screen.getByText('触发'))
      })
      await waitFor(() => {
        expect(screen.getByText('函数内容')).toBeInTheDocument()
      })
    })
  })

  describe('禁用状态 (disabled)', () => {
    it('disabled 为 true 时不应该显示弹出框', async () => {
      render(
        <Popover content='禁用的提示' disabled trigger='click'>
          <button>禁用触发</button>
        </Popover>
      )
      await act(async () => {
        fireEvent.click(screen.getByText('禁用触发'))
      })
      await new Promise((resolve) => setTimeout(resolve, 100))
      expect(screen.queryByText('禁用的提示')).not.toBeInTheDocument()
    })
  })

  describe('方向 (direction)', () => {
    it('应该支持 bottom 方向', async () => {
      render(
        <Popover content='底部提示' direction='bottom' trigger='click'>
          <button>触发</button>
        </Popover>
      )
      await act(async () => {
        fireEvent.click(screen.getByText('触发'))
      })
      await waitFor(() => {
        expect(screen.getByText('底部提示')).toBeInTheDocument()
      })
    })

    it('应该支持 top 方向', async () => {
      render(
        <Popover content='顶部提示' direction='top' trigger='click'>
          <button>触发</button>
        </Popover>
      )
      await act(async () => {
        fireEvent.click(screen.getByText('触发'))
      })
      await waitFor(() => {
        expect(screen.getByText('顶部提示')).toBeInTheDocument()
      })
    })

    it('应该支持 left 方向', async () => {
      render(
        <Popover content='左侧提示' direction='left' trigger='click'>
          <button>触发</button>
        </Popover>
      )
      await act(async () => {
        fireEvent.click(screen.getByText('触发'))
      })
      await waitFor(() => {
        expect(screen.getByText('左侧提示')).toBeInTheDocument()
      })
    })

    it('应该支持 right 方向', async () => {
      render(
        <Popover content='右侧提示' direction='right' trigger='click'>
          <button>触发</button>
        </Popover>
      )
      await act(async () => {
        fireEvent.click(screen.getByText('触发'))
      })
      await waitFor(() => {
        expect(screen.getByText('右侧提示')).toBeInTheDocument()
      })
    })
  })

  describe('对齐方式 (align)', () => {
    it('应该支持 center 对齐', async () => {
      render(
        <Popover content='居中对齐' align='center' trigger='click'>
          <button>触发</button>
        </Popover>
      )
      await act(async () => {
        fireEvent.click(screen.getByText('触发'))
      })
      await waitFor(() => {
        expect(screen.getByText('居中对齐')).toBeInTheDocument()
      })
    })

    it('应该支持 left 对齐', async () => {
      render(
        <Popover content='左对齐' align='left' trigger='click'>
          <button>触发</button>
        </Popover>
      )
      await act(async () => {
        fireEvent.click(screen.getByText('触发'))
      })
      await waitFor(() => {
        expect(screen.getByText('左对齐')).toBeInTheDocument()
      })
    })

    it('应该支持 right 对齐', async () => {
      render(
        <Popover content='右对齐' align='right' trigger='click'>
          <button>触发</button>
        </Popover>
      )
      await act(async () => {
        fireEvent.click(screen.getByText('触发'))
      })
      await waitFor(() => {
        expect(screen.getByText('右对齐')).toBeInTheDocument()
      })
    })
  })

  describe('偏移量 (offset)', () => {
    it('应该支持自定义偏移量', async () => {
      render(
        <Popover content='偏移提示' offset={10} trigger='click'>
          <button>触发</button>
        </Popover>
      )
      await act(async () => {
        fireEvent.click(screen.getByText('触发'))
      })
      await waitFor(() => {
        expect(screen.getByText('偏移提示')).toBeInTheDocument()
      })
    })
  })

  describe('等宽 (equalWidth)', () => {
    it('equalWidth 为 true 时弹出框应该正常显示', async () => {
      render(
        <Popover content='等宽提示' equalWidth trigger='click'>
          <button style={{ width: '200px' }}>宽触发器</button>
        </Popover>
      )
      await act(async () => {
        fireEvent.click(screen.getByText('宽触发器'))
      })
      await waitFor(() => {
        expect(screen.getByText('等宽提示')).toBeInTheDocument()
      })
    })
  })

  describe('组合场景', () => {
    it('点击触发的顶部对齐弹出框应该正确渲染', async () => {
      render(
        <Popover content='点击顶部' trigger='click' direction='top'>
          <button>点击顶部触发</button>
        </Popover>
      )
      await act(async () => {
        fireEvent.click(screen.getByText('点击顶部触发'))
      })
      await waitFor(() => {
        expect(screen.getByText('点击顶部')).toBeInTheDocument()
      })
    })

    it('带自定义内容的弹出框应该正确渲染', async () => {
      render(
        <Popover
          content={
            <div>
              <h3>标题</h3>
              <p>详细内容</p>
            </div>
          }
          trigger='click'
        >
          <button>复杂内容</button>
        </Popover>
      )
      await act(async () => {
        fireEvent.click(screen.getByText('复杂内容'))
      })
      await waitFor(() => {
        expect(screen.getByText('标题')).toBeInTheDocument()
        expect(screen.getByText('详细内容')).toBeInTheDocument()
      })
    })
  })
})
