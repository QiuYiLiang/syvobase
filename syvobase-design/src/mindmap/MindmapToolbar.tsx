import { Toolbar, ToolbarProps } from '@/toolbar'
import { IconName } from '@/icon'
import { cn } from '@/utils'
import { Popover } from '@/popover'
import { MindmapDirection } from './types'
import { DropdownMenuType } from '@/dropdown'

export interface MindmapToolbarProps {
  editable: boolean
  canUndo: boolean
  canRedo: boolean
  scale: number
  hasSelection: boolean
  isRootSelected: boolean
  direction: MindmapDirection
  onDirectionChange: (direction: MindmapDirection) => void
  onUndo: () => void
  onRedo: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onResetZoom: () => void
  onCenterView: () => void
  onExpandAll: () => void
  onCollapseAll: () => void
  onAddChild: () => void
  onAddSibling: () => void
  onDelete: () => void
  className?: string
}

function ToolbarDivider() {
  return <div className='bg-border mx-1 h-5 w-px' />
}

export function MindmapToolbar({
  editable,
  canUndo,
  canRedo,
  scale,
  hasSelection,
  isRootSelected,
  direction,
  onDirectionChange,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onCenterView,
  onExpandAll,
  onCollapseAll,
  onAddChild,
  onAddSibling,
  onDelete,
  className,
}: MindmapToolbarProps) {
  const scalePercent = Math.round(scale * 100)

  const editItems: ToolbarProps['items'] = editable
    ? [
        {
          icon: 'Undo2' as IconName,
          title: '撤销',
          disabled: !canUndo,
          onClick: onUndo,
        },
        {
          icon: 'Redo2' as IconName,
          title: '重做',
          disabled: !canRedo,
          onClick: onRedo,
        },
        <ToolbarDivider key='divider-1' />,
        {
          icon: 'Plus' as IconName,
          title: '添加子主题 (Tab)',
          disabled: !hasSelection,
          onClick: onAddChild,
        },
        {
          icon: 'ListPlus' as IconName,
          title: '添加同级主题 (Enter)',
          disabled: !hasSelection || isRootSelected,
          onClick: onAddSibling,
        },
        {
          icon: 'Trash2' as IconName,
          title: '删除节点 (Delete)',
          disabled: !hasSelection || isRootSelected,
          onClick: onDelete,
        },
        <ToolbarDivider key='divider-2' />,
      ]
    : []

  const directionTitle =
    direction === 'left'
      ? '左侧布局'
      : direction === 'right'
        ? '右侧布局'
        : '左右布局'

  const directionIcon: IconName =
    direction === 'left'
      ? 'ArrowLeft'
      : direction === 'right'
        ? 'ArrowRight'
        : 'ArrowLeftRight'

  const directionItems: DropdownMenuType = [
    {
      name: '右侧布局',
      icon: 'ArrowRight' as IconName,
      onClick: () => onDirectionChange('right'),
    },
    {
      name: '左侧布局',
      icon: 'ArrowLeft' as IconName,
      onClick: () => onDirectionChange('left'),
    },
    {
      name: '左右布局',
      icon: 'ArrowLeftRight' as IconName,
      onClick: () => onDirectionChange('both'),
    },
  ]

  const viewItems: ToolbarProps['items'] = [
    {
      icon: 'ChevronsUpDown' as IconName,
      title: '展开全部',
      onClick: onExpandAll,
    },
    {
      icon: 'ChevronsDownUp' as IconName,
      title: '收起全部',
      onClick: onCollapseAll,
    },
    <ToolbarDivider key='divider-layout' />,
    {
      icon: directionIcon,
      title: directionTitle,
      items: directionItems,
      dropdownTrigger: 'click',
      disabledDropdownIcon: true,
    },
    <ToolbarDivider key='divider-3' />,
    {
      icon: 'ZoomOut' as IconName,
      title: '缩小',
      disabled: scale <= 0.3,
      onClick: onZoomOut,
    },
    <Popover
      key='zoom-percent'
      trigger='click'
      content={
        <div className='flex flex-col gap-1 p-1'>
          {[50, 75, 100, 125, 150, 200].map((percent) => (
            <button
              key={percent}
              className={cn(
                'hover:bg-accent rounded px-3 py-1.5 text-left text-sm',
                percent === scalePercent && 'bg-accent'
              )}
              onClick={onResetZoom}
            >
              {percent}%
            </button>
          ))}
        </div>
      }
    >
      <button
        className={cn(
          'min-w-[50px] rounded px-2 py-1 text-xs font-medium',
          'hover:bg-accent transition-colors'
        )}
      >
        {scalePercent}%
      </button>
    </Popover>,
    {
      icon: 'ZoomIn' as IconName,
      title: '放大',
      disabled: scale >= 2,
      onClick: onZoomIn,
    },
    <ToolbarDivider key='divider-4' />,
    {
      icon: 'Focus' as IconName,
      title: '重置视图',
      onClick: onCenterView,
    },
  ]

  return (
    <Toolbar
      className={cn(
        'bg-background/95 border-border rounded-lg border p-1.5 shadow-sm backdrop-blur-sm',
        className
      )}
      items={[...editItems, ...viewItems]}
      inlineMode
    />
  )
}
