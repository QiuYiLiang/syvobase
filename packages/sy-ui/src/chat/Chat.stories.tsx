import { Meta, StoryObj } from '@storybook/react-vite'
import { Chat } from './Chat'
import { ChatMessageData, McpToolCall, PlanStep } from './types'
import { useState } from 'react'
import { Button } from '@/button'

const meta: Meta<typeof Chat> = {
  title: 'Components/Chat',
  component: Chat,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', width: '100%' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Chat>

// 基础示例
export const Basic: Story = {
  render: () => {
    const [messages, setMessages] = useState<ChatMessageData[]>([
      {
        id: '1',
        role: 'assistant',
        content: '你好！我是 AI 助手，有什么可以帮助你的吗？',
        status: 'completed',
        timestamp: Date.now() - 60000,
      },
    ])
    const [loading, setLoading] = useState(false)

    const handleSend = async (content: string) => {
      // 添加用户消息
      const userMessage: ChatMessageData = {
        id: Date.now().toString(),
        role: 'user',
        content,
        status: 'completed',
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, userMessage])

      // 模拟 AI 响应
      setLoading(true)
      const aiMessage: ChatMessageData = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        status: 'streaming',
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, aiMessage])

      // 模拟流式输出
      const response = `好的，我收到了你的消息："${content}"。

这是一个 **Markdown** 渲染示例：

- 支持 *斜体* 和 **粗体**
- 支持 \`行内代码\`
- 支持代码块：

\`\`\`javascript
const hello = 'world';
console.log(hello);
\`\`\`

> 这是一个引用块

还有[链接](https://example.com)支持！`

      for (let i = 0; i <= response.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 20))
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessage.id
              ? { ...msg, content: response.slice(0, i) }
              : msg
          )
        )
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessage.id ? { ...msg, status: 'completed' } : msg
        )
      )
      setLoading(false)
    }

    return (
      <Chat
        messages={messages}
        loading={loading}
        onSend={handleSend}
        onStop={() => setLoading(false)}
        showTimestamp
        placeholder='输入消息，按 Enter 发送...'
      />
    )
  },
}

// 带 MCP 工具调用示例
export const WithMcpToolCalls: Story = {
  render: () => {
    const toolCalls: McpToolCall[] = [
      {
        id: '1',
        name: 'search_web',
        args: { query: 'React hooks 最佳实践' },
        status: 'success',
        result: '找到 10 条相关结果...',
        startTime: Date.now() - 2000,
        endTime: Date.now() - 500,
      },
      {
        id: '2',
        name: 'read_file',
        args: { path: '/src/components/App.tsx' },
        status: 'running',
        startTime: Date.now() - 300,
      },
      {
        id: '3',
        name: 'execute_code',
        args: { code: 'npm install react' },
        status: 'pending',
      },
    ]

    const messages: ChatMessageData[] = [
      {
        id: '1',
        role: 'user',
        content: '帮我搜索 React hooks 的最佳实践，并读取项目中的 App.tsx 文件',
        status: 'completed',
        timestamp: Date.now() - 5000,
      },
      {
        id: '2',
        role: 'assistant',
        content: '好的，我正在为你执行以下操作：',
        status: 'streaming',
        timestamp: Date.now() - 4000,
        toolCalls,
      },
    ]

    return <Chat messages={messages} loading showTimestamp />
  },
}

// 带执行计划示例（消息内）
export const WithPlanInMessage: Story = {
  render: () => {
    const plan: PlanStep[] = [
      {
        id: '1',
        title: '分析需求',
        description: '理解用户的开发需求',
        status: 'completed',
      },
      {
        id: '2',
        title: '搜索相关代码',
        description: '在代码库中搜索相关文件',
        status: 'completed',
      },
      {
        id: '3',
        title: '编写代码',
        status: 'running',
        children: [
          {
            id: '3.1',
            title: '创建组件文件',
            status: 'completed',
          },
          {
            id: '3.2',
            title: '实现核心逻辑',
            status: 'running',
          },
          {
            id: '3.3',
            title: '添加样式',
            status: 'pending',
          },
        ],
      },
      {
        id: '4',
        title: '测试验证',
        status: 'pending',
      },
    ]

    const messages: ChatMessageData[] = [
      {
        id: '1',
        role: 'user',
        content: '帮我创建一个用户登录组件',
        status: 'completed',
      },
      {
        id: '2',
        role: 'assistant',
        content: '我将按以下计划为你创建登录组件：',
        status: 'streaming',
        plan,
      },
    ]

    return <Chat messages={messages} loading />
  },
}

// VS Code Copilot 风格 - Todos 固定在底部
export const WithTodos: Story = {
  render: () => {
    const [messages] = useState<ChatMessageData[]>([
      {
        id: '1',
        role: 'user',
        content: '帮我创建一个用户登录组件，包含表单验证和记住密码功能',
        status: 'completed',
      },
      {
        id: '2',
        role: 'assistant',
        content:
          '好的，我正在为你创建登录组件...\n\n首先，我会创建一个 `LoginForm.tsx` 组件文件。',
        status: 'streaming',
      },
    ])

    const todos: PlanStep[] = [
      {
        id: '1',
        title: '创建 LoginForm.tsx 组件',
        status: 'completed',
      },
      {
        id: '2',
        title: '添加表单字段 (用户名、密码)',
        status: 'completed',
      },
      {
        id: '3',
        title: '实现表单验证逻辑',
        status: 'running',
      },
      {
        id: '4',
        title: '添加"记住密码"复选框',
        status: 'pending',
      },
      {
        id: '5',
        title: '添加样式和响应式设计',
        status: 'pending',
      },
    ]

    return (
      <Chat
        messages={messages}
        loading
        todos={todos}
        placeholder='继续对话...'
      />
    )
  },
}

// 🔤 Markdown 完整功能演示
export const MarkdownShowcase: Story = {
  render: () => {
    const markdownContent = `# Markdown 渲染功能演示

这是一个完整的 **Markdown 渲染** 功能展示，包含各种常用格式。

## 文本格式

- **粗体文本** 使用双星号
- *斜体文本* 使用单星号
- ~~删除线~~ 使用双波浪号
- \`行内代码\` 使用反引号
- 组合使用：***粗斜体***

## 代码块

支持语法高亮的代码块：

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
}

const createUser = (name: string): User => {
  return {
    id: crypto.randomUUID(),
    name,
    email: \`\${name.toLowerCase()}@example.com\`,
  };
};

console.log(createUser('张三'));
\`\`\`

\`\`\`python
def fibonacci(n: int) -> list[int]:
    """生成斐波那契数列"""
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    
    fib = [0, 1]
    while len(fib) < n:
        fib.append(fib[-1] + fib[-2])
    return fib

print(fibonacci(10))  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
\`\`\`

## 列表

### 无序列表
- 第一项
- 第二项
  - 嵌套项 A
  - 嵌套项 B
- 第三项

### 有序列表
1. 首先，分析需求
2. 然后，设计方案
3. 接着，编写代码
4. 最后，测试验证

### 任务列表
- [x] 完成需求分析
- [x] 完成 UI 设计
- [ ] 开发前端页面
- [ ] 开发后端 API
- [ ] 测试和部署

## 表格

| 功能 | 状态 | 负责人 | 截止日期 |
|------|------|--------|----------|
| 用户登录 | ✅ 完成 | 张三 | 2024-01-15 |
| 数据看板 | 🔄 进行中 | 李四 | 2024-01-20 |
| 报表导出 | ⏳ 待开始 | 王五 | 2024-01-25 |

## 引用

> 编程的艺术在于平衡优雅与实用，在约束中寻找自由。
> 
> —— 某位智者

## 链接和图片

- [GitHub](https://github.com)
- [React 官网](https://react.dev)

## 数学公式

行内公式：$E = mc^2$

块级公式：

$$
f(x) = \\int_{-\\infty}^{\\infty} \\hat{f}(\\xi) e^{2\\pi i \\xi x} d\\xi
$$

---

以上就是 Markdown 渲染的完整功能演示！`

    const messages: ChatMessageData[] = [
      {
        id: '1',
        role: 'user',
        content: '展示一下你的 Markdown 渲染能力',
        status: 'completed',
      },
      {
        id: '2',
        role: 'assistant',
        content: markdownContent,
        status: 'completed',
      },
    ]

    return <Chat messages={messages} />
  },
}

// 📊 ECharts 图表演示
export const EChartsShowcase: Story = {
  render: () => {
    const chartContent = `# ECharts 图表渲染演示

我可以在 Markdown 中直接渲染 ECharts 图表！只需要使用 \`\`\`echarts\`\`\` 代码块即可。

## 柱状图示例

\`\`\`echarts
{
  "title": {
    "text": "月度销售数据",
    "left": "center",
    "textStyle": { "color": "#e5e5e5" }
  },
  "tooltip": { "trigger": "axis" },
  "xAxis": {
    "type": "category",
    "data": ["1月", "2月", "3月", "4月", "5月", "6月"],
    "axisLabel": { "color": "#a3a3a3" }
  },
  "yAxis": {
    "type": "value",
    "axisLabel": { "color": "#a3a3a3" }
  },
  "series": [{
    "name": "销售额",
    "type": "bar",
    "data": [120, 200, 150, 80, 70, 110],
    "itemStyle": { "color": "#3b82f6" }
  }]
}
\`\`\`

## 折线图示例

\`\`\`echarts
{
  "title": {
    "text": "用户增长趋势",
    "left": "center",
    "textStyle": { "color": "#e5e5e5" }
  },
  "tooltip": { "trigger": "axis" },
  "legend": {
    "data": ["新用户", "活跃用户"],
    "bottom": 0,
    "textStyle": { "color": "#a3a3a3" }
  },
  "xAxis": {
    "type": "category",
    "data": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    "axisLabel": { "color": "#a3a3a3" }
  },
  "yAxis": {
    "type": "value",
    "axisLabel": { "color": "#a3a3a3" }
  },
  "series": [
    {
      "name": "新用户",
      "type": "line",
      "smooth": true,
      "data": [120, 132, 101, 134, 90, 230, 210],
      "itemStyle": { "color": "#22c55e" }
    },
    {
      "name": "活跃用户",
      "type": "line",
      "smooth": true,
      "data": [220, 182, 191, 234, 290, 330, 310],
      "itemStyle": { "color": "#f59e0b" }
    }
  ]
}
\`\`\`

## 饼图示例

\`\`\`echarts
{
  "title": {
    "text": "访问来源分布",
    "left": "center",
    "textStyle": { "color": "#e5e5e5" }
  },
  "tooltip": { "trigger": "item" },
  "legend": {
    "orient": "vertical",
    "left": "left",
    "textStyle": { "color": "#a3a3a3" }
  },
  "series": [{
    "name": "访问来源",
    "type": "pie",
    "radius": ["40%", "70%"],
    "avoidLabelOverlap": false,
    "itemStyle": {
      "borderRadius": 10,
      "borderColor": "#171717",
      "borderWidth": 2
    },
    "label": { "show": false },
    "emphasis": {
      "label": { "show": true, "fontSize": 16 }
    },
    "data": [
      { "value": 1048, "name": "搜索引擎" },
      { "value": 735, "name": "直接访问" },
      { "value": 580, "name": "邮件营销" },
      { "value": 484, "name": "联盟广告" },
      { "value": 300, "name": "视频广告" }
    ]
  }]
}
\`\`\`

## 仪表盘示例

\`\`\`echarts
{
  "series": [{
    "type": "gauge",
    "progress": { "show": true, "width": 18 },
    "axisLine": { "lineStyle": { "width": 18 } },
    "axisTick": { "show": false },
    "splitLine": { "length": 15, "lineStyle": { "width": 2, "color": "#999" } },
    "axisLabel": { "distance": 25, "color": "#999", "fontSize": 12 },
    "anchor": { "show": true, "size": 25, "itemStyle": { "borderWidth": 10 } },
    "title": { "show": false },
    "detail": {
      "valueAnimation": true,
      "fontSize": 32,
      "color": "#fff",
      "offsetCenter": [0, "70%"]
    },
    "data": [{ "value": 72, "name": "系统负载" }]
  }]
}
\`\`\`

---

> 💡 **提示**: 点击图表右上角的「查看代码」按钮可以查看图表配置源码。`

    const messages: ChatMessageData[] = [
      {
        id: '1',
        role: 'user',
        content: '展示一下你的图表渲染能力',
        status: 'completed',
      },
      {
        id: '2',
        role: 'assistant',
        content: chartContent,
        status: 'completed',
      },
    ]

    return (
      <Chat
        messages={messages}
        messageRenders={[
          {
            // type: 'streamdown-echarts',
            type: 'echarts',
            prompt: 'echarts',
            render: () => {
              return <div>echarts</div>
            },
          },
        ]}
      />
    )
  },
}

// 带自定义交互按钮示例
export const WithActionButtons: Story = {
  render: () => {
    const [messages] = useState<ChatMessageData[]>([
      {
        id: '1',
        role: 'assistant',
        content:
          '我发现了以下代码问题，你希望我如何处理？\n\n```javascript\nconst data = null;\nconsole.log(data.name); // 可能导致空指针错误\n```',
        status: 'completed',
        actions: [
          {
            id: 'fix',
            label: '自动修复',
            icon: 'Wand2',
            type: 'primary',
            onClick: () => alert('正在修复...'),
          },
          {
            id: 'explain',
            label: '解释问题',
            icon: 'HelpCircle',
            onClick: () => alert('正在解释...'),
          },
          {
            id: 'ignore',
            label: '忽略',
            icon: 'X',
            type: 'ghost',
            onClick: () => alert('已忽略'),
          },
        ],
      },
    ])

    return <Chat messages={messages} />
  },
}

// 带自定义交互组件示例
export const WithCustomActions: Story = {
  render: () => {
    const messages: ChatMessageData[] = [
      {
        id: '1',
        role: 'assistant',
        content: '请选择你想要的操作模式：',
        status: 'completed',
      },
    ]

    return (
      <Chat
        messages={messages}
        customActions={
          <div className='flex items-center gap-2'>
            <Button icon='Zap' type='outline' size='sm'>
              快速模式
            </Button>
            <Button icon='Brain' type='outline' size='sm'>
              深度思考
            </Button>
            <Button icon='Search' type='outline' size='sm'>
              联网搜索
            </Button>
            <Button icon='Code' type='outline' size='sm'>
              代码模式
            </Button>
          </div>
        }
      />
    )
  },
}

// 带附件支持示例
export const WithAttachments: Story = {
  render: () => {
    const [messages, setMessages] = useState<ChatMessageData[]>([])

    const handleSend = (content: string, attachments?: any[]) => {
      const message: ChatMessageData = {
        id: Date.now().toString(),
        role: 'user',
        content,
        status: 'completed',
        attachments: attachments?.map((a) => ({
          ...a,
          type: a.type as 'image' | 'file' | 'code',
        })),
      }
      setMessages((prev) => [...prev, message])
    }

    return (
      <Chat
        messages={messages}
        enableAttachments
        acceptedFileTypes={['image/*', '.pdf', '.doc', '.docx']}
        onSend={handleSend}
        placeholder='输入消息或拖拽文件到这里...'
      />
    )
  },
}

// 带头部和底部示例
export const WithHeaderFooter: Story = {
  render: () => {
    const messages: ChatMessageData[] = [
      {
        id: '1',
        role: 'assistant',
        content: '欢迎使用 AI 助手！',
        status: 'completed',
      },
    ]

    return (
      <Chat
        messages={messages}
        header={
          <div className='flex items-center justify-between p-4'>
            <div className='flex items-center gap-2'>
              <div className='bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full'>
                AI
              </div>
              <div>
                <div className='font-medium'>智能助手</div>
                <div className='text-muted-foreground text-xs'>在线</div>
              </div>
            </div>
            <Button icon='Settings' type='ghost' size='sm' />
          </div>
        }
        footer={
          <div className='text-muted-foreground py-2 text-center text-xs'>
            由 AI 提供支持 · 内容仅供参考
          </div>
        }
      />
    )
  },
}

// 错误状态示例
export const ErrorState: Story = {
  render: () => {
    const messages: ChatMessageData[] = [
      {
        id: '1',
        role: 'user',
        content: '请帮我分析这段代码',
        status: 'completed',
      },
      {
        id: '2',
        role: 'assistant',
        content: '抱歉，在处理您的请求时遇到了问题。',
        status: 'error',
        error: '服务暂时不可用，请稍后重试',
      },
    ]

    return (
      <Chat
        messages={messages}
        onRegenerate={(id) => alert(`重新生成消息: ${id}`)}
      />
    )
  },
}

// 空状态示例
export const EmptyState: Story = {
  render: () => {
    return (
      <Chat
        emptyContent={
          <div className='text-center'>
            <div className='mb-4 text-4xl'>👋</div>
            <h3 className='mb-2 font-medium'>欢迎使用 AI 助手</h3>
            <p className='text-muted-foreground text-sm'>
              你可以问我任何问题，我会尽力帮助你
            </p>
          </div>
        }
      />
    )
  },
}

// 预设任务示例
export const WithTasks: Story = {
  render: () => {
    const [messages, setMessages] = useState<ChatMessageData[]>([
      {
        id: '1',
        role: 'assistant',
        content: '你好！我是 AI 助手，请选择下方的任务或直接输入你的问题。',
        status: 'completed',
        timestamp: Date.now(),
      },
    ])
    const [loading, setLoading] = useState(false)

    const tasks = [
      {
        name: '写一封邮件',
        icon: 'Mail',
        prompt: '请帮我写一封正式的商务邮件，主题是关于项目进度汇报',
      },
      { name: '翻译文档', icon: 'Languages', prompt: '请将以下内容翻译成英文' },
      {
        name: '生成创意',
        icon: 'Lightbulb',
        prompt: '请帮我生成 5 个关于产品推广的创意点子',
      },
      {
        name: '数据分析',
        icon: 'ChartBar',
        prompt: '请分析以下销售数据并给出建议',
      },
    ]

    const handleSend = async (content: string) => {
      const userMessage: ChatMessageData = {
        id: Date.now().toString(),
        role: 'user',
        content,
        status: 'completed',
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, userMessage])

      setLoading(true)
      const aiMessage: ChatMessageData = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        status: 'streaming',
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, aiMessage])

      const response = `收到你的请求："${content.slice(0, 50)}${content.length > 50 ? '...' : ''}"

我会帮你处理这个任务。这是一个演示示例，实际场景中 AI 会根据你的需求生成相应的内容。`

      for (let i = 0; i <= response.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 15))
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessage.id
              ? { ...msg, content: response.slice(0, i) }
              : msg
          )
        )
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessage.id ? { ...msg, status: 'completed' } : msg
        )
      )
      setLoading(false)
    }

    return (
      <Chat
        messages={messages}
        loading={loading}
        tasks={tasks}
        onSend={handleSend}
        onStop={() => setLoading(false)}
        placeholder='输入消息或点击上方任务...'
        emptyContent={
          <div className='text-center'>
            <div className='mb-4 text-4xl'>🚀</div>
            <h3 className='mb-2 font-medium'>快速开始</h3>
            <p className='text-muted-foreground text-sm'>
              点击下方任务按钮快速开始对话
            </p>
          </div>
        }
      />
    )
  },
}

// 🎯 完整交互示例 - 低代码平台创建进销存系统
export const FullInteractiveDemo: Story = {
  render: () => {
    const [messages, setMessages] = useState<ChatMessageData[]>([])
    const [loading, setLoading] = useState(false)
    const [todos, setTodos] = useState<PlanStep[]>([])

    // 模拟延时
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms))

    // 模拟流式输出文本（更慢）
    const streamText = async (messageId: string, text: string, speed = 25) => {
      for (let i = 0; i <= text.length; i++) {
        await delay(speed)
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, content: text.slice(0, i) } : msg
          )
        )
      }
    }

    // 递归更新嵌套 todo 状态
    const updateTodoStatus = (todoId: string, status: PlanStep['status']) => {
      const updateRecursive = (items: PlanStep[]): PlanStep[] => {
        return items.map((item) => {
          if (item.id === todoId) {
            return { ...item, status }
          }
          if (item.children) {
            return { ...item, children: updateRecursive(item.children) }
          }
          return item
        })
      }
      setTodos((prev) => updateRecursive(prev))
    }

    // 添加工具调用到消息
    const addToolCall = (msgId: string, tool: McpToolCall) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === msgId
            ? {
                ...msg,
                toolCalls: [...(msg.toolCalls || []), tool],
              }
            : msg
        )
      )
    }

    // 更新工具调用状态
    const updateToolCall = (
      msgId: string,
      toolId: string,
      updates: Partial<McpToolCall>
    ) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === msgId
            ? {
                ...msg,
                toolCalls: msg.toolCalls?.map((t) =>
                  t.id === toolId ? { ...t, ...updates } : t
                ),
              }
            : msg
        )
      )
    }

    // 完整的进销存系统创建流程
    const executeFullFlow = async () => {
      setLoading(true)

      // 1. 添加用户消息
      const userMsgId = Date.now().toString()
      setMessages([
        {
          id: userMsgId,
          role: 'user',
          content:
            '帮我用低代码平台从零开始创建一个完整的进销存管理系统，包含商品管理、采购入库、销售出库、库存盘点等功能模块。',
          status: 'completed',
          timestamp: Date.now(),
        },
      ])

      await delay(800)

      // 2. 创建 AI 响应消息
      const aiMsgId = (Date.now() + 1).toString()
      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          role: 'assistant',
          content: '',
          status: 'streaming',
          timestamp: Date.now(),
        },
      ])

      // 3. 流式输出第一段回复
      await streamText(
        aiMsgId,
        '好的，我来帮你创建一个完整的进销存管理系统。这是一个比较复杂的项目，让我先规划一下整体架构...'
      )

      await delay(1000)

      // 4. 创建嵌套任务计划
      const initialTodos: PlanStep[] = [
        {
          id: 't1',
          title: '创建应用和数据模型',
          status: 'pending',
          children: [
            { id: 't1-1', title: '创建「进销存系统」应用', status: 'pending' },
            { id: 't1-2', title: '创建「商品」数据表', status: 'pending' },
            { id: 't1-3', title: '创建「供应商」数据表', status: 'pending' },
            { id: 't1-4', title: '创建「客户」数据表', status: 'pending' },
            { id: 't1-5', title: '创建「仓库」数据表', status: 'pending' },
          ],
        },
        {
          id: 't2',
          title: '创建业务数据表',
          status: 'pending',
          children: [
            { id: 't2-1', title: '创建「采购订单」数据表', status: 'pending' },
            { id: 't2-2', title: '创建「采购明细」数据表', status: 'pending' },
            { id: 't2-3', title: '创建「销售订单」数据表', status: 'pending' },
            { id: 't2-4', title: '创建「销售明细」数据表', status: 'pending' },
            { id: 't2-5', title: '创建「库存记录」数据表', status: 'pending' },
          ],
        },
        {
          id: 't3',
          title: '创建功能页面',
          status: 'pending',
          children: [
            { id: 't3-1', title: '创建「商品管理」页面', status: 'pending' },
            { id: 't3-2', title: '创建「采购入库」页面', status: 'pending' },
            { id: 't3-3', title: '创建「销售出库」页面', status: 'pending' },
            { id: 't3-4', title: '创建「库存查询」页面', status: 'pending' },
            { id: 't3-5', title: '创建「库存盘点」页面', status: 'pending' },
          ],
        },
        {
          id: 't4',
          title: '配置业务逻辑',
          status: 'pending',
          children: [
            { id: 't4-1', title: '配置库存自动计算', status: 'pending' },
            { id: 't4-2', title: '配置库存预警规则', status: 'pending' },
            { id: 't4-3', title: '配置审批工作流', status: 'pending' },
          ],
        },
        {
          id: 't5',
          title: '创建数据看板',
          status: 'pending',
          children: [
            { id: 't5-1', title: '创建「销售统计」图表', status: 'pending' },
            { id: 't5-2', title: '创建「库存概览」仪表盘', status: 'pending' },
          ],
        },
      ]
      setTodos(initialTodos)

      await delay(1500)

      // ==================== 阶段 1: 创建应用和数据模型 ====================
      updateTodoStatus('t1', 'running')

      // 1-1: 创建应用
      updateTodoStatus('t1-1', 'running')
      const tool1 = {
        id: 'tool-create-app',
        name: 'create_application',
        args: { name: '进销存管理系统', icon: 'Package', color: '#3B82F6' },
        status: 'running' as const,
        startTime: Date.now(),
      }
      addToolCall(aiMsgId, tool1)
      await delay(2000)
      updateToolCall(aiMsgId, 'tool-create-app', {
        status: 'success',
        result: '应用创建成功，ID: app_jxc_001',
        endTime: Date.now(),
      })
      updateTodoStatus('t1-1', 'completed')
      await delay(500)

      // 1-2: 创建商品表
      updateTodoStatus('t1-2', 'running')
      const tool2 = {
        id: 'tool-create-product',
        name: 'create_entity',
        args: {
          name: '商品',
          fields: [
            '商品编码',
            '商品名称',
            '规格型号',
            '单位',
            '售价',
            '成本价',
            '库存预警值',
          ],
        },
        status: 'running' as const,
        startTime: Date.now(),
      }
      addToolCall(aiMsgId, tool2)
      await delay(2500)
      updateToolCall(aiMsgId, 'tool-create-product', {
        status: 'success',
        result: '商品表创建成功，包含7个字段',
        endTime: Date.now(),
      })
      updateTodoStatus('t1-2', 'completed')
      await delay(400)

      // 1-3: 创建供应商表
      updateTodoStatus('t1-3', 'running')
      await delay(1800)
      updateTodoStatus('t1-3', 'completed')
      await delay(300)

      // 1-4: 创建客户表
      updateTodoStatus('t1-4', 'running')
      await delay(1600)
      updateTodoStatus('t1-4', 'completed')
      await delay(300)

      // 1-5: 创建仓库表
      updateTodoStatus('t1-5', 'running')
      await delay(1400)
      updateTodoStatus('t1-5', 'completed')
      await delay(500)

      updateTodoStatus('t1', 'completed')

      // 更新消息内容
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? {
                ...msg,
                content:
                  msg.content +
                  '\n\n✅ 基础数据模型已创建完成，包括商品、供应商、客户、仓库等核心数据表。\n\n现在开始创建业务数据表...',
              }
            : msg
        )
      )

      await delay(1000)

      // ==================== 阶段 2: 创建业务数据表 ====================
      updateTodoStatus('t2', 'running')

      // 2-1: 采购订单
      updateTodoStatus('t2-1', 'running')
      const tool3 = {
        id: 'tool-create-purchase',
        name: 'create_entity',
        args: {
          name: '采购订单',
          fields: [
            '订单编号',
            '供应商',
            '采购日期',
            '总金额',
            '状态',
            '审批人',
            '备注',
          ],
          relations: ['供应商 -> 一对多'],
        },
        status: 'running' as const,
        startTime: Date.now(),
      }
      addToolCall(aiMsgId, tool3)
      await delay(2200)
      updateToolCall(aiMsgId, 'tool-create-purchase', {
        status: 'success',
        result: '采购订单表创建成功',
        endTime: Date.now(),
      })
      updateTodoStatus('t2-1', 'completed')
      await delay(400)

      // 2-2 到 2-5: 其他业务表
      for (const [id, , time] of [
        ['t2-2', '采购明细', 1800],
        ['t2-3', '销售订单', 2000],
        ['t2-4', '销售明细', 1700],
        ['t2-5', '库存记录', 1900],
      ] as const) {
        updateTodoStatus(id, 'running')
        await delay(time)
        updateTodoStatus(id, 'completed')
        await delay(300)
      }

      updateTodoStatus('t2', 'completed')
      await delay(800)

      // ==================== 阶段 3: 创建功能页面 ====================
      updateTodoStatus('t3', 'running')

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? {
                ...msg,
                content:
                  msg.content +
                  '\n\n✅ 业务数据表创建完成！\n\n现在开始创建功能页面...',
              }
            : msg
        )
      )

      await delay(600)

      // 3-1: 商品管理页面
      updateTodoStatus('t3-1', 'running')
      const tool4 = {
        id: 'tool-create-page-product',
        name: 'create_page',
        args: {
          name: '商品管理',
          type: 'crud',
          entity: '商品',
          features: ['列表', '新增', '编辑', '删除', '导入', '导出'],
        },
        status: 'running' as const,
        startTime: Date.now(),
      }
      addToolCall(aiMsgId, tool4)
      await delay(2800)
      updateToolCall(aiMsgId, 'tool-create-page-product', {
        status: 'success',
        result: '商品管理页面创建成功，包含CRUD功能',
        endTime: Date.now(),
      })
      updateTodoStatus('t3-1', 'completed')
      await delay(500)

      // 3-2: 采购入库页面
      updateTodoStatus('t3-2', 'running')
      const tool5 = {
        id: 'tool-create-page-purchase',
        name: 'create_page',
        args: {
          name: '采购入库',
          type: 'form',
          entity: '采购订单',
          features: ['主子表单', '自动计算', '库存更新'],
        },
        status: 'running' as const,
        startTime: Date.now(),
      }
      addToolCall(aiMsgId, tool5)
      await delay(3200)
      updateToolCall(aiMsgId, 'tool-create-page-purchase', {
        status: 'success',
        result: '采购入库页面创建成功',
        endTime: Date.now(),
      })
      updateTodoStatus('t3-2', 'completed')
      await delay(500)

      // 3-3 到 3-5: 其他页面
      for (const [id, time] of [
        ['t3-3', 3000],
        ['t3-4', 2400],
        ['t3-5', 2600],
      ] as const) {
        updateTodoStatus(id, 'running')
        await delay(time)
        updateTodoStatus(id, 'completed')
        await delay(400)
      }

      updateTodoStatus('t3', 'completed')
      await delay(800)

      // ==================== 阶段 4: 配置业务逻辑 ====================
      updateTodoStatus('t4', 'running')

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? {
                ...msg,
                content:
                  msg.content +
                  '\n\n✅ 功能页面创建完成！\n\n现在配置业务逻辑和自动化规则...',
              }
            : msg
        )
      )

      await delay(600)

      // 4-1: 库存自动计算
      updateTodoStatus('t4-1', 'running')
      const tool6 = {
        id: 'tool-config-stock-calc',
        name: 'create_automation',
        args: {
          name: '库存自动计算',
          trigger: '采购入库/销售出库完成时',
          action: '更新商品库存数量',
        },
        status: 'running' as const,
        startTime: Date.now(),
      }
      addToolCall(aiMsgId, tool6)
      await delay(2500)
      updateToolCall(aiMsgId, 'tool-config-stock-calc', {
        status: 'success',
        result: '库存自动计算规则配置成功',
        endTime: Date.now(),
      })
      updateTodoStatus('t4-1', 'completed')
      await delay(500)

      // 4-2: 库存预警
      updateTodoStatus('t4-2', 'running')
      await delay(2200)
      updateTodoStatus('t4-2', 'completed')
      await delay(400)

      // 4-3: 审批工作流
      updateTodoStatus('t4-3', 'running')
      const tool7 = {
        id: 'tool-config-workflow',
        name: 'create_workflow',
        args: {
          name: '采购审批流程',
          steps: ['提交申请', '部门经理审批', '财务审批', '完成'],
        },
        status: 'running' as const,
        startTime: Date.now(),
      }
      addToolCall(aiMsgId, tool7)
      await delay(2800)
      updateToolCall(aiMsgId, 'tool-config-workflow', {
        status: 'success',
        result: '审批工作流配置成功',
        endTime: Date.now(),
      })
      updateTodoStatus('t4-3', 'completed')
      await delay(500)

      updateTodoStatus('t4', 'completed')
      await delay(800)

      // ==================== 阶段 5: 创建数据看板 ====================
      updateTodoStatus('t5', 'running')

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? {
                ...msg,
                content:
                  msg.content +
                  '\n\n✅ 业务逻辑配置完成！\n\n最后，创建数据分析看板...',
              }
            : msg
        )
      )

      await delay(600)

      // 5-1: 销售统计
      updateTodoStatus('t5-1', 'running')
      await delay(2400)
      updateTodoStatus('t5-1', 'completed')
      await delay(400)

      // 5-2: 库存仪表盘
      updateTodoStatus('t5-2', 'running')
      await delay(2600)
      updateTodoStatus('t5-2', 'completed')
      await delay(500)

      updateTodoStatus('t5', 'completed')

      // ==================== 完成 ====================
      await delay(1000)

      // 最终消息
      const finalContent = `好的，我来帮你创建一个完整的进销存管理系统。这是一个比较复杂的项目，让我先规划一下整体架构...

✅ 基础数据模型已创建完成，包括商品、供应商、客户、仓库等核心数据表。

现在开始创建业务数据表...

✅ 业务数据表创建完成！

现在开始创建功能页面...

✅ 功能页面创建完成！

现在配置业务逻辑和自动化规则...

✅ 业务逻辑配置完成！

最后，创建数据分析看板...

---

## 🎉 进销存管理系统创建完成！

我已经为你创建了一个完整的进销存管理系统，包含以下模块：

### 📦 数据模型
| 数据表 | 说明 |
|-------|------|
| 商品表 | 商品基础信息、价格、库存预警 |
| 供应商表 | 供应商联系方式、合作信息 |
| 客户表 | 客户信息、联系方式 |
| 采购订单 | 采购记录、审批状态 |
| 销售订单 | 销售记录、客户关联 |
| 库存记录 | 实时库存、出入库流水 |

### 🖥️ 功能页面
- **商品管理** - 商品信息CRUD、批量导入导出
- **采购入库** - 采购订单、自动更新库存
- **销售出库** - 销售订单、库存扣减
- **库存查询** - 实时库存、历史记录
- **库存盘点** - 盘点单、差异处理

### ⚡ 自动化规则
- 入库/出库时自动更新库存数量
- 库存低于预警值时发送通知
- 采购金额超过5000元需要审批

### 📊 数据看板
- 销售趋势图、TOP10商品
- 库存分布、周转率分析

系统已准备就绪，你可以点击下方按钮进入系统！`

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? {
                ...msg,
                content: finalContent,
                status: 'completed',
                actions: [
                  {
                    id: 'open',
                    label: '打开应用',
                    icon: 'ExternalLink',
                    type: 'primary',
                    onClick: () => alert('正在打开进销存管理系统...'),
                  },
                  {
                    id: 'preview',
                    label: '预览数据模型',
                    icon: 'Database',
                    onClick: () => alert('打开数据模型设计器...'),
                  },
                  {
                    id: 'continue',
                    label: '继续配置',
                    icon: 'Settings',
                    type: 'ghost',
                    onClick: () => alert('打开系统设置...'),
                  },
                ],
              }
            : msg
        )
      )

      setLoading(false)
    }

    const handleSend = async (content: string) => {
      if (content.trim()) {
        await executeFullFlow()
      }
    }

    const handleReset = () => {
      setMessages([])
      setTodos([])
      setLoading(false)
    }

    return (
      <div className='relative flex h-full flex-col'>
        {/* 重置按钮 */}
        {messages.length > 0 && (
          <div className='absolute top-2 right-2 z-10'>
            <Button
              size='sm'
              type='outline'
              icon='RotateCcw'
              onClick={handleReset}
            >
              重置演示
            </Button>
          </div>
        )}

        <Chat
          messages={messages}
          loading={loading}
          todos={todos}
          onSend={handleSend}
          onStop={() => setLoading(false)}
          placeholder='输入任意内容开始演示...'
          emptyContent={
            <div className='mx-auto max-w-md text-center'>
              <div className='mb-6 text-6xl'>📦</div>
              <h3 className='mb-2 text-xl font-semibold'>进销存系统创建演示</h3>
              <p className='text-muted-foreground mb-6 text-sm leading-relaxed'>
                体验 AI 驱动的低代码平台，从零开始创建一个完整的进销存管理系统。
                包含数据建模、页面搭建、业务逻辑配置等全流程。
              </p>
              <Button
                type='default'
                size='lg'
                icon='Sparkles'
                onClick={() => executeFullFlow()}
              >
                开始创建进销存系统
              </Button>
            </div>
          }
        />
      </div>
    )
  },
}
