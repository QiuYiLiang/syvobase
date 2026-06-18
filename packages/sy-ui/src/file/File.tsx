import { BaseInputProps, cn, FileDataType, useControllable } from '@/utils'
import { $t } from '@/utils/i18n'
import { FileItem } from './FileItem'
import { FileContext, UploadingFile } from './shared'
import { SimpleFileItem } from './SimpleFileItem'
import { Button } from '@/button'
import { useContext, useRef, useState } from 'react'
import { AxiosRequestConfig } from 'axios'
import { SyvobaseUiContext } from '@/themes'
import { v4 } from 'uuid'
import { mergeTag } from '@/utils/tag'

export interface FileProps extends BaseInputProps<FileDataType[]> {
  mode?: 'advanced' | 'simple'
  exts?: string[]
  maxCount?: number
  maxSize?: number // MB
  disabledButtons?: ('preview' | 'edit' | 'download')[]
  local?: boolean
  getImageUrl?: (fileData: FileDataType) => string | void
  getFileUrl?: (fileData: FileDataType) => string
  onUpload?: (file: File) => AxiosRequestConfig
  onUploadSuccess?: (uploadSuccessData: any) => string
}

const MAX = 999999

export const File = (props: FileProps) => {
  const {
    mode = 'advanced',
    inlineMode = false,
    readMode = false,
    disabled: _disabled = false,
    exts = [],
    maxCount = MAX,
    maxSize = MAX,
    disabledButtons = [],
    getImageUrl = () => {},
    getFileUrl = () => {
      return ''
    },
    local = false,
    onUpload = () => {},
    onUploadSuccess = (id) => id,
  } = props
  const [value, setValue] = useControllable<FileProps, 'value'>({
    props,
    value: [],
  })

  const axios = useContext(SyvobaseUiContext).axios
  const isAdvanced = mode === 'advanced' && !inlineMode
  const Item = isAdvanced ? FileItem : SimpleFileItem
  const disabled = readMode || _disabled
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  return (
    <FileContext
      value={{
        mode,
        disabled,
        exts,
        maxCount,
        maxSize,
        disabledButtons,
        fileInputRef,
        uploading,
        value,
        setValue,
        getImageUrl,
        getFileUrl,
      }}
    >
      <div {...mergeTag('file', props)} className='flex w-full space-x-1'>
        <div
          className={cn(
            'flex flex-1',
            isAdvanced && 'flex-wrap',
            !isAdvanced && 'flex-col space-y-1',
            inlineMode && 'overflow-y-auto'
          )}
        >
          {!disabled && !isAdvanced && !inlineMode && (
            <Button
              icon='Upload'
              disabled={uploading}
              onClick={() => {
                fileInputRef.current?.click()
              }}
            >
              {$t('file.upload')}
            </Button>
          )}
          {value.map((file) => (
            <Item key={file.id} file={file} />
          ))}
          {uploadingFiles.map((file) => (
            <Item key={file.name + Date.now()} isUploading file={file} />
          ))}
          {!disabled && isAdvanced && value.length < maxCount && (
            <FileItem isUploadButton />
          )}
        </div>
        {!disabled && inlineMode && (
          <div className='flex h-full items-center'>
            <Button
              size='sm'
              type='ghost'
              icon='Upload'
              onlyIcon
              disabled={uploading}
              onClick={() => {
                fileInputRef.current?.click()
              }}
            >
              {$t('file.upload')}
            </Button>
          </div>
        )}
        {!disabled && (
          <input
            ref={fileInputRef}
            className='hidden'
            type='file'
            accept={exts.map((ext) => `.${ext}`).join(',')}
            multiple={maxCount > 1}
            onInput={(e: any) => {
              if (uploading) {
                return true
              }
              setUploading(true)
              const files = Array.from(e.target.files).slice(
                0,
                maxCount - value.length
              ) as File[]
              e.target.value = null
              const uploadingFiles: UploadingFile[] = files.map((file) => {
                if (file.size > maxSize * 1024 * 1024) {
                  return {
                    file,
                    name: file.name,
                    status: 'error',
                    progress: 0,
                    error: `${$t('file.maxSizeError')} ${maxSize} MB`,
                  }
                }
                return {
                  file,
                  name: file.name,
                  status: 'uploading',
                  progress: 0,
                }
              })
              setUploadingFiles(uploadingFiles)

              uploadingFiles.forEach(async (uploadingFile) => {
                if (uploadingFile.status !== 'uploading') {
                  return
                }
                const { file } = uploadingFile
                const formData = new FormData()
                formData.append('file', file)
                const axiosOptions: AxiosRequestConfig = {
                  method: 'POST',
                  url: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
                  data: formData,
                  onUploadProgress(progressEvent: any) {
                    const progress = Math.round(
                      (progressEvent.loaded * 100) / progressEvent.total
                    )
                    uploadingFile.progress = progress
                    setUploadingFiles((uploadingFiles) => [...uploadingFiles])
                  },
                }
                if (local) {
                  setUploadingFiles((uploadingFiles) =>
                    uploadingFiles.filter((item) => item !== uploadingFile)
                  )
                  setValue(() => [
                    ...value,
                    { id: v4(), name: file.name, file },
                  ])
                } else {
                  try {
                    if (!axios) {
                      throw new Error('axios not found')
                    }
                    const id = onUploadSuccess(
                      (
                        await axios({
                          ...axiosOptions,
                          ...(onUpload(file) ?? {}),
                        })
                      ).data
                    )
                    setUploadingFiles((uploadingFiles) =>
                      uploadingFiles.filter((item) => item !== uploadingFile)
                    )
                    setValue(() => [...value, { id, name: file.name }])
                  } catch (error) {
                    console.log(error)
                    uploadingFile.status = 'error'
                    uploadingFile.error = $t('file.uploadError')
                    setUploadingFiles((uploadingFiles) => [...uploadingFiles])
                  }
                }
                setUploading(false)
              })
            }}
          />
        )}
      </div>
    </FileContext>
  )
}
