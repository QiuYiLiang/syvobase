import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Carousel } from '../Carousel'

describe('Carousel 走马灯组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      const { container } = render(
        <Carousel>
          <div>幻灯片1</div>
          <div>幻灯片2</div>
          <div>幻灯片3</div>
        </Carousel>
      )
      expect(container.querySelector('.slick-slider')).toBeInTheDocument()
    })

    it('应该渲染所有幻灯片', () => {
      render(
        <Carousel>
          <div>幻灯片1</div>
          <div>幻灯片2</div>
          <div>幻灯片3</div>
        </Carousel>
      )
      // Carousel 会克隆幻灯片用于无限轮播，因此会有多个相同文本的元素
      expect(screen.getAllByText('幻灯片1').length).toBeGreaterThan(0)
    })
  })

  describe('自动播放 (autoplay)', () => {
    it('应该支持自动播放', () => {
      const { container } = render(
        <Carousel autoplay>
          <div>幻灯片1</div>
          <div>幻灯片2</div>
        </Carousel>
      )
      expect(container.querySelector('.slick-slider')).toBeInTheDocument()
    })
  })

  describe('指示点 (dots)', () => {
    it('默认应该显示指示点', () => {
      const { container } = render(
        <Carousel>
          <div>幻灯片1</div>
          <div>幻灯片2</div>
        </Carousel>
      )
      expect(container.querySelector('.slick-dots')).toBeInTheDocument()
    })

    it('dots 为 false 时不应该显示指示点', () => {
      const { container } = render(
        <Carousel dots={false}>
          <div>幻灯片1</div>
          <div>幻灯片2</div>
        </Carousel>
      )
      expect(container.querySelector('.slick-dots')).not.toBeInTheDocument()
    })
  })

  describe('垂直方向 (vertical)', () => {
    it('应该支持垂直方向', () => {
      const { container } = render(
        <Carousel dotPosition='left'>
          <div>幻灯片1</div>
          <div>幻灯片2</div>
        </Carousel>
      )
      expect(container.querySelector('.slick-slider')).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('带自动播放和多个幻灯片应该正确渲染', () => {
      render(
        <Carousel autoplay>
          <div>内容1</div>
          <div>内容2</div>
          <div>内容3</div>
          <div>内容4</div>
        </Carousel>
      )
      // Carousel 会克隆幻灯片用于无限轮播，因此会有多个相同文本的元素
      expect(screen.getAllByText('内容1').length).toBeGreaterThan(0)
    })
  })
})
