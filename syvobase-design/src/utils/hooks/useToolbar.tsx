import { ToolbarProps } from '@/toolbar'
import { getHasToolbar } from '../toolbar'

export type UseToolbarPropsValue = ToolbarProps | ToolbarProps['items']
export interface UseToolbarPropsOptions {
  align?: 'left' | 'center' | 'right'
}
export function useToolbarProps(
  value?: UseToolbarPropsValue,
  options: UseToolbarPropsOptions = {}
): [boolean, ToolbarProps] {
  const { align = 'right' } = options
  if (!value) {
    return [false, {}]
  }
  const toolbarProps = Array.isArray(value)
    ? {
        [{
          left: 'left',
          center: 'items',
          right: 'right',
        }[align]]: value,
      }
    : value
  return [getHasToolbar(toolbarProps), toolbarProps]
}
