import type { Preview } from '@storybook/react-vite'
import { SyvobaseUI as _SyvobaseUI } from '../src/syvobaseUI'
import { themes } from '../src/themes'
import { StrictMode } from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import './index.css'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import '../src/index.css'

const SyvobaseUI = _SyvobaseUI as any

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    toolbar: { hidden: true },
    options: {
      showPanel: false,
    },
  },
  decorators: [
    (Story) => (
      <StrictMode>
        <SyvobaseUI
          theme={themes['default']}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
          lang={{}}
          filePreviewConfig={{
            type: 'kkFileView',
            url: 'http://192.168.50.231:6006',
          }}
        >
          <Story />
        </SyvobaseUI>
      </StrictMode>
    ),
  ],
}

export default preview
