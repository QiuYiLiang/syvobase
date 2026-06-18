import { Meta, StoryObj } from '@storybook/react-vite'

import { Carousel } from '@/carousel'
import { CSSProperties } from 'react'

const meta = {
  title: 'Layout/Carousel',
  component: Carousel,
  argTypes: {
    autoplay: {
      control: 'boolean',
      description: '是否自动播放',
    },
    dots: {
      control: 'boolean',
      description: '是否显示指示点',
    },
    dotPosition: {
      control: 'inline-radio',
      options: ['top', 'bottom', 'left', 'right'],
      description: '指示点位置',
    },
    effect: {
      control: 'inline-radio',
      options: ['scrollx', 'fade'],
      description: '切换效果',
    },
    infinite: {
      control: 'boolean',
      description: '是否无限循环',
    },
  },
  args: {},
} satisfies Meta<typeof Carousel>

export default meta

type Story = StoryObj<typeof meta>

const contentStyle: CSSProperties = {
  margin: 0,
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
}

const slides = [
  <div key='1'>
    <h3 style={contentStyle}>1</h3>
  </div>,
  <div key='2'>
    <h3 style={contentStyle}>2</h3>
  </div>,
  <div key='3'>
    <h3 style={contentStyle}>3</h3>
  </div>,
  <div key='4'>
    <h3 style={contentStyle}>4</h3>
  </div>,
]

// 默认轮播
export const Default: Story = {
  args: {
    style: {
      width: 500,
    },
    children: slides,
  },
}

// 自动播放
export const Autoplay: Story = {
  args: {
    style: {
      width: 500,
    },
    autoplay: true,
    children: slides,
  },
}

// 渐变效果
export const FadeEffect: Story = {
  args: {
    style: {
      width: 500,
    },
    effect: 'fade',
    children: slides,
  },
}

// 指示点在上方
export const DotsTop: Story = {
  args: {
    style: {
      width: 500,
    },
    dotPosition: 'top',
    children: slides,
  },
}

// 指示点在左侧
export const DotsLeft: Story = {
  args: {
    style: {
      width: 500,
      height: 300,
    },
    dotPosition: 'left',
    children: slides,
  },
}

// 指示点在右侧
export const DotsRight: Story = {
  args: {
    style: {
      width: 500,
      height: 300,
    },
    dotPosition: 'right',
    children: slides,
  },
}

// 不显示指示点
export const NoDots: Story = {
  args: {
    style: {
      width: 500,
    },
    dots: false,
    children: slides,
  },
}

// 自动播放 + 渐变效果
export const AutoplayFade: Story = {
  args: {
    style: {
      width: 500,
    },
    autoplay: true,
    effect: 'fade',
    children: slides,
  },
}

// 带图片的轮播
export const WithImages: Story = {
  args: {
    style: {
      width: 600,
    },
    autoplay: true,
    children: [
      <div key='1'>
        <img
          src='https://picsum.photos/600/200?random=1'
          alt='image1'
          style={{ width: '100%', height: 200, objectFit: 'cover' }}
        />
      </div>,
      <div key='2'>
        <img
          src='https://picsum.photos/600/200?random=2'
          alt='image2'
          style={{ width: '100%', height: 200, objectFit: 'cover' }}
        />
      </div>,
      <div key='3'>
        <img
          src='https://picsum.photos/600/200?random=3'
          alt='image3'
          style={{ width: '100%', height: 200, objectFit: 'cover' }}
        />
      </div>,
    ],
  },
}
