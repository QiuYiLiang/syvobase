import { BaseTextProps, useControllable } from '@/utils'
import QRCode from 'antd/es/qr-code'
import { Text } from '@/text'
import { mergeTag } from '@/utils/tag'

export interface QrcodeProps extends BaseTextProps {
  iconUrl?: string
  width?: number
  bgColor?: string
  color?: string
  bordered?: boolean
  errorLevel?: 'L' | 'M' | 'Q' | 'H'
}

export const Qrcode = (props: QrcodeProps) => {
  const {
    readMode,
    iconUrl,
    width: size,
    bgColor,
    color,
    bordered = false,
    errorLevel,
    ...inputProps
  } = props

  const [value, setValue] = useControllable({
    props,
    value: '',
  })

  if (readMode) {
    return (
      <QRCode
        {...mergeTag('qrcode', props)}
        value={value}
        icon={iconUrl}
        size={size}
        bgColor={bgColor}
        color={color}
        bordered={bordered}
        errorLevel={errorLevel}
      />
    )
  }

  return (
    <Text
      {...mergeTag('qrcode', props)}
      {...inputProps}
      value={value}
      onChange={setValue}
    />
  )
}
