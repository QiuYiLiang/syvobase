import { useEditorRef, useEditorSelector } from 'platejs/react'
import {
  insertTableRow,
  insertTableColumn,
  deleteRow,
  deleteColumn,
  deleteTable,
  getTableAbove,
} from '@platejs/table'
import { ContextMenu } from '@/contextMenu'
import { DropdownMenuType } from '@/dropdown'
import { $t } from '@/utils/i18n'
import { ReactNode } from 'react'

interface TableMenuProps {
  children: ReactNode
}

export const TableMenu = ({ children }: TableMenuProps) => {
  const editor = useEditorRef()

  const isInTable = useEditorSelector((ed) => {
    try {
      return !!getTableAbove(ed as any)
    } catch {
      return false
    }
  }, [])

  const menuItems: DropdownMenuType = [
    {
      icon: 'ArrowUp',
      name: $t('richtext.tableInsertRowAbove'),
      onClick: () => insertTableRow(editor, { before: true }),
    },
    {
      icon: 'ArrowDown',
      name: $t('richtext.tableInsertRowBelow'),
      onClick: () => insertTableRow(editor),
    },
    { type: 'separator' },
    {
      icon: 'ArrowLeft',
      name: $t('richtext.tableInsertColLeft'),
      onClick: () => insertTableColumn(editor, { before: true }),
    },
    {
      icon: 'ArrowRight',
      name: $t('richtext.tableInsertColRight'),
      onClick: () => insertTableColumn(editor),
    },
    { type: 'separator' },
    {
      icon: 'Trash2',
      name: $t('richtext.tableDeleteRow'),
      onClick: () => deleteRow(editor),
    },
    {
      icon: 'Trash2',
      name: $t('richtext.tableDeleteCol'),
      onClick: () => deleteColumn(editor),
    },
    {
      icon: 'Trash',
      name: $t('richtext.tableDelete'),
      onClick: () => deleteTable(editor),
    },
  ]

  if (!isInTable) {
    return <>{children}</>
  }

  return <ContextMenu items={menuItems}>{children}</ContextMenu>
}
