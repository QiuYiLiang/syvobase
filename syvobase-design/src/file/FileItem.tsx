import { cn, FileDataType, getFileIcon, getFileType, useHover } from '@/utils'
import { $t } from '@/utils/i18n'
import { UploadingFile, useFileContext } from './shared'
import { RowToolbar } from './RowToolbar'
import { useRef } from 'react'
import { Icon } from '@/icon'
import { Popover } from '@/popover'

export interface FileItemProps {
  file?: FileDataType | UploadingFile
  isUploadButton?: boolean
  isUploading?: boolean
}

export const FileItem = (props: FileItemProps) => {
  const { isUploading = false, isUploadButton = false } = props
  const file = props.file as FileDataType
  const { uploading, fileInputRef, getImageUrl } = useFileContext()
  const { name } = file ?? {}
  const ref = useRef(null)
  const isHover = useHover(ref)
  const imageUrl =
    !isUploadButton && getFileType(name) === 'image' && getImageUrl(file!)

  const createUploadingContent = () => {
    const uploadingFile = file as any as UploadingFile
    if (uploadingFile.status === 'uploading') {
      return (
        <div className='flex flex-col justify-center space-y-2'>
          <div>{$t('file.uploading')}</div>
          <div className='bg-muted h-0.5 w-16 overflow-hidden rounded'>
            <div
              className='bg-primary h-full'
              style={{
                width: `${uploadingFile.progress}%`,
              }}
            />
          </div>
        </div>
      )
    }
    return (
      <Popover content={uploadingFile.error}>
        <div className='cursor-pointer text-red-500'>
          {uploadingFile.file.name}
        </div>
      </Popover>
    )
  }

  return (
    <div
      ref={ref}
      className={cn(
        'border-border bg-background relative m-1 inline-flex size-24 items-center justify-center overflow-hidden rounded-lg border text-center text-sm',
        isUploadButton &&
          'bg-muted/50 hover:bg-muted hover:ring-ring cursor-pointer hover:ring-2',
        isUploadButton && uploading && 'cursor-not-allowed'
      )}
      onClick={() => {
        if (!isUploadButton || uploading) {
          return
        }
        fileInputRef.current?.click()
      }}
    >
      {isUploading ? (
        createUploadingContent()
      ) : (
        <>
          {imageUrl ? (
            <>
              <div
                className='h-full w-full'
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                }}
              ></div>
              <div className='bg-muted/50 absolute bottom-0 w-full pb-1 text-center'>
                {name}
              </div>
            </>
          ) : (
            <div className='flex flex-col items-center space-y-2'>
              <div>
                {isUploadButton ? (
                  <Icon size={16} name='Upload' />
                ) : (
                  <Icon size={32} name={getFileIcon(name)} />
                )}
              </div>
              <div>{isUploadButton ? $t('file.upload') : name}</div>
            </div>
          )}
          {!isUploadButton && isHover && (
            <div className='bg-muted/60 absolute top-0 left-0 flex h-full w-full items-center justify-center'>
              <RowToolbar file={file} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
