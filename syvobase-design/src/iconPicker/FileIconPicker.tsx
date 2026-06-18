import { File } from '@/file'
import {
  BaseValueProps,
  FileDataType,
  useControllable,
  compressImage,
} from '@/utils'

export interface FileIconPickerProps extends BaseValueProps<FileDataType> {}

export const FileIconPicker = (props: FileIconPickerProps) => {
  const [value, setValue] = useControllable<FileIconPickerProps, 'value'>({
    props,
    value: undefined,
  })
  return (
    <File
      local
      value={value && typeof value === 'object' ? [value] : []}
      exts={['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp']}
      maxCount={1}
      maxSize={5}
      onChange={async (value) => {
        const fileData = value[0]
        if (fileData) {
          // 压缩图片到 10KB 以下
          ;(fileData as any).base64 = await compressImage(fileData.file!, 10)
          setValue(fileData)
        } else {
          setValue(undefined as any)
        }
      }}
    />
  )
}
