// 用于触发新增链接的事件
type LinkInsertHandler = (options: {
  text: string
  position: { top: number; left: number }
}) => void

// 全局事件，用于从 Toolbar 触发新增链接
let globalInsertHandler: LinkInsertHandler | null = null

export const setLinkInsertHandler = (handler: LinkInsertHandler | null) => {
  globalInsertHandler = handler
}

export const triggerLinkInsert = (options: {
  text: string
  position: { top: number; left: number }
}) => {
  globalInsertHandler?.(options)
}
