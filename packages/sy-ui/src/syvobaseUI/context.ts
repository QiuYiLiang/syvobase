import { createContext } from 'react'
import { Theme } from '../themes/shared'
import { Dict } from '@syvobase/utils'
import { SvgComponent } from '@/icon'
import { AxiosInstance, AxiosStatic } from 'axios'

export type FilePreviewServiceType = 'builtin' | 'kkFileView' | 'basemetas'

export interface FilePreviewConfig {
  type: FilePreviewServiceType
  url: string
}

export type MapServiceType = 'amap'

export interface MapConfig {
  type: MapServiceType
  key: string
}

export const SyvobaseUiContext = createContext<{
  theme: Theme
  dark: boolean
  icons: Dict<SvgComponent>
  axios?: AxiosStatic | AxiosInstance
  filePreviewConfig?: FilePreviewConfig
  mapConfig?: MapConfig
}>({} as any)
