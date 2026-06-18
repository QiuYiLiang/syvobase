import { Toaster } from 'sonner'
import { ReactNode } from 'react'

interface MessageProviderProps {
  children: ReactNode
}

export const MessageProvider = ({ children }: MessageProviderProps) => {
  return (
    <>
      {children}
      <Toaster
        richColors
        toastOptions={{
          classNames: {
            toast:
              'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
            description: 'group-[.toast]:text-muted-foreground',
            actionButton:
              'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
            cancelButton:
              'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          },
        }}
        position='top-center'
      />
    </>
  )
}
