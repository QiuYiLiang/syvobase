import { Dict } from '@/types'

export type TreeData<T, K extends string = 'children'> = (T &
  Partial<Record<K, TreeData<T, K>>>)[]

interface ArrayToTreeOptions<K> {
  idKey?: string
  parentIdKey?: string
  childrenKey?: K
  orderKey?: string
}

export function arrayToTree<T, K extends string = 'children'>(
  arr: T[],
  {
    idKey = 'id',
    parentIdKey = 'parentId',
    childrenKey,
    orderKey = 'order',
  }: ArrayToTreeOptions<K> = {},
  callback?: any
) {
  const sortArr = orderKey
    ? arr.sort((a: any, b: any) => a[orderKey] - b[orderKey])
    : arr
  const _childrenKey = childrenKey || 'children'

  const tree: TreeData<T, K> = []
  const map: Record<string | number, T> = {}

  for (const item of sortArr) {
    const newItem = { ...item }
    delete newItem[_childrenKey as string]
    map[item[idKey]] = newItem
  }

  for (const item of sortArr) {
    const parentId = item[parentIdKey]
    const node = map[item[idKey]]
    if (callback) {
      const newNode = callback(node)
      for (const key in node) {
        delete node[key]
      }
      Object.assign(node as any, newNode)
    }
    if (parentId) {
      const parentNode = map[parentId] as Dict
      if (parentNode) {
        parentNode[_childrenKey] ??= []
        parentNode[_childrenKey].push(node)
      }
    } else {
      tree.push(node as any)
    }
  }

  return tree
}

export function treeToArray(
  tree: any,
  {
    idKey = 'id',
    parentIdKey = 'parentId',
    childrenKey = 'children',
    fields,
    orderKey,
  }: any = {},
  callback?: any
) {
  const data: any = []
  function loop(tree: any, parentId?: string) {
    tree.forEach((item: any, index: number) => {
      let newItem: any = { ...item, [parentIdKey]: parentId }
      if (orderKey) {
        newItem[orderKey] = index
      }

      if (callback) {
        newItem = callback(newItem)
      }
      delete newItem.children
      if (fields) {
        const fieldsItem: any = {}
        fields.forEach((key: any) => {
          fieldsItem[key] = newItem[key]
        })
        newItem = fieldsItem
      }
      data.push(newItem)
      if (Array.isArray(item[childrenKey])) {
        loop(item[childrenKey], item[idKey])
      }
    })
  }
  loop(tree)
  return data
}

export function findTree(
  data: any[],
  callback: (node: any, i: number, data: any[], level: number) => void,
  {
    id,
    idKey = 'id',
    level,
  }: {
    id?: string
    idKey?: string
    level?: number
  }
) {
  const hasLevel = typeof level === 'number'
  if (hasLevel && level === 0) {
    return true
  }
  for (let i = 0; i < data.length; i++) {
    const item = data[i] as any
    if (item[idKey] === id) {
      callback(item, i, data, level as number)
      return true
    }
    if (hasLevel && level > 1) {
      callback(item, i, data, level as number)
    }
    if (item.children) {
      if (
        findTree(item.children, callback, {
          id,
          idKey,
          level: hasLevel ? level - 1 : undefined,
        })
      ) {
        return true
      }
    }
  }
  return false
}
