import { MessageProvider } from '@/message'
import { TableProvider } from '@/table'
import { DialogProvider } from '@/dialog'
import { DragDropProvider } from '@/dragList'
import { SyvobaseUiContext, FilePreviewConfig, MapConfig } from './context'
import { Theme, themes } from '@/themes'
import { BaseProps, cn } from '@/utils'
import { Dict } from '@syvobase/utils'
import { SvgComponent } from '@/icon'
import { useEffect } from 'react'
import { AxiosInstance, AxiosStatic } from 'axios'
import { AutoLayoutEditorProvider } from '@/autoLayout/AutoLayoutProvider'

export interface SyvobaseUIProps extends BaseProps {
  theme?: Theme
  dark?: boolean
  icons?: Dict<SvgComponent>
  axios?: AxiosStatic | AxiosInstance
  filePreviewConfig?: FilePreviewConfig
  mapConfig?: MapConfig
}

export const SyvobaseUI = ({
  className,
  style = {},
  dark = false,
  theme = themes['default'],
  children,
  icons = {},
  axios,
  filePreviewConfig,
  mapConfig,
}: SyvobaseUIProps) => {
  useEffect(() => {
    const themeStyle = { ...theme.common, ...(dark ? theme.dark : theme.light) }
    for (const key in themeStyle) {
      document.documentElement.style.setProperty(key, themeStyle[key])
    }
  }, [dark, theme])
  return (
    <SyvobaseUiContext
      value={{
        theme,
        dark,
        icons,
        axios,
        filePreviewConfig,
        mapConfig,
      }}
    >
      <AutoLayoutEditorProvider>
        <DragDropProvider>
          <TableProvider>
            <MessageProvider>
              <DialogProvider>
                <div
                  className={cn(
                    'bg-background text-foreground h-full w-full',
                    className
                  )}
                  style={style}
                >
                  {children}
                </div>
              </DialogProvider>
            </MessageProvider>
          </TableProvider>
        </DragDropProvider>
      </AutoLayoutEditorProvider>
    </SyvobaseUiContext>
  )
}
