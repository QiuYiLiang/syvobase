import { Icon } from '@/icon'
import { Select } from '@/select'

import { CSSProperties } from 'react'
import { Toolbar } from '@/toolbar'
import { $t } from '@/utils/i18n'
import { mergeTag } from '@/utils/tag'

export interface PaginationProps {
  className?: string
  style?: CSSProperties
  index: number
  size?: number
  total: number
  sizeData?: number[]
  onSizeChange?: (size: number) => void
  onIndexChange?: (index: number) => void
}

export const Pagination = (props: PaginationProps) => {
  const {
    className,
    style,
    index,
    total,
    size = 20,
    sizeData = [],
    onIndexChange,
    onSizeChange,
  } = props
  const pageTotal = Math.ceil(total / size)
  const leftEllipsis = index > 3
  const rightEllipsis = index < pageTotal - 3

  const counts =
    pageTotal < 7
      ? Array(pageTotal)
          .fill(undefined)
          .map((_, i) => i)
      : leftEllipsis && !rightEllipsis
        ? [
            0,
            -1,
            ...Array(5)
              .fill(undefined)
              .map((_, i) => i + pageTotal - 6),
          ]
        : !leftEllipsis && rightEllipsis
          ? [
              ...Array(5)
                .fill(undefined)
                .map((_, i) => i),
              -1,
              pageTotal - 1,
            ]
          : [0, -1, index - 1, index, index + 1, -1, pageTotal - 1]

  const handlePrevious = () => {
    onIndexChange?.(index - 1)
  }
  const handleNext = () => {
    onIndexChange?.(index + 1)
  }

  return (
    <Toolbar
      {...mergeTag('pagination', props)}
      className={className}
      style={style}
      left={
        total || total === 0
          ? [
              <div>
                {$t('pagination.total')}: {total}
              </div>,
            ]
          : []
      }
      right={[
        <Select
          value={size}
          className='w-16'
          items={sizeData.map((item) => ({
            id: item,
            name: item,
          }))}
          onChange={(size) => {
            onSizeChange?.(+size)
          }}
        />,
        {
          disabled: index === 0,
          type: 'ghost',
          icon: 'ChevronLeft',
          onClick: handlePrevious,
        },
        ...(counts as any).map((v: number) =>
          v === -1 ? (
            <div className='flex items-center justify-center'>
              <Icon name='Ellipsis' />
            </div>
          ) : (
            {
              type: v === index ? 'outline' : 'ghost',
              onClick: () => onIndexChange?.(v),
              name: v + 1,
            }
          )
        ),
        {
          disabled: index === pageTotal - 1,
          type: 'ghost',
          icon: 'ChevronRight',
          onClick: handleNext,
        },
      ]}
    />
  )
}
