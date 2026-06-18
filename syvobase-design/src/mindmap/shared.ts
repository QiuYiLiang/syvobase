import { v4 } from 'uuid'
import { MindmapNodeData } from './types'

// 全局变量用于跟踪当前被拖拽的节点ID（支持多选）
let currentDraggedNodeIds: string[] = []

export function getCurrentDraggedNodeIds(): string[] {
  return currentDraggedNodeIds
}

export function setCurrentDraggedNodeIds(ids: string[]): void {
  currentDraggedNodeIds = ids
}

/**
 * 生成唯一的节点 ID
 */
export function generateId(): string {
  return v4()
}

/**
 * 通过 ID 查找节点
 */
export function findNodeById(
  node: MindmapNodeData,
  id: string
): MindmapNodeData | null {
  if (node.id === id) return node
  if (node.children) {
    for (const child of node.children) {
      const found = findNodeById(child, id)
      if (found) return found
    }
  }
  return null
}

/**
 * 查找指定节点的父节点
 */
export function findParentNode(
  node: MindmapNodeData,
  id: string,
  parent: MindmapNodeData | null = null
): MindmapNodeData | null {
  if (node.id === id) return parent
  if (node.children) {
    for (const child of node.children) {
      const found = findParentNode(child, id, node)
      if (found) return found
    }
  }
  return null
}

/**
 * 深拷贝节点
 */
export function cloneNode(node: MindmapNodeData): MindmapNodeData {
  return JSON.parse(JSON.stringify(node))
}

/**
 * 更新树中的指定节点
 */
export function updateNodeInTree(
  root: MindmapNodeData,
  nodeId: string,
  updater: (node: MindmapNodeData) => MindmapNodeData
): MindmapNodeData {
  if (root.id === nodeId) {
    return updater(cloneNode(root))
  }
  if (root.children) {
    return {
      ...root,
      children: root.children.map((child) =>
        updateNodeInTree(child, nodeId, updater)
      ),
    }
  }
  return root
}

/**
 * 从树中删除指定节点
 */
export function removeNodeFromTree(
  root: MindmapNodeData,
  nodeId: string
): MindmapNodeData {
  if (root.children) {
    return {
      ...root,
      children: root.children
        .filter((child) => child.id !== nodeId)
        .map((child) => removeNodeFromTree(child, nodeId)),
    }
  }
  return root
}
