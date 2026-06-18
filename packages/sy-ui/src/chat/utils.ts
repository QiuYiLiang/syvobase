import type { PlanStep } from './types'

/**
 * 格式化时间戳为本地时间字符串
 */
export const formatTime = (timestamp?: number) => {
  if (!timestamp) return null
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * 从内容中解析 <think> 标签
 * 支持格式: <think>思考内容</think>
 */
export const parseThinkingFromContent = (
  content: string,
  isStreaming?: boolean
): {
  thinking: string
  displayContent: string
  thinkingStatus: 'thinking' | 'done'
} => {
  // 匹配完整的 <think>...</think> 标签
  const completeThinkMatch = content.match(/<think>([\s\S]*?)<\/think>/i)
  if (completeThinkMatch) {
    const thinking = completeThinkMatch[1].trim()
    const displayContent = content
      .replace(/<think>[\s\S]*?<\/think>/i, '')
      .trim()
    return { thinking, displayContent, thinkingStatus: 'done' }
  }

  // 匹配未闭合的 <think> 标签（流式输出中）
  const openThinkMatch = content.match(/<think>([\s\S]*)$/i)
  if (openThinkMatch) {
    const thinking = openThinkMatch[1].trim()
    const displayContent = content.replace(/<think>[\s\S]*$/i, '').trim()
    return {
      thinking,
      displayContent,
      thinkingStatus: isStreaming ? 'thinking' : 'done',
    }
  }

  return { thinking: '', displayContent: content, thinkingStatus: 'done' }
}

/**
 * 从内容中过滤掉 plan/step 标签
 * 这些标签只用于内部处理计划状态，不应该显示给用户
 */
export const filterPlanStepBlocks = (content: string): string => {
  if (!content) return content

  let filtered = content

  // 移除完整的 <plan>...</plan> 标签
  filtered = filtered.replace(/<plan>[\s\S]*?<\/plan>/gi, '')
  // 移除未闭合的 <plan>（流式输出中）
  filtered = filtered.replace(/<plan>[\s\S]*$/gi, '')
  // 移除 <step-status> 标签
  filtered = filtered.replace(/<step-status\s+[^>]*\/?>/gi, '')

  // 清理多余的空行
  filtered = filtered.replace(/\n{3,}/g, '\n\n')
  filtered = filtered.replace(/^\n+/, '')

  return filtered.trim()
}

/**
 * 解析单个 step 标签，处理嵌套情况
 * 返回匹配的 step 信息和结束位置
 */
const parseOneStep = (
  content: string,
  startPos: number,
  stepStatusMap: Map<string, 'pending' | 'running' | 'completed' | 'failed'>
): { step: PlanStep; endPos: number } | null => {
  // 从 startPos 开始查找 <step
  const stepStart = content.indexOf('<step', startPos)
  if (stepStart === -1) return null

  // 解析属性
  const attrMatch = content
    .slice(stepStart)
    .match(/<step\s+id=["']([^"']+)["']\s+title=["']([^"']+)["'](\s*\/>|\s*>)/i)
  if (!attrMatch) return null

  const id = attrMatch[1]
  const title = attrMatch[2]
  const isSelfClosing = attrMatch[3].includes('/>')
  const attrEndPos = stepStart + attrMatch[0].length

  if (isSelfClosing) {
    return {
      step: {
        id,
        title,
        status: stepStatusMap.get(id) || 'pending',
      },
      endPos: attrEndPos,
    }
  }

  // 找到匹配的 </step>，需要处理嵌套
  let depth = 1
  let pos = attrEndPos
  let closePos = -1

  while (pos < content.length && depth > 0) {
    const nextOpen = content.indexOf('<step', pos)
    const nextClose = content.indexOf('</step>', pos)

    if (nextClose === -1) break

    if (nextOpen !== -1 && nextOpen < nextClose) {
      // 检查是否是自闭合标签
      const selfCloseCheck = content.slice(nextOpen).match(/<step[^>]*\/>/i)
      if (selfCloseCheck && nextOpen + selfCloseCheck[0].length <= nextClose) {
        // 这是自闭合标签，不增加深度
        pos = nextOpen + selfCloseCheck[0].length
      } else {
        depth++
        pos = nextOpen + 5
      }
    } else {
      depth--
      if (depth === 0) {
        closePos = nextClose
      }
      pos = nextClose + 7
    }
  }

  if (closePos === -1) return null

  // 获取内部内容
  const innerContent = content.slice(attrEndPos, closePos)
  const endPos = closePos + 7

  // 检查是否有嵌套的 step
  const hasNestedSteps = /<step\s+id=["']/.test(innerContent)

  let description: string | undefined
  let children: PlanStep[] | undefined

  if (hasNestedSteps) {
    // 提取描述（第一个 <step 之前的文本）
    const firstStepPos = innerContent.indexOf('<step')
    description = innerContent.slice(0, firstStepPos).trim() || undefined
    // 递归解析子步骤
    children = parseStepsFromString(innerContent, stepStatusMap)
    if (children.length === 0) children = undefined
  } else {
    description = innerContent.trim() || undefined
  }

  // 计算父步骤状态：如果有子步骤，根据子步骤状态自动推断
  let status = stepStatusMap.get(id) || 'pending'
  if (children && children.length > 0 && !stepStatusMap.has(id)) {
    const allCompleted = children.every((c) => c.status === 'completed')
    const anyFailed = children.some((c) => c.status === 'failed')
    const anyRunning = children.some(
      (c) => c.status === 'running' || c.status === 'completed'
    )
    if (allCompleted) {
      status = 'completed'
    } else if (anyFailed) {
      status = 'failed'
    } else if (anyRunning) {
      status = 'running'
    }
  }

  return {
    step: {
      id,
      title,
      description,
      status,
      children,
    },
    endPos,
  }
}

/**
 * 解析字符串中的所有 step 标签
 */
const parseStepsFromString = (
  content: string,
  stepStatusMap: Map<string, 'pending' | 'running' | 'completed' | 'failed'>
): PlanStep[] => {
  const steps: PlanStep[] = []
  let pos = 0

  while (pos < content.length) {
    const result = parseOneStep(content, pos, stepStatusMap)
    if (!result) break

    if (!steps.find((s) => s.id === result.step.id)) {
      steps.push(result.step)
    }
    pos = result.endPos
  }

  return steps
}

/**
 * 从内容中解析 <plan> 和 <step> 标签，返回树形 PlanStep 数组
 * 使用行业规范的 XML 标签格式，支持流式解析和嵌套步骤
 *
 * 格式示例:
 * <plan>
 *   <step id="1" title="分析需求">
 *     <step id="1.1" title="收集信息">收集用户信息</step>
 *     <step id="1.2" title="整理需求">整理需求文档</step>
 *   </step>
 *   <step id="2" title="执行任务">执行具体任务</step>
 * </plan>
 *
 * 状态更新:
 * <step-status id="1.1" status="running" />
 * <step-status id="1.1" status="completed" />
 */
export const parsePlanStepsFromContent = (
  content: string,
  isStreaming?: boolean
): PlanStep[] => {
  if (!content) return []

  // 1. 先解析所有 <step-status> 标签收集状态
  const stepStatusMap = new Map<
    string,
    'pending' | 'running' | 'completed' | 'failed'
  >()
  const statusRegex =
    /<step-status\s+id=["']([^"']+)["']\s+status=["']([^"']+)["']\s*\/?>/gi
  let statusMatch
  while ((statusMatch = statusRegex.exec(content)) !== null) {
    const [, id, status] = statusMatch
    if (id && status) {
      stepStatusMap.set(
        id,
        status as 'pending' | 'running' | 'completed' | 'failed'
      )
    }
  }

  // 2. 解析完整的 <plan>...</plan> 标签
  const completePlanMatch = content.match(/<plan>([\s\S]*?)<\/plan>/i)
  if (completePlanMatch) {
    return parseStepsFromString(completePlanMatch[1], stepStatusMap)
  }

  // 3. 解析未闭合的 <plan>（流式输出中）
  if (isStreaming) {
    const unfinishedPlanMatch = content.match(/<plan>([\s\S]*)$/i)
    if (unfinishedPlanMatch && !content.includes('</plan>')) {
      return parseStepsFromString(unfinishedPlanMatch[1], stepStatusMap)
    }
  }

  return []
}
