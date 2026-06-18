import { ToolbarProps } from '@/toolbar'
import { BaseValueProps, FileDataType } from '@/utils'

export interface FileViewerProps extends BaseValueProps<string> {
  files?: FileDataType[]
  allowDownload?: boolean
  getFileUrl: (file: FileDataType) => string
  buttons?: ToolbarProps['items']
}

export interface ViewerProps {
  file: FileDataType
  url: string
}

export function base64encode(str) {
  const encoder = new TextEncoder()
  const data = encoder.encode(str)

  let binary = ''
  const bytes = new Uint8Array(data)
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }

  return window.btoa(binary)
}
