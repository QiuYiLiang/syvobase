import { useRef, useState } from 'react'
import {
  MindmapData,
  MindmapNodeData,
  MindmapSelection,
  MindmapViewport,
  MindmapDirection,
} from './types'
import {
  generateId,
  findNodeById,
  findParentNode,
  cloneNode,
  updateNodeInTree,
  removeNodeFromTree,
} from './shared'

export function createEmptyMindmap(
  rootTopic: string = '中心主题'
): MindmapData {
  return {
    nodeData: {
      id: generateId(),
      topic: rootTopic,
      expanded: true,
      children: [],
    },
  }
}

export interface UseMindmapOptions {
  data: MindmapData
  direction?: MindmapDirection
  readMode?: boolean
  onChange: (data: MindmapData) => void
}

export interface UseMindmapReturn {
  data: MindmapData
  selection: MindmapSelection
  viewport: MindmapViewport
  direction: MindmapDirection
  selectNode: (nodeId: string | null, addToSelection?: boolean) => void
  selectNodes: (nodeIds: string[]) => void
  clearSelection: () => void
  startEditing: () => void
  stopEditing: () => void
  addChild: (parentId: string) => string
  addSibling: (nodeId: string) => string | null
  updateNodeTopic: (nodeId: string, topic: string) => void
  deleteNode: (nodeId: string) => void
  deleteNodes: (nodeIds: string[]) => void
  toggleExpand: (nodeId: string) => void
  expandAll: () => void
  collapseAll: () => void
  moveNode: (
    nodeId: string,
    newParentId: string,
    index?: number,
    side?: 'left' | 'right'
  ) => void
  moveNodes: (nodeIds: string[], newParentId: string) => void
  moveNodeAsSibling: (
    nodeId: string,
    targetId: string,
    position: 'before' | 'after'
  ) => void
  moveNodesAsSibling: (
    nodeIds: string[],
    targetId: string,
    position: 'before' | 'after'
  ) => void
  setViewport: (viewport: Partial<MindmapViewport>) => void
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
  centerView: () => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  copyNodes: () => void
  cutNodes: () => void
  pasteNodes: (targetNodeId: string) => void
  clipboard: MindmapNodeData[]
  getNodeById: (id: string) => MindmapNodeData | null
  getParentNode: (id: string) => MindmapNodeData | null
  distributeChildrenSides: () => void
}

export function useMindmap(options: UseMindmapOptions): UseMindmapReturn {
  const { data, direction = 'right', readMode = false, onChange } = options

  const [selection, setSelection] = useState<MindmapSelection>({
    nodeId: null,
    nodeIds: [],
    isEditing: false,
  })
  const [viewport, setViewportState] = useState<MindmapViewport>({
    x: 0,
    y: 0,
    scale: 1,
  })

  const [clipboard, setClipboard] = useState<MindmapNodeData[]>([])
  const historyRef = useRef<MindmapData[]>([
    { nodeData: cloneNode(data.nodeData) },
  ])
  const historyIndexRef = useRef(0)
  const [, forceUpdate] = useState(0)
  const maxHistorySize = 50
  const dataRef = useRef(data)
  dataRef.current = data

  const pushHistory = (newData: MindmapData) => {
    const history = historyRef.current
    const currentIndex = historyIndexRef.current

    if (currentIndex < history.length - 1) {
      history.splice(currentIndex + 1)
    }

    history.push({
      nodeData: cloneNode(newData.nodeData),
    })

    if (history.length > maxHistorySize) {
      history.shift()
      historyIndexRef.current = history.length - 1
    } else {
      historyIndexRef.current = history.length - 1
    }

    forceUpdate((n) => n + 1)
  }

  const updateData = (updater: (prev: MindmapData) => MindmapData) => {
    const prev = dataRef.current
    const next = updater(prev)
    pushHistory(next)
    onChange(next)
  }

  const selectNode = (nodeId: string | null, addToSelection = false) => {
    setSelection((prev) => {
      if (addToSelection && nodeId) {
        const newNodeIds = prev.nodeIds.includes(nodeId)
          ? prev.nodeIds.filter((id) => id !== nodeId)
          : [...prev.nodeIds, nodeId]
        return {
          nodeId: newNodeIds[newNodeIds.length - 1] || null,
          nodeIds: newNodeIds,
          isEditing: false,
        }
      }
      return {
        nodeId,
        nodeIds: nodeId ? [nodeId] : [],
        isEditing: false,
      }
    })
  }

  const selectNodes = (nodeIds: string[]) => {
    setSelection({
      nodeId: nodeIds[nodeIds.length - 1] || null,
      nodeIds,
      isEditing: false,
    })
  }

  const clearSelection = () => {
    setSelection({ nodeId: null, nodeIds: [], isEditing: false })
  }

  const startEditing = () => {
    if (readMode) return
    setSelection((prev) => ({ ...prev, isEditing: true }))
  }

  const stopEditing = () => {
    setSelection((prev) => ({ ...prev, isEditing: false }))
  }

  const addChild = (parentId: string): string => {
    if (readMode) return ''
    const newId = generateId()
    updateData((prev) => ({
      ...prev,
      nodeData: updateNodeInTree(prev.nodeData, parentId, (node) => ({
        ...node,
        expanded: true,
        children: [
          ...(node.children || []),
          { id: newId, topic: '子主题', expanded: true, children: [] },
        ],
      })),
    }))
    setSelection({ nodeId: newId, nodeIds: [newId], isEditing: false })
    return newId
  }

  const addSibling = (nodeId: string): string | null => {
    if (readMode) return null
    const parent = findParentNode(data.nodeData, nodeId)
    if (!parent) return null

    const newId = generateId()
    const siblingIndex =
      parent.children?.findIndex((c) => c.id === nodeId) ?? -1

    updateData((prev) => ({
      ...prev,
      nodeData: updateNodeInTree(prev.nodeData, parent.id, (node) => {
        const newChildren = [...(node.children || [])]
        newChildren.splice(siblingIndex + 1, 0, {
          id: newId,
          topic: '主题',
          expanded: true,
          children: [],
        })
        return { ...node, children: newChildren }
      }),
    }))
    setSelection({ nodeId: newId, nodeIds: [newId], isEditing: false })
    return newId
  }

  const updateNodeTopic = (nodeId: string, topic: string) => {
    if (readMode) return
    updateData((prev) => ({
      ...prev,
      nodeData: updateNodeInTree(prev.nodeData, nodeId, (node) => ({
        ...node,
        topic,
      })),
    }))
  }

  const deleteNode = (nodeId: string) => {
    if (readMode) return
    if (data.nodeData.id === nodeId) return

    const parent = findParentNode(data.nodeData, nodeId)

    let nextSelectedId: string | null = null
    if (parent && parent.children) {
      const currentIndex = parent.children.findIndex((c) => c.id === nodeId)
      if (currentIndex > 0) {
        nextSelectedId = parent.children[currentIndex - 1].id
      } else if (parent.children.length > 1) {
        nextSelectedId = parent.children[1].id
      } else {
        nextSelectedId = parent.id
      }
    }

    updateData((prev) => ({
      ...prev,
      nodeData: removeNodeFromTree(prev.nodeData, nodeId),
    }))

    if (nextSelectedId) {
      setSelection({
        nodeId: nextSelectedId,
        nodeIds: [nextSelectedId],
        isEditing: false,
      })
    }
  }

  const deleteNodes = (nodeIds: string[]) => {
    if (readMode) return
    const validIds = nodeIds.filter((id) => id !== data.nodeData.id)
    if (validIds.length === 0) return

    updateData((prev) => {
      let newNodeData = prev.nodeData
      for (const nodeId of validIds) {
        newNodeData = removeNodeFromTree(newNodeData, nodeId)
      }
      return { ...prev, nodeData: newNodeData }
    })

    setSelection({ nodeId: null, nodeIds: [], isEditing: false })
  }

  const copyNodes = () => {
    const nodesToCopy = selection.nodeIds
      .map((id) => findNodeById(data.nodeData, id))
      .filter(
        (node): node is MindmapNodeData =>
          node !== null && node.id !== data.nodeData.id
      )

    if (nodesToCopy.length > 0) {
      setClipboard(nodesToCopy.map((node) => cloneNode(node)))
    }
  }

  const cutNodes = () => {
    if (readMode) return
    const nodesToCut = selection.nodeIds
      .filter((id) => id !== data.nodeData.id)
      .map((id) => findNodeById(data.nodeData, id))
      .filter((node): node is MindmapNodeData => node !== null)

    if (nodesToCut.length > 0) {
      setClipboard(nodesToCut.map((node) => cloneNode(node)))
      const idsToDelete = nodesToCut.map((node) => node.id)
      updateData((prev) => {
        let newNodeData = prev.nodeData
        for (const nodeId of idsToDelete) {
          newNodeData = removeNodeFromTree(newNodeData, nodeId)
        }
        return { ...prev, nodeData: newNodeData }
      })
      setSelection({ nodeId: null, nodeIds: [], isEditing: false })
    }
  }

  const regenerateIds = (node: MindmapNodeData): MindmapNodeData => {
    return {
      ...node,
      id: generateId(),
      children: node.children?.map((child) => regenerateIds(child)),
    }
  }

  const pasteNodes = (targetNodeId: string) => {
    if (readMode) return
    if (clipboard.length === 0) return

    updateData((prev) => {
      let newNodeData = prev.nodeData
      for (const node of clipboard) {
        const newNode = regenerateIds(node)
        newNodeData = updateNodeInTree(newNodeData, targetNodeId, (parent) => ({
          ...parent,
          expanded: true,
          children: [...(parent.children || []), newNode],
        }))
      }
      return { ...prev, nodeData: newNodeData }
    })
  }

  const toggleExpand = (nodeId: string) => {
    updateData((prev) => ({
      ...prev,
      nodeData: updateNodeInTree(prev.nodeData, nodeId, (node) => ({
        ...node,
        expanded: node.expanded === false ? true : false,
      })),
    }))
  }

  const setExpandAll = (expanded: boolean) => {
    const expandNode = (node: MindmapNodeData): MindmapNodeData => ({
      ...node,
      expanded,
      children: node.children?.map(expandNode),
    })
    updateData((prev) => ({
      ...prev,
      nodeData: expandNode(prev.nodeData),
    }))
  }

  const expandAll = () => setExpandAll(true)
  const collapseAll = () => setExpandAll(false)

  const moveNode = (
    nodeId: string,
    newParentId: string,
    index?: number,
    side?: 'left' | 'right'
  ) => {
    if (readMode) return
    if (nodeId === data.nodeData.id) return
    if (nodeId === newParentId) return

    const nodeToMove = findNodeById(data.nodeData, nodeId)
    if (!nodeToMove) return

    if (findNodeById(nodeToMove, newParentId)) return

    updateData((prev) => {
      let newTree = removeNodeFromTree(prev.nodeData, nodeId)
      newTree = updateNodeInTree(newTree, newParentId, (parent) => {
        const children = [...(parent.children || [])]
        // 如果移动到根节点且指定了 side，设置节点的 side 属性
        const movedNode =
          side !== undefined ? { ...nodeToMove, side } : nodeToMove
        if (index !== undefined) {
          children.splice(index, 0, movedNode)
        } else {
          children.push(movedNode)
        }
        return { ...parent, children, expanded: true }
      })
      return { ...prev, nodeData: newTree }
    })
  }

  const moveNodeAsSibling = (
    nodeId: string,
    targetId: string,
    position: 'before' | 'after'
  ) => {
    if (readMode) return
    if (nodeId === data.nodeData.id) return
    if (nodeId === targetId) return

    const nodeToMove = findNodeById(data.nodeData, nodeId)
    if (!nodeToMove) return

    if (findNodeById(nodeToMove, targetId)) return

    const targetParent = findParentNode(data.nodeData, targetId)
    if (!targetParent) return

    updateData((prev) => {
      let newTree = removeNodeFromTree(prev.nodeData, nodeId)
      newTree = updateNodeInTree(newTree, targetParent.id, (parent) => {
        const children = [...(parent.children || [])]
        const targetIndex = children.findIndex((c) => c.id === targetId)
        if (targetIndex === -1) return parent
        const insertIndex =
          position === 'before' ? targetIndex : targetIndex + 1
        children.splice(insertIndex, 0, nodeToMove)
        return { ...parent, children }
      })
      return { ...prev, nodeData: newTree }
    })
  }

  const moveNodes = (nodeIds: string[], newParentId: string) => {
    if (readMode) return
    // 过滤掉根节点和目标父节点本身
    const validNodeIds = nodeIds.filter(
      (id) => id !== data.nodeData.id && id !== newParentId
    )
    if (validNodeIds.length === 0) return

    // 获取所有要移动的节点
    const nodesToMove = validNodeIds
      .map((id) => findNodeById(data.nodeData, id))
      .filter((node): node is MindmapNodeData => node !== null)

    // 确保没有节点是另一个要移动节点的子节点
    const filteredNodes = nodesToMove.filter((node) => {
      return !nodesToMove.some(
        (other) => other.id !== node.id && findNodeById(other, node.id)
      )
    })

    // 确保目标父节点不是要移动的任何节点的子节点
    for (const node of filteredNodes) {
      if (findNodeById(node, newParentId)) return
    }

    updateData((prev) => {
      let newTree = prev.nodeData
      // 先移除所有节点
      for (const node of filteredNodes) {
        newTree = removeNodeFromTree(newTree, node.id)
      }
      // 再添加到新父节点
      newTree = updateNodeInTree(newTree, newParentId, (parent) => {
        const children = [...(parent.children || []), ...filteredNodes]
        return { ...parent, children, expanded: true }
      })
      return { ...prev, nodeData: newTree }
    })
  }

  const moveNodesAsSibling = (
    nodeIds: string[],
    targetId: string,
    position: 'before' | 'after'
  ) => {
    if (readMode) return
    // 过滤掉根节点和目标节点本身
    const validNodeIds = nodeIds.filter(
      (id) => id !== data.nodeData.id && id !== targetId
    )
    if (validNodeIds.length === 0) return

    // 获取所有要移动的节点
    const nodesToMove = validNodeIds
      .map((id) => findNodeById(data.nodeData, id))
      .filter((node): node is MindmapNodeData => node !== null)

    // 确保没有节点是另一个要移动节点的子节点
    const filteredNodes = nodesToMove.filter((node) => {
      return !nodesToMove.some(
        (other) => other.id !== node.id && findNodeById(other, node.id)
      )
    })

    // 确保目标节点不是要移动的任何节点的子节点
    for (const node of filteredNodes) {
      if (findNodeById(node, targetId)) return
    }

    const targetParent = findParentNode(data.nodeData, targetId)
    if (!targetParent) return

    updateData((prev) => {
      let newTree = prev.nodeData
      // 先移除所有节点
      for (const node of filteredNodes) {
        newTree = removeNodeFromTree(newTree, node.id)
      }
      // 再添加到目标位置
      newTree = updateNodeInTree(newTree, targetParent.id, (parent) => {
        const children = [...(parent.children || [])]
        const targetIndex = children.findIndex((c) => c.id === targetId)
        if (targetIndex === -1) return parent
        const insertIndex =
          position === 'before' ? targetIndex : targetIndex + 1
        children.splice(insertIndex, 0, ...filteredNodes)
        return { ...parent, children }
      })
      return { ...prev, nodeData: newTree }
    })
  }

  const setViewport = (partial: Partial<MindmapViewport>) => {
    setViewportState((prev) => ({ ...prev, ...partial }))
  }

  const zoomIn = () => {
    setViewportState((prev) => ({
      ...prev,
      scale: Math.min(prev.scale + 0.1, 2),
    }))
  }

  const zoomOut = () => {
    setViewportState((prev) => ({
      ...prev,
      scale: Math.max(prev.scale - 0.1, 0.3),
    }))
  }

  const resetZoom = () => {
    setViewportState((prev) => ({ ...prev, scale: 1 }))
  }

  const centerView = () => {
    setViewportState({ x: 0, y: 0, scale: 1 })
  }

  const undo = () => {
    if (readMode) return
    const history = historyRef.current
    const currentIndex = historyIndexRef.current
    if (currentIndex > 0) {
      const prevData = history[currentIndex - 1]
      historyIndexRef.current = currentIndex - 1
      forceUpdate((n) => n + 1)
      onChange(prevData)
    }
  }

  const redo = () => {
    if (readMode) return
    const history = historyRef.current
    const currentIndex = historyIndexRef.current
    if (currentIndex < history.length - 1) {
      const nextData = history[currentIndex + 1]
      historyIndexRef.current = currentIndex + 1
      forceUpdate((n) => n + 1)
      onChange(nextData)
    }
  }

  // 将根节点的子节点平均分配到左右两侧（优先右侧）
  const distributeChildrenSides = () => {
    if (readMode) return
    updateData((prev) => {
      const rootChildren = prev.nodeData.children || []
      if (rootChildren.length === 0) return prev

      const midPoint = Math.ceil(rootChildren.length / 2)
      const newChildren = rootChildren.map((child, index) => ({
        ...child,
        // 前半部分分到右侧，后半部分分到左侧
        side: index < midPoint ? ('right' as const) : ('left' as const),
      }))

      return {
        ...prev,
        nodeData: {
          ...prev.nodeData,
          children: newChildren,
        },
      }
    })
  }

  const getNodeById = (id: string) => findNodeById(data.nodeData, id)

  const getParentNode = (id: string) => findParentNode(data.nodeData, id)

  return {
    data,
    selection,
    viewport,
    direction,
    selectNode,
    selectNodes,
    clearSelection,
    startEditing,
    stopEditing,
    addChild,
    addSibling,
    updateNodeTopic,
    deleteNode,
    deleteNodes,
    toggleExpand,
    expandAll,
    collapseAll,
    moveNode,
    moveNodes,
    moveNodeAsSibling,
    moveNodesAsSibling,
    setViewport,
    zoomIn,
    zoomOut,
    resetZoom,
    centerView,
    undo,
    redo,
    canUndo: historyIndexRef.current > 0,
    canRedo: historyIndexRef.current < historyRef.current.length - 1,
    copyNodes,
    cutNodes,
    pasteNodes,
    clipboard,
    getNodeById,
    getParentNode,
    distributeChildrenSides,
  }
}
