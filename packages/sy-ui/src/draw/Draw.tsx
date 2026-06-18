import {
  BaseInputProps,
  BaseTriggerUpdateModel,
  useControllable,
} from '@/utils'
import { getCurrentLanguage } from '@/utils/i18n'
import { Loading } from '@/loading'
import { useDark } from '@/themes'
import {
  RefAttributes,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

/**
 * draw.io iframe 通信协议的消息类型
 */
interface DrawIoMessage {
  event:
    | 'init'
    | 'load'
    | 'save'
    | 'autosave'
    | 'export'
    | 'exit'
    | 'configure'
    | 'merge'
    | 'prompt'
    | 'template'
    | 'draft'
  xml?: string
  data?: string
  modified?: boolean
  [key: string]: unknown
}

interface DrawIoAction {
  action: 'load' | 'export' | 'configure' | 'merge' | 'prompt' | 'template'
  xml?: string
  autosave?: number
  [key: string]: unknown
}

/** 获取默认的 draw.io 服务地址（与当前页面同主机，端口 6007） */
const getDefaultBaseUrl = () => {
  if (typeof window === 'undefined') return ''
  return `${window.location.protocol}//${window.location.hostname}:6007`
}

/** 将应用语言代码转换为 draw.io 支持的 lang 参数 */
const toDrawIoLang = (locale: string): string => {
  const map: Record<string, string> = {
    'zh-CN': 'zh',
    'zh-Hant': 'zh-TW',
  }
  return map[locale] || locale.split('-')[0]
}

export interface DrawProps
  extends BaseInputProps<string>, RefAttributes<BaseTriggerUpdateModel> {
  baseUrl?: string
  autoSave?: boolean
}

export const Draw = (props: DrawProps) => {
  const {
    ref,
    baseUrl,
    autoSave = true,
    readMode = false,
    disabled = false,
    inlineMode = false,
  } = props
  const editable = !(readMode || disabled)
  const [value, setValue, triggerUpdate] = useControllable({
    manualTriggerUpdate: inlineMode,
    props,
    value: '',
  })

  useImperativeHandle(ref, () => ({
    triggerUpdate,
  }))

  // ---- iframe 通信逻辑 ----

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const isInitializedRef = useRef(false)
  const [loading, setLoading] = useState(true)
  const dark = useDark()
  const xmlRef = useRef(value)
  xmlRef.current = value

  const sendAction = useCallback((action: DrawIoAction) => {
    const iframe = iframeRef.current
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(JSON.stringify(action), '*')
    }
  }, [])

  const loadXml = useCallback(
    (xmlContent: string) => {
      sendAction({
        action: 'load',
        xml: xmlContent,
        autosave: autoSave ? 1 : 0,
      })
    },
    [sendAction, autoSave]
  )

  const urlParameters = {
    ui: 'kennedy',
    spin: false,
    libraries: true,
    saveAndExit: false,
    modified: editable,
    lang: toDrawIoLang(getCurrentLanguage()),
    splash: 0,
    offline: 1,
    pwa: 1,
    browser: 1,
    stealth: 1,
    dark: dark ? 1 : 0,
    chrome: !readMode && !disabled,
  } as Record<string, unknown>

  const buildUrl = useCallback(() => {
    const base = baseUrl || getDefaultBaseUrl()
    if (!base) return ''

    const params = new URLSearchParams()
    params.set('embed', '1')
    params.set('proto', 'json')

    for (const [key, val] of Object.entries(urlParameters)) {
      if (val === undefined || val === null) continue
      if (typeof val === 'boolean') {
        params.set(key, val ? '1' : '0')
      } else {
        params.set(key, String(val))
      }
    }

    const separator = base.includes('?') ? '&' : '?'
    return `${base}${separator}${params.toString()}`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseUrl, editable, readMode, disabled, dark])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        !iframeRef.current?.contentWindow ||
        event.source !== iframeRef.current.contentWindow
      ) {
        return
      }

      let msg: DrawIoMessage
      try {
        if (typeof event.data === 'string') {
          msg = JSON.parse(event.data)
        } else {
          msg = event.data
        }
      } catch {
        return
      }

      if (!msg || !msg.event) return

      switch (msg.event) {
        case 'init':
          isInitializedRef.current = true
          setLoading(false)
          loadXml(xmlRef.current || '')
          break

        case 'save':
          if (msg.xml && !autoSave) {
            setValue(msg.xml)
          }
          break

        case 'autosave':
          if (msg.xml && autoSave) {
            setValue(msg.xml)
          }
          break

        case 'exit':
          break
      }
    }

    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [loadXml, autoSave, setValue])

  useEffect(() => {
    if (isInitializedRef.current && value !== undefined) {
      loadXml(value)
    }
  }, [value, loadXml])

  const iframeSrc = buildUrl()

  if (!iframeSrc) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: 14,
        }}
      >
        请配置 draw.io 服务地址 (baseUrl)
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 400,
      }}
    >
      {loading && (
        <Loading style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
      )}
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          minHeight: 400,
          visibility: loading ? 'hidden' : 'visible',
        }}
      />
    </div>
  )
}
