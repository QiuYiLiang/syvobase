import { cn, FileDataType, getFileIcon, useHover } from '@/utils'
import { UploadingFile, useFileContext } from './shared'
import { RowToolbar } from './RowToolbar'
import { useRef } from 'react'
import { Icon } from '@/icon'
import { previewFile } from '@/fileViewer'

export interface SimpleFileItemProps {
  file: FileDataType | UploadingFile
  isUploading?: boolean
}

export const SimpleFileItem = (props: SimpleFileItemProps) => {
  const { isUploading = false } = props
  const file = props.file as FileDataType
  const { name } = file
  const { disabledButtons, value: files, getFileUrl } = useFileContext()
  const ref = useRef(null)
  const isHover = useHover(ref)
  const supportPreview = !disabledButtons.includes('preview')

  const createUploadingContent = () => {
    const uploadingFile = file as any as UploadingFile
    return (
      uploadingFile.status === 'uploading' && (
        <div className='bg-muted absolute bottom-0 left-0 mr-0! ml-0! h-0.5 w-full overflow-hidden rounded px-1'>
          <div
            className='bg-primary h-full'
            style={{
              width: `${uploadingFile.progress}%`,
            }}
          />
        </div>
      )
    )
  }
  return (
    <div
      ref={ref}
      className={cn(
        'border-border bg-background relative flex w-full items-center space-x-1 rounded-lg border p-1 text-sm',
        !isUploading && 'cursor-pointer'
      )}
      onClick={() => {
        if (isUploading) {
          return
        }
        if (supportPreview) {
          previewFile({
            files,
            value: file.id,
            getFileUrl,
            allowDownload: !disabledButtons.includes('download'),
          })
          return
        }
      }}
    >
      <Icon size={16} name={getFileIcon(name)} />
      <div
        className={cn(
          'flex-1 truncate text-blue-500',
          (file as any)?.status === 'error' && 'text-red-500'
        )}
      >
        {name}
      </div>
      {isUploading
        ? createUploadingContent()
        : isHover && (
            <div className='bg-muted/50 absolute top-0 right-0 flex h-full w-full items-center justify-end'>
              <RowToolbar file={file} />
            </div>
          )}
    </div>
  )
}
