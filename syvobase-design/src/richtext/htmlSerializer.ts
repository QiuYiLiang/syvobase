import { Value } from 'platejs'
import { createInitialValue } from './plugins'

type SlateNode = {
  type?: string
  children?: SlateNode[]
  text?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
  url?: string
  [key: string]: unknown
}

// HTML 标签到 Slate 类型的映射
const htmlTagToSlateType: Record<string, string> = {
  p: 'p',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  blockquote: 'blockquote',
  ul: 'ul',
  ol: 'ol',
  li: 'li',
  pre: 'code_block',
  code: 'code_line',
  hr: 'hr',
  a: 'a',
  table: 'table',
  tr: 'tr',
  td: 'td',
  th: 'th',
  img: 'img',
}

// Slate 类型到 HTML 标签的映射
const slateTypeToHtmlTag: Record<string, string> = {
  p: 'p',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  blockquote: 'blockquote',
  ul: 'ul',
  ol: 'ol',
  li: 'li',
  code_block: 'pre',
  code_line: 'code',
  hr: 'hr',
  a: 'a',
  table: 'table',
  tr: 'tr',
  td: 'td',
  th: 'th',
  img: 'img',
  action_item: 'li',
  toggle: 'div',
}

// 序列化文本节点
const serializeTextNode = (node: SlateNode): string => {
  let text = node.text || ''

  // 转义 HTML 特殊字符
  text = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

  // 应用标记
  if (node.code) {
    text = `<code>${text}</code>`
  }
  if (node.bold) {
    text = `<strong>${text}</strong>`
  }
  if (node.italic) {
    text = `<em>${text}</em>`
  }
  if (node.underline) {
    text = `<u>${text}</u>`
  }
  if (node.strikethrough) {
    text = `<s>${text}</s>`
  }

  return text
}

// 检查节点是否为空（只包含空白文本）
const isEmptyNode = (node: SlateNode): boolean => {
  if (node.text !== undefined) {
    return !node.text.trim()
  }
  if (!node.children || node.children.length === 0) {
    return true
  }
  return node.children.every(isEmptyNode)
}

// 序列化单个节点
const serializeNode = (node: SlateNode): string => {
  // 文本节点
  if (node.text !== undefined) {
    return serializeTextNode(node)
  }

  // 跳过空节点（但保留 hr）
  if (node.type !== 'hr' && isEmptyNode(node)) {
    return ''
  }

  // 元素节点
  const children = node.children?.map(serializeNode).join('') || ''
  const tag = slateTypeToHtmlTag[node.type || ''] || 'div'

  // 特殊处理
  switch (node.type) {
    case 'a':
      return `<a href="${node.url || ''}">${children}</a>`
    case 'img':
      return `<img src="${node.url || ''}" alt="${(node.caption as string) || ''}" />`
    case 'hr':
      return '<hr />'
    case 'li':
    case 'action_item': {
      // 列表项：如果只有一个段落子节点，直接输出其内容
      if (node.children?.length === 1 && node.children[0].type === 'p') {
        const innerChildren =
          node.children[0].children?.map(serializeNode).join('') || ''
        return `<li>${innerChildren}</li>`
      }
      return `<li>${children}</li>`
    }
    default:
      return `<${tag}>${children}</${tag}>`
  }
}

// 序列化 Slate Value 到 HTML
export const serializeHtml = (value: Value): string => {
  return value
    .map(serializeNode)
    .filter((s) => s.trim()) // 过滤空字符串
    .join('\n')
}

// 反序列化 HTML 元素到 Slate 节点
const deserializeElement = (
  element: Element
): SlateNode | SlateNode[] | null => {
  const tagName = element.tagName.toLowerCase()

  // 处理内联标记元素
  if (['strong', 'b'].includes(tagName)) {
    const children = deserializeChildren(element)
    return applyMark(children, 'bold')
  }
  if (['em', 'i'].includes(tagName)) {
    const children = deserializeChildren(element)
    return applyMark(children, 'italic')
  }
  if (tagName === 'u') {
    const children = deserializeChildren(element)
    return applyMark(children, 'underline')
  }
  if (['s', 'del', 'strike'].includes(tagName)) {
    const children = deserializeChildren(element)
    return applyMark(children, 'strikethrough')
  }
  if (
    tagName === 'code' &&
    element.parentElement?.tagName.toLowerCase() !== 'pre'
  ) {
    const children = deserializeChildren(element)
    return applyMark(children, 'code')
  }

  // 处理块级元素
  const type = htmlTagToSlateType[tagName]
  if (type) {
    const children = deserializeChildren(element)

    // 特殊处理
    if (tagName === 'a') {
      return {
        type: 'a',
        url: element.getAttribute('href') || '',
        children: children.length > 0 ? children : [{ text: '' }],
      }
    }
    if (tagName === 'img') {
      return {
        type: 'img',
        url: element.getAttribute('src') || '',
        children: [{ text: '' }],
      }
    }
    if (tagName === 'hr') {
      return {
        type: 'hr',
        children: [{ text: '' }],
      }
    }
    // 列表项需要将内容包装在段落中
    if (tagName === 'li') {
      // 检查是否已经有块级子元素
      const hasBlockChild = children.some(
        (c) => c.type && ['p', 'ul', 'ol', 'blockquote'].includes(c.type)
      )
      if (hasBlockChild) {
        return {
          type: 'li',
          children:
            children.length > 0
              ? children
              : [{ type: 'p', children: [{ text: '' }] }],
        }
      }
      // 否则将内联内容包装在段落中
      return {
        type: 'li',
        children: [
          {
            type: 'p',
            children: children.length > 0 ? children : [{ text: '' }],
          },
        ],
      }
    }
    // blockquote 也需要将内容包装在段落中
    if (tagName === 'blockquote') {
      const hasBlockChild = children.some(
        (c) => c.type && ['p', 'ul', 'ol'].includes(c.type)
      )
      if (hasBlockChild) {
        return {
          type: 'blockquote',
          children,
        }
      }
      return {
        type: 'blockquote',
        children: [
          {
            type: 'p',
            children: children.length > 0 ? children : [{ text: '' }],
          },
        ],
      }
    }

    return {
      type,
      children: children.length > 0 ? children : [{ text: '' }],
    }
  }

  // div、span 等容器元素，直接返回子节点
  if (
    ['div', 'span', 'section', 'article', 'main', 'header', 'footer'].includes(
      tagName
    )
  ) {
    return deserializeChildren(element)
  }

  // 默认作为段落处理
  const children = deserializeChildren(element)
  if (children.length > 0) {
    return {
      type: 'p',
      children,
    }
  }

  return null
}

// 反序列化子节点
const deserializeChildren = (element: Element): SlateNode[] => {
  const nodes: SlateNode[] = []

  element.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent || ''
      // 只保留非空白文本，或者至少包含一个非空白字符
      if (text.trim()) {
        // 规范化空白：多个空白字符合并为一个空格
        nodes.push({ text: text.replace(/\s+/g, ' ').trim() })
      }
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const result = deserializeElement(child as Element)
      if (result) {
        if (Array.isArray(result)) {
          nodes.push(...result)
        } else {
          nodes.push(result)
        }
      }
    }
  })

  return nodes
}

// 应用标记到节点
const applyMark = (nodes: SlateNode[], mark: string): SlateNode[] => {
  return nodes.map((node) => {
    if (node.text !== undefined) {
      return { ...node, [mark]: true }
    }
    if (node.children) {
      return { ...node, children: applyMark(node.children, mark) }
    }
    return node
  })
}

// 确保每个块级节点都有正确的结构
const normalizeNodes = (nodes: SlateNode[]): SlateNode[] => {
  const result: SlateNode[] = []
  let currentInlineNodes: SlateNode[] = []

  const flushInlineNodes = () => {
    if (currentInlineNodes.length > 0) {
      result.push({
        type: 'p',
        children: currentInlineNodes,
      })
      currentInlineNodes = []
    }
  }

  nodes.forEach((node) => {
    // 如果是纯文本节点或内联元素
    if (node.text !== undefined) {
      currentInlineNodes.push(node)
    } else if (
      node.type &&
      [
        'p',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'blockquote',
        'ul',
        'ol',
        'code_block',
        'hr',
        'table',
        'img',
      ].includes(node.type)
    ) {
      // 块级元素
      flushInlineNodes()
      result.push(node)
    } else {
      // 其他情况作为内联处理
      if (node.children) {
        currentInlineNodes.push(...(node.children as SlateNode[]))
      }
    }
  })

  flushInlineNodes()

  return result.length > 0 ? result : createInitialValue()
}

// 反序列化 HTML 字符串到 Slate Value
export const deserializeHtml = (html: string): Value => {
  if (!html.trim()) {
    return createInitialValue()
  }

  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const nodes = deserializeChildren(doc.body)
    return normalizeNodes(nodes) as Value
  } catch (error) {
    console.error('Failed to parse HTML:', error)
    // 回退到纯文本
    return [
      {
        type: 'p',
        children: [{ text: html }],
      },
    ]
  }
}
