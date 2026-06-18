import {
  addZIndex,
  BaseDirectionProps,
  BaseProps,
  cn,
  getZIndex,
  useControllable,
  useMount,
} from '@/utils'
import {
  Root,
  Content,
  Portal,
  Title,
  Description,
  DialogPortalProps,
} from '@radix-ui/react-dialog'
import { PanelProps, Panel } from '@/panel'
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Dict } from '@syvobase/utils'
import { getToolbarProps, ToolbarItem } from '@/toolbar'
import { mergeTag } from '@/utils/tag'

export interface DialogProps
  extends Omit<PanelProps, 'type'>, BaseDirectionProps {
  container?: DialogPortalProps['container']
  defaultOpen?: boolean
  open?: boolean
  modal?: boolean
  zIndex?: number
  disabledHeader?: boolean
  onOpenChange?: (open: boolean) => void
  onClose?: () => void
}

let dialogId = 0

export const Dialog = (props: DialogProps) => {
  const {
    direction = 'center',
    toolbar: _toolbar,
    disabledContentPadding = false,
    container,
    children,
    disabledHeader = false,
    zIndex,
    modal = true,
    onClose,
    ...panelProps
  } = props
  const [open, setOpen] = useControllable({
    props,
    value: false,
    valueKey: 'open',
    defaultValueKey: 'defaultOpen',
    onChangeKey: 'onOpenChange',
  })
  useMount(() => {
    addZIndex()
  })
  const currentZIndex = getZIndex()

  const close = () => {
    onClose?.()
    setOpen(false)
  }
  const topToolbar = (() => {
    const { topToolbar = { right: [] } } = panelProps
    const closeItem: ToolbarItem = {
      icon: 'X',
      className: 'text-lg',
      type: 'ghost',
      onClick: () => {
        close()
      },
    }
    if (Array.isArray(topToolbar)) {
      return {
        items: topToolbar,
        right: [closeItem],
      }
    }
    return {
      ...topToolbar,
      right: [...(topToolbar.right ?? []), closeItem],
    }
  })()

  const toolbar = getToolbarProps(_toolbar, { align: 'right' })

  const commonPanelProps: PanelProps = {
    disabledContentPadding: true,
    ...panelProps,
    ...(disabledHeader
      ? {}
      : {
          topToolbar,
        }),
    toolbar,
    children: (
      <div className={cn('h-full w-full', !disabledContentPadding && 'px-4')}>
        {children}
      </div>
    ),
  }

  const position = container === document.body ? 'fixed' : 'absolute'

  if (!open) {
    return
  }

  const content =
    direction === 'center' ? (
      <Content
        className={cn(
          'pointer-events-auto absolute',
          'border-border bg-card data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] top-[50%] left-[50%] grid max-h-screen max-w-[100vw] translate-x-[-50%] translate-y-[-50%] gap-4 border shadow-lg duration-200 sm:rounded-lg'
        )}
        style={{
          zIndex: zIndex ?? currentZIndex,
        }}
        ref={(el) => {
          if (el) {
            el.removeAttribute('tabindex')
          }
        }}
      >
        <Panel {...commonPanelProps} />
      </Content>
    ) : (
      <Content
        className={cn(
          'pointer-events-auto absolute',
          'border-border bg-card data-[state=open]:animate-in data-[state=closed]:animate-out gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
          {
            top: 'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 border-b',
            bottom:
              'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 border-t',
            left: 'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full max-w-screen border-r',
            right:
              'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full max-w-screen border-l',
          }[direction]
        )}
        style={{
          zIndex: currentZIndex,
        }}
        ref={(el) => {
          if (el) {
            el.removeAttribute('tabindex')
          }
        }}
      >
        <Panel
          style={{
            ...(container === document.body
              ? {
                  maxHeight: '100vh',
                  maxWidth: '100vw',
                }
              : {
                  maxHeight: '100%',
                  maxWidth: '100%',
                }),
            ...(panelProps.style ?? {}),
          }}
          {...commonPanelProps}
        />
      </Content>
    )

  return (
    <Root {...mergeTag('dialog', props)} open={open} modal={false}>
      <Portal container={container}>
        <div
          className={cn(
            position,
            'pointer-events-none inset-0 overflow-hidden'
          )}
          style={{ zIndex: zIndex ?? currentZIndex }}
        >
          {modal && open && (
            <div
              className={cn(
                'bg-background/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 pointer-events-auto absolute inset-0 h-full w-full'
              )}
              onClick={(e) => {
                e.stopPropagation()
                close()
              }}
            />
          )}
          <Title />
          <Description />
          {content}
        </div>
      </Portal>
    </Root>
  )
}

export interface DialogProvider {
  children?: ReactNode
}

type DialogsMapType = Dict<{
  open: boolean
  options: DialogOptions
}>

interface DialogProviderApi {
  setDialogsMap: Dispatch<SetStateAction<DialogsMapType>>
  closeDialog: (dialogId: number) => void
}

const dialogProviderMap = new Map<any, DialogProviderApi>()

export interface DialogProviderProps extends BaseProps {
  providerKey?: any
}

const DEFAULT_PROVIDER_KEY = Symbol('syvobase.defaultDialogProviderKey')

export const DialogProvider = ({
  providerKey = DEFAULT_PROVIDER_KEY,
  children,
}: DialogProviderProps) => {
  const [dialogsMap, setDialogsMap] = useState<DialogsMapType>({})
  const dialogProviderApiRef = useRef<DialogProviderApi>(null)

  const closeDialog = (dialogId: number) => {
    setDialogsMap((dialogsMap) => {
      dialogsMap[dialogId].open = false
      return { ...dialogsMap }
    })
    setTimeout(() => {
      setDialogsMap((dialogsMap) => {
        delete dialogsMap[dialogId]
        return { ...dialogsMap }
      })
    }, 1000)
  }

  dialogProviderApiRef.current = {
    setDialogsMap,
    closeDialog,
  }

  useEffect(() => {
    dialogProviderMap.set(providerKey, dialogProviderApiRef.current!)
    return () => {
      dialogProviderMap.delete(providerKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const dialogKeys = Object.keys(dialogsMap)
  return (
    <>
      {children}
      {dialogKeys.map((key) => {
        const { open, options } = dialogsMap[key]
        return (
          <Dialog
            key={key}
            {...options}
            open={open}
            onOpenChange={(open) => {
              options.onOpenChange?.(open)
              closeDialog(key as unknown as number)
            }}
          />
        )
      })}
    </>
  )
}

export interface DialogOptions extends Omit<
  DialogProps,
  'open' | 'defaultOpen'
> {
  defaultValue?: any
  providerKey?: any
}

export interface DialogAPI {
  value: any
  setValue: (value: any) => void
  setDefaultValue: (value: any) => void
  close: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const dialog = (
  options: DialogOptions | ((api: DialogAPI) => DialogOptions)
) => {
  let inited = false
  const id = dialogId++
  let _providerKey: any
  const api: DialogAPI = {
    setDefaultValue: (value) => {
      if (inited) {
        return
      }
      inited = true
      api.value = value
    },
    setValue: (value) => {
      api.value = value
      refresh()
    },
    value: undefined,
    close: () => dialogProviderMap.get(_providerKey)?.closeDialog(id),
  }

  function refresh() {
    const { ...dialogProps } =
      typeof options === 'function' ? options(api) : options
    const { providerKey = DEFAULT_PROVIDER_KEY } = dialogProps
    _providerKey = providerKey
    return dialogProviderMap.get(providerKey)?.setDialogsMap((dialogsMap) => {
      delete dialogProps.providerKey
      dialogsMap[id] = { open: true, options: dialogProps }
      return { ...dialogsMap }
    })
  }
  refresh()
  return api
}
