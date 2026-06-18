import { CSSProperties } from 'react'

export interface MindmapNodeData {
  id: string
  topic: string
  children?: MindmapNodeData[]
  expanded?: boolean
  style?: MindmapNodeStyle
  icons?: string[]
  tags?: string[]
  notes?: string
  hyperlink?: string
  // 在 both 布局中，根节点的直接子节点使用此属性记录属于左侧还是右侧
  side?: 'left' | 'right'
}

export interface MindmapNodeStyle {
  background?: CSSProperties['background']
  color?: CSSProperties['color']
  fontSize?: CSSProperties['fontSize']
  fontWeight?: CSSProperties['fontWeight']
}

export interface MindmapData {
  nodeData: MindmapNodeData
  theme?: MindmapTheme
}

export interface MindmapTheme {
  name: string
  primaryColor: string
  primaryTextColor: string
  lineColor: string
  lineWidth: number
}

export const DEFAULT_THEMES: Record<string, MindmapTheme> = {
  default: {
    name: 'Default',
    primaryColor: 'hsl(var(--primary))',
    primaryTextColor: 'hsl(var(--primary-foreground))',
    lineColor: 'hsl(var(--border))',
    lineWidth: 2,
  },
  dark: {
    name: 'Dark',
    primaryColor: '#1e293b',
    primaryTextColor: '#f8fafc',
    lineColor: '#475569',
    lineWidth: 2,
  },
  colorful: {
    name: 'Colorful',
    primaryColor: '#6366f1',
    primaryTextColor: '#ffffff',
    lineColor: '#a5b4fc',
    lineWidth: 2,
  },
}

export interface MindmapSelection {
  nodeId: string | null
  nodeIds: string[]
  isEditing: boolean
}

export interface MindmapViewport {
  x: number
  y: number
  scale: number
}

export type MindmapDirection = 'right' | 'left' | 'both'

export interface MindmapPosition {
  x: number
  y: number
  width: number
  height: number
}

export interface NodePositionMap {
  [nodeId: string]: MindmapPosition
}

export interface DragPreviewState {
  draggedNodeId: string
  // 目标父节点ID
  targetParentId: string
  // 插入位置索引（在父节点的子节点中的位置）
  insertIndex?: number
  // 鼠标位置（相对于容器，用于实时预览线）
  mouseX?: number
  mouseY?: number
  // 在 both 布局中，记录拖拽位置是左侧还是右侧
  layoutSide?: 'left' | 'right'
}
