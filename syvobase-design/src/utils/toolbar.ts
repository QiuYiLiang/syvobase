import { ToolbarProps } from '@/toolbar'

export function getHasToolbar(toolbarProps: ToolbarProps) {
  return !!(
    toolbarProps.left?.length ||
    toolbarProps.items?.length ||
    toolbarProps.right?.length
  )
}
