import { ToolbarProps } from './Toolbar'

export const getToolbarProps = (
  toolbar: ToolbarProps | ToolbarProps['items'],
  {
    align,
  }: {
    align: 'left' | 'right' | 'center'
  } = { align: 'center' }
) => {
  if (!toolbar) {
    return {}
  }
  return Array.isArray(toolbar)
    ? { [align === 'center' ? 'items' : align]: toolbar }
    : toolbar
}
