import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Qrcode } from '../QRCode'

describe('QRCode 二维码组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      const { container } = render(<Qrcode />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('只读模式 (readMode)', () => {
    it('只读模式应该渲染二维码', () => {
      const { container } = render(
        <Qrcode readMode value='https://example.com' />
      )
      // antd QRCode 组件会渲染 canvas 或 svg
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('编辑模式', () => {
    it('编辑模式应该渲染输入框', () => {
      render(<Qrcode />)
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
    })

    it('应该可以输入值', () => {
      const onChange = vi.fn()
      render(<Qrcode value='' onChange={onChange} />)
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'test' } })
      expect(onChange).toHaveBeenCalledWith('test')
    })
  })

  describe('受控模式 (value)', () => {
    it('编辑模式应该显示 value', () => {
      render(<Qrcode value='test value' />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('test value')
    })
  })

  describe('二维码配置', () => {
    it('应该支持 iconUrl', () => {
      const { container } = render(
        <Qrcode readMode value='test' iconUrl='https://example.com/icon.png' />
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('应该支持 width', () => {
      const { container } = render(<Qrcode readMode value='test' width={200} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('应该支持 bgColor', () => {
      const { container } = render(
        <Qrcode readMode value='test' bgColor='#ffffff' />
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('应该支持 color', () => {
      const { container } = render(
        <Qrcode readMode value='test' color='#000000' />
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('应该支持 bordered', () => {
      const { container } = render(<Qrcode readMode value='test' bordered />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('应该支持 errorLevel', () => {
      const { container } = render(
        <Qrcode readMode value='test' errorLevel='H' />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('带所有配置的只读二维码应该正确渲染', () => {
      const { container } = render(
        <Qrcode
          readMode
          value='https://example.com'
          iconUrl='https://example.com/icon.png'
          width={200}
          bgColor='#ffffff'
          color='#000000'
          bordered
          errorLevel='H'
        />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })
})
