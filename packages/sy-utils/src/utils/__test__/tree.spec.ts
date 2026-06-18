import { describe, it, expect, vi } from 'vitest'
import { arrayToTree, treeToArray, findTree } from '../tree'

describe('tree 树形结构工具函数', () => {
  describe('arrayToTree', () => {
    it('应该将扁平数组转为树形结构', () => {
      const arr = [
        { id: '1', parentId: null, order: 0 },
        { id: '2', parentId: '1', order: 0 },
        { id: '3', parentId: '1', order: 1 },
      ]
      const tree = arrayToTree(arr)

      expect(tree).toHaveLength(1)
      expect(tree[0].id).toBe('1')
      expect(tree[0].children).toHaveLength(2)
      expect(tree[0].children![0].id).toBe('2')
      expect(tree[0].children![1].id).toBe('3')
    })

    it('应该处理空数组', () => {
      const tree = arrayToTree([])
      expect(tree).toEqual([])
    })

    it('应该处理单个节点', () => {
      const arr = [{ id: '1', parentId: null }]
      const tree = arrayToTree(arr)

      expect(tree).toHaveLength(1)
      expect(tree[0].id).toBe('1')
      expect(tree[0].children).toBeUndefined()
    })

    it('应该处理多个根节点', () => {
      const arr = [
        { id: '1', parentId: null, order: 0 },
        { id: '2', parentId: null, order: 1 },
        { id: '3', parentId: null, order: 2 },
      ]
      const tree = arrayToTree(arr)

      expect(tree).toHaveLength(3)
    })

    it('应该按 order 排序', () => {
      const arr = [
        { id: '1', parentId: null, order: 2 },
        { id: '2', parentId: null, order: 0 },
        { id: '3', parentId: null, order: 1 },
      ]
      const tree = arrayToTree(arr)

      expect(tree[0].id).toBe('2')
      expect(tree[1].id).toBe('3')
      expect(tree[2].id).toBe('1')
    })

    it('应该支持自定义键名', () => {
      const arr = [
        { uid: '1', parent: null },
        { uid: '2', parent: '1' },
      ]
      const tree = arrayToTree(arr, {
        idKey: 'uid',
        parentIdKey: 'parent',
      })

      expect(tree).toHaveLength(1)
      expect((tree[0] as any).uid).toBe('1')
      expect(tree[0].children).toHaveLength(1)
    })

    it('应该支持自定义 childrenKey', () => {
      const arr = [
        { id: '1', parentId: null },
        { id: '2', parentId: '1' },
      ]
      const tree = arrayToTree(arr, { childrenKey: 'items' })

      expect(tree[0].items).toBeDefined()
      expect(tree[0].items).toHaveLength(1)
    })

    it('应该支持回调函数转换节点', () => {
      const arr = [
        { id: '1', parentId: null, name: 'Root' },
        { id: '2', parentId: '1', name: 'Child' },
      ]
      const tree = arrayToTree(arr, {}, (node: any) => ({
        ...node,
        label: node.name,
      }))

      expect((tree[0] as any).label).toBe('Root')
      expect((tree[0].children![0] as any).label).toBe('Child')
    })

    it('应该处理深层嵌套', () => {
      const arr = [
        { id: '1', parentId: null, order: 0 },
        { id: '2', parentId: '1', order: 0 },
        { id: '3', parentId: '2', order: 0 },
        { id: '4', parentId: '3', order: 0 },
        { id: '5', parentId: '4', order: 0 },
      ]
      const tree = arrayToTree(arr)

      expect(tree[0].id).toBe('1')
      expect(tree[0].children![0].id).toBe('2')
      expect(tree[0].children![0].children![0].id).toBe('3')
      expect(tree[0].children![0].children![0].children![0].id).toBe('4')
      expect(
        tree[0].children![0].children![0].children![0].children![0].id
      ).toBe('5')
    })

    it('应该不修改原数组中的 children', () => {
      const arr = [
        { id: '1', parentId: null, children: ['original'] },
        { id: '2', parentId: '1' },
      ]
      arrayToTree(arr)

      // 原数组的 children 不应被修改
      expect((arr[0] as any).children).toEqual(['original'])
    })
  })

  describe('treeToArray', () => {
    it('应该将树形结构转为扁平数组', () => {
      const tree = [
        {
          id: '1',
          children: [{ id: '2' }, { id: '3' }],
        },
      ]
      const arr = treeToArray(tree)

      expect(arr).toHaveLength(3)
      expect(arr[0].id).toBe('1')
      expect(arr[0].parentId).toBeUndefined()
      expect(arr[1].parentId).toBe('1')
      expect(arr[2].parentId).toBe('1')
    })

    it('应该处理空树', () => {
      const arr = treeToArray([])
      expect(arr).toEqual([])
    })

    it('应该处理单节点树', () => {
      const tree = [{ id: '1' }]
      const arr = treeToArray(tree)

      expect(arr).toHaveLength(1)
      expect(arr[0].id).toBe('1')
    })

    it('应该添加 order 字段', () => {
      const tree = [
        {
          id: '1',
          children: [{ id: '2' }, { id: '3' }],
        },
      ]
      const arr = treeToArray(tree, { orderKey: 'order' })

      expect(arr[0].order).toBe(0)
      expect(arr[1].order).toBe(0)
      expect(arr[2].order).toBe(1)
    })

    it('应该支持自定义键名', () => {
      const tree = [
        {
          uid: '1',
          items: [{ uid: '2' }],
        },
      ]
      const arr = treeToArray(tree, {
        idKey: 'uid',
        parentIdKey: 'parent',
        childrenKey: 'items',
      })

      expect(arr[0].uid).toBe('1')
      expect(arr[1].parent).toBe('1')
    })

    it('应该支持 fields 过滤', () => {
      const tree = [
        {
          id: '1',
          name: 'Root',
          extra: 'data',
          children: [{ id: '2', name: 'Child', extra: 'more' }],
        },
      ]
      const arr = treeToArray(tree, { fields: ['id', 'name', 'parentId'] })

      expect(arr[0]).toEqual({ id: '1', name: 'Root', parentId: undefined })
      expect(arr[1]).toEqual({ id: '2', name: 'Child', parentId: '1' })
    })

    it('应该支持回调函数', () => {
      const tree = [
        {
          id: '1',
          name: 'Root',
          children: [{ id: '2', name: 'Child' }],
        },
      ]
      const arr = treeToArray(tree, {}, (node: any) => ({
        ...node,
        label: node.name,
      }))

      expect(arr[0].label).toBe('Root')
      expect(arr[1].label).toBe('Child')
    })

    it('应该处理深层嵌套树', () => {
      const tree = [
        {
          id: '1',
          children: [
            {
              id: '2',
              children: [
                {
                  id: '3',
                  children: [{ id: '4' }],
                },
              ],
            },
          ],
        },
      ]
      const arr = treeToArray(tree)

      expect(arr).toHaveLength(4)
      expect(arr.map((n) => n.id)).toEqual(['1', '2', '3', '4'])
    })
  })

  describe('findTree', () => {
    const tree = [
      {
        id: '1',
        children: [
          {
            id: '2',
            children: [{ id: '4' }],
          },
          { id: '3' },
        ],
      },
      { id: '5' },
    ]

    it('应该找到根节点', () => {
      let foundNode: any = null
      const result = findTree(
        tree,
        (node) => {
          foundNode = node
        },
        { id: '1' }
      )

      expect(result).toBe(true)
      expect(foundNode.id).toBe('1')
    })

    it('应该找到嵌套节点', () => {
      let foundNode: any = null
      findTree(
        tree,
        (node) => {
          foundNode = node
        },
        { id: '4' }
      )

      expect(foundNode.id).toBe('4')
    })

    it('找不到节点时返回 false', () => {
      const result = findTree(tree, () => {}, { id: 'nonexistent' })

      expect(result).toBe(false)
    })

    it('应该支持自定义 idKey', () => {
      const customTree = [{ uid: '1', children: [{ uid: '2' }] }]
      let foundNode: any = null
      findTree(
        customTree,
        (node) => {
          foundNode = node
        },
        { id: '2', idKey: 'uid' }
      )

      expect(foundNode.uid).toBe('2')
    })

    it('应该传递正确的参数给回调', () => {
      let callbackArgs: any = null
      findTree(
        tree,
        (node, i, data, level) => {
          callbackArgs = { node, i, data, level }
        },
        { id: '1' }
      )

      expect(callbackArgs.node.id).toBe('1')
      expect(callbackArgs.i).toBe(0)
      expect(callbackArgs.data).toBe(tree)
    })

    it('level 为 0 时应该立即返回 true', () => {
      const callback = vi.fn()
      const result = findTree(tree, callback, { id: '1', level: 0 })

      expect(result).toBe(true)
      expect(callback).not.toHaveBeenCalled()
    })

    it('应该在找到节点时停止搜索', () => {
      let callCount = 0
      findTree(
        tree,
        () => {
          callCount++
        },
        { id: '1' }
      )

      // 找到第一个节点就停止
      expect(callCount).toBe(1)
    })

    it('应该处理空树', () => {
      const result = findTree([], () => {}, { id: '1' })
      expect(result).toBe(false)
    })

    it('应该处理 level 参数限制深度', () => {
      let maxDepthReached = 0
      findTree(
        tree,
        (_node, _i, _data, level) => {
          if (level > maxDepthReached) {
            maxDepthReached = level
          }
        },
        { id: 'nonexistent', level: 2 }
      )

      // level 参数限制搜索深度
      expect(maxDepthReached).toBeLessThanOrEqual(2)
    })
  })
})
