// 测试环境配置
import '@testing-library/jest-dom/vitest'
import React from 'react'
import { vi } from 'vitest'

// 设置开发环境，使 mergeTag 函数返回 data-tag 属性
process.env.NODE_ENV = 'development'

// Mock ResizeObserver
class ResizeObserverMock {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}
global.ResizeObserver = ResizeObserverMock

// Mock URL.revokeObjectURL
if (!window.URL.revokeObjectURL) {
  window.URL.revokeObjectURL = vi.fn()
}

// Mock URL.createObjectURL
if (!window.URL.createObjectURL) {
  window.URL.createObjectURL = vi.fn(() => 'mock-url')
}

// Mock mind-elixir 模块，因为它依赖浏览器 DOM API
vi.mock('mind-elixir', () => ({
  default: class MindElixir {
    static RIGHT = 1
    static LEFT = 2
    static new(topic: string) {
      return {
        nodeData: {
          id: 'root',
          topic,
          children: [],
        },
      }
    }
    bus = {
      addListener: vi.fn(),
    }
    constructor() {}
    init() {}
    install() {}
    destroy() {}
    getData() {
      return { nodeData: { id: 'root', topic: 'test', children: [] } }
    }
  },
}))

vi.mock('@mind-elixir/node-menu', () => ({
  default: class NodeMenu {},
}))

// Mock Draw 组件，因为它依赖 iframe
vi.mock('@/draw/Draw', () => {
  return {
    Draw: ({ value, ...props }: any) => {
      return React.createElement('div', {
        'data-testid': 'drawio-embed',
        'data-xml': value,
        ...props,
      })
    },
  }
})
