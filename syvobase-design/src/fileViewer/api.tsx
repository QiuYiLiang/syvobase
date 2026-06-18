import { dialog } from '@/dialog'
import { FileViewer } from './FileViewer'
import { FileViewerProps } from './shared'

export function previewFile(options: FileViewerProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { value, onChange, ...props } = options
  const dialogApi = dialog({
    header: '',
    direction: 'right',
    style: {
      width: 800,
    },
    disabledHeader: true,
    disabledContentPadding: true,
    children: (
      <FileViewer
        buttons={[
          {
            icon: 'X',
            type: 'ghost',
            onClick: () => {
              dialogApi.close()
            },
          },
        ]}
        {...props}
        defaultValue={value}
      />
    ),
  })
}
