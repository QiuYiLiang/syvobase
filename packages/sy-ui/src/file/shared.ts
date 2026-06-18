import {
  createContext,
  Dispatch,
  RefObject,
  SetStateAction,
  useContext,
} from 'react'
import { FileProps } from './File'
import { FileDataType } from '@/utils'

export interface UploadingFile {
  file: File
  name: string
  status: 'uploading' | 'error'
  error?: string
  progress: number
}

export const FileContext = createContext(
  {} as {
    uploading: boolean
    fileInputRef: RefObject<HTMLInputElement | null>
    setValue: Dispatch<SetStateAction<FileDataType[]>>
  } & Required<
    Pick<
      FileProps,
      | 'mode'
      | 'disabled'
      | 'value'
      | 'exts'
      | 'maxCount'
      | 'maxSize'
      | 'disabledButtons'
      | 'getFileUrl'
      | 'getImageUrl'
    >
  >
)

export const useFileContext = () => useContext(FileContext)
