import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
  RefObject,
} from 'react'
import { cn } from '@/utils'
import { $t } from '@/utils/i18n'
import dayjs, { Dayjs } from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { GanttViewMode, TableNode, useTableContext } from './shared'
import { Popover } from '@/popover'
import { CheckboxGroup } from '@/checkboxGroup'
import { DatePicker } from '@/datePicker'
import { Number } from '@/number'

dayjs.extend(isBetween)
dayjs.extend(weekOfYear)

// 甘特图滚动边界检测 hook
interface UseGanttScrollBoundaryOptions {
  scrollRef: RefObject<HTMLElement | null>
  columnWidth: number
  leftFixedWidth: number
  totalColumns: number
  onReachStart?: () => void
  onReachEnd?: () => void
}

export const useGanttScrollBoundary = ({
  scrollRef,
  columnWidth,
  leftFixedWidth,
  totalColumns,
  onReachStart,
  onReachEnd,
}: UseGanttScrollBoundaryOptions) => {
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const containerWidth = container.clientWidth
      const totalWidth = totalColumns * columnWidth
      const maxScrollLeft = totalWidth - containerWidth + leftFixedWidth

      // 只有完全触碰到边界才触发加载
      // 到达左边界
      if (scrollLeft <= 0 && onReachStart) {
        onReachStart()
        return
      }

      // 到达右边界
      if (scrollLeft >= maxScrollLeft - 1 && onReachEnd) {
        onReachEnd()
        return
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [
    scrollRef,
    columnWidth,
    leftFixedWidth,
    totalColumns,
    onReachStart,
    onReachEnd,
  ])
}

// 获取甘特图配置的 hook
export const useGanttConfig = () => {
  const {
    currentTableData,
    fieldNames,
    ganttMode = 'day',
    scrollRef,
    columns,
    columnWidthConfigMap,
  } = useTableContext()

  const { startDateKey, endDateKey } = fieldNames

  // 内部视图模式状态
  const [viewMode, setViewModeState] = useState<GanttViewMode>(ganttMode)

  // 根据视图类型获取固定的列数量
  const getFixedColumnCount = (mode: GanttViewMode) => {
    switch (mode) {
      case 'day':
        return 120 // 日视图显示120天
      case 'week':
        return 48 // 周视图显示48周
      case 'month':
        return 24 // 月视图显示24个月
      default:
        return 120
    }
  }

  // 根据视图模式调整列宽
  const columnWidth = viewMode === 'day' ? 40 : viewMode === 'week' ? 80 : 100

  // 计算左侧固定列的总宽度
  const leftFixedWidth = useMemo(() => {
    return columns.reduce((total, col) => {
      // 在甘特图模式下，所有普通列都是左侧固定的
      const width = columnWidthConfigMap[col.id] || 100
      return total + width
    }, 0)
  }, [columns, columnWidthConfigMap])

  // 计算数据的时间范围（基于实际数据）
  const dataTimeRange = useMemo(() => {
    let minDate: Dayjs | null = null
    let maxDate: Dayjs | null = null

    currentTableData.forEach((node) => {
      const startDate = node.data[startDateKey!]
      const endDate = node.data[endDateKey!]
      if (startDate) {
        const start = dayjs(startDate)
        if (!minDate || start.isBefore(minDate)) {
          minDate = start
        }
      }
      if (endDate) {
        const end = dayjs(endDate)
        if (!maxDate || end.isAfter(maxDate)) {
          maxDate = end
        }
      }
    })

    if (!minDate) minDate = dayjs().subtract(7, 'day')
    if (!maxDate) maxDate = dayjs().add(7, 'day')

    return { minDate, maxDate }
  }, [currentTableData, startDateKey, endDateKey])

  // 基准日期 - 用于切换视图时保持位置
  const [anchorDate, setAnchorDate] = useState<Dayjs>(dayjs())

  // 当数据范围变化时，重置锚点日期
  const minDateValue = dataTimeRange.minDate.valueOf()
  const maxDateValue = dataTimeRange.maxDate.valueOf()
  useEffect(() => {
    // 设置锚点日期为数据范围中间
    setAnchorDate(
      dayjs(
        (dataTimeRange.minDate.valueOf() + dataTimeRange.maxDate.valueOf()) / 2
      )
    )
  }, [minDateValue, maxDateValue, dataTimeRange.minDate, dataTimeRange.maxDate])

  // 获取当前可视区域中心的日期
  const getCurrentVisibleCenterDate = useCallback((): Dayjs => {
    const container = scrollRef.current
    if (!container) return anchorDate

    const scrollLeft = container.scrollLeft
    const containerWidth = container.clientWidth
    const visibleCenterX = scrollLeft + (containerWidth - leftFixedWidth) / 2

    // 计算中心位置对应的列索引
    const columnIndex = Math.floor(visibleCenterX / columnWidth)

    // 根据当前视图模式计算日期
    const fixedCount = getFixedColumnCount(viewMode)
    const halfCount = Math.floor(fixedCount / 2)
    const startColumnOffset = -halfCount

    switch (viewMode) {
      case 'day':
        return anchorDate.add(startColumnOffset + columnIndex, 'day')
      case 'week':
        return anchorDate
          .startOf('week')
          .add(startColumnOffset + columnIndex, 'week')
      case 'month':
        return anchorDate
          .startOf('month')
          .add(startColumnOffset + columnIndex, 'month')
      default:
        return anchorDate
    }
  }, [scrollRef, leftFixedWidth, columnWidth, viewMode, anchorDate])

  // 切换视图模式，保持当前可视位置
  const setViewMode = useCallback(
    (newMode: GanttViewMode) => {
      if (newMode === viewMode) return

      // 获取当前可视中心的日期
      const centerDate = getCurrentVisibleCenterDate()

      // 更新锚点日期
      setAnchorDate(centerDate)

      // 切换视图模式
      setViewModeState(newMode)

      // 延迟滚动到中心位置
      setTimeout(() => {
        const container = scrollRef.current
        if (!container) return

        const newColumnWidth =
          newMode === 'day' ? 40 : newMode === 'week' ? 80 : 100
        const fixedCount = getFixedColumnCount(newMode)
        const halfCount = Math.floor(fixedCount / 2)

        // 滚动到中心
        const targetScrollLeft =
          halfCount * newColumnWidth -
          (container.clientWidth - leftFixedWidth) / 2
        container.scrollLeft = Math.max(0, targetScrollLeft)
      }, 0)
    },
    [viewMode, getCurrentVisibleCenterDate, scrollRef, leftFixedWidth]
  )

  // 滚动到今天
  const scrollToToday = useCallback(() => {
    const today = dayjs()

    // 更新锚点日期为今天
    setAnchorDate(today)

    // 延迟滚动到中心位置
    setTimeout(() => {
      const container = scrollRef.current
      if (!container) return

      const fixedCount = getFixedColumnCount(viewMode)
      const halfCount = Math.floor(fixedCount / 2)

      // 滚动到中心
      const targetScrollLeft =
        halfCount * columnWidth - (container.clientWidth - leftFixedWidth) / 2
      container.scrollLeft = Math.max(0, targetScrollLeft)
    }, 0)
  }, [viewMode, scrollRef, leftFixedWidth, columnWidth])

  // 计算完整时间范围（基于锚点日期和固定列数）
  const fullTimeRange = useMemo(() => {
    const fixedCount = getFixedColumnCount(viewMode)
    const halfCount = Math.floor(fixedCount / 2)

    let start: Dayjs
    let end: Dayjs

    switch (viewMode) {
      case 'day':
        start = anchorDate.subtract(halfCount, 'day').startOf('day')
        end = anchorDate.add(halfCount, 'day').endOf('day')
        break
      case 'week':
        start = anchorDate.startOf('week').subtract(halfCount, 'week')
        end = anchorDate.startOf('week').add(halfCount, 'week')
        break
      case 'month':
        start = anchorDate.startOf('month').subtract(halfCount, 'month')
        end = anchorDate.startOf('month').add(halfCount, 'month')
        break
      default:
        start = anchorDate.subtract(halfCount, 'day').startOf('day')
        end = anchorDate.add(halfCount, 'day').endOf('day')
    }

    return { start, end }
  }, [anchorDate, viewMode])

  // 生成所有日期列（固定数量）
  const ganttColumns = useMemo(() => {
    const columns: Dayjs[] = []
    const fixedCount = getFixedColumnCount(viewMode)
    let current = fullTimeRange.start

    for (let i = 0; i < fixedCount; i++) {
      columns.push(current)
      switch (viewMode) {
        case 'day':
          current = current.add(1, 'day')
          break
        case 'week':
          current = current.add(1, 'week')
          break
        case 'month':
          current = current.add(1, 'month')
          break
      }
    }
    return columns
  }, [fullTimeRange.start, viewMode])

  // 边界加载锁定
  const boundaryLoadingRef = useRef(false)

  const handleReachStart = useCallback(() => {
    const container = scrollRef.current
    const currentScrollLeft = container?.scrollLeft ?? 0

    // 向左扩展：移动锚点日期（只移动四分之一，减少跳动）
    const fixedCount = getFixedColumnCount(viewMode)
    const expandCount = Math.floor(fixedCount / 4)
    switch (viewMode) {
      case 'day':
        setAnchorDate((prev) => prev.subtract(expandCount, 'day'))
        break
      case 'week':
        setAnchorDate((prev) => prev.subtract(expandCount, 'week'))
        break
      case 'month':
        setAnchorDate((prev) => prev.subtract(expandCount, 'month'))
        break
    }

    // 使用 requestAnimationFrame 保持滚动位置平滑
    requestAnimationFrame(() => {
      if (container) {
        // 锚点日期向左移动了 expandCount，时间范围起点也向左移动了 expandCount
        // 所以滚动条需要向右调整 expandCount * columnWidth 来保持视觉位置
        container.scrollLeft = expandCount * columnWidth + currentScrollLeft
      }
      // 稍微延迟重置，避免连续触发
      setTimeout(() => {
        boundaryLoadingRef.current = false
      }, 150)
    })
  }, [viewMode, scrollRef, columnWidth])

  const handleReachEnd = useCallback(() => {
    const container = scrollRef.current
    const currentScrollLeft = container?.scrollLeft ?? 0

    // 向右扩展：移动锚点日期（只移动四分之一，减少跳动）
    const fixedCount = getFixedColumnCount(viewMode)
    const expandCount = Math.floor(fixedCount / 4)
    switch (viewMode) {
      case 'day':
        setAnchorDate((prev) => prev.add(expandCount, 'day'))
        break
      case 'week':
        setAnchorDate((prev) => prev.add(expandCount, 'week'))
        break
      case 'month':
        setAnchorDate((prev) => prev.add(expandCount, 'month'))
        break
    }

    // 使用 requestAnimationFrame 保持滚动位置平滑
    requestAnimationFrame(() => {
      if (container) {
        // 锚点日期向右移动了 expandCount，时间范围起点也向右移动了 expandCount
        // 所以滚动条需要向左调整 expandCount * columnWidth 来保持视觉位置
        container.scrollLeft = currentScrollLeft - expandCount * columnWidth
      }
      // 稍微延迟重置，避免连续触发
      setTimeout(() => {
        boundaryLoadingRef.current = false
      }, 150)
    })
  }, [viewMode, scrollRef, columnWidth])

  // 扩展时间范围的回调
  useGanttScrollBoundary({
    scrollRef,
    columnWidth,
    leftFixedWidth,
    totalColumns: ganttColumns.length,
    onReachStart: useCallback(() => {
      if (boundaryLoadingRef.current) return
      boundaryLoadingRef.current = true
      handleReachStart()
    }, [handleReachStart]),
    onReachEnd: useCallback(() => {
      if (boundaryLoadingRef.current) return
      boundaryLoadingRef.current = true
      handleReachEnd()
    }, [handleReachEnd]),
  })

  return {
    viewMode,
    setViewMode,
    columnWidth,
    ganttColumns,
    fullTimeRange,
    scrollToToday,
  }
}

// 甘特图 Context
interface GanttContextType {
  viewMode: GanttViewMode
  setViewMode: (mode: GanttViewMode) => void
  columnWidth: number
  ganttColumns: Dayjs[]
  fullTimeRange: { start: Dayjs; end: Dayjs }
  scrollToToday: () => void
}

export const GanttContext = createContext<GanttContextType | null>(null)

export const useGanttContext = () => {
  const ctx = useContext(GanttContext)
  if (!ctx) {
    throw new Error('useGanttContext must be used within GanttContext.Provider')
  }
  return ctx
}

// 甘特图表头单元格
interface GanttHeaderCellProps {
  date: Dayjs
  index: number
  isFirstOfMonth?: boolean
  monthColSpan?: number
}

export const GanttHeaderCell = (props: GanttHeaderCellProps) => {
  const { date } = props
  const { viewMode, columnWidth } = useGanttContext()

  const isWeekend = viewMode === 'day' && (date.day() === 0 || date.day() === 6)
  const isToday = date.isSame(dayjs(), 'day')

  const formatLabel = () => {
    switch (viewMode) {
      case 'day':
        return date.format('D')
      case 'week':
        return $t('gantt.week', '周') + date.week()
      case 'month':
        return date.format('M月')
      default:
        return date.format('D')
    }
  }

  // 获取中文星期名称
  const getChineseWeekday = (day: number) => {
    const weekdays = [
      $t('gantt.weekday.sun', '周日'),
      $t('gantt.weekday.mon', '周一'),
      $t('gantt.weekday.tue', '周二'),
      $t('gantt.weekday.wed', '周三'),
      $t('gantt.weekday.thu', '周四'),
      $t('gantt.weekday.fri', '周五'),
      $t('gantt.weekday.sat', '周六'),
    ]
    return weekdays[day]
  }

  const formatSubLabel = () => {
    switch (viewMode) {
      case 'day':
        return getChineseWeekday(date.day())
      default:
        return ''
    }
  }

  return (
    <th
      className={cn(
        'bg-secondary border-border border-r border-b p-0 text-xs font-normal'
      )}
      style={{ width: columnWidth, minWidth: columnWidth }}
    >
      <div className='flex flex-col items-center justify-center py-1'>
        <span
          className={cn((isWeekend || isToday) && 'text-primary font-medium')}
        >
          {formatLabel()}
        </span>
        {formatSubLabel() && (
          <span className='text-muted-foreground text-[10px]'>
            {formatSubLabel()}
          </span>
        )}
      </div>
    </th>
  )
}

// 甘特图月份表头行（第一行）
export const GanttMonthHeaderCells = () => {
  const { columnWidth, ganttColumns } = useGanttContext()

  // 按月分组
  const monthGroups = useMemo(() => {
    if (ganttColumns.length === 0) return []

    const groups: { key: string; label: string; count: number }[] = []
    let currentMonth = ''

    ganttColumns.forEach((date) => {
      const monthKey = date.format('YYYY-MM')
      if (monthKey !== currentMonth) {
        groups.push({
          key: monthKey,
          label: date.format('YYYY年M月'),
          count: 1,
        })
        currentMonth = monthKey
      } else {
        groups[groups.length - 1].count++
      }
    })

    return groups
  }, [ganttColumns])

  return (
    <>
      {/* 月份 */}
      {monthGroups.map(({ key, label, count }) => (
        <th
          key={key}
          colSpan={count}
          className='bg-secondary border-border border-r border-b p-0 text-xs font-medium'
          style={{ width: count * columnWidth, minWidth: count * columnWidth }}
        >
          <div className='flex h-8 items-center justify-center'>{label}</div>
        </th>
      ))}
    </>
  )
}

// 甘特图视图切换按钮 - 固定在右上角
export const GanttViewModeSwitcher = () => {
  const { viewMode, setViewMode, scrollToToday } = useGanttContext()

  const handleChange = (value: string) => {
    if (value === 'today') {
      scrollToToday()
    } else {
      setViewMode(value as GanttViewMode)
    }
  }

  return (
    <CheckboxGroup
      className='bg-background absolute top-1 right-1 rounded-lg py-1'
      multiple={false}
      allowClear={false}
      styleType='pills'
      value={viewMode}
      items={[
        { id: 'today', name: $t('gantt.today') },
        { id: 'day', name: $t('gantt.day') },
        { id: 'week', name: $t('gantt.week') },
        { id: 'month', name: $t('gantt.month') },
      ]}
      onChange={handleChange}
    />
  )
}

// 甘特图日期表头行（第二行）
export const GanttDateHeaderCells = () => {
  const { ganttColumns } = useGanttContext()

  return (
    <>
      {/* 日期 */}
      {ganttColumns.map((date, i) => (
        <GanttHeaderCell key={i} date={date} index={i} />
      ))}
    </>
  )
}

// 甘特图数据单元格 - 简单单元格，只显示背景
interface GanttDataCellProps {
  node: TableNode
  date: Dayjs
  index: number
}

export const GanttDataCell = (props: GanttDataCellProps) => {
  const { node, date } = props
  const { viewMode, columnWidth } = useGanttContext()

  const isWeekend = viewMode === 'day' && (date.day() === 0 || date.day() === 6)
  const isToday = date.isSame(dayjs(), 'day')

  // 分组行显示空单元格
  if (node.group) {
    return (
      <td
        className={cn(
          'bg-background border-border relative border-r border-b p-0',
          isWeekend && 'bg-muted/30'
        )}
        style={{ width: columnWidth, minWidth: columnWidth }}
      />
    )
  }

  return (
    <td
      className={cn(
        'bg-background border-border relative border-r border-b p-0',
        isWeekend && 'bg-muted/30',
        isToday && 'bg-primary/5'
      )}
      style={{
        width: columnWidth,
        minWidth: columnWidth,
        height: 'inherit',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 今日标记线 */}
      {isToday && (
        <div className='bg-primary pointer-events-none absolute top-0 bottom-0 left-1/2 z-5 w-0.5 -translate-x-1/2' />
      )}
    </td>
  )
}

// 拖拽类型
type DragType = 'move' | 'resize-left' | 'resize-right' | 'create' | null

// 任务条组件 - 支持拖拽改变时间
interface GanttTaskBarProps {
  node: TableNode
}

const GanttTaskBar = (props: GanttTaskBarProps) => {
  const { node } = props
  const { columnWidth, ganttColumns, fullTimeRange } = useGanttContext()
  const { fieldNames, onRowClick, updateRow, readMode, disabled } =
    useTableContext()

  // 是否禁用编辑（只读或禁用状态）
  const isDisabled = readMode || disabled

  const { nameKey, startDateKey, endDateKey, percentageKey } = fieldNames
  const { idKey } = fieldNames

  // 拖拽状态
  const [isDragging, setIsDragging] = useState(false)
  const [dragType, setDragType] = useState<DragType>(null)
  const [isHovering, setIsHovering] = useState(false)

  // 临时拖拽值
  const [tempStartDate, setTempStartDate] = useState<Dayjs | null>(null)
  const [tempEndDate, setTempEndDate] = useState<Dayjs | null>(null)

  // 拖拽起始信息
  const dragStartRef = useRef<{
    startX: number
    originalLeft: number
    originalWidth: number
    originalStartDate: Dayjs
    originalEndDate: Dayjs
  } | null>(null)

  const barRef = useRef<HTMLDivElement>(null)

  // 获取数据
  const startDate = node.data[startDateKey!]
  const endDate = node.data[endDateKey!]
  const percentage = node.data[percentageKey!] || 0

  // 计算日期相关的值（即使没有数据也需要计算，但使用默认值）
  const start = tempStartDate || (startDate ? dayjs(startDate) : null)
  const end = tempEndDate || (endDate ? dayjs(endDate) : null)
  const currentPercentage = percentage

  // 计算任务条在整个甘特图中的绝对位置
  const totalDays = fullTimeRange.end.diff(fullTimeRange.start, 'day') + 1
  const totalWidth = ganttColumns.length * columnWidth
  const pixelsPerDay = totalWidth / totalDays

  const startDiff = start ? start.diff(fullTimeRange.start, 'day') : 0
  const endDiff = end ? end.diff(fullTimeRange.start, 'day') : 0

  const absoluteLeft = startDiff * pixelsPerDay
  const barWidth = Math.max((endDiff - startDiff + 1) * pixelsPerDay, 20)

  // 像素转天数
  const pixelsToDays = useCallback(
    (pixels: number) => {
      return Math.round(pixels / pixelsPerDay)
    },
    [pixelsPerDay]
  )

  // 开始拖拽
  const handleDragStart = useCallback(
    (e: React.MouseEvent, type: DragType) => {
      if (isDisabled || !startDate || !endDate) return
      e.preventDefault()
      e.stopPropagation()

      setIsDragging(true)
      setDragType(type)

      dragStartRef.current = {
        startX: e.clientX,
        originalLeft: absoluteLeft,
        originalWidth: barWidth,
        originalStartDate: dayjs(startDate),
        originalEndDate: dayjs(endDate),
      }
    },
    [isDisabled, absoluteLeft, barWidth, startDate, endDate]
  )

  // 处理拖拽移动
  useEffect(() => {
    if (!isDragging || !dragStartRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      const { startX, originalStartDate, originalEndDate } =
        dragStartRef.current!
      const deltaX = e.clientX - startX

      switch (dragType) {
        case 'move': {
          // 整体移动
          const daysDelta = pixelsToDays(deltaX)
          setTempStartDate(originalStartDate.add(daysDelta, 'day'))
          setTempEndDate(originalEndDate.add(daysDelta, 'day'))
          break
        }
        case 'resize-left': {
          // 调整开始时间
          const daysDelta = pixelsToDays(deltaX)
          const newStart = originalStartDate.add(daysDelta, 'day')
          // 确保开始时间不超过结束时间
          if (
            newStart.isBefore(originalEndDate) ||
            newStart.isSame(originalEndDate, 'day')
          ) {
            setTempStartDate(newStart)
          }
          break
        }
        case 'resize-right': {
          // 调整结束时间
          const daysDelta = pixelsToDays(deltaX)
          const newEnd = originalEndDate.add(daysDelta, 'day')
          // 确保结束时间不早于开始时间
          if (
            newEnd.isAfter(originalStartDate) ||
            newEnd.isSame(originalStartDate, 'day')
          ) {
            setTempEndDate(newEnd)
          }
          break
        }
      }
    }

    const handleMouseUp = () => {
      if (dragStartRef.current) {
        // 保存更改
        const updates: Record<string, any> = {}

        if (tempStartDate && startDateKey) {
          updates[startDateKey] = tempStartDate.format('YYYY-MM-DD')
        }
        if (tempEndDate && endDateKey) {
          updates[endDateKey] = tempEndDate.format('YYYY-MM-DD')
        }

        if (Object.keys(updates).length > 0 && idKey) {
          updateRow(node.data[idKey], { ...node.data, ...updates })
        }
      }

      // 重置状态
      setIsDragging(false)
      setDragType(null)
      setTempStartDate(null)
      setTempEndDate(null)
      dragStartRef.current = null
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [
    isDragging,
    dragType,
    pixelsToDays,
    tempStartDate,
    tempEndDate,
    startDateKey,
    endDateKey,
    idKey,
    updateRow,
    node.data,
  ])

  // 处理日期区间变化
  const handleDateRangeChange = (value: any) => {
    if (!value || !Array.isArray(value) || value.length !== 2) return
    const [newStart, newEnd] = value
    if (!newStart || !newEnd) return

    const startDayjs = dayjs(newStart)
    const endDayjs = dayjs(newEnd)

    if (
      startDayjs.isValid() &&
      endDayjs.isValid() &&
      startDateKey &&
      endDateKey &&
      idKey
    ) {
      updateRow(node.data[idKey], {
        ...node.data,
        [startDateKey]: startDayjs.format('YYYY-MM-DD HH:mm'),
        [endDateKey]: endDayjs.format('YYYY-MM-DD HH:mm'),
      })
    }
  }

  const handlePercentageChange = (value: number | undefined) => {
    const numValue = value ?? 0
    if (numValue >= 0 && numValue <= 100) {
      if (percentageKey && idKey) {
        updateRow(node.data[idKey], {
          ...node.data,
          [percentageKey]: numValue,
        })
      }
    }
  }

  // 编辑弹出框内容
  const popoverContent = (
    <div className='space-y-3 p-2' onClick={(e) => e.stopPropagation()}>
      <div className='font-medium'>{node.data[nameKey!]}</div>

      {!isDisabled ? (
        <>
          {/* 日期区间编辑 */}
          <div className='flex items-center gap-2'>
            <label className='text-muted-foreground w-12 shrink-0 text-xs'>
              日期
            </label>
            <DatePicker
              className='flex-1'
              range
              format='YYYY-MM-DD HH:mm'
              value={[startDate, endDate]}
              onChange={handleDateRangeChange}
            />
          </div>

          {/* 进度编辑 */}
          <div className='flex items-center gap-2'>
            <label className='text-muted-foreground w-12 shrink-0 text-xs'>
              进度
            </label>
            <Number
              className='flex-1'
              min={0}
              max={100}
              value={percentage}
              onChange={handlePercentageChange}
            />
            <span className='text-muted-foreground w-6 shrink-0 text-right text-xs'>
              %
            </span>
          </div>
        </>
      ) : (
        <>
          <div className='text-muted-foreground text-sm'>
            {start?.format('YYYY-MM-DD HH:mm')} ~{' '}
            {end?.format('YYYY-MM-DD HH:mm')}
          </div>
          <div className='text-muted-foreground text-sm'>
            进度: {percentage}%
          </div>
        </>
      )}
    </div>
  )

  // 如果是分组行或没有日期数据，不渲染任务条
  if (node.group || !startDate || !endDate || !start || !end) {
    return null
  }

  return (
    <Popover direction='top' content={popoverContent}>
      <div
        ref={barRef}
        className={cn(
          'bg-primary absolute top-1/2 z-10 flex h-6 -translate-y-1/2 items-center rounded-md text-xs text-white shadow-sm',
          isDragging && 'opacity-80',
          !isDisabled && 'cursor-grab'
        )}
        style={{
          left: absoluteLeft,
          width: barWidth,
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => !isDragging && setIsHovering(false)}
        onClick={(e) => {
          e.stopPropagation()
          if (!isDragging) {
            onRowClick?.(node)
          }
        }}
        onMouseDown={(e) => handleDragStart(e, 'move')}
      >
        {/* 进度条背景 */}
        <div
          className='bg-primary-foreground/30 absolute inset-y-0 left-0 rounded-l-md'
          style={{ width: `${currentPercentage}%` }}
        />

        {/* 左侧拖拽手柄 - 调整开始时间 */}
        {!isDisabled && (isHovering || isDragging) && (
          <div
            className='absolute top-0 bottom-0 -left-1 z-20 w-2 cursor-ew-resize rounded-l'
            onMouseDown={(e) => {
              e.stopPropagation()
              handleDragStart(e, 'resize-left')
            }}
          >
            <div className='bg-primary-foreground/50 absolute top-1/2 left-1/2 h-3 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded' />
          </div>
        )}

        {/* 任务名称 */}
        <span className='relative z-10 truncate px-1'>
          {node.data[nameKey!]}
        </span>

        {/* 右侧拖拽手柄 - 调整结束时间 */}
        {!isDisabled && (isHovering || isDragging) && (
          <div
            className='absolute top-0 -right-1 bottom-0 z-20 w-2 cursor-ew-resize rounded-r'
            onMouseDown={(e) => {
              e.stopPropagation()
              handleDragStart(e, 'resize-right')
            }}
          >
            <div className='bg-primary-foreground/50 absolute top-1/2 left-1/2 h-3 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded' />
          </div>
        )}

        {/* 拖拽时显示日期提示 */}
        {isDragging &&
          (dragType === 'move' ||
            dragType === 'resize-left' ||
            dragType === 'resize-right') && (
            <div className='bg-background text-foreground absolute -top-8 left-1/2 z-30 -translate-x-1/2 rounded px-2 py-1 text-xs whitespace-nowrap shadow-lg'>
              {start.format('MM-DD')} ~ {end.format('MM-DD')}
            </div>
          )}
      </div>
    </Popover>
  )
}

// 甘特图数据行单元格组
interface GanttRowCellsProps {
  node: TableNode
}

export const GanttRowCells = (props: GanttRowCellsProps) => {
  const { node } = props
  const { ganttColumns, columnWidth } = useGanttContext()
  const { fieldNames, updateRow, readMode, disabled } = useTableContext()
  const { startDateKey, endDateKey, idKey } = fieldNames

  // 是否禁用编辑
  const isDisabled = readMode || disabled

  // 检查是否有日期数据
  const hasDateData = node.data[startDateKey!] && node.data[endDateKey!]

  // 创建时间区间的拖拽状态
  const [isCreating, setIsCreating] = useState(false)
  const [createStartIndex, setCreateStartIndex] = useState<number | null>(null)
  const [createEndIndex, setCreateEndIndex] = useState<number | null>(null)

  // 第一个甘特图单元格的 ref，用于计算位置
  const firstCellRef = useRef<HTMLTableCellElement>(null)

  const createDragRef = useRef<{
    startIndex: number
  } | null>(null)

  // 处理创建开始
  const handleCreateStart = (e: React.MouseEvent, index: number) => {
    if (isDisabled || hasDateData || node.group) return
    e.preventDefault()
    e.stopPropagation()

    setIsCreating(true)
    setCreateStartIndex(index)
    setCreateEndIndex(index)
    createDragRef.current = { startIndex: index }
  }

  // 处理创建过程中的鼠标移动
  useEffect(() => {
    if (!isCreating || createDragRef.current === null) return

    const handleMouseMove = (e: MouseEvent) => {
      // 使用第一个甘特图单元格作为参考点
      const firstCell = firstCellRef.current
      if (!firstCell) return

      const rect = firstCell.getBoundingClientRect()
      // 计算鼠标相对于第一个甘特图单元格的 x 位置
      const x = e.clientX - rect.left
      // 计算当前索引
      const currentIndex = Math.max(
        0,
        Math.min(ganttColumns.length - 1, Math.floor(x / columnWidth))
      )

      const startIdx = createDragRef.current!.startIndex
      if (currentIndex >= startIdx) {
        setCreateStartIndex(startIdx)
        setCreateEndIndex(currentIndex)
      } else {
        setCreateStartIndex(currentIndex)
        setCreateEndIndex(startIdx)
      }
    }

    const handleMouseUp = () => {
      if (
        createStartIndex !== null &&
        createEndIndex !== null &&
        startDateKey &&
        endDateKey &&
        idKey
      ) {
        // 保存创建的时间区间
        const startDate = ganttColumns[createStartIndex]
        const endDate = ganttColumns[createEndIndex]

        updateRow(node.data[idKey], {
          ...node.data,
          [startDateKey]: startDate.format('YYYY-MM-DD'),
          [endDateKey]: endDate.format('YYYY-MM-DD'),
        })
      }

      // 重置状态
      setIsCreating(false)
      setCreateStartIndex(null)
      setCreateEndIndex(null)
      createDragRef.current = null
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [
    isCreating,
    createStartIndex,
    createEndIndex,
    ganttColumns,
    columnWidth,
    startDateKey,
    endDateKey,
    idKey,
    updateRow,
    node.data,
  ])

  // 计算创建中的任务条位置
  const createBarStyle = useMemo(() => {
    if (!isCreating || createStartIndex === null || createEndIndex === null) {
      return null
    }
    const left = createStartIndex * columnWidth
    const width = (createEndIndex - createStartIndex + 1) * columnWidth
    return { left, width }
  }, [isCreating, createStartIndex, createEndIndex, columnWidth])

  return (
    <>
      {/* 第一个单元格作为任务条的容器 */}
      {ganttColumns.map((date, i) => {
        const isFirst = i === 0
        const isWeekend = date.day() === 0 || date.day() === 6
        const isToday = date.isSame(dayjs(), 'day')

        if (node.group) {
          return (
            <td
              key={i}
              className={cn(
                'bg-background border-border relative border-r border-b p-0',
                isWeekend && 'bg-muted/30'
              )}
              style={{ width: columnWidth, minWidth: columnWidth }}
            />
          )
        }

        return (
          <td
            key={i}
            ref={isFirst ? firstCellRef : undefined}
            className={cn(
              'bg-background border-border relative border-r border-b p-0',
              isWeekend && 'bg-muted/30',
              isToday && 'bg-primary/5',
              // 没有日期数据时，显示可创建的光标
              !hasDateData && !isDisabled && 'cursor-crosshair'
            )}
            style={{
              width: columnWidth,
              minWidth: columnWidth,
              height: 'inherit',
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => handleCreateStart(e, i)}
          >
            {isToday && (
              <div className='bg-primary pointer-events-none absolute top-0 bottom-0 left-1/2 z-5 w-0.5 -translate-x-1/2' />
            )}
            {/* 任务条只渲染在第一个单元格 */}
            {isFirst && <GanttTaskBar node={node} />}
            {/* 创建中的任务条预览 - 只在第一个单元格渲染 */}
            {isFirst && createBarStyle && (
              <div
                className='bg-primary/50 absolute top-1/2 z-10 flex h-6 -translate-y-1/2 items-center rounded-md text-xs text-white shadow-sm'
                style={{
                  left: createBarStyle.left,
                  width: createBarStyle.width,
                }}
              >
                <span className='relative z-10 truncate px-1'>
                  {ganttColumns[createStartIndex!]?.format('MM-DD')} ~{' '}
                  {ganttColumns[createEndIndex!]?.format('MM-DD')}
                </span>
              </div>
            )}
          </td>
        )
      })}
    </>
  )
}
