import { ReactNode, useRef } from 'react'
import { useVirtualList } from '@/utils/hooks/useVirtualList'
import { useTableContext, VirtualContext, VirtualContextType } from './shared'

interface TableContentProps {
  children: ReactNode
}

export const TableContent = ({ children }: TableContentProps) => {
  const { currentTableData, scrollRef, virtual } = useTableContext()
  const bodyRef = useRef<HTMLTableSectionElement>(null)

  // 使用虚拟列表，scrollRef 根据甘特图模式选择
  // 甘特图模式下两个区域同步滚动，使用表格的 scrollRef
  const { virtualList, paddingTop, paddingBottom } = useVirtualList({
    enabled: virtual.vertical,
    data: currentTableData,
    estimateSize: () => 32,
    overscan: 5,
    scrollRef: scrollRef,
    getItemElement: (item) => {
      return bodyRef.current?.querySelector(
        `tr[data-key="${item.id}"]`
      ) as HTMLElement
    },
  })

  const contextValue: VirtualContextType = {
    virtualList,
    paddingTop,
    paddingBottom,
    bodyRef,
  }

  return <VirtualContext value={contextValue}>{children}</VirtualContext>
}
