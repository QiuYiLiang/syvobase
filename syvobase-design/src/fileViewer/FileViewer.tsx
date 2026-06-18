import { getFileIcon, useControllable, download } from '@/utils'
import { $t } from '@/utils/i18n'
import { base64encode, FileViewerProps } from './shared'
import { Toolbar, ToolbarProps } from '@/toolbar'
import { mergeTag } from '@/utils/tag'
import { useContext } from 'react'
import { SyvobaseUiContext, FilePreviewConfig } from '@/syvobaseUI'

/**
 * 根据文件预览配置生成预览URL
 */
function getPreviewUrl(fileUrl: string, config?: FilePreviewConfig): string {
  if (!config) {
    return ''
  }

  const { type, url } = config

  switch (type) {
    case 'kkFileView':
      // kkFileView 使用 base64 编码的 URL
      return `${url}/onlinePreview?url=${encodeURIComponent(base64encode(fileUrl))}`
    case 'basemetas':
    case 'builtin':
    default:
      // basemetas 使用 URL 编码的文件地址
      return `${url}/preview?url=${encodeURIComponent(fileUrl)}`
  }
}

export const FileViewer = (props: FileViewerProps) => {
  const {
    files = [],
    allowDownload = false,
    getFileUrl,
    buttons: _buttons = [],
  } = props
  const { filePreviewConfig } = useContext(SyvobaseUiContext)
  const [value, setValue] = useControllable<FileViewerProps, 'value'>({
    props,
    value: files[0]?.id,
  })
  const currentIndex = files?.findIndex(({ id }) => id === value) ?? 0
  const currentFile = files[currentIndex]
  const multipleFiles = files.length > 1
  const currentFileUrl = currentFile && getFileUrl(currentFile)

  const buttons = (() => {
    const buttons: ToolbarProps['items'] = []
    if (multipleFiles) {
      buttons.push(
        {
          type: 'ghost',
          icon: 'ChevronLeft',
          onlyIcon: true,
          name: $t('fileViewer.prev'),
          disabled: currentIndex === 0,
          onClick: () => {
            setValue(files[currentIndex - 1]?.id)
          },
        },
        {
          type: 'ghost',
          icon: 'ChevronRight',
          onlyIcon: true,
          name: $t('fileViewer.next'),
          disabled: currentIndex === files.length - 1,
          onClick: () => {
            setValue(files[currentIndex + 1]?.id)
          },
        }
      )
    }
    if (allowDownload) {
      buttons.push({
        type: 'ghost',
        icon: 'Download',
        onlyIcon: true,
        name: $t('fileViewer.download'),
        disabled: !currentFileUrl,
        onClick: () => {
          download({ url: currentFileUrl, fileName: currentFile.name })
        },
      })
    }
    return [...buttons, ..._buttons]
  })()

  return (
    <div
      {...mergeTag('file-viewer', props)}
      className='flex h-full w-full flex-col'
    >
      <Toolbar
        className='border-border border-b p-1'
        items={[
          {
            icon: getFileIcon(currentFile?.name),
            type: 'ghost',
            name: currentFile?.name ?? $t('fileViewer.emptyFile'),
          },
        ]}
        right={buttons}
      />
      <div className='flex w-full flex-1 items-center justify-center overflow-auto'>
        {currentFile && currentFileUrl && (
          <iframe
            className='h-full w-full border-none'
            src={getPreviewUrl(currentFileUrl, filePreviewConfig)}
          />
        )}
      </div>
    </div>
  )
}
