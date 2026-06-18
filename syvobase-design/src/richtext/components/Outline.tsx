import { useEditorSelector } from 'platejs/react'
import { cn } from '@/utils'
import { $t } from '@/utils/i18n'
import { useEffect, useRef, useState } from 'react'

// 大纲项类型
interface OutlineItem {
  id: string
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  text: string
  level: number
  index: number // 标题在所有标题中的索引
}

// 从节点中提取文本
const extractText = (node: any): string => {
  if (typeof node === 'string') return node
  if (node.text !== undefined) return node.text
  if (node.children) {
    return node.children.map(extractText).join('')
  }
  return ''
}

// 大纲组件 Props
export interface OutlineProps {
  className?: string
  /** 最小显示的标题级别，默认 3 (显示 h1-h3) */
  maxLevel?: number
  /** 当有无标题状态变化时的回调 */
  onHasHeadingsChange?: (hasHeadings: boolean) => void
}

export const Outline = ({
  className,
  maxLevel = 3,
  onHasHeadingsChange,
}: OutlineProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const visibleHeadingsRef = useRef<Set<number>>(new Set())

  // 从编辑器中提取标题
  const outlineItems = useEditorSelector(
    (editor) => {
      const items: OutlineItem[] = []
      const headingTypes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

      editor.children.forEach((node: any) => {
        if (headingTypes.includes(node.type)) {
          const level = parseInt(node.type.slice(1), 10)
          if (level <= maxLevel) {
            items.push({
              id: node.id || `heading-${items.length}`,
              type: node.type,
              text: extractText(node),
              level,
              index: items.length,
            })
          }
        }
      })

      return items
    },
    [maxLevel]
  )

  // 通知父组件标题状态变化
  useEffect(() => {
    onHasHeadingsChange?.(outlineItems.length > 0)
  }, [outlineItems.length, onHasHeadingsChange])

  // 获取滚动容器内的所有标题 DOM 元素
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getHeadingElements = (container: HTMLElement) => {
    const selector = Array.from(
      { length: maxLevel },
      (_, i) => `h${i + 1}`
    ).join(',')
    return Array.from(container.querySelectorAll(selector)) as HTMLElement[]
  }

  // 使用 IntersectionObserver 监听标题可见性
  useEffect(() => {
    if (outlineItems.length === 0) return

    const setupObserver = () => {
      // 找到滚动容器
      const scrollContainer = document.querySelector(
        '[data-richtext-scroll-container]'
      ) as HTMLElement | null

      if (!scrollContainer) {
        // 如果没找到，稍后重试
        requestAnimationFrame(setupObserver)
        return
      }

      const headingElements = getHeadingElements(scrollContainer)
      if (headingElements.length === 0) {
        requestAnimationFrame(setupObserver)
        return
      }

      // 清理旧的 observer
      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      visibleHeadingsRef.current.clear()

      // 创建 IntersectionObserver
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const index = headingElements.indexOf(entry.target as HTMLElement)
            if (index === -1) return

            if (entry.isIntersecting) {
              visibleHeadingsRef.current.add(index)
            } else {
              visibleHeadingsRef.current.delete(index)
            }
          })

          // 设置最小的可见索引为活跃项
          const visibleIndices = Array.from(visibleHeadingsRef.current)
          if (visibleIndices.length > 0) {
            setActiveIndex(Math.min(...visibleIndices))
          }
        },
        {
          root: scrollContainer,
          rootMargin: '0px 0px -70% 0px', // 只检测顶部 30% 区域
          threshold: 0,
        }
      )

      // 观察所有标题元素
      headingElements.forEach((el) => {
        observerRef.current?.observe(el)
      })
    }

    requestAnimationFrame(setupObserver)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [outlineItems, getHeadingElements])

  // 滚动到对应标题
  const scrollToHeading = (index: number) => {
    const scrollContainer = document.querySelector(
      '[data-richtext-scroll-container]'
    ) as HTMLElement | null
    if (!scrollContainer) return

    const headingElements = getHeadingElements(scrollContainer)
    const element = headingElements[index]
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // 计算缩进
  const getIndent = (level: number) => {
    return (level - 1) * 12
  }

  // 无标题时不显示
  if (outlineItems.length === 0) {
    return null
  }

  return (
    <div className={cn('flex w-56 flex-col py-3', className)}>
      {/* 大纲列表 */}
      <div className='border-border relative border-l'>
        <nav>
          {outlineItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToHeading(item.index)}
              className={cn(
                'text-muted-foreground hover:text-foreground relative -ml-px w-full truncate border-l-2 border-transparent py-1 pr-2 text-left text-sm transition-colors',
                activeIndex === item.index && 'border-primary text-foreground'
              )}
              style={{ paddingLeft: `${8 + getIndent(item.level)}px` }}
              title={item.text}
            >
              {item.text || $t('richtext.untitledHeading')}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
