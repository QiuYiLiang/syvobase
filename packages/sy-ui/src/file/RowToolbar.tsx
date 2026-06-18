import { Button, ButtonProps } from '@/button'
import { useFileContext } from './shared'
import { confirm } from '@/confirm'
import { FileDataType, download } from '@/utils'
import { $t } from '@/utils/i18n'
import { previewFile } from '@/fileViewer'

export interface RowToolbarProps {
  file: FileDataType
}

export const RowToolbar = (props: RowToolbarProps) => {
  const { file } = props
  const {
    disabled,
    disabledButtons,
    value: files,
    setValue,
    getFileUrl,
  } = useFileContext()
  const commonButtonProps: ButtonProps = {
    size: 'sm',
    type: 'ghost',
    onlyIcon: true,
  }

  const supportPreview = !disabledButtons.includes('preview')
  const supportDownload = !disabledButtons.includes('download')
  const fileUrl = getFileUrl(file)

  return (
    <div
      className='flex'
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      {supportPreview && (
        <Button
          {...commonButtonProps}
          icon='Eye'
          onClick={() =>
            previewFile({
              files,
              value: file.id,
              getFileUrl,
              allowDownload: supportDownload,
            })
          }
        >
          {$t('file.preview')}
        </Button>
      )}
      {supportDownload && (
        <Button
          {...commonButtonProps}
          icon='Download'
          onClick={() => download({ url: fileUrl, fileName: file.name })}
        >
          {$t('file.download')}
        </Button>
      )}
      {!disabled && (
        <Button
          {...commonButtonProps}
          icon='Trash2'
          onClick={() => {
            confirm({
              header: $t('file.hint'),
              children: $t('file.confirmDelete'),
              onConfirm: () => {
                setValue((value) => value.filter(({ id }) => file.id !== id))
              },
            })
          }}
        >
          {$t('file.delete')}
        </Button>
      )}
    </div>
  )
}
